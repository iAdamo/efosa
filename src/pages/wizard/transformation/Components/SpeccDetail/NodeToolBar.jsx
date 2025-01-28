import { WizardContext } from "@contexts/WizardContext";
import { useContext, useEffect, useRef, useState } from "react";
import * as ReactDOM from "react-dom";
import useOutsideClickHandler from "@/hooks/useOutsideHandler";
import { NodeToolBarContext } from "@contexts/NodeToolBarContext";
import {
	addActiveFieldApi,
	addOperationNodeApi,
	deleteActiveFieldApi,
	updateActiveNodeApi,
	updateMeatballValue,
} from "@axios/apiCalls";
import useNodeToolbarWidth from "@/hooks/NodeToolBar/useNodeToolbarWidth";
import STabs from "@components/STabs";
import add from "@assets/icons/add.svg";
import node from "@assets/icons/node.svg";
import deleteIcon from "@assets/icons/delete.svg";

import SAccordionGroup from "@components/SAccordionGroup";
import NodeParameters from "./NodeToolBar/components/node-parameters";
import RelatedNodeParameters from "./NodeToolBar/components/related-node-parameters";
import {
	destinationIconClass,
	destinationTextColor,
	sourceIconClass,
	sourceBackgroundColor,
	destinationBackgroundColor,
} from "./NodeToolBar/components/color-variables";
import { uniqueIdentifierParams } from "./NodeToolBar/components/temp-data";
import { Button } from "react-aria-components";
import SButton from "@/components/SButton";
import useGlobalStore from "@/store/globalStore";
import Edit from "@assets/icons/Edit.svg";
import Vector from "@assets/icons/vector.svg";
import { cloneDeep } from "lodash";
import { getNodeName } from "@/utils/nodeComponentHelpers";
import { ELEMENTS, TOGGLES } from "@/store/uiSlice";

const selector = (state) => ({
	deactivateNode: state.deactivateNode,
	activeFields: state.activeFields.allIds.map(
		(id) => state.activeFields.byId[id],
	),
	addActiveField: state.addActiveField,
	deleteActiveField: state.deleteActiveField,
	setSidebar: state.UI.setSidebar,
	wizardMode: state.UI.TOGGLES.WIZARD_MODE
});

const NodeToolBar = () => {
	const {
		// activeFields,
		setActiveFields,
		setActiveNodes,
		activeNodes,
		meatballs,
		speccID,
		setMeatballs,
		shouldUpdateNodesFieldAndMeatballs,
		setShouldUpdateNodesFieldAndMeatballs,
		operationNodesConfig,
		setOperationNodes,
		getAndSetOKStatuses,
	} = useContext(WizardContext);

	const { deactivateNode, activeFields, addActiveField, deleteActiveField, setSidebar, wizardMode } =
		useGlobalStore(selector);
	const { toolbarNode, setToolBarNode, closeToolbar } =
		useContext(NodeToolBarContext);

	const { toolbarFixedClass, onDragToolbarWidth, onDragToolbarWidthEnd } =
		useNodeToolbarWidth(toolbarNode);
	const [meatballValues, setMeatballValues] = useState([]);
	const [isSource, setIsSource] = useState(false);
	const [params, setParams] = useState([...uniqueIdentifierParams]);
	const [isEditing, setIsEditing] = useState(false);
	const [nodeName, setNodeName] = useState(
		toolbarNode?.customName || toolbarNode?.name || "",
	);
	const { updateNodes } = useGlobalStore((s) => s);
	useEffect(() => {
		if (toolbarNode != null) {
			console.log(toolbarNode);
			setIsSource(toolbarNode.direction === "SOURCE");
			setNodeName(getNodeName(toolbarNode));
		}
	}, [toolbarNode]);

	const filterActiveFields = (nodeID) => {
		return activeFields.filter((item) => item.nodeID === nodeID);
	};

	const toolbarRef = useRef(null);

	const accordionItems = [
		{
			title: (
				<span className="flex gap-x-1 items-center">
					<div
						class={` ${toolbarNode ? "text-white" : "text-neutral-700"
							} text-xs font-bold font-['Inter'] leading-[11px] tracking-tight`}
					>
						Node Parameters ({toolbarNode?.availableFields?.length})
					</div>
				</span>
			),
			content: (
				<div className="node-params-tabs">
					<STabs
						tabClassName="p-0"
						key="mainParamTabs"
						selectionColor={
							isSource ? sourceBackgroundColor : destinationBackgroundColor
						}
						tabs={[
							{
								name: "All",
								children: (
									<NodeParameters
										isSource={isSource}
										toolbarNode={toolbarNode}
										params={toolbarNode ? toolbarNode.availableFields : []}
										toggleParameter={(name) => toggleParameter(name)}
										activeFields={
											toolbarNode ? filterActiveFields(toolbarNode.id) : []
										}
									/>
								),
							},
							{
								name: "Selected",
								children: (
									<NodeParameters
										isSource={isSource}
										toggleParameter={(name) => toggleParameter(name)}
										toolbarNode={toolbarNode}
										selectedOnly={true}
										params={toolbarNode ? toolbarNode.availableFields : []}
										activeFields={
											toolbarNode ? filterActiveFields(toolbarNode.id) : []
										}
									/>
								),
							},
						]}
					/>
				</div>
			),
		},
		{
			title: (
				<span className="flex gap-x-1 items-center">
					<div
						class={` ${toolbarNode ? "text-white" : "text-neutral-700"
							} text-xs font-bold font-['Inter'] leading-[11px] tracking-tight`}
					>
						Related Nodes
					</div>
				</span>
			),
			content: (
				<div className="node-params-tabs">
					<STabs
						tabClassName="p-0"
						key="mainParamTabs"
						selectionColor={
							isSource ? sourceBackgroundColor : destinationBackgroundColor
						}
						tabs={[
							{
								name: "All",
								key: "relatedNodeParamAll",
								children: (
									<RelatedNodeParameters
										key="relatedNodeParamAll"
										isSource={isSource}
										parentNode={toolbarNode ?? null}
										setNode={() => setNode()}
										availableRelatedNodes={
											toolbarNode ? toolbarNode.availableRelatedNodes : []
										}
										activeNodes={activeNodes}
										toolbarNode={toolbarNode}
										shouldUpdateNodesFieldAndMeatballs={
											shouldUpdateNodesFieldAndMeatballs
										}
										setShouldUpdateNodesFieldAndMeatballs={(value) =>
											setShouldUpdateNodesFieldAndMeatballs(value)
										}
									/>
								),
							},
							{
								name: "Selected",
								children: (
									<RelatedNodeParameters
										isSource={isSource}
										key="relatedNodeParamSelected"
										selectedOnly={true}
										setNode={() => setNode()}
										parentNode={toolbarNode ?? null}
										availableRelatedNodes={
											toolbarNode ? toolbarNode.availableRelatedNodes : []
										}
										activeNodes={activeNodes}
										toolbarNode={toolbarNode}
										shouldUpdateNodesFieldAndMeatballs={
											shouldUpdateNodesFieldAndMeatballs
										}
										setShouldUpdateNodesFieldAndMeatballs={(value) =>
											setShouldUpdateNodesFieldAndMeatballs(value)
										}
									/>
								),
							},
						]}
					/>
				</div>
			),
		},
	];

	const addOperationNodeTransform = async () => {
		console.log(toolbarNode);
		if (toolbarNode.direction === "DESTINATION") {
			closeToolbar();

			addOperationNodeApi;

			const ONConfig = operationNodesConfig.find((config) => {
				if (config.package === "NodeAsON") {
					return true;
				}
				return false;
			});

			const { data } = await addOperationNodeApi(
				speccID,
				ONConfig.id,
				toolbarNode.id,
			);

			setOperationNodes((prev) => [...prev, data[0]]);
		}
	};

	const handleEditClick = () => {
		setIsEditing(true);
	};
	const handleNodeNameEditing = (e) => {
		setNodeName(e?.target?.value);
	};

	const editNodeNameForCurrentNode = async () => {
		try {
			const response = await updateActiveNodeApi(toolbarNode.id, {
				customName: nodeName,
			});
			if (response?.data) {
				const updatedNode = response.data;
				let newNodes = cloneDeep(activeNodes);
				const currentNodeIdx = newNodes.findIndex(
					(currentNode) => currentNode?.id === toolbarNode.id,
				);
				newNodes.splice(currentNodeIdx, 1);
				newNodes = [
					...newNodes,
					{ ...toolbarNode, customName: updatedNode["customName"] || "" },
				];
				setToolBarNode({
					...toolbarNode,
					customName: nodeName,
				});
				setActiveNodes(newNodes);
				updateNodes(newNodes);
			} else {
				setNodeName(getNodeName(toolbarNode));
			}
		} catch (err) {
			console.error(err);
			setNodeName(getNodeName(toolbarNode));
		}
	};

	const handleSaveClickForNodeName = () => {
		setIsEditing(false);
		editNodeNameForCurrentNode();
	};

	const handleRevertClickForNodeName = () => {
		setIsEditing(false);
		setNodeName(toolbarNode?.name || "");
		let newNodes = cloneDeep(activeNodes);
		const currentNodeIdx = newNodes.findIndex(
			(currentNode) => currentNode?.id === toolbarNode.id,
		);
		newNodes.splice(currentNodeIdx, 1);
		newNodes = [...newNodes, { ...toolbarNode, customName: null }];
		setToolBarNode({
			...toolbarNode,
			customName: null,
		});
		setActiveNodes(newNodes);
		updateNodes(newNodes);
	};

	const editNodeName = () => {
		return (
			<div className="w-[100%] flex flex-col gap-[10px]">
				<input
					type="text"
					value={nodeName}
					onChange={handleNodeNameEditing}
					className={` border flex-1 ${isSource
						? "source-api-border-color"
						: "destination-api-border-color"
						} input-container`}
				/>
				<div className="w-[94px] h-[22px] flex justify-center items-center gap-[5px]">
					<button
						onClick={handleSaveClickForNodeName}
						className="save-btn"
						disabled={nodeName?.length > 0 ? false : true}
					>
						Save
					</button>
					<button onClick={handleRevertClickForNodeName} className="revert-btn">
						Revert
					</button>
				</div>
			</div>
		);
	};

	const showNodeDetails = () => {
		return (
			<div
				className={`node-details-container relative group hover:bg-[#3C3C3C]`}
			>
				<img
					src={toolbarNode ? node : add}
					alt="add"
					className={`${!toolbarNode
						? "icon-grey-5"
						: isSource
							? sourceIconClass
							: destinationIconClass
						} pl-[5px]`}
				/>
				<div className="flex justify-between">
					<div className="flex items-center justify-between">
						<div
							class={`text-xs font-bold font-['Inter'] ${isSource ? "source-api-text-color" : destinationTextColor
								} test-class flex gap-3`}
						>
							Parent{" "}
							{toolbarNode ? (
								<div class="text-white text-xs font-medium font-['Inter'] ">
									{getNodeName(toolbarNode)}
								</div>
							) : (
								<div class="text-zinc-400 text-xs font-normal font-['Inter'] leading-[14px] tracking-tight">
									Add Parent Node
								</div>
							)}
						</div>
					</div>
					<div className="btn-container group-hover:opacity-100 transition-opacity ">
						<button
							onClick={async () => {
								await deactivateNode(toolbarNode);
								setToolBarNode(null);
								if (toolbarNode?.parentNode == null) {
									await getAndSetOKStatuses(false, ["ADD_NODES"]);
								}
							}}
							className="delete-btn"
							type="button"
						>
							<img
								src={Vector}
								alt="delete"
								className="fill-[#AEAEAE] cursor-pointer"
								width="13px"
								height="15px"
							/>
						</button>
						<button onClick={handleEditClick} className="edit-btn">
							<img
								src={Edit}
								alt="edit"
								className="fill-[#AEAEAE] cursor-pointer"
								width="19px"
								height="15px"
							/>
						</button>
					</div>
				</div>
			</div>
		);
	};

	const nodeComponent = () => {
		return (
			<div className="node-accordian-container">
				<div className="flex justify-between">
					<span class="text-white text-xs font-bold font-['Inter'] leading-[11px] tracking-tight py-[10px]">
						Node
					</span>
					<SButton
						onClick={() => {
							addOperationNodeTransform();
						}}
					>
						<span>Node as ON</span>
					</SButton>
				</div>
				<div className="parent-node-no-data cursor-pointer overflow-hidden">
					{isEditing ? editNodeName() : showNodeDetails()}
				</div>
				<SAccordionGroup items={accordionItems} />
			</div>
		);
	};

	const tabs = [
		{ name: "Node", children: nodeComponent() },
		{ name: "Operations", children: <span /> },
	];

	useOutsideClickHandler(toolbarRef, async (e) => {
		if (toolbarNode) {
			for (let i = 0; i < meatballs.length; i++) {
				for (let j = 0; j < meatballValues.length; j++) {
					if (meatballs[i].id === meatballValues[j].id) {
						await updateMeatballValueOnBlur(
							meatballValues[j].value,
							meatballs[i],
						);
					}
				}
			}

			// setIsOpenMenu(false);
			setToolBarNode(null);
			e?.stopPropagation();
			setSidebar(wizardMode === TOGGLES.WIZARD_MODE.RUN ? ELEMENTS.SIDEBAR.RUN_PROGRESS : ELEMENTS.SIDEBAR.MATCH_PROGRESS);
		}
	});

	const closeModal = useRef(null);
	useOutsideClickHandler(closeModal, () => { });

	const toggleParameter = async (availableField) => {
		const activeField = activeFields.find(
			(item) => item.name === availableField && item.nodeID === toolbarNode.id,
		);
		console.log("toggle", activeField);
		if (activeField) {
			deleteActiveField(activeField.id);
		} else {
			addActiveField(toolbarNode.id, availableField);
		}
	};

	const updateMeatballValueOnBlur = async (value, meatball) => {
		const meatballResponse = await updateMeatballValue(meatball.id, value);

		const allNewMeatballs = [];

		for (let i = 0; i < meatballs.length; i++) {
			if (meatballResponse?.data?.id === meatballs[i].id) {
				allNewMeatballs.push(meatballResponse?.data);
			} else {
				allNewMeatballs.push(meatballs[i]);
			}
		}

		setMeatballs(allNewMeatballs);
	};

	const mainLayout = document.getElementById("mainLayout");

	const componentRevamp = (
		<div
			className={`absolute top-[40px] right-[40px] z-overlay`}
			ref={toolbarRef}
		>
			{!toolbarNode ? null : (
				<>
					<div
						draggable
						style={{
							zIndex: 35,
							position: "fixed",
							width: "25px",
							height: "100%",
							background: "transparent",
							cursor: "e-resize",
						}}
						onDrag={onDragToolbarWidth}
						onDragEnd={onDragToolbarWidthEnd}
					/>
					<div className="nodetoolbar-component-wrapper">
						<div className="flex flex-col bg-[#1e2125] px-[18px] py-3 w-[246px] h-[90vh] rounded-api-component">
							<STabs
								tabClassName="pt-[10px] px-[20px]"
								tabs={tabs}
								key="nodeCompTabs"
							/>
						</div>
					</div>
				</>
			)}
		</div>
	);

	if (toolbarNode?.isInGroupModal) {
		return ReactDOM.createPortal(component, document.getElementById("app"));
	}

	return componentRevamp;
};

export default NodeToolBar;
