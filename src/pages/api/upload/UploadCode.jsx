import { useState } from "react";
import { useEffect } from "react";

export default function UploadCode(props) {
	const [noOfLines, setNoOfLines] = useState(16);

	const { jsontext, setJsontext, codeClassName } = props;

	useEffect(() => {
		if (jsontext === "") return;
		const lines = jsontext.split("\n").length;
		if (lines > 14) {
			setNoOfLines(lines);
		} else {
			setNoOfLines(15);
		}
	}, [jsontext]);

	const getLineNumbers = () => {
		const lines = [];
		if (noOfLines > 200) {
			return <></>;
		}
		for (let i = 1; i <= noOfLines; i++) {
			lines.push(
				<div
					key={i}
					className="text-right text-[#aeaeae] text-base font-normal font-['Fira Code'] leading-4"
				>
					{i}
				</div>,
			);
		}
		return lines;
	};

	const clearCode = () => {
		setJsontext("");
		setNoOfLines(15);
	};

	return (
		<div className={`flex flex-col pt-[10px] h-full`}>
			<div className="flex justify-between">
				<div className="text-grey-17 mb-3 font-medium">UPLOAD FILE</div>
				<div
					onClick={clearCode}
					onKeyDown={clearCode}
					class="text-[#aeaeae] text-xs font-normal font-['Inter'] leading-[14px] underline cursor-pointer"
				>
					Clear all
				</div>
			</div>
			<div className={`rounded-[5px] p-5 border border-gradient-grey-4 max-h-[296px] ${codeClassName}`}>
				<div className="overflow-auto max-h-[256px] flex w-full ">
					<div className="flex flex-col border-r border-gradient-grey-9 text-right h-full pr-[10px]">
						{getLineNumbers()}
					</div>
					<textarea
						rows={noOfLines}
						value={jsontext}
						onChange={(e) => setJsontext(e.target.value)}
						spellCheck={false}
						className="pl-[10px] bg-transparent overflow-hidden w-full resize-none font-medium leading-4 font-fira"
					/>
				</div>
			</div>
		</div>
	);
}
