import { WizardContext } from "@contexts/WizardContext";
import { updateConditionRow } from "@axios/apiCalls";
import { useMemo, useState, useContext } from "react";
import { SelectItem, WizardSelect } from "../../../WizardSelect";
import WizardInput from "../../../WizardInput";
import useGlobalStore from "@/store/globalStore";
import { Button } from "react-aria-components";

const selector = (state) => ({
	conditionRowChangeFieldType: state.conditionRowChangeFieldType,
	conditionRowChangeLinkValue: state.conditionRowChangeLinkValue,
	conditionRowChangeComparison: state.conditionRowChangeComparison,
	conditionRowChangeConstantValue: state.conditionRowChangeConstantValue,
	conditionRowUpdateThenValue: state.conditionRowUpdateThenValue,
});

const ConditionRow = ({
	conditionRow,
	links,
	comparisons,
	isSwitch,
	deleteConditionRowClick,
	numberOfConditionRows,
	nodeType,
}) => {
	const {
		conditionRowChangeFieldType,
		conditionRowChangeComparison,
		conditionRowChangeLinkValue,
		conditionRowChangeConstantValue,
		conditionRowUpdateThenValue,
	} = useGlobalStore(selector);

	const changeConstantValue = async (e, field) => {
		conditionRowChangeConstantValue(
			conditionRow.ONID,
			conditionRow.id,
			field,
			e.target.value,
		);
	};

	const changeLinkValue = async (val, field) => {
		conditionRowChangeLinkValue(conditionRow.ONID, conditionRow.id, val, field);
	};

	const updateThenValue = async (e) => {
		conditionRowUpdateThenValue(
			conditionRow.ONID,
			conditionRow.id,
			e.target.value,
		);
	};

	const updateComparison = async (val) => {
		conditionRowChangeComparison(conditionRow.ONID, conditionRow.id, val);
	};

	const updateFieldOrValue = async (isFirst, isField) => {
		conditionRowChangeFieldType(
			conditionRow.ONID,
			conditionRow.id,
			isFirst,
			isField,
		);
	};

	return (
		<div className="flex flex-col">
			{isSwitch && numberOfConditionRows > 1 && (
				<div className="px-[20px] py-[10px] flex justify-end gap-[2px] w-full border border-grey-1 last:rounded-b first:rounded-t bg-secondary-yellow/10">
					<Button onClick={() => deleteConditionRowClick(conditionRow.id)}>
						-
					</Button>
				</div>
			)}
			<div className="flex w-full h-max">
				{!isSwitch && (
					<WizardSelect
						label={"First type Is Field"}
						onSelectionChange={(selected) =>
							updateFieldOrValue(true, selected === "FIELD")
						}
						defaultSelectedKey={conditionRow.firstType}
					>
						<SelectItem id="FIELD">Field</SelectItem>
						<SelectItem id="VALUE">Value</SelectItem>
					</WizardSelect>
				)}
				{nodeType?.toLowerCase() !== "boolean" && (
					<>
						<WizardSelect
							label={"Second Type Is Field"}
							onSelectionChange={(selected) =>
								updateFieldOrValue(false, selected === "FIELD")
							}
							defaultSelectedKey={conditionRow.secondType}
						>
							<SelectItem id="FIELD">Field</SelectItem>
							<SelectItem id="VALUE">Value</SelectItem>
						</WizardSelect>
					</>
				)}
			</div>
			{!isSwitch && (
				<>
					{conditionRow.firstType === "FIELD" && (
						<WizardSelect
							label={"Link"}
							onSelectionChange={(selected) => {
								changeLinkValue(selected, "firstLinkID");
							}}
							defaultSelectedKey={String(conditionRow.firstLinkID)}
						>
							{links.map((link, index) => {
								return (
									<SelectItem key={`link-${link.id}`} id={link.id}>
										Input {index + 1}
									</SelectItem>
								);
							})}
						</WizardSelect>
					)}

					{conditionRow.firstType === "VALUE" && (
						<WizardInput
							placeholder={"value"}
							onBlur={(e) => changeConstantValue(e, "firstValue")}
							defaultValue={conditionRow.firstValue}
						/>
					)}
				</>
			)}

			{isSwitch && (
				<span className="px-[20px] py-[10px] flex flex-col gap-[2px] w-full justify-between border border-grey-1 last:rounded-b first:rounded-t">
					If Input 1
				</span>
			)}
			<div className="flex-grow text-center">
				<WizardSelect
					label={"Condition"}
					onSelectionChange={(selected) => {
						updateComparison(selected);
					}}
					defaultSelectedKey={conditionRow.comparisonId}
				>
					{comparisons.map((comparison) => {
						return (
							<SelectItem
								key={`comparison-${comparison.id}`}
								id={comparison.id}
							>
								{comparison.displayname}
							</SelectItem>
						);
					})}
				</WizardSelect>
			</div>
			{nodeType?.toLowerCase() !== "boolean" && (
				<>
					{conditionRow.secondType === "FIELD" && (
						<WizardSelect
							label={"Link"}
							onSelectionChange={(selected) => {
								changeLinkValue(selected, "secondLinkID");
							}}
							defaultSelectedKey={String(conditionRow.secondLinkID)}
						>
							{links.map((link, index) => {
								return (
									<SelectItem key={`link-${link.id}`} id={link.id}>
										Input {index + 1}
									</SelectItem>
								);
							})}
						</WizardSelect>
					)}

					{conditionRow.secondType === "VALUE" && (
						<WizardInput
							placeholder={"value"}
							onBlur={(e) => changeConstantValue(e, "secondValue")}
							defaultValue={conditionRow.secondValue}
						/>
					)}
				</>
			)}
			{isSwitch && (
				<WizardInput
					placeholder={"Return Value"}
					defaultValue={conditionRow.thenValue}
					onBlur={updateThenValue}
				/>
			)}
		</div>
	);
};

export default ConditionRow;
