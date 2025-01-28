import { WizardContext } from "@contexts/WizardContext";
import { startSpecc } from "@axios/apiCalls";
import React, { useState, useContext } from "react";
import ConfettiExplosion from "react-confetti-explosion";
import SButton from "@/components/SButton";

export default function StartSpeccPage(props) {
	const { speccID, setIsSpeccStarted } = useContext(WizardContext);

	const [isExploding, setIsExploding] = useState(false);
	const clickStartSpecc = async () => {
		await startSpecc(speccID);
		setIsExploding(true);
		setIsSpeccStarted(true);
	};
	return (
		<>
			<div className="w-full bg-[#080808] m-4 p-3 rounded-base flex justify-center items-center">
				<SButton
					className={"text-[28px] !p-6"}
					sType={"build"}
					onClick={clickStartSpecc}
				>
					Start SPECC
				</SButton>
			</div>

			{isExploding && (
				<div className="fixed top-[20%] left-[50%]">
					<ConfettiExplosion
						onComplete={() => setIsExploding(false)}
						particleCount={300}
						particleSize={14}
						width={2000}
						force={0.5}
						duration={4000}
					/>
				</div>
			)}
		</>
	);
}
