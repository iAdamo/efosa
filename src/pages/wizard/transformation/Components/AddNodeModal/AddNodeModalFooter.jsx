import { useContext } from "react";
import { AddNodeModalContext } from "@contexts/AddNodeModalContext";
import SButton from "@/components/SButton";
const AddNodeModalFooter = ({ onSubmit, onCancel, isCustomNode }) => {
	const { apiLevels, selectedAPIs } = useContext(AddNodeModalContext);

	return (
		<div className="modal-footer mt-3 flex gap-4 justify-start px-5">
			<SButton className="cancel-btn" onClick={onCancel}>
				Cancel
			</SButton>

			<SButton
				sType={"build"}
				className={
					selectedAPIs.length > 0 ? "cancel-btn" : "cancel-btn disabled-btn"
				}
				onClick={onSubmit}
			>
				Add node
			</SButton>
		</div>
	);
};

export default AddNodeModalFooter;
