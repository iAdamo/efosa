import { useState, useCallback, useContext } from "react";
import CheckBoxComponent from "@pages/wizard/transformation/Components/CheckBoxComponent";
import { PlusIcon } from "@heroicons/react/solid";
import { PagesContext } from "@contexts/PagesContext";
import { WizardContext } from "@contexts/WizardContext";
import { addActiveNode } from "@axios/apiCalls";
import { WIZARD_COMPONENT_TYPE } from "@/constants";

const AddRelatedNodes = ({ parentNode, availableNodes }) => {
	const [selectedNodes, setSelectedNodes] = useState([]);

	const { speccID } = useContext(PagesContext);
	const {
		apiId,
		setTriggerInitRequest,
		sourceApi,
		destinationApi,
		getNodeDirection,
		setActiveNodes,
		activeNodes,
	} = useContext(WizardContext);

	const getApiId = () => {
		if (selectedNodes.length) {
			if (selectedNodes[0].direction === "DESTINATION") {
				return destinationApi.info.id;
			}
			if (selectedNodes[0].direction === "SOURCE") {
				return sourceApi.info.id;
			}
			return "";
		}
	};

	const { isMatchMode } = useContext(MatchContext);
	const { selectedPairing } = useContext(RunnerContext);

	const addHandler = useCallback(async () => {
		const models = [];
		for (let i = 0; i < selectedNodes.length; i++) {
			const model = {
				speccID: speccID,
				APIID: parentNode.APIID,
				endpoint: null,
				name: selectedNodes[i],
				speccpageid: parentNode.speccpageid,
				parentNode: parentNode.id,
				isMatching: isMatchMode,
				pairingID: selectedPairing ? selectedPairing.id : null,
				type: WIZARD_COMPONENT_TYPE.RUN,
			};

			models.push(model);
		}

		const { data } = await addActiveNode(models);

		const filteredData = data.filter((newNode) => {
			for (let i = 0; i < activeNodes.length; i++) {
				if (activeNodes[i].id === newNode.id) {
					return false;
				}
			}
			return true;
		});

		setActiveNodes((v) => [...v, ...filteredData]);
	}, [selectedNodes, parentNode, apiId, speccID, setTriggerInitRequest]);

	const toggleNode = (node) => {
		if (selectedNodes.findIndex((item) => item === node) === -1) {
			setSelectedNodes([...selectedNodes, node]);
		} else {
			setSelectedNodes((nodes) => nodes.filter((item) => item !== node));
		}
	};

	return (
		<div>
			{availableNodes.map((availableNode) => {
				return (
					<CheckBoxComponent
						isChecked={
							selectedNodes.findIndex((item) => item === availableNode) !== -1
						}
						type={getNodeDirection(parentNode.APIID).toLowerCase()}
						name={availableNode}
						onChange={() => {
							toggleNode(availableNode);
						}}
					/>
				);
			})}

			<div>
				<button className="nodetoolbar-addButton" onClick={addHandler}>
					<PlusIcon
						className="mr-2 h-6 w-6 p-1 text-white bg-lightPurple rounded-md"
						aria-hidden="true"
					/>
					Add related node
				</button>
			</div>
		</div>
	);
};

export default AddRelatedNodes;
