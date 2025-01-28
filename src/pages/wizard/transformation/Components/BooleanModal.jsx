import { WizardContext } from "@contexts/WizardContext";
import useOutsideClickHandler from "@hooks/useOutsideHandler";
import { useContext, useEffect, useRef, useState } from "react";

const BooleanModal = ({ schema, modal, onClose }) => {
	const { schemasDescriptions, setSchemasDescriptions } =
		useContext(WizardContext);
	const [booleanState, setBooleanState] = useState();
	const [inputValue, setInputValue] = useState();

	useEffect(() => {
		const newDescriptions = schemasDescriptions.map((item) => ({
			...item,
		}));
		const currentItem = newDescriptions.find(
			(item) => item.schemaId === schema.id,
		);
		if (currentItem) {
			setBooleanState(currentItem?.value);
			setInputValue(currentItem.descriptions);
		}
	}, [schema]);

	useEffect(() => {
		const newDescriptions = schemasDescriptions.map((item) => ({
			...item,
		}));
		let currentItem = newDescriptions.find(
			(item) => item.schemaId === schema.id,
		);

		if (!currentItem) {
			currentItem = {
				schemaId: schema.id,
				value: false,
				descriptions: "",
			};
			newDescriptions.push(currentItem);
		}

		currentItem.value = booleanState;
		currentItem.descriptions = inputValue;

		setSchemasDescriptions(newDescriptions);
	}, [inputValue, booleanState]);

	const closeModal = useRef(null);
	useOutsideClickHandler(closeModal, () => {
		onClose(null);
	});
	if (!modal) return null;
	return (
		<div
			ref={closeModal}
			onClick={(e) => e.stopPropagation()}
			className="w-[155px] h-[149px] bg-[#080808] rounded-lg border absolute z-20 px-3 py-3 booleanModal"
			style={{
				transform: "translateY(-19px) translateX(-182px)",
			}}
		>
			<h2 className="whitespace-nowrap fs-14">Parameter Functions</h2>
			<hr />
			<div className="flex h-[23px] my-3 ">
				<button
					className={`w-full h-full rounded-l ${booleanState ? "active" : ""} `}
					onClick={() => {
						setBooleanState("True");
					}}
				>
					True
				</button>
				<button
					className={`w-full h-full rounded-r ${
						!booleanState ? "active" : ""
					} `}
					onClick={() => {
						setBooleanState(false);
					}}
				>
					False
				</button>
			</div>
			<p className="fs-12">Fixed value:</p>
			<input
				className="w-full"
				onChange={(e) => {
					setInputValue(e.target.value);
				}}
				value={inputValue}
			/>
		</div>
	);
};

export default BooleanModal;
