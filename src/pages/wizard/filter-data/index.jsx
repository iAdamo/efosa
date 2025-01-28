import SInput from "@/components/SInput";
import SRadioGroup from "@/components/SRadioGroup";
import SSelectDropdown, { DropdownItem } from "@/components/SSelectDropdown";
import Filter from "@assets/icons/filter.svg?react";
import AddIcon from "@assets/icons/add.svg?react";
import Delete from "@assets/icons/delete.svg?react";
import { Radio } from "react-aria-components";
import { v4 as uuidv4 } from "uuid";
import { useState } from "react";
import useGlobalStore from "@/store/globalStore";
import { useShallow } from "zustand/react/shallow";
import { useEffect } from "react";
import { deleteGenericCRUDWithID, getModuleInput, postGenericCRUD, postGenericCRUDWithID, runModule } from "@/axios/apiCalls";
import NestedGrid from "@/components/NestedGrid/NestedGrid";
import { WizardContext } from "@/contexts/WizardContext";
import { useContext } from "react";
import { act } from "react";

const selector = (state) => ({
	activeModules: state.activeModules,
	initialDataFetched: state.dataFetched.initialSpeccValues,
	activeFields: state.activeFields,
	activeNodes: state.activeNodes,
});

/*
const selector = (state) => ({
	activeModules: state.activeModules,
	setActiveModules: state.setActiveModules,
	initialDataFetched: state.dataFetched.initialSpeccValues,
	speccId: state.speccId,
	sourceAPIData: state.sourceAPIData,
	activeFields: state.activeFields,
	activeNodes: state.activeNodes,
	updateActiveField: state.updateActiveField,
	transferKey: state.transferKey,
  });
*/
export default function FilterData() {
	const { activeModules, initialDataFetched, activeFields,
		activeNodes, } = useGlobalStore(
			useShallow(selector),
		);

	const {
		speccID,
		sourceAPIID,
		conditionalComparisons,
		getAndSetOKStatuses
	} = useContext(WizardContext);


	const [module, setModule] = useState(null);
	const [moduleResponseAnswer, setModuleResponseAnswer] = useState(null);
	const [moduleResponseInput, setModuleResponseInput] = useState(null);
	const sourceFieldsToFilter = [];
	const sourceNodes = [];

	useEffect(() => {
		(async () => {
			if (module) {
				const moduleResponseAnswer = await getModuleInput(speccID, module.id);

				setModuleResponseInput(moduleResponseAnswer);
				getAndSetOKStatuses(false, ["FILTER"]);
			}
		})();
	}, [module, speccID]);


	for (const [key, node] of Object.entries(activeNodes.byId)) {
		if (node.APIID === sourceAPIID) {
			sourceNodes.push(node);
		}
	}



	for (const [key, field] of Object.entries(activeFields.byId)) {
		let found = false;
		for (let i = 0; i < sourceNodes.length; i++) {
			if (field.nodeID === sourceNodes[i].id) {
				found = true;
				break;
			}
		}
		if (found) {
			sourceFieldsToFilter.push(field);
		}
	}



	for (let i = 0; i < activeFields.length; i++) {
		let found = false;
		for (let j = 0; j < sourceNodes.length; j++) {
			if (activeFields[i].nodeID === sourceNodes[j].id) {
				found = true;
			}
		}
		if (found) {
			sourceFieldsToFilter.push(activeFields[i]);
		}
	}


	useEffect(() => {
		if (initialDataFetched && activeModules) {
			const module = activeModules.find(
				(module) => module.config.name === "FILTER",
			);
			setModule(module);
		}
	}, [activeModules, initialDataFetched]);

	useEffect(() => {
		(async () => {
			const moduleResponseAnswer = await runModule(speccID, module.id);
			setModuleResponseAnswer(moduleResponseAnswer);
		})();
	}, [module]);


	const addLine = async () => {
		const newLine = await postGenericCRUD('Filter_Lines', {
			moduleID: module.id,
		});

		setModule({
			...module,
			lines: [...module.lines, newLine.data[0]],
		});
	}


	const deleteFilter = async (line) => {
		await deleteGenericCRUDWithID('Filter_Lines', line.id);
		const newLines = module.lines.filter((item) => item.id !== line.id);
		setModule({
			...module,
			lines: newLines,
		});
	}

	const updateLineField = async (line, id) => {
		const updatedLine = await postGenericCRUDWithID('Filter_Lines', line.id, {
			activeFieldID: id,
		});

		const newLines = module.lines.map((item) => {
			if (item.id === line.id) {
				return updatedLine.data;
			}
			return item;
		});
		setModule({
			...module,
			lines: newLines,
		});
	}


	const updateLineComparison = async (line, comparisonID) => {
		const updatedLine = await postGenericCRUDWithID('Filter_Lines', line.id, {
			comparisonID,
		});

		const newLines = module.lines.map((item) => {
			if (item.id === line.id) {
				return updatedLine.data;
			}
			return item;
		});
		setModule({
			...module,
			lines: newLines,
		});
	}

	const updateFilterValue = async (line, value) => {
		const updatedLine = await postGenericCRUDWithID('Filter_Lines', line.id, {
			value,
		});

		const newLines = module.lines.map((item) => {
			if (item.id === line.id) {
				return updatedLine.data;
			}
			return item;
		});
		setModule({
			...module,
			lines: newLines,
		});
	}

	const updateIncludeExclude = async (line, includeExclude) => {
		const updatedLine = await postGenericCRUDWithID('Filter_Lines', line.id, {
			IncludeOrExclude: includeExclude,
		});

		const newLines = module.lines.map((item) => {
			if (item.id === line.id) {
				return updatedLine.data;
			}
			return item;
		});
		setModule({
			...module,
			lines: newLines,
		});
	}


	if (!module) {
		return null;
	}

	return (
		<div className="flex gap-[10px] w-full filter-data-wrapper p-[10px] max-h-[98%] overflow-hidden">
			<div className="w-[35%] flex flex-col p-[10px] rounded-[5px] bg-[#080808] h-max max-h-[98%] overflow-y-scroll gap-[10px]">
				<div class="text-white text-xs font-bold font-['Inter'] leading-[11px] tracking-tight">
					Data
				</div>
				{moduleResponseAnswer ? (
					<NestedGrid isListOfDataObjects={true} gridData={moduleResponseInput?.listOfDataObjects} />
				) : (
					<div className="h-[30vh] flex bg-grey-1 rounded-[5px] items-center justify-center">
						<div class="text-[#aeaeae] text-xs font-normal font-['Inter'] leading-[11px]">
							No parameters selected
						</div>
					</div>
				)}
			</div>
			<div className="flex flex-col w-[30%] bg-[#111111] p-5 gap-10 rounded-[5px] max-h-[98%] h-max overflow-y-scroll">
				{module.lines.map((item, index) => {
					let activeField = null;
					for (let i = 0; i < sourceFieldsToFilter.length; i++) {
						if (sourceFieldsToFilter[i].id === item.activeFieldID) {
							activeField = sourceFieldsToFilter[i];
							break;
						}
					}

					const comparisons = [];
					if (activeField) {
						for (let i = 0; i < conditionalComparisons.length; i++) {
							if (conditionalComparisons[i].type === activeField.type) {
								comparisons.push(conditionalComparisons[i]);
							}
						}
					}
					const selectedComparison = comparisons.find(
						(comparison) => comparison.id === item.comparisonID,
					);

					let defaultIncludeExclude = null;
					if (item.IncludeOrExclude === 'INCLUDE') {
						defaultIncludeExclude = 'INCLUDE';
					}
					else if (item.IncludeOrExclude === 'EXCLUDE') {
						defaultIncludeExclude = 'EXCLUDE';
					}

					return (
						<div key={uuidv4()} className="flex flex-col gap-5">
							<div className="flex justify-between">
								<div className="flex gap-[10px]">
									<Filter className="icon-pink" />
									<div class=" text-white text-base font-bold font-['Inter'] leading-[16px] tracking-normal">
										Filter by
									</div>
								</div>

								<Delete
									onClick={() => {
										deleteFilter(item);
									}}
									className="icon-white w-4 h-4 cursor-pointer"
								/>

							</div>

							<div className="flex flex-col gap-[10px]">
								<div class="text-[#aeaeae] text-xs font-normal font-['Inter'] leading-[14px]">
									Filter on field
								</div>

								<SSelectDropdown
									defaultValue={activeField ? activeField.name : ""}
									onChange={async (e) => {
										await updateLineField(item, e);
									}}>
									{sourceFieldsToFilter.map((field) => (
										<DropdownItem key={uuidv4()} item={field.name} id={field.id} />
									))}

								</SSelectDropdown>
							</div>

							<div className="flex flex-col gap-[10px]">
								<div class="text-[#aeaeae] text-xs font-normal font-['Inter'] leading-[14px]">
									Comparison type
								</div>
								<SSelectDropdown
									defaultValue={selectedComparison ? selectedComparison.name : ""}
									onChange={async (e) => {
										await updateLineComparison(item, e);
									}}>
									{comparisons.map((comparison) => (
										<DropdownItem key={uuidv4()} item={comparison.name} id={comparison.id} />
									))}
								</SSelectDropdown>
							</div>

							<div className="flex flex-col gap-[10px]">
								<div class="text-[#aeaeae] text-xs font-normal font-['Inter'] leading-[14px]">
									Value
								</div>
								<SInput
									type="text"
									placeholder="Search"
									defaultValue={item.value}
									onBlur={(e) => {
										updateFilterValue(item, e.target.value);
									}}
								/>
							</div>

							<SRadioGroup defaultValue={defaultIncludeExclude} onChange={(e) => {
								updateIncludeExclude(item, e);
							}} getValue={(e) => {

							}}>
								<Radio value="INCLUDE">Include</Radio>
								<Radio value="EXCLUDE">Exclude</Radio>
							</SRadioGroup>
						</div>
					)
				})}

				<div
					onClick={() => {
						addLine();
					}}
					onKeyDown={() => {

					}}
					className="flex gap-[10px] px-[10px] items-center cursor-pointer"
				>
					<AddIcon className="icon-grey-5" />
					<div class="text-[#aeaeae] text-xs font-normal font-['Inter'] leading-[14px] tracking-tight">
						Add another filter
					</div>
				</div>


			</div>
			<div className="w-[35%] flex flex-col p-[10px] rounded-[5px] bg-[#080808] h-max max-h-[98%] overflow-y-scroll gap-5">
				<div class="text-white text-xs font-bold font-['Inter'] leading-[11px] tracking-tight">
					Results
				</div>
				{moduleResponseAnswer ? (
					<NestedGrid isListOfDataObjects={true} gridData={moduleResponseAnswer.listOfDataObjects} />
				) : (
					<div className="h-[30vh] flex bg-grey-1 rounded-[5px] items-center justify-center">
						<div class="text-[#aeaeae] text-xs font-normal font-['Inter'] leading-[11px]">
							No parameters selected
						</div>
					</div>
				)}
			</div>
		</div >
	);
}
