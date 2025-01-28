import React from "react";
import { cva } from "class-variance-authority";
import searchIcon from "@assets/icons/library.svg";

const search = cva(["s-search"], {
	variants: {
		sType: {
			pink: "s-search-pink",
			mint: "s-search-mint",
		},
	},
	defaultVariants: {
		sType: "pink",
	},
});

const SSearch = React.forwardRef(
	({ sType, className, Util, isTest, showFull, ...props }, ref, ) => {
		return (
			<div
				className={`${className ? search({ sType }) + " " + className : search({ sType })} ${isTest || showFull ? "flex-1" : ""}`	}
			>
				<div className={`s-search-wrapper  ${isTest || showFull ? "flex flex-row-reverse gap-1 w-[100%]" : ""} ${isTest ? "" : "" }`}>
					<input ref={ref} {...props} placeholder="Search" />
					<img src={searchIcon} alt="search" className="icon-grey-5" />
				</div>
			</div>
		);
	},
);

export default SSearch;
