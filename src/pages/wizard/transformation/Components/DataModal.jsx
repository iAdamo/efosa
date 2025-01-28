import { useRef, useContext, useState, useEffect } from "react";
import useOutsideClickHandler from "@hooks/useOutsideHandler";
import { WizardContext } from "@contexts/WizardContext";
import { ChevronLeftIcon, SearchCircleIcon } from "@heroicons/react/solid";
import SearchTopBarIcon from "@/Icons/searchtopbaricon";
import { DIRECTION } from "@constants";
import { updateActiveFieldDefaultValueApi } from "@axios/apiCalls";
import { isArray } from "lodash";
import SInput from "@components/SInput";

const DataModal = (props, modal, schema) => {
	const [stateModal, setStateModal] = useState("smallModal");
	const [searchDropdown, setSearchDropDown] = useState();
	const {
		dataModal,
		setDataModal,
		dataModalSearchValue,
		setDataModalSearchValue,
		setDataModalDescription,
		dataModalDescription,
		fetchedData,
		activeFields,
		setActiveFields,
	} = useContext(WizardContext);

	const {
		schemaName,
		exampledata,
		setSelectedExampledataIndex,
		setIsExampledataFresh,
		actualExampledata,
		direction,
		type,
		activeField,
	} = props;

	const [changedDefaultValue, setChangedDefaultValue] = useState(
		activeField?.defaultValue,
	);

	const defaultValueChanger = async (e) => {
		updateDefaultValue(e.target.value);
	};

	const updateDefaultValue = async (newDefaultValue) => {
		const newDefaultValueData = await updateActiveFieldDefaultValueApi(
			activeField.id,
			newDefaultValue,
		);

		const newDefaultValueModel = newDefaultValueData.data;

		const newActiveFieldsArray = [];
		for (let i = 0; i < activeFields.length; i++) {
			if (activeFields[i].id == newDefaultValueModel.id) {
				activeFields[i].defaultValue = newDefaultValueModel.defaultValue;
			}
			newActiveFieldsArray.push(activeFields[i]);
		}

		setActiveFields(newActiveFieldsArray);
	};

	const closeDataModal = useRef(null);
	useOutsideClickHandler(closeDataModal, async () => {
		console.log("Outside click");
		console.log(changedDefaultValue);
		if (type != "boolean") {
			if (changedDefaultValue != activeField.defaultValue) {
				await updateDefaultValue(changedDefaultValue);
			}
		}

		setDataModal(null);
		setDataModalSearchValue(null);
		setDataModalDescription(null);
	});

	const capitalizeFirst = (str) => {
		if (str) {
			return str.charAt(0).toUpperCase() + str.slice(1);
		}
	};

	const changeDescription = (newStr) => {
		modal.schema.description = newStr;
		setDataModal(null);
	};

	const setIndexForExampleData = (index) => {
		setSelectedExampledataIndex(index);
		setIsExampledataFresh(false);
	};

	const getHighlightedText = (text, highlight) => {
		const parts = text?.split(new RegExp(`(${highlight})`, "gi"));
		return (
			<span>
				{parts.map((part, i) => (
					<span
						key={i}
						style={
							part.toLowerCase() === highlight.toLowerCase()
								? { background: "#EBDCF9" }
								: {}
						}
					>
						{part}
					</span>
				))}
			</span>
		);
	};

	const filterForSearchParameters = (array) => {
		if (!array) {
			return null;
		}

		if (!isArray(array)) {
			return null;
		}

		array = array?.filter((value) => value != null);

		if (!dataModalSearchValue) {
			return array;
		}

		const result = array.filter((item) => item.includes(dataModalSearchValue));

		return result;
	};

	if (!dataModal) {
		return null;
	}

	return (
		<div
			ref={closeDataModal}
			onClick={(e) => e.stopPropagation()}
			className={`relative ${
				direction == DIRECTION.SOURCE ? "left-[30px]" : "right-[280px]"
			} z-[10000] textalign-left`}
		>
			{stateModal === "smallModal" && (
				<div className="w-[250px] bg-[#080808] rounded-lg border absolute  px-3 py-3 booleanModal">
					{direction == DIRECTION.DESTINATION && (
						<>
							<div>
								<p className="text-black">Default value</p>
								{(type === "string" ||
									type === "number" ||
									type === "integer") && (
									<>
										<SInput
											sType={type}
											objectType={"FIELD"}
											objectID={activeField.id}
											onChange={(e) => setChangedDefaultValue(e.target.value)}
											onBlur={defaultValueChanger}
											defaultValue={activeField?.defaultValue}
										/>
									</>
								)}

								{type === "boolean" && (
									<>
										<div className="flex h-[23px] my-3 ">
											<button
												className={`w-full h-full rounded-l ${
													activeField.defaultValue == "true" ? "active" : ""
												} `}
												onClick={() => {
													updateDefaultValue("true");
												}}
											>
												True
											</button>
											<button
												className={`w-full h-full rounded-r ${
													activeField.defaultValue == "false" ? "active" : ""
												} `}
												onClick={() => {
													updateDefaultValue("false");
												}}
											>
												False
											</button>

											<button
												className={`w-full h-full rounded-r ${
													activeField.defaultValue == null ? "active" : ""
												} `}
												onClick={() => {
													updateDefaultValue(null);
												}}
											>
												Unset
											</button>
										</div>
									</>
								)}
							</div>
						</>
					)}
					{direction == DIRECTION.SOURCE && (
						<>
							<button className="dataModal_button w-full border-0 h-5">
								Parameter Functions
							</button>
							<button
								className="dataModal_button w-full border-0 h-5"
								onClick={() => {
									setStateModal("bigModal");
								}}
							>
								Example data
							</button>
						</>
					)}
				</div>
			)}

			{stateModal === "bigModal" && (
				<div>
					<div className="w-[291px] bg-[#080808] rounded-lg border absolute py-3 booleanModal">
						<div className="relative text-center px-3">
							<div
								className="absolute w-[14px] h-[14px]"
								onClick={() => {
									setStateModal("smallModal");
								}}
							>
								<ChevronLeftIcon />
							</div>
							<h2>Example Data</h2>
						</div>

						<div className="w-[101px] h-px bg-[#080808] mx-auto mt-[13px] mb-[10px] px-3" />
						<span className="datamodalname">
							{capitalizeFirst(schemaName) + ": "}
						</span>
						<span className="datamodalvalue">{actualExampledata}</span>

						<h4>{capitalizeFirst(dataModalDescription)}</h4>
						<div className="w-full mt-19px relative px-3">
							<div className="absolute w-[15px] h-[15px] mt-[22px] ml-[5px]">
								<SearchTopBarIcon width="15" height="15" color="#D5D5D5" />
							</div>
							<input
								className="searchInputDataModal"
								onFocus={() => setSearchDropDown(true)}
								value={dataModalSearchValue || ""}
								onChange={(e) => {
									setDataModalSearchValue(e.target.value);
								}}
							/>
						</div>
						{searchDropdown && (
							<div className="max-h-[200px] overflow-y-auto overflow-x-hidden">
								<div className="border-b border-[#D4D4D4] w-[291px] h-px mb-[10px]" />
								<ul>
									{filterForSearchParameters(exampledata)?.map(
										(item, index) => {
											return (
												<li
													key={item.id}
													onClick={(e) => {
														e.stopPropagation();
														setIndexForExampleData(index);
													}}
												>
													{item[schemaName]}
												</li>
											);
										},
									)}
								</ul>
							</div>
						)}
					</div>
				</div>
			)}
		</div>
	);
};

export default DataModal;
