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

export default function LoadingEdge({
	id,
	sourceX,
	sourceY,
	targetX,
	targetY,
	sourcePosition,
	targetPosition,
}) {
	const [edgePath] = getBezierPath({
		sourceX,
		sourceY,
		sourcePosition,
		targetX,
		targetY,
		targetPosition,
	});

	return (
		<path
			id={`edge-loading-${id}`}
			d={edgePath}
			animated={true}
			className="animate-move-and-pulse"
			stroke-linecap="round"
			stroke-linejoin="round"
			style={{
				stroke: "grey",
				strokeDasharray: 8,
			}}
			fill="none"
		/>
	);
}
