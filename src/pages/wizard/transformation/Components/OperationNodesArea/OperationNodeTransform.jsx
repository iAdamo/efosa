import { useMemo, useState, useContext, useEffect } from "react";

import OperationNodeInputs from "./OperationNodeInputs";
import OperationNodeBlockInputSection from "./OperationNodeBlockInputSection";
import OperationNodeOutputArea from "./OperationNodeOutputArea";
import OperationNodeOutputs from "./OperationNodeOutputs";
import {
	getGenericCRUDWithID,
	updateFieldForON,
	updateIndexForON,
} from "@axios/apiCalls";
import { WizardContext } from "@contexts/WizardContext";
import SInput from "@/components/SInput";
import { useNodeId } from "@xyflow/react";
import useGlobalStore from "@/store/globalStore";

const selector = (state) => ({
	edges: state.edges.allIds.map((id) => state.edges.byId[id]),
});

const OperationNodeTransform = ({
	ON,
	ONConfig,
	nodeType,
	setNodeType,
	isCollapsed,
}) => {
	const nodeId = useNodeId();

	const { edges } = useGlobalStore(selector);

	if (!ON || !ONConfig) {
		return <></>;
	}

	const [linksToON, setLinksToON] = useState(null);
	const { operationNodes, setOperationNodes, activeFields } =
		useContext(WizardContext);

	useEffect(() => {
		setLinksToON(edges.filter((link) => link.target === nodeId));
	}, [edges, nodeId]);

	useEffect(() => {
		(async () => {
			if (ONConfig.isForObjects) {
				if (numberOfLinksToON != null && linksToON.length > numberOfLinksToON) {
					const ONInfo = await getGenericCRUDWithID(
						"Operation_Nodes",
						ON.id,
						[],
					);

					const allNodes = [];
					for (let i = 0; i < operationNodes.length; i++) {
						if (operationNodes[i].id == ON.id) {
							allNodes.push(ONInfo.data[0]);
						} else {
							allNodes.push(operationNodes[i]);
						}
					}
					setOperationNodes(allNodes);

					setNumberOfLinksToON(linksToON.length);
				}
				if (numberOfLinksToON == null) {
					setNumberOfLinksToON(linksToON.length);
				}
			}
		})();
	}, [linksToON, ON, ONConfig]);

	let fieldsToChooseFrom = null;
	if (ON.nodeID != null) {
		fieldsToChooseFrom = [];
		for (let i = 0; i < activeFields.length; i++) {
			if (activeFields[i].nodeID == ON.nodeID) {
				fieldsToChooseFrom.push(activeFields[i]);
			}
		}
	}

	useEffect(() => {
		if (ONConfig != null) {
			if (ONConfig.isForObjects) {
				setNodeType("object");
			} else {
				if (ONConfig.fromString) {
					setNodeType("string");
				}
				if (ONConfig.fromBoolean) {
					setNodeType("boolean");
				}
				if (ONConfig.fromDecimal) {
					setNodeType("number");
				}
				if (ONConfig.fromInteger) {
					setNodeType("integer");
				}
			}
		}
	}, [ONConfig, setNodeType]);

	const updateObjectIndexes = async (e) => {
		const updated = updateIndexForON(ON.id, e.target.value);
		ON.objectIndexes = e.target.value;

		const allNodes = [];
		for (let i = 0; i < operationNodes.length; i++) {
			if (operationNodes[i].id == ON.id) {
				allNodes.push(ON);
			} else {
				allNodes.push(operationNodes[i]);
			}
		}
		setOperationNodes(allNodes);
	};

	const updateFieldID = async (e) => {
		const updated = updateFieldForON(ON.id, e.target.value);
		ON.workOnFieldID = e.target.value;

		const allNodes = [];
		for (let i = 0; i < operationNodes.length; i++) {
			if (operationNodes[i].id == ON.id) {
				allNodes.push(ON);
			} else {
				allNodes.push(operationNodes[i]);
			}
		}
		setOperationNodes(allNodes);
	};

	return (
		<>
			<div className="flex flex-col">
				<OperationNodeInputs
					ON={ON}
					ONConfig={ONConfig}
					nodeType={nodeType}
					setNodeType={setNodeType}
					isCollapsed={isCollapsed}
				/>
				{!isCollapsed && (
					<>
						{!!ONConfig.isForObjects && (
							<div className="flex flex-col">
								<div className="">
									Index:
									<SInput
										className="ml-2 border inline-block h-[24px] w-[100px]"
										type="text"
										onBlur={(e) => updateObjectIndexes(e)}
										defaultValue={ON.objectIndexes}
									/>
								</div>
								{fieldsToChooseFrom && (
									<div className="mt-2">
										Field:
										<select onClick={(e) => updateFieldID(e)}>
											<option value={null}>Select field</option>
											{fieldsToChooseFrom.map((field) => {
												return (
													<option
														value={field.id}
														selected={
															field.id == ON.workOnFieldID ? "selected" : ""
														}
													>
														{field.name}
													</option>
												);
											})}
										</select>
									</div>
								)}
							</div>
						)}

						{ON.operationNodeInputs?.map((el) => (
							<OperationNodeBlockInputSection
								key={el.id}
								ON={ON}
								ONConfig={ONConfig}
								operationNodeInput={el}
								value={el?.value || ""}
							/>
						))}
					</>
				)}

				<OperationNodeOutputs
					ON={ON}
					ONConfig={ONConfig}
					nodePassthroughType={null}
					setNodePassthroughType={null}
					isCollapsed={isCollapsed}
				/>
			</div>
		</>
	);
};

export default OperationNodeTransform;
