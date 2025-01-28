import { useState } from "react";
import { useEffect } from "react";

export default function UploadCode() {
	const [noOfLines, setNoOfLines] = useState(18);
	const [code, setCode] = useState("");

	useEffect(() => {
		if (code === "") return;
		const lines = code.split("\n").length;
		if (lines > 14) {
			setNoOfLines(lines);
		} else {
			setNoOfLines(18);
		}
	}, [code]);

	const getLineNumbers = () => {
		const lines = [];
		for (let i = 1; i <= noOfLines; i++) {
			lines.push(
				<div
					key={i}
					className="text-right text-[#aeaeae] text-base font-normal font-['Fira Code']"
				>
					{i}
				</div>,
			);
		}
		return lines;
	};

	const clearCode = () => {
		setCode("");
		setNoOfLines(15);
	};

	return (
		<div className="flex flex-col gap-[5px] pt-[10px]">
			<div className="flex justify-between">
				<div class="text-[#aeaeae] text-xs font-normal font-['Inter'] leading-[14px] pl-3">
					Insert Code*
				</div>
				<div
					onClick={clearCode}
					onKeyDown={clearCode}
					class="text-[#aeaeae] text-xs font-normal font-['Inter'] leading-[14px] underline cursor-pointer"
				>
					Clear all
				</div>
			</div>
			<div className="flex bg-grey-2 rounded-[5px] max-h-[35vh] pt-[10px] overflow-scroll">
				<div className="flex flex-col border-r border-white text-right h-full pr-[10px] px-[10px]">
					{getLineNumbers()}
				</div>
				<textarea
					rows={noOfLines}
					value={code}
					onChange={(e) => setCode(e.target.value)}
					className="pl-[10px] bg-grey-2 w-full overflow-hidden h-full resize-none"
				/>
			</div>

			<div class="text-[#aeaeae] text-xs font-medium font-['Inter'] leading-none px-3">
				*Required
			</div>
		</div>
	);
}
