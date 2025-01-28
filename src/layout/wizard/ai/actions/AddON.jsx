import useGlobalStore from "@/store/globalStore";
import React from "react";
import ThumbsUp from "@/assets/icons/thumbs-up.svg?react";
import ThumbsDown from "@/assets/icons/thumbs-down.svg?react";
import Node from "@/assets/icons/node.svg?react";
import SButton from "@/components/SButton";

function AddON() {
	const { addShadowNode, clearShadowNodes } = useGlobalStore((s) => ({
		addShadowNode: s.addShadowNode,
		clearShadowNodes: s.clearShadowNodes,
	}));
	return (
		<div className="border border-grey-1 flex flex-col rounded-[6px] mr-1 group">
			<div className="p-[10px] rounded-base flex flex-col gap-[10px]">
				<span className="text-white text-[12px] font-light italic font-['Inter'] leading-[13px]">
					Adding a multiply operation node etc etc some information long text
					bla... read more
				</span>

				<div
					className="rounded-base flex flex-col overflow-hidden"
					onMouseEnter={() => addShadowNode("Multiply")}
					onMouseLeave={() => clearShadowNodes()}
				>
					<div className="flex p-[10px] justify-start items-center bg-grey-1 bg-secondary-mint-green-10 gap-[5px] border border-transparent hover:border-secondary-mint-green rounded-[6px]">
						<Node className="icon-white" />

						<div class="text-white text-xs font-normal font-['Inter'] leading-[14px] tracking-tight">
							Customer number
						</div>
					</div>
				</div>
			</div>
			<div className="bg-grey-1 p-[10px]  gap-[8px] pl-5 items-end rounded-b-[5px] hidden group-hover:flex">
				<SButton sType={"build"}>Accept</SButton>
				<SButton>Reject</SButton>
			</div>
		</div>
	);
}

export default AddON;
