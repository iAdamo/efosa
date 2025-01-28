import React from "react";

const SetupCard = ({ active, onClick, title, text }) => (
	<div
		className={`h-[250px] flex-grow mx-4 p-2 flex flex-col border-[1px] rounded-[10px] justify-between cursor-pointer ${
			active ? "border-[#55689B]" : "border-[#D9D9D9]"
		}`}
		onClick={onClick}
	>
		<div className="flex pt-4 px-8 items-center">
			<div
				className={`my-2 text-center pl-4 ${active ? "text-[#4C41CA]" : "text-[#D9D9D9]"}`}
			>
				{title}
			</div>
		</div>
		<div className="mt-2 text-[#808080] flex-grow text-center text-[12px]">
			Parameter from “API left side” will be matched with Parameter from “API
			right side”
		</div>
		<div className="flex justify-center items-center my-4">
			<span className={active && "text-yellow"}>o</span>
		</div>
	</div>
);

export default SetupCard;
