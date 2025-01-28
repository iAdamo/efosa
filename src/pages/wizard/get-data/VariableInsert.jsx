import React, { useContext, useRef, useState } from "react";
import { WizardContext } from "@contexts/WizardContext";
import { postGenericCRUD } from "@axios/apiCalls";
import useOutsideClickHandler from "@hooks/useOutsideHandler";

const VariableInsert = React.forwardRef(
	({ sType, objectType, objectID, ...props }, ref) => {
		const { speccID } = useContext(WizardContext);
		const { usedVariables, setUsedVariables, variables, webhookVariables } =
			useContext(WizardContext);

		const dropdownRef = useRef(null);

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

		const insertVariable = async (
			variableID,
			objectType,
			objectID,
			speccID,
			variableType
		) => {
			const sendObject = {
				variableID: variableID,
				speccID: speccID,
				variableType: variableType,
			};

			if (objectType == "FIELD") {
				sendObject.fieldID = objectID;
			} else if (objectType == "MEATBALL") {
				sendObject.meatballID = objectID;
			} else if (objectType == "ONINPUT") {
				sendObject.ONInputID = objectID;
			}

			const insertedVariable = await postGenericCRUD(
				"Used_Variables",
				sendObject
			);

			const allUsedVariables = [];
			for (let i = 0; i < usedVariables.length; i++) {
				allUsedVariables.push(usedVariables[i]);
			}
			allUsedVariables.push(insertedVariable.data[0]);

			setUsedVariables(allUsedVariables);
		};

		const filteredVariables = variables.filter((variable) => {
			if (variable?.type?.toLowerCase() == sType?.toLowerCase()) {
				return true;
			}
			return false;
		});

		useOutsideClickHandler(dropdownRef, async (e) => {
			let isFound = false;
			let parent = e.target;
			let run = true;
			while (run) {
				if (parent.id == "app") {
					run = false;
					break;
				}

				if (parent.id == "dropdowntoggler") {
					isFound = true;
					run = false;
					break;
				}
				parent = parent.parentNode;
			}

			//let parent = e.target.parentNode
			if (!isFound) {
				setDropdownHidden(true);
			}
		});

		const [dropdownHidden, setDropdownHidden] = useState(true);
		return (
			<div className="flex">
				<div
					className="relative dropdowntoggler"
					id={"dropdowntoggler"}
					onClick={() => {
						setDropdownHidden(!dropdownHidden);
					}}
				>
					Var
				</div>
				<div className="">
					<div className="absolute">
						<div
							ref={dropdownRef}
							className={`${
								dropdownHidden ? "hidden" : "absolute"
							} flex-col max-w-[205px] absolute rounded-[5px] p-[10px] shadow-[0_4px_4px_0px_rgba(0,0,0,0.25)] w-[205px] bg-[#3c3c3c] z-[999999] text-white`}
						>
							<div className="flex flex-col">
								<div>
									Manually set variables
									{filteredVariables.map(
										(filteredVariable) => {
											return (
												<>
													<div
														onClick={() => {
															insertVariable(
																filteredVariable.id,
																objectType,
																objectID,
																speccID,
																"VARIABLE"
															);
														}}
													>
														{filteredVariable.name}
													</div>
												</>
											);
										}
									)}
								</div>
								<div>
									Webhook variables
									{webhookVariables.map((webhookVariable) => {
										return (
											<>
												<div
													onClick={() => {
														insertVariable(
															webhookVariable.id,
															objectType,
															objectID,
															speccID,
															"WEBHOOK"
														);
													}}
												>
													{webhookVariable.name}
												</div>
											</>
										);
									})}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
);

export default VariableInsert;
