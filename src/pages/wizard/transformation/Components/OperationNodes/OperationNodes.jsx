import React, { useCallback, useState, useContext } from "react";
import SpecStoreIcon from "@/Icons/SpecStoreIcon";
import { PagesContext } from "@contexts/PagesContext";
import { WizardContext } from "@contexts/WizardContext";
import { addOperationNodeApi } from "@axios/apiCalls";
import { MatchContext } from "@contexts/MatchContext";
import { RunnerContext } from "@contexts/RunnerContext";
import CheckmarkIcon from "@/Icons/updated/CheckmarkIcon";
import SButton from "@/components/SButton";
import useGlobalStore from "@/store/globalStore";
import { useShallow } from "zustand/react/shallow";
import { useStoreApi } from "@xyflow/react";

const tabsListEnum = {
	All: 0,
	Transform: 1,
	Conditional: 2,
	Reference: 3,
};
const tabs = ["All", "Transform", "Conditional", "Reference"];

const OperationNodes = () => {
	const store = useStoreApi();
	const { addOperationNode } = useGlobalStore(
		useShallow((state) => ({ addOperationNode: state.addOperationNode })),
	);
	const [currentTab, setCurrentTab] = useState(tabsListEnum.All);
	const [currentNode, setCurrentNode] = useState(null);

	const { speccID } = useContext(PagesContext);
	const { setOperationNodes, operationNodesConfig } = useContext(WizardContext);

	const [nodes, setNodes] = useState(operationNodesConfig);

	const tabClickHandler = (tab) => {
		setCurrentTab(tab);
	};

	const { setShowDataInspector } = useContext(WizardContext);

	const { isMatchMode } = useContext(MatchContext);
	const { selectedPairing } = useContext(RunnerContext);

	const searchHandler = useCallback(
		(e) => {
			const text = e.target.value.toLocaleLowerCase().trim();
			if (!text) {
				setNodes(mockedData);
				return;
			}

			const filtered =
				nodes?.filter((el) =>
					el.name.toLocaleLowerCase().trim().includes(text),
				) || [];
			setNodes(filtered);
		},
		[nodes],
	);

	const splittedNodes = () => {
		switch (currentTab) {
			case tabsListEnum.All:
				return nodes;
			case tabsListEnum.Transform:
				return nodes?.filter((el) => el.package === "TypeTransformation") || [];
			case tabsListEnum.Conditional:
				return nodes?.filter((el) => el.package === "Conditional") || [];
			case tabsListEnum.Reference:
				return nodes?.filter((el) => el.package === "NodeAsON") || [];
			default:
				return nodes;
		}
	};

	const nodeHandler = (node) => {
		setCurrentNode(node);
	};

	const addNodeHandler = useCallback(async () => {
		const NODE_WIDTH = 116;
		const NODE_HEIGHT = 28;
		const {
			height,
			width,
			transform: [transformX, transformY, zoomLevel],
		} = store.getState();
		const zoomMultiplier = 1 / zoomLevel;
		const centerX = -transformX * zoomMultiplier + (width * zoomMultiplier) / 2;
		const centerY =
			-transformY * zoomMultiplier + (height * zoomMultiplier) / 2;
		const nodeWidthOffset = NODE_WIDTH / 2;
		const nodeHeightOffset = NODE_HEIGHT / 2;

		const position = {
			x: centerX - nodeWidthOffset,
			y: centerY - nodeHeightOffset,
		};

		addOperationNode(speccID, currentNode.id, position);
	}, [speccID, currentNode, addOperationNode]);

	return (
		<div className="">
			<div className="pl-3 pr-3">
				<div className="flex flex-row justify-between">
					<div width="100%" className="mb-3 flex flex-col gap-2">
						<SButton
							sType={"build"}
							className={"cursor-pointer"}
							onClick={() => {
								setShowDataInspector(true);
							}}
						>
							<div class="text-white text-xs font-semibold font-['Inter'] leading-[14px] tracking-tight">
								Open Data Inspector
							</div>
						</SButton>
						{tabs.map((tab, index) => {
							return (
								<SButton
									className={"w-min"}
									key={`operation-${index}`}
									onClick={() => {
										if (currentTab != tabsListEnum[tab]) {
											tabClickHandler(tabsListEnum[tab]);
											nodeHandler(null);
										}
									}}
								>
									{currentTab === index && (
										<span className="w-[30px] text-center">
											<CheckmarkIcon color="#000000" />
										</span>
									)}
									<span>{tab}</span>
								</SButton>
							);
						})}
					</div>
				</div>

				<div className="flex flex-col border-[1.5px] border-[#D4D4D4] border-solid py-1 justify-stretch">
					{/* TO-DO: Get rid-off when endpoint will be ready */}
					<div className="flex-grow">
						<table className="w-[100%] h-[200px]">
							<tr
								className={`flex pl-7 font-light text-[12px] font-semibold decoration-black font-worksans`}
							>
								<td>
									{currentTab === tabsListEnum.All && <>All</>}
									{currentTab === tabsListEnum.Transform && <>Transform</>}
									{currentTab === tabsListEnum.Conditional && <>Conditional</>}
									{currentTab === tabsListEnum.Reference && <>Reference</>}
								</td>
							</tr>
							{splittedNodes().map((el) => {
								return (
									<tr
										key={el.name}
										onClick={() => {
											nodeHandler(el);
										}}
										className={`flex pl-7 font-light text-[12px] font-worksans ${
											currentNode?.name === el.name
												? "text-[#000] bg-[#ebdcf9] hover:bg-[#ebdcf9]"
												: "hover:bg-grey-3"
										}`}
									>
										<td>{el.name}</td>
									</tr>
								);
							})}
						</table>

						<div className="flex justify-center mb-1 px-1">
							{currentNode && (
								<button
									className={`px-16 py-1 rounded-md text-[12px] font-worksans ${
										currentNode
											? "text-[#fff] bg-[#4C41CA]"
											: "bg-[#080808] border-[1px] border-fuchsia-50 border-solid"
									}`}
									disabled={!currentNode}
									onClick={addNodeHandler}
								>
									Insert
								</button>
							)}
						</div>
					</div>
				</div>
			</div>

			<div />
			{currentNode && (
				<div>
					<div className="flex flex-col p-3">
						<div className="flex flex-row">
							<SpecStoreIcon color="black" />
							<div className="font-medium font-semibold ml-3 mb-3">
								{currentNode?.name.toUpperCase()}
							</div>
						</div>
						<div className="text-[14px] font-light mb-3">
							Description of node
						</div>
						<div>
							<div className="text-[14px] font-semibold">Example:</div>
							<div className="text-[14px] font-light">Text example</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default OperationNodes;
