import SButton from "@/components/SButton";
import { WizardContext } from "@/contexts/WizardContext";
import React from "react";
import { useContext } from "react";
import Magic from "@assets/icons/magic.svg?react";
import { useState } from "react";
import useGlobalStore from "@/store/globalStore";
import { useEffect } from "react";
import { useShallow } from "zustand/react/shallow";

function AIButton() {
	const { setIsAIChatOpen, isAIChatOpen } = useContext(WizardContext);
	const [isGlowing, setIsGlowing] = useState(false);
	const { AISuggestionsAllIds } = useGlobalStore((s) => ({
		AISuggestionsAllIds: s.AI.suggestions.allIds,
	}));

	useEffect(() => {
		if (AISuggestionsAllIds.length > 0) setIsGlowing(true);
	}, [AISuggestionsAllIds]);

	const clickHandler = () => {
		setIsAIChatOpen(!isAIChatOpen);
		if (isAIChatOpen === false) setIsGlowing(false);
	};

	return (
		<SButton
			sType={"build"}
			className={`gap-[5px] flex items-center ai-navbar-btn ${isGlowing ? "ai-navbar-btn-glow" : ""}`}
			onClick={clickHandler}
		>
			<Magic className="h-[16px] w-fit icon-white" />
			<div class="text-white text-xs font-semibold font-['Inter'] leading-[14px] tracking-tight">
				AI
			</div>
		</SButton>
	);
}

export default AIButton;
