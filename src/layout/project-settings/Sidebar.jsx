import SidebarLinks from "@components/SidebarLinks";
import { Group } from "react-aria-components";
import { motion } from "framer-motion";
import { sidebarFlyIn } from "../../animations";

export default function Sidebar() {
	return (
		<motion.aside {...sidebarFlyIn}>
			<Group className={"flex flex-col gap-1"}>
				<SidebarLinks label={"Settings"} />
				<SidebarLinks label={"Get Data"} />
				<SidebarLinks label={"Connect"} />
				<SidebarLinks label={"Strategy"} />
			</Group>
		</motion.aside>
	);
}
