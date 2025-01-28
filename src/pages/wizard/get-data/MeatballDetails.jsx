import { postGenericCRUDWithID } from "@/axios/apiCalls";
import SSelectDropdown, { DropdownItem } from "@/components/SSelectDropdown";
import TextLoaders from "@components/loaders/TextLoaders";
import SAccordion from "@components/SAccordion";
import SBadge from "@components/SBadge";
import SForm from "@components/SForm";
import SInput from "@components/SInput";
import { WizardContext } from "@contexts/WizardContext";
import { useDebounce } from "@hooks/useDebounce";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import VariableSelector from "./VariableSelector";

function MeatballDetails({
	id,
	defaultValue,
	description,
	exampleValue,
	isRequired,
	name,
	type,
	value,
	removeMeatballFromSelected,
	editMeatballSelected,
	loading,
	setMeatballs,
	isHoverable,
	isTest,
	isPagination,
	typeOfPagination,
}) {
	const {
		register,
		watch,
		formState: { errors, isValid },
		handleSubmit,
		setValue,
	} = useForm();

	const { speccID } = useContext(WizardContext);

	const [formState, setFormState] = useState(null);
	const debouncedFormState = useDebounce(formState, 1000);

	const updateMeatballValue = async (id, key, value) => {
		const updatedMeatballValue = postGenericCRUDWithID("Meatballs", id, {
			[key]: value,
		});
		setMeatballs((prev) => {
			return prev.map((mb) => {
				if (mb.id === id) {
					return { ...mb, value };
				}
				return mb;
			});
		});
	};

	useEffect(() => {
		const subscription = watch(handleSubmit(createClickFunction));
		return () => subscription.unsubscribe();
	}, [handleSubmit, watch]);

	useEffect(() => {
		setValue("value", value);
	}, [value]);

	useEffect(() => {
		debouncedFormState &&
			value !== debouncedFormState.value &&
			editMeatballSelected(name, debouncedFormState);
	}, [debouncedFormState]);

	const createClickFunction = async (data) => {
		// editMeatballSelected(name, data);
		setFormState(data);
	};

	const renderErrors = (errors) => {
		switch (errors?.type) {
			case "required":
				return (
					<label className="s-error">
						<span className="capitalize">{name}</span> is required
					</label>
				);
			default:
				return <label className="s-label">*Required</label>;
		}
	};

	const renderDiv = () => (
		<SAccordion
			content={
				<div className="flex flex-col gap-[10px]">
					{description && (
						<span className="label">{description}</span>
					)}
					<SForm className="flex flex-col gap-[5px]">

						{!isPagination && <>
							<span className="label">Values</span>
							<span className="s-label">{name}</span>
							<VariableSelector
								objectType={"MEATBALL"}
								objectID={id}
								sType={type}
								{...register("value", {})}
								aria-invalid={errors.value ? "true" : "false"}
								InputComponent={SInput}
								onBlur={(e) => {
									updateMeatballValue(id, "value", e.target.value);
								}}
								defaultValue={value}
							/></>}
						{isPagination && (<>
							<span>Pagination Type</span>
							<SSelectDropdown defaultValue={typeOfPagination} onChange={(value) => { updateMeatballValue(id, "typeOfPagination", value); }}>
								<DropdownItem item="PAGE" />
								<DropdownItem item="OFFSET" />
								<DropdownItem item="LASTID" />
							</SSelectDropdown></>)}
						{/* {renderErrors(errors.value)} */}
					</SForm>
				</div>
			}
			title={
				<div className="flex flex-col gap-[10px]">
					<span className="label capitalize">{name}</span>
					{type && <SBadge label={type} />}
					{isRequired && <SBadge label={"Required"} />}
				</div>
			}
			utils={
				<button
					onClick={() => {
						removeMeatballFromSelected(name);
					}}
					className={`label ${isTest ? "label-mint-green" : "label-pink"} `}
				>
					Remove
				</button>
			}
			accordionClassname={`p-[10px] overflow-hidden rounded-[5px] ${isTest ? "border-custom-destinationBgColor" : "border-custom-sourceBgColor"} border-[1px]`}
			open={true}
			isHoverable={isHoverable}
			isTest={isTest}
		/>
	);

	const loadingDiv = () => (
		<div className="meatball">
			<TextLoaders count={1} />
			<TextLoaders count={1} />
			<TextLoaders count={1} />
			<TextLoaders count={1} />
		</div>
	);

	return loading ? loadingDiv() : renderDiv();
}

export default MeatballDetails;
