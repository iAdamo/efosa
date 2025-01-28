import React from "react";
import {
	BaseEdge,
	getBezierPath,
	useConnection,
	useStore,
} from "@xyflow/react";
import { useState, useEffect } from "react";
import useGlobalStore from "@/store/globalStore";
import { getTypeColor } from "@/utils/typeColour";
import { useShallow } from "zustand/react/shallow";

const zoomSelector = (s) => s.transform[2];

const selector = (state) => ({
	setActiveConnectionLine: state.setActiveConnectionLine,
	removeActiveConnectionLine: state.removeActiveConnectionLine,
	getHandle: state.getHandle,
	activeConnectionLineDisableHandles: state.activeConnectionLineDisableHandles,
	enableAllHandles: state.enableAllHandles,
});

export default ({
	fromX,
	fromY,
	toX,
	toY,
	fromPosition,
	toPosition,
	markerEnd,
	fromHandle,
}) => {
	const zoom = useStore(zoomSelector);
	const {
		setActiveConnectionLine,
		removeActiveConnectionLine,
		getHandle,
		activeConnectionLineDisableHandles,
		enableAllHandles,
	} = useGlobalStore(useShallow(selector));
	const [circleRadius, setCircleRadius] = useState(8);
	const [style, setStyle] = useState({
		stroke: "white",
		strokeDasharray: 8,
		strokeWidth: 2,
	});
	const connection = useConnection();

	const [edgePath] = getBezierPath({
		sourceX: fromX,
		sourceY: fromY,
		targetX: toX,
		targetY: toY,
		sourcePosition: fromPosition,
		targetPosition: toPosition,
	});

	useEffect(() => {
		const maxHeight = 8;
		const minHeight = 4;
		let appliedHeight = 10 / zoom;
		if (appliedHeight < minHeight) appliedHeight = minHeight;
		else if (appliedHeight > maxHeight) appliedHeight = maxHeight;
		setCircleRadius(appliedHeight);
	}, [zoom]);

	useEffect(() => {
		const handleID = fromHandle.id;
		const handle = getHandle(handleID);
		if (handle.data.type)
			setStyle((style) => ({
				...style,
				stroke: getTypeColor(handle.data.type),
			}));
		setActiveConnectionLine({
			type: handle.data.type,
			nodeId: handle.data.nodeId,
		});
		activeConnectionLineDisableHandles();
		return () => {
			enableAllHandles();
			removeActiveConnectionLine();
		};
	}, [
		setActiveConnectionLine,
		removeActiveConnectionLine,
		getHandle,
		fromHandle.id,
		activeConnectionLineDisableHandles,
		enableAllHandles,
	]);

	return (
		<g>
			<BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
			<circle
				cx={toX}
				cy={toY}
				fill="#fff"
				r={circleRadius}
				stroke="white"
				strokeWidth={1.5}
			/>
		</g>
	);
};
