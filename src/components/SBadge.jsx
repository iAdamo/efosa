import React from "react";

function SBadge({ label, className, ...props }) {
	return (
		<span {...props} className={className ? "s-badge " + className : "s-badge"}>
			{label}
		</span>
	);
}

export default SBadge;
