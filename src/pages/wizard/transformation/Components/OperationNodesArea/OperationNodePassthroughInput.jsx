import { LinksContext } from "@contexts/LinksContext";
import { WizardContext } from "@contexts/WizardContext";
import DraggableLinkPoint from "@pages/wizard/transformation/Components/DraggableLinkPoint";
import { useContext, useEffect, useMemo, useState } from "react";
import HandlerPoints from "../UI/HandlerPoints";
import { Position, useNodeId, useUpdateNodeInternals } from "@xyflow/react";
import useGlobalStore from "@/store/globalStore";

const selector = (state) => ({
	activeConnectionLine: state.activeConnectionLine,
});

const OperationNodePassthroughInput = (props) => {
	const { ON, ONConfig, nodePassthroughType, isCollapsed } = props;
	const { activeConnectionLine } = useGlobalStore(selector);
	const nodeId = useNodeId();
	const updateNodeInternals = useUpdateNodeInternals();

	useEffect(() => {
		updateNodeInternals(nodeId);
	}, [nodePassthroughType]);

	return (
		<div className="flex flex-col p-3">
			<div className="relative flex-col schema-block reverse  textalign-left ">
				<HandlerPoints
					id={`output-passthrough-${ON.id}`}
					type="target"
					isPassthrough={true}
					position={Position.Left}
					style={{
						left: "-12px",
					}}
					hidden={activeConnectionLine === null && !nodePassthroughType}
					dataType={nodePassthroughType}
					isCollapsed={isCollapsed}
				/>
			</div>
		</div>
	);
};

export default OperationNodePassthroughInput;
