import React from "react";
import SSpeccStatus from "@components/SSpeccStatus";

export default function StatusContainer({ status, text }) {
	const statusTextColor = getStatusTextColor(status, text);
	return (
		<div className="statusWrapper">
			<div className="statusContent">
				<span className="statusText">Status</span>
				<SSpeccStatus text={status} />
			</div>
			<div className={`${statusTextColor} itemValue `}>{text}</div>
		</div>
	);
}

const getStatusTextColor = (status, text) => {
	if (text === 0) {
		return "text-[#8C8C8C]";
	}
	switch (status) {
		case statusEnum.LIVE:
			return "text-[#00DF9C]";
		case statusEnum.PAUSED:
			return "text-[#FF9A33]";
		case statusEnum.DRAFT:
			return "text-[#EA35FA]";
		case statusEnum.STOPPED:
			return "text-[#FF3737]";
		default:
			return "text-[#8C8C8C]";
	}
};

const statusEnum = {
	LIVE: "LIVE",
	PAUSED: "PAUSED",
	DRAFT: "DRAFT",
	STOPPED: "STOPPED",
};
