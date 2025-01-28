import { colors, DIRECTION } from "@/constants";
import NodeIcon from "@/Icons/NodeIcon";
import React from "react";

function ShadowNode({ node }) {
	const { name, direction } = node;
	return (
		<div className="px-[10px] py-[20px] bg-[#080808] rounded-base flex gap-[20px] w-[300px] opacity-75">
			<NodeIcon
				firstColor={
					direction === DIRECTION.SOURCE
						? colors.secondary.cerise
						: colors.secondary["mint-green"]
				}
				width="10"
				height="10"
			/>
			<span
				className={`${direction === DIRECTION.SOURCE ? "text-secondary-cerise" : "text-secondary-mint-green"} font-bold capitalize`}
			>
				{name}
			</span>
		</div>
	);
}

export default ShadowNode;
