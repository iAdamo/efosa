import check from "@assets/icons/tick.svg";
import node from "@assets/icons/node.svg";
import {
	destinationIconClass,
	destinationTextColor,
	sourceIconClass,
	sourceTextColor,
} from "./color-variables";
import React, { useEffect, useState, useContext, useCallback } from "react";
import { PagesContext } from "@contexts/PagesContext";
import { WizardContext } from "@contexts/WizardContext";
import { addActiveNode, addEnvelope } from "@axios/apiCalls";
import { MatchContext } from "@contexts/MatchContext";
import { RunnerContext } from "@contexts/RunnerContext";
import Loading from "@components/loaders/Loading";
import useGlobalStore from "@/store/globalStore";
import { WIZARD_COMPONENT_TYPE } from "@/constants";
import {SCheckbox} from "@components/SCheckbox.jsx";
import SToggle from "@components/SToggle.jsx";

const selector = (state) => ({
	deactivateNode: state.deactivateNode,
	activeNodes: state.activeNodes.allIds.map((id) => state.activeNodes.byId[id]),
	addActiveNode: state.addActiveNode,
});

export default function RelatedNodeParameters({ ...props }) {
	const [selectedNodes, setSelectedNodes] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [currentNode, setCurrentNode] = useState("");
	const { deactivateNode, addActiveNode, activeNodes } = useGlobalStore(selector);

	const { speccID } = useContext(PagesContext);

	const { isMatchMode } = useContext(MatchContext);
	const { selectedPairing } = useContext(RunnerContext);

	const addHandler = async (nodeList) => {
		console.log("nodeList", nodeList[0]);
		const model = {
			speccID: speccID,
			APIID: props.toolbarNode.APIID,
			endpoint: null,
			name: nodeList[0],
			speccpageid: props.toolbarNode.speccpageid,
			parentNode: props.toolbarNode.id,
			isMatching: isMatchMode,
			pairingID: selectedPairing ? selectedPairing.id : null,
			type: WIZARD_COMPONENT_TYPE.RUN,
		};

		const res = await addActiveNode(model);
		setIsLoading(false);
	};

	const toggleNode = async (node) => {
		setIsLoading(true);
		const exists = activeNodes.findIndex((item) => item.name === node);
		console.log("exists", exists, activeNodes, node);
		if (exists === -1) {
			const temp = [...selectedNodes, node];
			addHandler(temp);
			setSelectedNodes(temp);
		} else {
			const temp = selectedNodes.filter((item) => item !== node);
			const toBeDeleted = activeNodes.filter((item) => {
				console.log("checking", item, props.toolbarNode);
				return item.name === node;
			});

			console.log(
				"delete",
				toBeDeleted,
				selectedNodes,
				temp,
				activeNodes,
				props.toolbarNode,
			);

			await deactivateNode(toBeDeleted[0]);

			setIsLoading(false);
			if (props.toolbarNode.name === node) {
				props.setNode(null);
			}

			setSelectedNodes(temp);
		}
	};

	const releatedNode = (item, isSource, isSelected, index, isShowModal, directionInfo) => {
		return (
			// biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
			<>
				{isShowModal ? <div
					key={index}
					className="w-full p-[10px] h-full flex items-start gap-[30px] justify-between hover:bg-grey-1"
				>
					<div className="max-w-[120px] w-full flex items-center gap-[10px] font-bold">
						{isLoading && currentNode === index ? (
							<div className="h-[20px] w-[20px]">
								<Loading
									className="h-[20px] w-[20px]"
									imgClassName="h-[20px] w-[20px]"
								/>
							</div>
						) : <SCheckbox
								isSelected={!!isSelected}
								className={directionInfo.checkboxClass}
								onChange={(isChecked) => {
									setCurrentNode(index);
									toggleNode(item.name, isChecked);
								}}
								value="isBasicAuth"
						/>}

						<span className="text-grey-7 break-all text-[12px] font-medium font-['Inter']">
							{item.name ?? ""}
						</span>
					</div>
					<div className="flex meatballs-view flex-col w-full items-start">
						<div className="flex justify-between w-full mb-[10px]">
							<p className="text-[#AEAEAE] text-[10px] font-medium font-['Inter']">
								Description
							</p>
							<SToggle label="Envelope?" value={true} isChecked={true}/>
						</div>
					</div>
				</div> : <div
					key={index}
					onClick={() => {
						setCurrentNode(index);
						toggleNode(item.name);
					}}
					className={`flex justify-between items-start py-[10px] px-[5px] group hover:bg-[#2B2B2B80] hover:rounded-[5px]  hover-div ${
						isLoading === true ? "cursor-not-allowed" : "cursor-pointer"
					}`}
				>
					<div className="flex gap-[10px] items-start">
						{isSelected ? (
							<img
								src={check}
								alt={check}
								className={`${isSource ? "icon-pink" : "icon-mint-green"}`}
								height="22px"
								width="22px"
							/>
						) : (
							<div className="h-[24px] w-[24px]"/>
						)}
						<div className="flex flex-col items-start gap-[4px]">
							<div className="flex items-center gap-[4px]">
								<div
									className="text-white text-xs font-normal font-['Inter'] leading-[14px] tracking-tight">
									{item.name}
								</div>
							</div>

							<div className="flex gap-[5px]">
								<img
									src={node}
									alt={check}
									className={`${
										isSource ? sourceIconClass : destinationIconClass
									}`}
								/>
								<div
									className={`${
										isSource ? sourceTextColor : destinationTextColor
									} text-xs font-medium font-['Inter'] leading-3`}
								>
									Related Node
								</div>
							</div>
						</div>
					</div>
					{isLoading === true && currentNode === index && (
						<div className="h-[20px] w-[20px]">
							<Loading
								className="h-[20px] w-[20px]"
								imgClassName="h-[20px] w-[20px]"
							/>
						</div>
					)}
				</div>}
			</>
		)
	};

	const checkIfSelected = (relatedNode) => {
		let isActive = false;
		activeNodes.map((node) => {
			if (
				node.name === relatedNode.name &&
				node.parentNode === props.toolbarNode.id
			) {
				isActive = true;
			}
		});
		return isActive;
	};

	return (
		<div key={props.key} className="flex flex-col pt-2">
			{!!props.availableRelatedNodes.length ? (
				props.availableRelatedNodes.map((item, index) => {
					if (props.selectedOnly === true) {
						if (checkIfSelected(item) === true) {
							return releatedNode(
								item,
								props.isSource,
								checkIfSelected(item),
								index,
								props.isShowModal,
								props.directionInfo
							);
						}
					} else {
						return releatedNode(
							item,
							props.isSource,
							checkIfSelected(item),
							index,
							props.isShowModal,
							props.directionInfo
						);
					}
				})
			) : (
				<div className="text-grey-7 text-[12px] font-medium font-['Inter'] text-center mt-[10px]">
					No related nodes available
				</div>
			)}
		</div>
	);
}
