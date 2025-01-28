import React from "react";

function ShadowField({ field }) {
	const { name, direction } = field;
	return (
		<div className="px-[20px] py-[10px] flex flex-col gap-1 w-full justify-between border border-grey-1 last:rounded-b first:rounded-t opacity-75">
			<span>{name}</span>
		</div>
	);
}

export default ShadowField;
