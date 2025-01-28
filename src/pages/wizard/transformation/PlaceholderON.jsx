import React from "react";
import HandlerPoints from "./Components/UI/HandlerPoints";
import { useNodeId } from "@xyflow/react";
import { Position } from "@xyflow/react";
function PlaceholderON({ data }) {
	const { label, inputs = [], outputs = [] } = data;
	const nodeId = useNodeId();

	return (
		<div className="p-[10px] pt-[20px] w-[200px] bg-[#080808] rounded-base opacity-75 flex flex-col gap-[20px]">
			<span className="text-secondary-yellow">{label}</span>
			{inputs.length > 0 && (
				<div>
					{inputs.map((input, index) => {
						return (
							<HandlerPoints
								key={`${nodeId}-input-${index}`}
								label={input}
								id={`${nodeId}-input-${index}`}
								position={Position.Left}
								type="target"
							/>
						);
					})}
				</div>
			)}
			{outputs.length > 0 && (
				<div>
					{outputs.map((output, index) => {
						return (
							<HandlerPoints
								key={`${nodeId}-output-${index}`}
								label={output}
								id={`${nodeId}-output-${index}`}
								position={Position.Right}
								type="source"
							/>
						);
					})}
				</div>
			)}
		</div>
	);
}

export default PlaceholderON;
