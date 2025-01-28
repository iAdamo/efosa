import BooleanMeatball from "@pages/wizard/transformation/Components/UI/Meatballs/BooleanMeatball";
import IntegerAndStringMeatball from "@pages/wizard/transformation/Components/UI/Meatballs/IntegerAndStringMeatball";
import { WizardContext } from "@contexts/WizardContext";
import { useContext, useState } from "react";
import {
	addMeatball,
	deleteMeatball,
	updateMeatballPagination,
	updateMeatballPaginationType,
} from "@axios/apiCalls";
import CheckmarkIcon from "@/Icons/updated/CheckmarkIcon";

const propertyTabEnm = {
	pagination: "Pagination",
	otherProperty: "Other property",
};

const NodeToolBarProperties = ({
	node,
	meatballs,
	updateMeatballValueOnBlur,
	meatballValues,
	setMeatballValues,
}) => {
	const [formValue, setFormValue] = useState({});
	const [activeTab, setActiveTab] = useState(propertyTabEnm.pagination);

	const { setActiveNodes, activeNodes, setMeatballs, speccID } =
		useContext(WizardContext);

	const handlerCheckbox = (name, id) => {
		setFormValue((prev) => ({
			[name]: prev[name],
		}));
		const res = {
			name: node?.pagination?.id === id ? null : name,
			id,
			value: formValue[name],
		};
		//countHandler(res);
	};

	const valueOnChange = (id, value) => {
		let isFound = false;
		for (let i = 0; i < meatballValues.length; i++) {
			if (meatballValues[i].id == id) {
				isFound = true;
				break;
			}
		}

		const allMeatballValues = meatballValues;

		if (!isFound) {
			const newObj = {};
			newObj.id = id;
			newObj.value = value;
			allMeatballValues.push(newObj);
		}

		for (let i = 0; i < allMeatballValues.length; i++) {
			if (allMeatballValues[i].id == id) {
				allMeatballValues[i].value = value;
			}
		}

		setMeatballValues(allMeatballValues);
	};

	const handlerChangeInput = (name, value, id) => {
		setFormValue((prev) => ({
			...prev,
			[name]: value,
		}));
		if (node?.pagination?.id === id) {
			//countHandler({ value, name, id });
		}
	};

	const addMeatballOnClick = async (meatball) => {
		const meatballResponse = await addMeatball(
			speccID,
			node.id,
			meatball.name,
			meatball.in,
		);

		const newMeatballs = meatballs;
		let isFound = false;
		for (let i = 0; i < meatballs.length; i++) {
			if (meatballs[i].id == meatballResponse.data[0].id) {
				isFound = true;
				break;
			}
		}

		if (!isFound) {
			newMeatballs.push(meatballResponse.data[0]);
		}

		setMeatballs(newMeatballs);
	};

	const deleteMeatballHandler = async (meatball) => {
		setMeatballs((prev) => prev.filter((item) => item.id !== meatball.id));

		const meatballResponse = await deleteMeatball(meatball.id);
	};

	const updateIsPagination = async (value, meatball) => {
		const meatballResponse = await updateMeatballPagination(meatball.id, value);
		setMeatballs(
			meatballs.map((meatballItem) => {
				if (meatballItem.id == meatball.id) {
					return { ...meatballItem, isPagination: value };
				} else {
					return { ...meatballItem };
				}
			}),
		);
	};

	const updatePaginationType = async (value, meatball) => {
		const meatballResponse = await updateMeatballPaginationType(
			meatball.id,
			value,
		);
		setMeatballs(
			meatballs.map((meatballItem) => {
				if (meatballItem.id == meatball.id) {
					return { ...meatballItem, typeOfPagination: value };
				} else {
					return { ...meatballItem };
				}
			}),
		);
	};

	return (
		<div className="fontFamilyQuicksand">
			<div className="border-b border-[#D5D5D5] mt-4 pb-5 pr-5 text-xs text-medium text-[#808080] pl-6">
				<p className="font-bold text-[13px]">Available parameters</p>
				<br />

				<table>
					{node?.availableMeatballs?.map((available) => {
						let found = false;
						let meatball = null;
						for (let i = 0; i < meatballs.length; i++) {
							if (meatballs[i].name == available.name) {
								found = true;
								meatball = meatballs[i];
							}
						}
						return (
							<tr
								onClick={() => {
									if (found) {
										deleteMeatballHandler(meatball);
									} else {
										addMeatballOnClick(available);
									}
								}}
							>
								<td className="w-[20px]">
									{found && (
										<>
											<CheckmarkIcon display="inline-block" color="#000" />
										</>
									)}
								</td>
								<td>{available.name}</td>
							</tr>
						);
					})}
				</table>
			</div>
			<div className="pl-6">
				{meatballs?.map((meatball) => {
					const meatballType = node?.availableMeatballs?.find(
						(availableMeatball) => {
							if (availableMeatball.name == meatball.name) {
								return true;
							}
						},
					);

					if (meatballType.type === "boolean") {
						return (
							<BooleanMeatball
								meatball={meatball}
								name={meatballType?.name}
								description={meatballType?.description}
								value={meatball.value}
								inputType={meatballType.type}
								updateMeatballValueOnBlur={updateMeatballValueOnBlur}
								deleteMeatballHandler={deleteMeatballHandler}
								valueOnChange={valueOnChange}
							/>
						);
					} else {
						return (
							<IntegerAndStringMeatball
								meatball={meatball}
								name={meatballType?.name}
								description={meatballType?.description}
								value={meatball?.value}
								inputType={meatballType?.type}
								updateMeatballValueOnBlur={updateMeatballValueOnBlur}
								deleteMeatballHandler={deleteMeatballHandler}
								updateIsPagination={updateIsPagination}
								updatePaginationType={updatePaginationType}
								valueOnChange={valueOnChange}
							/>
						);
					}
				})}
			</div>
		</div>
	);
};

export default NodeToolBarProperties;
