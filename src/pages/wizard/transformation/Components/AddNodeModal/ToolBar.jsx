import { useContext, useRef } from "react";
import NodeIcon from "@/Icons/NodeIcon";
import RightLinkIcon from "@/Icons/RightLinkIcon";
import { WizardContext } from "@contexts/WizardContext";
import { deleteLinkAPI } from "@axios/apiCalls";
import useOutsideClickHandler from "@hooks/useOutsideHandler";
import DeleteIcon from "@/Icons/DeleteIcon";
import SButton from "@/components/SButton";

const ToolBar = () => {
	const {
		selectedLink,
		setSelectedLink,
		links,
		setLinks,
		setShouldUpdateOperationNodes,
	} = useContext(WizardContext);

	const deleteLink = async () => {
		await deleteLinkAPI(selectedLink.id);
		setLinks((prev) => prev.filter((el) => el.id !== selectedLink.id));
		setSelectedLink(null);

		setShouldUpdateOperationNodes(true);
	};
	const blockRef = useRef(null);
	useOutsideClickHandler(blockRef, () => {
		setSelectedLink(null);
	});

	if (!selectedLink) return null;
	return (
		<div
			ref={blockRef}
			style={{
				position: "fixed",
				top: selectedLink.positionY + 60 + "px",
				left: selectedLink.positionX - 161 + "px",
			}}
			className="bg-[#080808] flex-col gap-2 rounded p-4 z-node-overlay"
		>
			<div className="flex gap-2 items-center pb-2">
				<div className="flex flex-col">
					<div className="mb-3 flex items-center gap-2">
						<NodeIcon />
						<span className="capitalize">
							{selectedLink.sourceFieldNodeName || "sourceEndpoints"}
						</span>
					</div>
					<p className="mb-1 capitalize">
						{selectedLink.sourceFieldName || "Customernumber"}
					</p>
					<button className="text-[#8DB9B5] flex">Example data</button>
				</div>
				<div className="h-full">
					<RightLinkIcon />
				</div>
				<div className="flex flex-col">
					<div className="mb-3 flex items-center gap-2">
						<NodeIcon firstColor="#FCB16C" />
						<span className="capitalize">
							{selectedLink.destinationFieldNodeName || "destinationEndpoints"}
						</span>
					</div>
					<p className="mb-1 capitalize">
						{selectedLink.destinationFieldName || "Membershipnumber"}
					</p>
					<button className="text-[#FFA756] flex">Example data</button>
				</div>
			</div>

			<div className="flex justify-end mt-2">
				<SButton
					onClick={() => {
						deleteLink();
					}}
					className={"flex gap-2"}
				>
					Delete
					<DeleteIcon />
				</SButton>
			</div>
		</div>
	);
};

export default ToolBar;
