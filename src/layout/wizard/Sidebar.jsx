import SidebarLinks from "@components/SidebarLinks";
import { Group } from "react-aria-components";
import { motion } from "framer-motion";
import { sidebarFlyIn } from "../../animations";
import { useParams } from "react-router-dom";

export default function Sidebar() {
	const { speccID } = useParams();
	return (
		<motion.aside {...sidebarFlyIn}>
			<Group className={"flex flex-col gap-1"}>
				<SidebarLinks label={"Get Data"} to={`/specc/${speccID}/get-data`} />
				<SidebarLinks
					label={"Transformation"}
					to={`/specc/${speccID}/transformation`}
				/>
				<SidebarLinks label={"Transfer"} to={`/specc/${speccID}/transfer`} />
				<SidebarLinks
					label={"Unique Source"}
					to={`/specc/${speccID}/unique-source`}
				/>
				<SidebarLinks
					label={"Unique Destination"}
					to={`/specc/${speccID}/unique-destination`}
				/>
				<SidebarLinks label={"Strategy"} to={`/specc/${speccID}/strategy`} />
				<SidebarLinks label={"Scheduler"} to={`/specc/${speccID}/scheduler`} />
				<SidebarLinks
					label={"Start Specc"}
					to={`/specc/${speccID}/start-specc`}
				/>
			</Group>
		</motion.aside>
	);
}
