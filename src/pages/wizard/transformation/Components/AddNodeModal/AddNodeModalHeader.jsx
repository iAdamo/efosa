import SButton from "@/components/SButton";
import SInput from "@/components/SInput";
import React from "react";
import close from "@assets/icons/cross.svg";
import caretRight from "@assets/icons/caret-right.svg";
import caretLeft from "@assets/icons/caret-left.svg";

const AddNodeModalHeader = ({ onCancel, directionInfo }) => {
	return (
		<div className="modal-header flex flex-col gap-4">
			<div className="flex justify-between heading-wrapper">
				<div className="flex items-center">
					<span className="addNodeHeading">Add Parent Node &nbsp;</span>
					<span
						className={`addNodeAPI ${directionInfo.bgStyle} text-secondary-white py-[3px] px-[5px] ${directionInfo.textStyle}`}
					>
						{directionInfo.endpoint}
					</span>
				</div>
				<img
					onClick={() => onCancel()}
					onKeyDown={() => onCancel()}
					src={close}
					alt={close}
					className="h-3 w-3 icon-grey-5 cursor-pointer"
				/>
			</div>
		</div>
	);
};

export default AddNodeModalHeader;
