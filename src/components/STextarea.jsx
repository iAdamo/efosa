import React from "react";
import { cva } from "class-variance-authority";

const textarea = cva(["s-textarea"], {
	variants: {
		sType: {
			pink: "s-textarea-pink",
			mint: "s-textarea-mint",
		},
	},
	defaultVariants: {
		sType: "pink",
	},
});

const STextarea = React.forwardRef(({ sType, className, ...props }, ref) => {
	return (
		<div
			className={
				className ? textarea({ sType }) + " " + className : textarea({ sType })
			}
		>
			<div className="s-textarea-wrapper">
				<textarea ref={ref} {...props} />
			</div>
		</div>
	);
});

export default STextarea;
