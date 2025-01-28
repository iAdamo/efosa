import React, { useContext } from "react";
import { WizardContext } from "@contexts/WizardContext";
import { deleteGenericCRUDWithID } from "@axios/apiCalls";
import VariableInsert from "./VariableInsert";
import { Button } from "react-aria-components";

const VariableSelector = ({
	sType,
	Util,
	objectType,
	objectID,
	InputComponent,
	...props
}) => {
	const { usedVariables, setUsedVariables, variables, webhookVariables } =
		useContext(WizardContext);

	let usedVariable = null;

	for (let i = 0; i < usedVariables.length; i++) {
		if (objectType == "FIELD") {
			if (usedVariables[i].fieldID == objectID) {
				usedVariable = usedVariables[i];
				break;
			}
		}
		if (objectType == "MEATBALL") {
			if (usedVariables[i].meatballID == objectID) {
				usedVariable = usedVariables[i];
				break;
			}
		}
		if (objectType == "ONINPUT") {
			if (usedVariables[i].ONInputID == objectID) {
				usedVariable = usedVariables[i];
				break;
			}
		}
	}

	let actualVariable = null;
	if (usedVariable != null) {
		if (usedVariable.variableType == "WEBHOOK") {
			for (let i = 0; i < webhookVariables.length; i++) {
				if (usedVariable.variableID == webhookVariables[i].id) {
					actualVariable = webhookVariables[i];
					break;
				}
			}
		} else if (usedVariable.variableType == "VARIABLE") {
			for (let i = 0; i < variables.length; i++) {
				if (usedVariable.variableID == variables[i].id) {
					actualVariable = variables[i];
					break;
				}
			}
		}
	}

	const deleteUsedVariable = async (usedVariableID) => {
		const deleted = await deleteGenericCRUDWithID(
			"Used_Variables",
			usedVariableID,
		);
		const allUsedVariables = [];
		for (let i = 0; i < usedVariables.length; i++) {
			if (usedVariables[i].id != usedVariableID) {
				allUsedVariables.push(usedVariables[i]);
			}
		}
		setUsedVariables(allUsedVariables);
	};

	return (
		<>
			{usedVariable != null && (
				<>
					<div className="text-white flex">
						{/* <div className="flex-grow">{actualVariable.name} </div> */}
					</div>
					<Button
						onClick={() => {
							deleteUsedVariable(usedVariable.id);
						}}
					>
						Delete
					</Button>
				</>
			)}
			{usedVariable == null && (
				<div className="flex gap-2">
					<VariableInsert
						sType={sType}
						objectType={objectType}
						objectID={objectID}
					/>

					{InputComponent && <InputComponent {...props} />}
				</div>
			)}
		</>
	);
};

export default VariableSelector;
