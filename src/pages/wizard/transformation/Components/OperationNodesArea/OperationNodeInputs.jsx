import { LinksContext } from "@contexts/LinksContext";
import { WizardContext } from "@contexts/WizardContext";
import DraggableLinkPoint from "@pages/wizard/transformation/Components/DraggableLinkPoint";
import { Position, useNodeId } from "@xyflow/react";
import { Handle } from "@xyflow/react";
import { useContext, useEffect, useMemo, useState } from "react";
import HandlerPoints from "../UI/HandlerPoints";
import useGlobalStore from "@/store/globalStore";

const selector = (state) => ({
	allEdges: state.edges.allIds.map((id) => state.edges.byId[id]),
	handles: state.handles,
});
const OperationNodeInputs = (props) => {
	const {
		ON,
		ONConfig,
		nodeType,
		setNodeType,
		isCollapsed,
		isIfCondition = false,
	} = props;
	const { allEdges, handles } = useGlobalStore(selector);
	const nodeId = useNodeId();

	const showGhost = false;

	const filteredLinks = allEdges.filter(
		(link) =>
			link.target === nodeId &&
			!handles.byId[link.targetHandle]?.data.isPassthrough,
	);

	let numberOfInputs = filteredLinks?.length ?? 0;
	if (filteredLinks.length < ONConfig.maxInput || ONConfig.maxInput == -1) {
		numberOfInputs++;
	}

	return (
		<div className="flex flex-col">
			{[...Array(numberOfInputs)].map((number, index) => {
				return (
					<>
						<HandlerPoints
							key={`ON-input-${ON.id}-${index}`}
							id={`ON-input-${ON.id}-${index}`}
							position={Position.Left}
							type="target"
							index={index}
							dataType={nodeType}
							label={`Input ${index + 1}`}
							isCollapsed={isCollapsed}
						/>
					</>
				);
			})}
		</div>
	);
};

export default OperationNodeInputs;
