import React, { useContext, useState } from "react";
import UniqueIdentifierSelection from "./UniqueIdentifierSelection";
import { RunnerContext } from "@contexts/RunnerContext";
import { WizardContext } from "@contexts/WizardContext";

const UniqueSourcePage = (props) => {
	const { thirdNode, selectedUnique } = useContext(RunnerContext);

	const { sourceAPIID, activeNodes } = useContext(WizardContext);

	let isForMatching = false;

	let nodeToUse = null;

	nodeToUse = activeNodes.find((node) => {
		if (node.APIID == sourceAPIID && node.parentnode == null) {
			return true;
		}
		return false;
	});

	if (!nodeToUse) {
		if (!thirdNode) {
			return false;
		}
		if (selectedUnique == thirdNode.id) {
			isForMatching = true;
			nodeToUse = thirdNode;
		}
	}

	if (!nodeToUse) {
		return false;
	}

	const direction = "SOURCE";

	return (
		<div className="w-full bg-[#080808] m-4 p-3 rounded-base overflow-scroll">
			<UniqueIdentifierSelection
				disabled={false}
				node={nodeToUse}
				direction={direction}
				isMatching={isForMatching}
			/>
		</div>
	);
};

export default UniqueSourcePage;
