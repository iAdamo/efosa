import useGlobalStore from "@/store/globalStore";
import { useUpdateNodeInternals } from "@xyflow/react";
import React from "react";
import Operation from "@/assets/icons/operations.svg?react";
import Info from "@/assets/icons/info.svg?react";
import Connect from "@/assets/icons/connect.svg?react";
import Node from "@/assets/icons/node.svg?react";
import ThumbsUp from "@/assets/icons/thumbs-up.svg?react";
import ThumbsDown from "@/assets/icons/thumbs-down.svg?react";
import SButton from "@/components/SButton";
import { useState } from "react";

function AddONWithLinks({ id, inputs, outputs, ON }) {
	const {
		addShadowNode,
		addShadowEdge,
		clearShadow,
		activeFields,
		onConnect,
		addOperationNode,
		setSuggestionAsApproved,
		setSuggestionAsRejected,
	} = useGlobalStore((state) => ({
		addShadowNode: state.addShadowNode,
		addShadowEdge: state.addShadowEdge,
		clearShadow: state.clearShadow,
		activeFields: state.activeFields,
		addOperationNode: state.addOperationNode,
		onConnect: state.onConnect,
		setSuggestionAsApproved: state.setSuggestionAsApproved,
		setSuggestionAsRejected: state.setSuggestionAsRejected,
	}));

	const updateNodeInternals = useUpdateNodeInternals();
	const [loading, setLoading] = useState(false);

	const handleHover = (e) => {
		const nodeId = addShadowNode(
			ON.name,
			inputs.map((fieldId) => activeFields.byId[fieldId].name),
			outputs.map((fieldId) => activeFields.byId[fieldId].name),
		);
		updateNodeInternals(nodeId);
		inputs.forEach((input, index) => {
			addShadowEdge("API1", nodeId, String(input), `${nodeId}-input-${index}`);
		});

		outputs.forEach((output, index) => {
			addShadowEdge(
				nodeId,
				"API2",
				`${nodeId}-output-${index}`,
				String(output),
			);
		});
	};

	const handleAccept = async () => {
		try {
			setLoading(true);
			const nodeId = await addOperationNode(ON.id);
			for (const inputFieldId of inputs) {
				const connection = {
					source: "API1",
					target: nodeId,
					sourceHandle: String(inputFieldId),
					targetHandle: `input-${nodeId}-${inputs.indexOf(inputFieldId)}`,
				};
				await onConnect(connection);
			}
			for (const outputFieldId of outputs) {
				const connection = {
					source: nodeId,
					target: "API2",
					sourceHandle: `output-${nodeId}-${outputs.indexOf(outputFieldId)}`,
					targetHandle: String(outputFieldId),
				};
				await onConnect(connection);
			}
			clearShadow();
			setSuggestionAsApproved(id);
			setLoading(false);
		} catch (err) {
			clearShadow();
			setLoading(false);
		}
	};
	const handleReject = () => {
		setSuggestionAsRejected(id);
		clearShadow();
	};

	return (
		<div
			className="border border-grey-1 flex flex-col rounded-[6px] mr-1 group"
			onMouseEnter={handleHover}
			onMouseLeave={() => clearShadow()}
		>
			<div className="p-[10px] rounded-base flex flex-col gap-[10px]">
				<span className="text-white text-[12px] font-light italic font-['Inter'] leading-[13px] mt-[5px]">
					Adding a multiply operation node etc etc some information long text
					bla... read more
				</span>
				<div className="rounded-base flex flex-col overflow-hidden group">
					<div className="p-[10px] flex group-hover:bg-custom-yellow/50 group-hover:border-transparent  border border-custom-yellow items-center gap-1 rounded-t-[5px] ">
						<Operation />
						<div class="text-white text-xs font-normal font-['Inter'] leading-[14px] tracking-tight">
							{ON.name}
						</div>
					</div>
					{inputs.map((input) => (
						<div className="flex p-[10px] justify-between bg-grey-1 hover:bg-secondary-mint-green-15">
							<div className="gap-2 flex items-center">
								<Info className="icon-white m-1 " />

								<div
									className={`w-[8px] h-[8px] 
					   bg-[#00df9c]
					  rounded mr-[5px]`}
								/>
								<div class="text-[#d32dca] text-xs font-normal font-['Inter'] leading-[14px] tracking-tight">
									{activeFields.byId[input].name}
								</div>
							</div>
							<div className="gap-[10px] flex items-center">
								<Node className="icon-pink" />
								<Connect className="icon-grey-5" />
							</div>
						</div>
					))}
					{outputs.map((output) => (
						<div className="flex p-[10px] justify-between bg-grey-1 hover:bg-secondary-mint-green-15">
							<div className="gap-2 flex items-center">
								<Info className="icon-white m-1 " />

								<div
									className={`w-[8px] h-[8px] 
					   bg-[#00df9c]
					  rounded mr-[5px]`}
								/>
								<div class="text-[#d32dca] text-xs font-normal font-['Inter'] leading-[14px] tracking-tight">
									{activeFields.byId[output].name}
								</div>
							</div>
							<div className="gap-[10px] flex items-center">
								<Node className="icon-pink" />
								<Connect className="icon-grey-5" />
							</div>
						</div>
					))}
				</div>
			</div>
			<div className="bg-grey-1 p-[10px] gap-[8px] pl-5 items-end rounded-b-[5px] mt-[10px] hidden group-hover:flex">
				<SButton sType={"build"} onClick={handleAccept}>
					Accept
				</SButton>
				<SButton loading={loading} onClick={handleReject}>
					Reject
				</SButton>
			</div>
		</div>
	);
}

export default AddONWithLinks;
