import React from "react";
import { NavLink } from "react-router-dom";

function SidebarLinks({ Image, label, to, disabled }) {
	return (
		<NavLink
			to={to ? to : "#"}
			data-is-disabled={disabled || !to}
			className={({ isActive }) =>
				["sidebar-links", isActive && !disabled ? "bg-grey-2" : ""].join(" ")
			}
		>
			{Image && Image}
			<span className=" text-grey-5">{label}</span>
		</NavLink>
	);
}

export default SidebarLinks;
