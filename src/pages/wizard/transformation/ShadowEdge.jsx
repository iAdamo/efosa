import React from "react";
import { BaseEdge, getBezierPath } from "@xyflow/react";

export default ({
	sourceX,
	sourceY,
	targetX,
	targetY,
	sourcePosition,
	targetPosition,
	markerEnd,
}) => {
	const [edgePath, labelX, labelY] = getBezierPath({
		sourceX,
		sourceY,
		sourcePosition,
		targetX,
		targetY,
		targetPosition,
	});

	return (
		<BaseEdge
			path={edgePath}
			markerEnd={markerEnd}
			style={{
				stroke: "grey",
			}}
		/>
	);
};
