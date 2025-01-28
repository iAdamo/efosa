import { LinksContext } from "@contexts/LinksContext";
import { WizardContext } from "@contexts/WizardContext";
import DraggableLinkPoint from "@pages/wizard/transformation/Components/DraggableLinkPoint";
import { useContext, useEffect, useMemo, useState } from "react";
import OperationNodePassthroughInput from "./OperationNodePassthroughInput";
import { Handle } from "@xyflow/react";
import { Position } from "@xyflow/react";
import HandlerPoints from "../UI/HandlerPoints";
import { getOutputTypeFromConfig } from "@/utils/typeColour";
import useGlobalStore from "@/store/globalStore";
import { useShallow } from "zustand/react/shallow";

const selector = (state) => ({
	exampleDataHandles: state.exampleData.handles,
});

const OperationNodeOutputs = (props) => {
	const {
		ON,
		ONConfig,
		nodePassthroughType,
		setNodePassthroughType,
		isCollapsed,
	} = props;
	const { links } = useContext(WizardContext);

	const [outputType, setOutputType] = useState(null);

	const [addedOutputs, setAddedOutputs] = useState(0);

	const { exampleDataHandles } = useGlobalStore(useShallow(selector));

	let numberOfOutputs = 0;
	let isTrueFalse = false;
	if (ONConfig.name == "IF Condition") {
		numberOfOutputs = 2;
		isTrueFalse = true;
	} else if (ONConfig.name == "Switch") {
		numberOfOutputs = 1;
	} else {
		const allOutputLinks = links.filter((link) => {
			if (link.ONsourceID == ON.id) {
				return true;
			}
			return false;
		});

		if (allOutputLinks.length == 0) {
			numberOfOutputs = 1;
		} else {
			let highestOutputIndex = 0;
			for (const link of allOutputLinks) {
				if (link.outputIndex > highestOutputIndex) {
					highestOutputIndex = link.outputIndex;
				}
			}
			numberOfOutputs = highestOutputIndex + 1;
		}

		//Loop through exampleDataHandles but exclude the index of the handles, and check how many is connected to the ON. exampleDataHandles is an object

		let numberOfExampleResults = 0;

		for (const [key, value] of Object.entries(exampleDataHandles)) {
			if (key.includes("ON-output-" + ON.id)) {
				numberOfExampleResults++;
			}
		}

		if (numberOfExampleResults > numberOfOutputs) {
			numberOfOutputs = numberOfExampleResults;
		}
	}

	let hasPassthrough = false;
	if (ONConfig.name == "IF Condition") {
		hasPassthrough = true;
	}

	useEffect(() => {
		const outputType = getOutputTypeFromConfig(ONConfig);
		setOutputType(outputType[0]);
	}, [ONConfig]);

	return (
		<div className="flex flex-col mt-[10px]">
			{hasPassthrough && (
				<OperationNodePassthroughInput
					ON={ON}
					ONConfig={ONConfig}
					nodePassthroughType={nodePassthroughType}
					setNodePassthroughType={setNodePassthroughType}
					isCollapsed={isCollapsed}
				/>
			)}
			{[...Array(numberOfOutputs + addedOutputs)].map((number, index) => {
				const outputLabel = () => (
					<span>
						{ON.result && ON.result.length >= index - 1 && (
							<>
								<p className="exampledataptag inline-block">
									{ON.result[index]}
								</p>
							</>
						)}
						{isTrueFalse
							? index === 0
								? "True"
								: "False"
							: `Output ${index + 1}`}
					</span>
				);
				return (
					<HandlerPoints
						key={`ON-output-${ON.id}-${index}`}
						id={`ON-output-${ON.id}-${index}`}
						type="source"
						position={Position.Right}
						index={index}
						label={outputLabel()}
						dataType={nodePassthroughType ? nodePassthroughType : outputType}
						isCollapsed={isCollapsed}
					/>
				);
			})}
			{!isTrueFalse && (
				<div
					className="flex-grow flex items-center justify-center w-full h-8 border border-grey-13 rounded-api-component cursor-pointer"
					onClick={() => {
						setAddedOutputs((s) => s + 1);
					}}
				>
					+
				</div>
			)}
		</div>
	);
};

export default OperationNodeOutputs;
