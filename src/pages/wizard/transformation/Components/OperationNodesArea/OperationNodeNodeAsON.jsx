import { useMemo, useState, useContext } from "react";
import NodeComponentHeader from "../NodeComponent/NodeComponentHeader";
import SchemaComponent from "@pages/wizard/transformation/Components/SchemaComponent";
import SelectNode from "../UI/SelectNode";
import { DIRECTION } from "@constants";
import { WizardContext } from "@contexts/WizardContext";
import NodeComponent from "@pages/wizard/transformation/Components/NodeComponent";
import DraggableLinkPoint from "@pages/wizard/transformation/Components/DraggableLinkPoint";
import { updateOperationNodeApi } from "@axios/apiCalls";
import HandlerPoints from "../UI/HandlerPoints";
import { Position } from "@xyflow/react";

const list = [
	{ name: "Name", value: "Test example data" },
	{ name: "Account", value: "Example data" },
	{ name: "Amount", value: "Example data" },
	{ name: "customerNumber", value: "Example data" },
	{ name: "email", value: "Example data" },
];

const OperationNodeNodeAsON = ({ ON, fullNode, allActiveFields, ONConfig }) => {
	const [isCollapsed, setIsCollapsed] = useState(false);
	const [selectValue, setSelectValue] = useState("Show all parameters");

	const { activeNodes, activeFields, speccID } = useContext(WizardContext);
	/*
    const { node, speccId } = useMemo(() => {
        const node = [...activeSchemas.destination].find(
            ({ activeNodeId }) => activeNodeId === parentNodeId
        );

        const pathname = window.location.pathname;
        const speccId = pathname.substring(pathname.lastIndexOf("/") + 1);

        return { node, speccId };
    }, [parentNodeId, activeSchemas]);
*/
	if (!ON) {
		return null;
	}

	return (
		<div className="rounded-lg relative px-3 flex flex-col gap-4">
			<HandlerPoints
				id={`asON-${ON.id}`}
				type="source"
				position={Position.Right}
				isNodeAsON={true}
				index={0}
				dataType="connection"
				label={"connection"}
			/>

			<NodeComponent
				//{...props}
				fullNode={fullNode}
				//{...node}
				direction={"DESTINATION"}
				speccid={speccID}
				ON={ON}
				isNodeAsON={true}
				//deleteNode={deleteNode}
				//parentNodeId={parentNodeId}
				isRelatedNode={0}
			/>
		</div>
	);
};

export default OperationNodeNodeAsON;
