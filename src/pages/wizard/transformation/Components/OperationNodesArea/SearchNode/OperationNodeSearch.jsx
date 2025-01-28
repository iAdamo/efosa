import { useMemo, useState, useContext, useEffect } from "react";

import OperationNodeInputs from "../OperationNodeInputs";
import OperationNodeBlockInputSection from "../OperationNodeBlockInputSection";
import OperationNodeOutputArea from "../OperationNodeOutputArea";
import OperationNodeOutputs from "../OperationNodeOutputs";
import {
	getGenericCRUDWithID,
	updateFieldForON,
	updateIndexForON,
} from "@axios/apiCalls";
import { WizardContext } from "@contexts/WizardContext";
import NodeActivationModal from "./NodeActivationModal";

const OperationNodeSearch = ({
	ON,
	ONConfig,
	nodeType,
	setNodeType,
	inputs,
	operationNodesInput,
	isCollapsed,
}) => {
	if (!ON || !ONConfig) {
		return <></>;
	}

	const { operationNodes, setOperationNodes, links, activeFields } =
		useContext(WizardContext);

	return <div className="flex flex-col mb-3 px-3">I</div>;
};

export default OperationNodeSearch;
