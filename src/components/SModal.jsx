import React from "react";
import cross from "@assets/icons/cross.svg";
import { Button } from "react-aria-components";

function SModal({ children, className, label, onClose }) {
	return (
		<div className={className ? `s-modal ${className}` : "s-modal"}>
			{label && (
				<div className="label-container flex justify-between align-center">
					<div className="label">{label}</div>
					<Button className="icon-interactive" onPress={onClose}>
						<img className="icon-grey-5" src={cross} alt="cross" />
					</Button>
				</div>
			)}
			<div className="content">{children}</div>
		</div>
	);
}

export default SModal;
