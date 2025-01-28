import { Group } from "react-aria-components";
import SSearch from "@components/SSearch";
import SButton from "@components/SButton";
import { useNavigate } from "react-router-dom";
import { SMenuButton, SMenuItem } from "@components/MenuDropdown";
import Logo from "@assets/icons/logo.svg?react";
import Chev from "@assets/icons/acrd-close.svg?react";
import MenuOptions from "../MenuOptions";
import { motion } from "framer-motion";
import { routeAnim } from "@/animations";

export default function Navbar() {
	const navigate = useNavigate();
	return (
		<div className="lg:pl-5 lg:pr-3 xl:pl-10 xl:pr-7">
			<Logo className="w-[29px] h-[39px]" />
		</div>
		// <motion.div {...routeAnim} className="px-5 pt-4 pb-10">
		// 	<Group className="max-h-[39px]">
		// 		<SMenuButton
		// 			label={
		// 			}
		// 			className="flex flex-col gap-[8px]"
		// 		>
		// 			<MenuOptions />
		// 		</SMenuButton>
		// 	</Group>
		// 	{/*
		// 	<Group className={"w-[350px]"}>
		// 		<SSearch />
		// 	</Group>
		// 	*/}
		// </motion.div>
	);
}
