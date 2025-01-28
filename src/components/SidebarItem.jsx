import React, { useState } from "react";
import { NavLink } from "react-router-dom";

function SidebarItem({ Image, label, to, disabled }) {
    const [active, setActive] = useState();
    return (
        <NavLink
            to={to ? to : "#"}
            data-is-disabled={disabled || !to}
            className={({ isActive }) => {
                setActive(isActive)
                return ["py-3 px-1 rounded-base flex gap-1 items-center", isActive && !disabled ? "border px-2 border-grey-12 rounded-md bg-sidebar-option-gradient" : ""].join(" ")
            }
            }
        >
            <div className={active && "icon-white"}>
                {Image && Image}
            </div>
            {label && <span className="text-custom-patternGrey text-lg leading-base font-normal">{label}</span>}
        </NavLink>
    );
}
export default SidebarItem;