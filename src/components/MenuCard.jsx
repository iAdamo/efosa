import React from "react";
import { Button } from "react-aria-components";

function MenuCard({ Logo, label, background, className, ...props }) {
	return (
		<Button
			className={`p-1.5 rounded-lg flex flex-col justify-between items-start w-full ${className ? `${className}` : ""}`}
			{...props}
		>
			{Logo && <div className="w-4 h-4"> <Logo className="w-full h-full" /></div>}
			<span className="text-xs font-normal text-left">{label}</span>
		</Button>
	);
}

export default MenuCard;
