import { getStraightPath, useNodeId } from "@xyflow/react";
import { getSmoothStepPath } from "@xyflow/react";
import { Handle } from "@xyflow/react";
import { fill } from "lodash";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { colors } from "@/constants";
import useGlobalStore from "@/store/globalStore";
import { roundCorners } from 'svg-round-corners';

const selector = (state) => ({
	addRelationHandle: state.addRelationHandle,
	removeRelationHandle: state.removeRelationHandle,
});


export function RelatedNodesHandles({ id, ...props }) {
	const { addRelationHandle, removeRelationHandle } = useGlobalStore(selector);
	const nodeId = useNodeId();

	useEffect(() => {
		const handleData = {
			id: id,
			data: {
				nodeId: nodeId
			}
		};
		addRelationHandle(handleData);

		return () => {
			removeRelationHandle(id);
		};
	}, [addRelationHandle, removeRelationHandle, id, nodeId]);

	return (
		<Handle
			id={id}
			{...props}
			isConnectable={false}
			className="!border-0 !bg-transparent"
		/>
	);
}

export function RelatedNodesLinks({
	id,
	source,
	sourceX,
	sourceY,
	targetX,
	targetY,
}) {
	const path = `M${sourceX},${sourceY - 4} ${sourceX},${targetY} ${targetX},${targetY}`;
	const roundedPath = roundCorners(path, 8).path;
	const color = source === "API1" ? colors.secondary["pink-light-1"] : colors.secondary["aqua-1"];


	return (
		<g>
			<defs>
				<marker
					id={`arrowHead-${id}`}
					viewBox="0 0 10 10"
					refX="9"
					refY="5"
					markerWidth="6"
					markerHeight="6"
					orient="auto-start-reverse">
					<path d="M 0 0 L 10 5 L 0 10" style={{
						strokeWidth: "1.5px",
						fill: "none",
						stroke: color,
					}} />
				</marker>
			</defs>
			<path
				d={roundedPath}
				style={{
					strokeWidth: "1.5px",
					fill: "none",
					stroke: color,
				}}
				markerEnd={`url(#arrowHead-${id})`}
			/>
		</g>
	);
}
