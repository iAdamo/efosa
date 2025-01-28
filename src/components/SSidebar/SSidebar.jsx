import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function SSidebar({ children, isCollapsed, ...props }) {
	const [isNotExpanded, setIsNotExpanded] = useState(false);
	useEffect(() => {
		setIsNotExpanded(isCollapsed);
	}, [isCollapsed]);
	// const sidebarVariants = {
	//   expanded: {
	//     initial: {
	//       width: 0,
	//     },
	//     width: "290px",
	//     transition: {
	//       duration: 1.5,
	//       type: "spring",
	//     },
	//   },
	//   collapsed: {
	//     width: "80px",
	//     transition: {
	//       duration: 0.5,
	//       //type: "spring",
	//     },
	//   },
	// };
	return (
		<motion.div
			// variants={sidebarVariants}
      layout
			initial="expanded"
			animate={!isNotExpanded ? "expanded" : "collapsed"}
			className={`sidebar-container ${
				isCollapsed ? "!min-w-[80px]" : "!min-w-[290px]"
			} ${props.sidebarClassName} `}
		>
			{children}
		</motion.div>
	);
}
