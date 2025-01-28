import React from "react";

const statusEnum = {
	LIVE: "LIVE",
	PAUSED: "PAUSED",
	DRAFT: "DRAFT",
	STOPPED: "STOPPED",
};

export default function SSpeccStatus({ text }) {
	const style = {
		width: "max-content",
	};
	const statusColor = getStatusColor(text);
	return (
		<div className={` flex border  rounded-[3px] ${statusColor}`} style={style}>
			<span
				className={`text-base-xs font-semibold px-[5px] py-[3px]  text-xs leading-3 `}
			>
				{text}
			</span>
		</div>
	);
}
const getStatusColor = (status) => {
	switch (status) {
		case statusEnum.LIVE:
			return "border-[#00DF9C] text-[#00DF9C]";
		case statusEnum.PAUSED:
			return "border-[#FF9A33] text-[#FF9A33]";
		case statusEnum.DRAFT:
			return "border-[#EA35FA] text-[#EA35FA]";
		case statusEnum.STOPPED:
			return "border-[#FF3737] text-[#FF3737]";
		default:
			return "border-[#FF9A33] text-[#FF9A33]";
	}
};
