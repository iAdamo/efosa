import React, { useContext } from "react";
import { addActiveNode, updateTransferKey } from "@axios/apiCalls";
import { WizardContext } from "@contexts/WizardContext";
import { MatchContext } from "@contexts/MatchContext";
import SButton from "@/components/SButton";
import { Button } from "react-aria-components";
import { WIZARD_COMPONENT_TYPE } from "@/constants";

export default function UniqueDestinationPage(props) {
	const { activeNodes, setActiveNodes, speccID, transferkey, setTransferkey } =
		useContext(WizardContext);

	const { isMatchMode } = useContext(MatchContext);

	const allPostResponses = activeNodes.filter((node) => {
		if (node.isPostResponse) {
			return true;
		}
		return false;
	});

	const addNode = async (parentNode, selectedName) => {
		const models = [];

		const model = {
			speccID: speccID,
			APIID: parentNode.APIID,
			endpoint: null,
			isPostResponse: true,
			name: selectedName,
			//speccpageid: parentNode.speccpageid,
			parentNode: parentNode.id,
			isMatching: isMatchMode,
			type: WIZARD_COMPONENT_TYPE.RUN
		};

		models.push(model);

		const { data } = await addActiveNode(models);

		const newActiveNodes = [];
		for (let i = 0; i < activeNodes.length; i++) {
			newActiveNodes.push(activeNodes[i]);
		}
		newActiveNodes.push(data[0]);

		setActiveNodes(newActiveNodes);
	};

	const setUnique = async (nodeID, name) => {
		const second = {};
		second.nodeID = nodeID;
		second.keyName = name;
		const updatedTransferkey = await updateTransferKey(
			transferkey.id,
			null,
			second,
			null,
		);
		console.log("Updated");
		console.log(updatedTransferkey);

		setTransferkey(updatedTransferkey.data);
	};

	return (
		<div className="w-full bg-[#080808] m-4 p-3 rounded-base h-full overflow-scroll flex flex-col gap-12">
			{allPostResponses.map((node) => {
				return (
					<div className="flex flex-col gap-2 border rounded-base p-3">
						<span>Node: {node.name}</span>
						<span>Related nodes:</span>
						<div className="flex gap-2">
							{node.availableRelatedNodes.map((relatedNodes) => {
								return (
									<SButton
										onClick={() => {
											addNode(node, relatedNodes.name);
										}}
									>
										{relatedNodes.name}
									</SButton>
								);
							})}
						</div>
						Fields:
						<div className="flex flex-col gap-1 items-start">
							{node.availableFields.map((availableField) => {
								let isKey = false;
								if (
									transferkey.destinationKeyNodeID == node.id &&
									transferkey.destinationKeyName == availableField.name
								) {
									isKey = true;
								}

								return (
									<Button
										className={` w-max p-2 rounded ${isKey ? "bg-custom-pink" : "bg-grey-3"}`}
										onPress={() => {
											setUnique(node.id, availableField.name);
										}}
									>
										{availableField.name}
									</Button>
								);
							})}
						</div>
					</div>
				);
			})}
		</div>
	);
}
