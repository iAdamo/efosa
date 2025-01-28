import React from "react";
import { motion } from "framer-motion";
import { sidebarFlyInRight } from "@/animations";

function SSidebarNonFloating({ open, children, className, ...props }) {
	const classNameCalculated = () => {
		const defaultClassName = `bg-[#080808] p-grid-gutter h-full ${className}`;
		if (open) {
			return `${defaultClassName} w-full`;
		}
		return `${defaultClassName} w-0`;
	};
	return (
		<motion.aside className={classNameCalculated()}>{children}</motion.aside>
	);
}

export default SSidebarNonFloating;
