import { Group } from "react-aria-components";
import SButton from "@components/SButton";
import { useNavigate } from "react-router-dom";
import { SMenuButton, SMenuItem } from "@components/MenuDropdown";
import Logo from "@assets/icons/logo.svg?react";
import Chev from "@assets/icons/acrd-close.svg?react";
import { Button } from "react-aria-components";
import MenuOptions from "../MenuOptions";
import { useMatches } from "react-router-dom";
import { useEffect } from "react";
import { useContext } from "react";
import { ProjectContext } from "@/contexts/ProjectContext";
import { NAVIGATION_TYPES, PARAMS, UI_ACTIONS } from "@/constants";
import { useState } from "react";
import { motion } from "framer-motion";
import { routeAnim } from "@/animations";

export default function Navbar(props) {
	const navigate = useNavigate();
	const matches = useMatches();
	const { projectID, sourceAPICustomName, destinationAPICustomName } =
		useContext(ProjectContext);
	const [buttonConf, setButtonConf] = useState(null);

	useEffect(() => {
		const filteredMatches = matches.filter((match) =>
			Boolean(match.handle?.navigationButton),
		);
		if (filteredMatches.length > 0) {
			setButtonConf(filteredMatches[0].handle.navigationButton);
		}
	}, [matches]);

	const renderActionButton = () => {
		if (buttonConf) {
			switch (buttonConf.action) {
				case NAVIGATION_TYPES.INTEGRATIONS:
					return (
						<SButton
							sType={"build"}
							onClick={() => {
								const actionConf = buttonConf.actionConf;
								if (actionConf.action === UI_ACTIONS.NAVIGATE) {
									navigate(actionConf.to(projectID));
								}
							}}
						>
							{buttonConf.text}
						</SButton>
					);
				case NAVIGATION_TYPES.PROJECT_SETTINGS:
					return (
						<SButton
							sType={"build"}
							onClick={() => {
								const actionConf = buttonConf.actionConf;
								if (actionConf.action === UI_ACTIONS.NAVIGATE) {
									navigate(actionConf.to(projectID));
								}
							}}
						>
							{buttonConf.text}
						</SButton>
					);
				default:
					console.error("buttonConf.action not defined in NAVIGATION_TYPES");
			}
		}
		console.error("No navigation button found in route data");
		return (
			<SButton
				sType={"build"}
				onClick={() => {
					navigate("/new-project");
				}}
			>
				<span>Confirm Settings</span>
			</SButton>
		);
	};
	return (
		<motion.div {...routeAnim} className="navbar-container">
			<Group className={"flex gap-2"}>
				<SMenuButton
					label={
						<Group
							className={
								"bg-grey-1 rounded flex items-center px-[8px] py-[6px] gap-[5px]"
							}
						>
							<Logo className="h-[20px] w-fit" />
							<Chev className="w-[10px] h-fit s-icon-grey-4" />
						</Group>
					}
					className="flex flex-col gap-[8px]"
				>
					<MenuOptions />
				</SMenuButton>

				<SMenuButton
					label={
						<Group
							className={"flex items-center px-[8px] py-[6px] gap-[5px] h-max"}
						>
							<span>Add API</span>
							<Chev className="w-[10px] h-fit s-icon-grey-4" />
						</Group>
					}
					className="flex flex-col gap-[8px]"
				>
					<SMenuItem>Find Template</SMenuItem>
				</SMenuButton>

				<SMenuButton
					label={
						<Group
							className={"flex items-center px-[8px] py-[6px] gap-[5px] h-max"}
						>
							<span>API Builder</span>
							<Chev className="w-[10px] h-fit s-icon-grey-4" />
						</Group>
					}
					className="flex flex-col gap-[8px]"
				>
					<SMenuItem>Find Template</SMenuItem>
				</SMenuButton>

				<Button>
					<span>Modules</span>
				</Button>
			</Group>
			<span className="cursor-pointer text-[14px]">
				From{" "}
				<p className="inline font-bold text-secondary-cerise">
					{sourceAPICustomName ? sourceAPICustomName : "API 1"}
				</p>{" "}
				to{" "}
				<p className="inline font-bold text-secondary-mint-green">
					{destinationAPICustomName ? destinationAPICustomName : "API 2"}
				</p>
			</span>
			<Group className="flex gap-[10px]">
				<SButton>
					<span>AI</span>
				</SButton>
				{renderActionButton()}
			</Group>
		</motion.div>
	);
}
