import React from "react";

export default function SEnvironmentStatus({ text }) {
	const style = {
		width: "max-content",
	};
	return (
		<div className={`flex border border-[#F6C519] rounded-[3px]`} style={style}>
			<span className="text-base-xs font-semibold px-[5px] py-[3px] text-[#F6C519] text-xs leading-3 ">
				{text}
			</span>
		</div>
	);
}
