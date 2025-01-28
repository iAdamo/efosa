import React, { useContext } from "react";
import { CheckCircleIcon } from "@heroicons/react/solid";
import { MatchContext } from "@contexts/MatchContext";
import ArrowLeftIcon from "@/Icons/ArrowLeftIcon";
import { RunnerContext, matchTabEnum } from "@contexts/RunnerContext";
import DraggableLinkPoint from "./DraggableLinkPoint";

const selectedColor = "#55689B";
const grey = "#D9D9D9";

const getTextColor = (condition) =>
	condition ? `text-[${selectedColor}]` : "text-gray-300";

const getCheck = (condition) => (
	<CheckCircleIcon
		color={condition ? selectedColor : grey}
		width="12px"
		height="12px"
	/>
);

const MatchBlock = () => {
	const isMatch = true;
	const connect = true;
	const pagination = true;
	const match = true;

	const { isMatchMode, setIsMatchMode } = useContext(MatchContext);
	const { setIsRunnerOpen, setMatchStep } = useContext(RunnerContext);
	const { selectedPairing } = useContext(RunnerContext);

	const matchHandler = () => {
		setIsRunnerOpen(true);
		setMatchStep(matchTabEnum.Result);
	};
	if (!isMatchMode) {
		return null;
	}
	if (!selectedPairing) {
		return null;
	}
	const sourceMatchbox = selectedPairing?.matchboxes?.find((matchbox) => {
		if (matchbox.direction == "SOURCE") {
			return true;
		}
		return false;
	});

	if (!sourceMatchbox) {
		return null;
	}

	const destinationMatchbox = selectedPairing?.matchboxes?.find((matchbox) => {
		if (matchbox.direction == "DESTINATION") {
			return true;
		}
		return false;
	});

	if (!destinationMatchbox) {
		return null;
	}

	return (
		<div className="w-72 h-40 rounded-md flex flex-col bg-[#080808] justify-between fixed left-[50%] top-[100px] translate-x-[-81px]">
			<div className="flex flex-col items-center relative">
				<div
					className={`cursor-pointer flex flex-row items-center justify-center font-bold text-base w-full rounded-t-md p-1 mb-1 ${
						isMatch ? `bg-[${selectedColor}]` : "bg-transparent"
					}`}
					onClick={matchHandler}
				>
					<div className={`mr-1 ${isMatch ? "text-white" : "text-gray-500"}`}>
						MATCH
					</div>
					{isMatch && (
						<CheckCircleIcon width="15px" height="15px" color="#FFF" />
					)}
					{isMatch && (
						<button className="rotate-180 absolute right-5">
							<ArrowLeftIcon color="#FFF" />
						</button>
					)}
				</div>
				<div className="flex flex-row justify-between text-gray-300 text-xs">
					<div className={getTextColor(connect)}>Connect:</div>
					<div className="flex items-center ml-2">{getCheck(connect)}</div>
				</div>
				<div className="flex flex-row justify-between text-gray-300 text-xs">
					<div className={getTextColor(pagination)}>Select Pagination:</div>
					<div className="flex items-center ml-2">{getCheck(pagination)}</div>
				</div>
				{match && (
					<div className="flex flex-row justify-between text-gray-300 text-xs">
						<div className={getTextColor(match)}>Its a match!:</div>
						<div className="flex items-center ml-2">{getCheck(match)}</div>
					</div>
				)}
			</div>
			<div className="flex flex-row border-t-[1px] border-gray-200">
				<DraggableLinkPoint
					activeField={null}
					direction={"SOURCE"}
					isCollapsed={false}
					isInGroupModal={false}
					isInOperationNode={false}
					ONConfig={null}
					ON={null}
					isInput={false}
					inputName={null}
					isOutput={false}
					indexOfOutput={null}
					matchbox={sourceMatchbox}
					isNodeAsONField={false}
				/>
				<DraggableLinkPoint
					activeField={null}
					direction={"DESTINATION"}
					isCollapsed={false}
					isInGroupModal={false}
					isInOperationNode={false}
					ONConfig={null}
					ON={null}
					isInput={false}
					inputName={null}
					isOutput={false}
					indexOfOutput={null}
					matchbox={destinationMatchbox}
					isNodeAsONField={false}
				/>
				<div className="flex flex-row w-1/2 p-3 justify-start">
					<div>
						<div className="text-xs">Parameter</div>
						<div className="text-[#8DB9B5] text-xs">Example data</div>
					</div>
				</div>
				<div className="h-full w-[1px] bg-gray-200" />
				<div className="flex flex-row w-1/2 p-3 justify-end">
					<div>
						<div className="text-xs text-right">Parameter</div>
						<div className="text-[#F1B477] text-xs">Example data</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default MatchBlock;
