import React from "react";
import Info from "@/assets/icons/info.svg?react";
import Connect from "@/assets/icons/connect.svg?react";
import Node from "@/assets/icons/node.svg?react";
import ThumbsUp from "@/assets/icons/thumbs-up.svg?react";
import ThumbsDown from "@/assets/icons/thumbs-down.svg?react";
import useGlobalStore from "@/store/globalStore";
import SButton from "@/components/SButton";
import { useState } from "react";
import { WIZARD_COMPONENT_TYPE } from "@/constants";

function AddActiveNode({ node, id }) {
	const {
		parentNode,
		addShadowActiveNode,
		clearShadowActiveNode,
		getNodeDirection,
		setSuggestionAsApproved,
		setSuggestionAsRejected,
		addActiveNode,
	} = useGlobalStore((state) => ({
		parentNode: state.activeNodes.byId[node.ownerNode],
		addShadowActiveNode: state.addShadowActiveNode,
		clearShadowActiveNode: state.clearShadowActiveNode,
		getNodeDirection: state.getNodeDirection,
		setSuggestionAsApproved: state.setSuggestionAsApproved,
		setSuggestionAsRejected: state.setSuggestionAsRejected,
		addActiveNode: state.addActiveNode,
	}));
	const [loading, setLoading] = useState(false);
	const handleHover = () => {
		const direction = getNodeDirection(parentNode.APIID);
		addShadowActiveNode({
			parentNode: node.ownerNode,
			name: node.name,
			direction: direction,
		});
	};
	const clearShadow = () => {
		clearShadowActiveNode();
	};
	const handleAccept = async () => {
		const model = {
			APIID: parentNode.APIID,
			endpoint: null,
			isMatching: false,
			name: node.name,
			pairingID: null,
			parentNode: parentNode.id,
			speccID: parentNode.speccID,
			speccpageid: null,
			type: WIZARD_COMPONENT_TYPE.RUN,
		};
		setLoading(true);
		await addActiveNode(model);
		clearShadowActiveNode();
		setSuggestionAsApproved(id);
		setLoading(false);
	};
	const handleReject = () => {
		setSuggestionAsRejected(id);
		clearShadowActiveNode();
	};
	return (
		<div
			className="border border-grey-1 flex flex-col rounded-[6px] mr-1 group"
			onMouseEnter={handleHover}
			onMouseLeave={() => clearShadow()}
		>
			<div className="p-[10px] rounded-base flex flex-col gap-[10px]">
				<span className="text-white text-[12px] font-light italic font-['Inter'] leading-[13px] mt-[5px]">
					Linking two paramters together etc etc some information long text
					bla... read more
				</span>
				<div className="rounded-base flex flex-col overflow-hidden group">
					<div className="p-[10px] flex group-hover:bg-main-peach-4 group-hover:border-transparent  border border-main-peach-1 items-center gap-1 rounded-base ">
						<Node className="icon-white group-hover:icon-peach" />
						<div class="text-white text-xs font-normal font-['Inter'] leading-[14px] tracking-tight">
							{node.name}
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

export default AddActiveNode;
