import useGlobalStore from "@/store/globalStore";
import React from "react";
import Info from "@/assets/icons/info.svg?react";
import Connect from "@/assets/icons/connect.svg?react";
import Node from "@/assets/icons/node.svg?react";
import ThumbsUp from "@/assets/icons/thumbs-up.svg?react";
import ThumbsDown from "@/assets/icons/thumbs-down.svg?react";
import SButton from "@/components/SButton";
import { useState } from "react";

function LinkParams({ sourceHandle, targetHandle, id }) {
	const {
		addShadowEdge,
		clearShadow,
		setSuggestionAsApproved,
		setSuggestionAsRejected,
		onConnect,
	} = useGlobalStore((state) => ({
		addShadowEdge: state.addShadowEdge,
		clearShadow: state.clearShadow,
		setSuggestionAsApproved: state.setSuggestionAsApproved,
		setSuggestionAsRejected: state.setSuggestionAsRejected,
		onConnect: state.onConnect,
	}));
	const [loading, setLoading] = useState(false);
	const handleHover = (e) => {
		addShadowEdge(
			"API1",
			"API2",
			String(sourceHandle.id),
			String(targetHandle.id),
		);
	};
	const handleAccept = async () => {
		const connection = {
			source: "API1",
			target: "API2",
			sourceHandle: String(sourceHandle.id),
			targetHandle: String(targetHandle.id),
		};
		setLoading(true);
		clearShadow();
		await onConnect(connection);
		setSuggestionAsApproved(id);
		setLoading(false);
	};
	const handleReject = () => {
		setSuggestionAsRejected(id);
		clearShadow();
	};
	return (
		<div
			className="border border-grey-1 flex flex-col rounded-[6px] mr-1 group"
			onMouseEnter={handleHover}
			onMouseLeave={clearShadow}
		>
			<div className="p-[10px] rounded-base flex flex-col gap-[10px]">
				<span className="text-white text-[12px] font-light italic font-['Inter'] leading-[13px] mt-[5px]">
					Linking two paramters together etc etc some information long text
					bla... read more
				</span>
				<div className="rounded-base flex flex-col overflow-hidden group">
					<div className="p-[10px] flex group-hover:bg-main-peach-4 group-hover:border-transparent  border border-main-peach-1 items-center gap-1 rounded-t-[5px] ">
						<Connect className="icon-white group-hover:icon-peach" />
						<div class="text-white text-xs font-normal font-['Inter'] leading-[14px] tracking-tight">
							Linking two parameters
						</div>
					</div>
					<div className="flex p-[10px] justify-between bg-grey-1 hover:bg-secondary-mint-green-15">
						<div className="gap-2 flex items-center">
							<Info className="icon-white m-1 " />

							<div
								className={`w-[8px] h-[8px] 
                   bg-[#EE6B7E]
                  rounded mr-[5px]`}
							/>
							<div class="text-[#d32dca] text-xs font-normal font-['Inter'] leading-[14px] tracking-tight">
								{sourceHandle.name}
							</div>
						</div>
						<div className="gap-[10px] flex items-center">
							<Connect className="icon-grey-5" />
						</div>
					</div>
					<div className="flex p-[10px] justify-between bg-grey-1 hover:bg-secondary-mint-green-15">
						<div className="gap-2 flex items-center">
							<Info className="icon-white m-1 " />

							<div
								className={`w-[8px] h-[8px] 
                   bg-[#00df9c]
                  rounded mr-[5px]`}
							/>
							<div class="text-secondary-mint-green text-xs font-normal font-['Inter'] leading-[14px] tracking-tight">
								{targetHandle.name}
							</div>
						</div>
						<div className="gap-[10px] flex items-center">
							<Connect className="icon-grey-5" />
						</div>
					</div>
					{/* <span className="p-[10px] flex bg-custom-mintgreen/15">
            Customer number
          </span>
          <span className="p-[10px] flex bg-custom-mintgreen/15">Output</span> */}
				</div>
			</div>
			<div className="bg-grey-1 p-[10px] gap-[8px] pl-5 items-end rounded-b-[5px] mt-[10px] hidden group-hover:flex">
				<SButton loading={loading} sType={"build"} onClick={handleAccept}>
					Accept
				</SButton>
				<SButton loading={loading} onClick={handleReject}>
					Reject
				</SButton>
			</div>
		</div>
	);
}

export default LinkParams;
