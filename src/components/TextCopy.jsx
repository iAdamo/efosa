import React from "react";
import copyIcon from "@assets/icons/copy.svg";
import { toast } from "sonner";

function TextCopy({ text, component }) {
	return (
		<div
			className={`text-copy ${text?.length > 0 ? "cursor-pointer" : ""}`}
			onClick={() => {
				if (text?.length > 0) {
					navigator.clipboard.writeText(text);
					toast.success(`Copied ${text} to clipboard`);
				}
			}}
		>
			{component}
			<div className="icon-interactive">
				{text?.length > 0 && (
					<img className="icon-grey-5" src={copyIcon} alt="copy" />
				)}
			</div>
		</div>
	);
}

export default TextCopy;
