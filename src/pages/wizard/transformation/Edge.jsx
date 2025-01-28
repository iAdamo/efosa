import React from "react";
import {
	BaseEdge,
	EdgeLabelRenderer,
	getBezierPath,
	useReactFlow,
} from "@xyflow/react";
import SButton from "@/components/SButton";
import { useEffect } from "react";
import useGlobalStore from "@/store/globalStore";
import { getTypeColor } from "@/utils/typeColour";
import { useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { useRef } from "react";
import { findClosestPointOnBezier } from "@/utils/bezier";
import { animate } from "framer-motion";
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";
import { opacityAnim } from "@/animations";
import { WizardContext } from "@/contexts/WizardContext";
import { useContext } from "react";

export default function Edge({
	id,
	sourceX,
	sourceY,
	targetX,
	targetY,
	sourcePosition,
	targetPosition,
	markerEnd,
	sourceHandleId,
	targetHandleId,
	renderType
}) {
	const { setEdges, screenToFlowPosition } = useReactFlow();
	const { getAndSetOKStatuses } = useContext(WizardContext);
	const { sourceHandle, targetHandle } = useGlobalStore((s) => ({
		sourceHandle: s.handles.byId[sourceHandleId],
		targetHandle: s.handles.byId[targetHandleId],
	}));
	const timerRef = useRef(null);
	const [edgePath, labelX, labelY] = getBezierPath({
		sourceX,
		sourceY,
		sourcePosition,
		targetX,
		targetY,
		targetPosition,
	});
	const [hoverCoordinates, setHoverCoordinates] = useState(null);
	const [buttonCoordinates, setButtonCoordinates] = useState(null);
	const animationRef = useRef(null);
	const [edgeStyle, setEdgeStyle] = useState({
		stroke: "white",
		strokeWidth: 2,
		fill: "none",
		cursor: "pointer",
		// strokeDasharray: 8,
	});
	const [buttonStyle, setButtonStyle] = useState({
		backgroundColor: "grey",
	});
	const [isDeleteable, setIsDeleteable] = useState(true);

	const onEdgeClick = async () => {
		setEdges((edges) => edges.filter((edge) => edge.id !== id));
		//await getAndSetOKStatuses(false, ["CONNECT"]);
	};

	const renderCloseButton = (renderType) => {
		switch (renderType) {
			case "wizard":
			case "matching":
				return true;
			case "executionSummary":
				return false;
			default:
				break;
		}
	}

	useEffect(() => {
		//no handle type defaults to white
		if (sourceHandle?.data.type) {
			if (sourceHandle.data.type === "connection") {
				setIsDeleteable(false);
			}
			setEdgeStyle((style) => ({
				...style,
				stroke: getTypeColor(sourceHandle.data.type),
			}));
			setButtonStyle((style) => ({
				...style,
				backgroundColor: getTypeColor(sourceHandle.data.type),
			}));
		}
	}, [sourceHandle, sourceHandleId]);

	useEffect(() => {
		if (sourceHandle?.data.isCollapsed || targetHandle?.data.isCollapsed) {
			setIsDeleteable(false);
		} else {
			setIsDeleteable(true);
		}
	}, [sourceHandle, targetHandle]);

	const handleHover = (event) => {
		if (timerRef.current) {
			clearTimeout(timerRef.current);
		}
		const position = screenToFlowPosition({
			x: event.clientX,
			y: event.clientY,
		});

		setHoverCoordinates({
			x: position.x,
			y: position.y,
		});
	};

	const mouseLeaveHandler = () => {
		timerRef.current = setTimeout(() => {
			setHoverCoordinates(null);
		}, 1000);
	};

	useEffect(() => {
		if (hoverCoordinates !== null) {
			const points = {};
			let index = 0;
			for (const segment of edgePath.split(" ")) {
				// Remove any command letters (like 'M', 'C')
				const cleanSegment = segment.replace(/[a-zA-Z]/g, "");

				// Split the segment into x and y parts
				const [x, y] = cleanSegment.split(",");

				// Convert them to numbers and add to points object if both x and y exist
				if (x && y) {
					points[`p${index}`] = {
						x: Number.parseFloat(x),
						y: Number.parseFloat(y),
					};
					index++;
				}
			}
			const closestPoint = findClosestPointOnBezier(
				points.p0,
				points.p1,
				points.p2,
				points.p3,
				{ x: hoverCoordinates.x, y: hoverCoordinates.y },
			);
			if (buttonCoordinates === null) {
				setButtonCoordinates(closestPoint);
			} else {
				if (animationRef.current) {
					animationRef.current.x.stop();
					animationRef.current.y.stop();
				}
				const animationX = animate(buttonCoordinates.x, closestPoint.x, {
					duration: 0.04,
					ease: "easeOut",
					onUpdate: (value) => {
						setButtonCoordinates((coords) => ({ y: coords?.y, x: value }));
					},
				});
				const animationY = animate(buttonCoordinates.y, closestPoint.y, {
					duration: 0.04,
					ease: "easeOut",
					onUpdate: (value) => {
						setButtonCoordinates((coords) => ({ y: value, x: coords?.x }));
					},
				});
				animationRef.current = {
					x: animationX,
					y: animationY,
				};
			}
		} else {
			animationRef.current = null;
			setButtonCoordinates(null);
		}
	}, [edgePath, hoverCoordinates]);
	return (
		<>
			{/* <BaseEdge
				path={edgePath}
				onHover={handleHover}
				markerEnd={markerEnd}
				style={edgeStyle}
			/> */}
			{/* <path
				d={edgePath}
				onMouseMove={handleHover}
				onMouseLeave={mouseLeaveHandler}
				style={edgeStyle}
			/> */}
			<defs>
				<path id={`edge-${id}`} d={edgePath} fill="none" />
			</defs>
			<g id="group" onMouseMove={handleHover} onMouseLeave={mouseLeaveHandler}>
				<use
					xlinkHref={`#edge-${id}`}
					style={{
						strokeWidth: 40,
					}}
					pointer-events="stroke"
				/>
				<use style={edgeStyle} xlinkHref={`#edge-${id}`} />
			</g>
			<AnimatePresence>
				{buttonCoordinates !== null && isDeleteable && (
					<EdgeLabelRenderer>
						<motion.div
							{...opacityAnim}
							style={{
								position: "absolute",
								transform: `translate(-50%, -50%) translate(${buttonCoordinates.x}px,${buttonCoordinates.y}px)`,
								fontSize: 12,
								// everything inside EdgeLabelRenderer has no pointer events by default
								// if you have an interactive element, set pointer-events: all
								pointerEvents: "all",
							}}
							className="nodrag nopan"
						>
							{renderCloseButton(renderType) && <SButton
								onMouseOver={handleHover}
								onMouseLeave={mouseLeaveHandler}
								onClick={onEdgeClick}
								style={buttonStyle}
							>
								×
							</SButton>}
						</motion.div>
					</EdgeLabelRenderer>
				)}
			</AnimatePresence>
		</>
	);
}
