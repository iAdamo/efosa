import { WizardContext } from "@contexts/WizardContext";
import NodeIcon from "@/Icons/NodeIcon";
import { DIRECTION } from "@constants";
import useOutsideClickHandler from "@hooks/useOutsideHandler";
import { useContext, useMemo, useRef, useState } from "react";
import SelectNode from "../UI/SelectNode";

const list = [
	{ name: "Name", value: "Test example data" },
	{ name: "Account", value: "Example data" },
	{ name: "Amount", value: "Example data" },
	{ name: "customerNumber", value: "Example data" },
	{ name: "email", value: "Example data" },
];

const NodeComponentContextMenu = () => {
	const [selectValue, setSelectValue] = useState("Show all parameters");

	const { nodeContextMenu, setNodeContextMenu } = useContext(WizardContext);

	const nodeContextMenuRef = useRef(null);

	useOutsideClickHandler(nodeContextMenuRef, () => setNodeContextMenu(null));

	const position = useMemo(() => {
		let top = nodeContextMenu?.event.clientY || 0;
		let left = nodeContextMenu?.event.clientX || 0;

		const screenHeight = window.innerHeight;
		const mainLayout = document.getElementById("mainLayout");

		if (screenHeight - top - 362 < 0) {
			top -= 362;
		}
		if (mainLayout) {
			mainLayout.style.overflowY = !!nodeContextMenu ? "hidden" : "auto";
		}

		if (nodeContextMenu?.direction === DIRECTION.DESTINATION) {
			left -= 243;
		}
		return { top, left };
	}, [nodeContextMenu]);

	if (!nodeContextMenu) {
		return null;
	}

	return (
		<div>
			<div className="absolute top-0 left-0 w-full h-full bg-[#080808] opacity-20 z-40" />
			<div
				ref={nodeContextMenuRef}
				className="fixed w-[243px] h-[362px] customBoxShadow bg-[#080808] rounded-lg z-50 fontFamilyQuicksand"
				style={position}
			>
				<div className="p-4 pb-7">
					<div className="flex items-center gap-2 text-sm font-bold">
						{nodeContextMenu.direction === DIRECTION.DESTINATION ? (
							<NodeIcon firstColor="#fcb16c" width="26" height="26" />
						) : (
							<NodeIcon width="26" height="26" />
						)}
						<h2 className="capitalize">{nodeContextMenu.nodeName}</h2>
					</div>
					<div className="mt-2.5">
						<SelectNode
							value={selectValue}
							onClick={setSelectValue}
							options={list}
						/>
					</div>
					<hr className="mt-3 h-px bg-grey-3" />
					<div className="overflow-auto h-[255px]">
						<div className="mt-4">
							<h3 className="text-sm font-bold mb-1.5">Index 0</h3>
							{list.map((item) => (
								<div
									key={item.name}
									className="fontFamilyIBMPlexMono text-[10px] mb-1"
								>
									<p>
										{item.name} :{" "}
										<span className="font-bold text-[#F1B477]">
											{item.value}
										</span>
									</p>
								</div>
							))}
						</div>
						<div className="mt-4">
							<h3 className="text-sm font-bold mb-1.5">Index 1</h3>
							{list.map((item) => (
								<div
									key={item.name}
									className="fontFamilyIBMPlexMono text-[10px] mb-1"
								>
									<p>
										{item.name} :{" "}
										<span className="font-bold text-[#F1B477]">
											{item.value}
										</span>
									</p>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default NodeComponentContextMenu;
