import { ProjectContext } from "@contexts/ProjectContext";
import { postGenericCRUDWithID } from "@axios/apiCalls";
import { useContext } from "react";
import Primitive from "./VariableTypes/Primitive";
import DateVariableType from "./VariableTypes/DateVariableType";
import DateRangeVariableType from "./VariableTypes/DateRangeVariableType";
import Predefined from "./VariableTypes/Predefined";

export default function SelectedVariable(props) {
	const { selectedVariableID, setSelectedVariable } = props;

	const { variables, setVariables } = useContext(ProjectContext);

	let selectedVariable = null;
	for (let i = 0; i < variables.length; i++) {
		if (variables[i].id == selectedVariableID) {
			selectedVariable = variables[i];
			break;
		}
	}

	const updateVariableName = async (e) => {
		const newName = e.target.value;
		const updatedVariable = await postGenericCRUDWithID(
			"Active_Variables",
			selectedVariableID,
			{ name: newName }
		);
		const newList = [];

		for (let i = 0; i < variables.length; i++) {
			if (variables[i].id == selectedVariableID) {
				newList.push(updatedVariable.data);
			} else {
				newList.push(variables[i]);
			}
		}

		setVariables(newList);
	};

	const setVariableType = async (type) => {
		const newName = type;
		const updatedVariable = await postGenericCRUDWithID(
			"Active_Variables",
			selectedVariableID,
			{ variableType: newName }
		);
		const newList = [];

		for (let i = 0; i < variables.length; i++) {
			if (variables[i].id == selectedVariableID) {
				newList.push(updatedVariable.data);
			} else {
				newList.push(variables[i]);
			}
		}

		setVariables(newList);
	};

	const resetVariableType = async () => {
		const updatedVariable = await postGenericCRUDWithID(
			"Active_Variables",
			selectedVariableID,
			{ variableType: null }
		);

		const newList = [];

		for (let i = 0; i < variables.length; i++) {
			if (variables[i].id == selectedVariableID) {
				newList.push(updatedVariable.data);
			} else {
				newList.push(variables[i]);
			}
		}


		setVariables(newList);
	};

	return (
		<>
			<div className="bg-[#111111] text-white">
				<div
					onClick={() => {
						setSelectedVariable(null);
					}}
				>
					Back
				</div>
				<div>Variable name:</div>
				<div>
					<input
						onBlur={(e) => {
							updateVariableName(e);
						}}
						className="text-black"
						type={"text"}
						defaultValue={selectedVariable.name}
					/>
				</div>

				{selectedVariable.variableType == null && (
					<>
						<div>Select type</div>
						<button
							className="s-button s-button-normal border border-white m-2"
							onClick={() => {
								setVariableType("PRIMITIVE");
							}}
						>
							Primitive
						</button>
						<button
							className="s-button s-button-normal border border-white m-2"
							onClick={() => {
								setVariableType("DATE");
							}}
						>
							Date
						</button>
						<button
							className="s-button s-button-normal border border-white m-2"
							onClick={() => {
								setVariableType("DATERANGE");
							}}
						>
							Date range
						</button>
						<button
							className="s-button s-button-normal border border-white m-2"
							onClick={() => {
								setVariableType("PREDEFINED");
							}}
						>
							Predefined
						</button>
					</>
				)}

				{selectedVariable.variableType != null && (
					<button
						className="s-button s-button-normal border border-white m-2"
						onClick={() => {
							resetVariableType();
						}}
					>
						Reset type
					</button>
				)}

				{selectedVariable.variableType != null &&
					selectedVariable.variableType == "PRIMITIVE" && (
						<Primitive variableProp={selectedVariable} />
					)}
				{selectedVariable.variableType != null &&
					selectedVariable.variableType == "DATE" && (
						<DateVariableType variableProp={selectedVariable} />
					)}
				{selectedVariable.variableType != null &&
					selectedVariable.variableType == "DATERANGE" && (
						<DateRangeVariableType />
					)}
				{selectedVariable.variableType != null &&
					selectedVariable.variableType == "PREDEFINED" && (
						<Predefined variableProp={selectedVariable} />
					)}
			</div>
		</>
	);
}
