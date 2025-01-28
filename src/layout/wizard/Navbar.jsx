import { Group } from "react-aria-components";
import { SMenuButton, SMenuItem } from "../../components/MenuDropdown";
import Logo from "@assets/icons/logo.svg?react";
import Chev from "@assets/icons/acrd-close.svg?react";
import Add from "@assets/icons/add.svg?react";
import Eye from "@assets/icons/eye.svg?react";
import Change from "@assets/icons/change.svg?react";
import Arrange from "@assets/icons/arrange.svg?react";
import Modules from "@assets/icons/modules.svg?react";
import SettingsData from "@assets/icons/settings-data.svg?react";
import CaretClose from "@assets/icons/caret-open.svg?react";
import Start from "@assets/icons/start.svg?react";
import ToggleOval from "@assets/icons/toggle_oval.svg?react";
import LiveIcon from "@assets/icons/live-icon.svg?react";
import placeholder from "@assets/icons/person-placeholder.png";
import { motion } from "framer-motion";
import { routeAnim } from "../../animations";
import SButton from "@/components/SButton";
import { useContext } from "react";
import MenuOptions from "../MenuOptions";
import { Button } from "react-aria-components";
import SSpeccStatus from "@/components/SSpeccStatus";
import { useState } from "react";
import SchedulingModal from "@/pages/project-integrations/IntegrationModals/Scheduling";
import { ProjectContext } from "@/contexts/ProjectContext";
import { useEffect } from "react";
import SFormSelect from "@/components/SFormSelect";
import { startSpecc, stopSpecc } from "@axios/apiCalls";
import { weekDays } from "./navbar-list-data";
import SSelectMultiple from "@/components/SSelectMultiple";
import { Section } from "react-aria-components";
import Tick from "@assets/icons/tick.svg?react";
import { WizardContext } from "@/contexts/WizardContext";
import { useReactFlow } from "@xyflow/react";
import useGlobalStore from "@/store/globalStore";
import { useShallow } from "zustand/react/shallow";
import AIButton from "./AIButton";
import { promiseToast } from "@/components/toasts/promise-toast";

const selector = (state) => ({
	autoLayout: state.autoLayout,
});

export default function Navbar(props) {
	const { sourceAPICustomName, destinationAPICustomName, specc } =
		useContext(ProjectContext);
	const {
		scheduleModalIsOpen,
		setScheduleModalIsOpen,
		setIsSpeccStarted,
		isSpeccStarted,
		speccID,
		sourceAPIName,
		destinationAPIName,
	} = useContext(WizardContext);

	const [selectedProject, setSelectedProject] = useState(null);
	const [apiCallIsRunning, setApiCallIsRunning] = useState(false);
	const [selectedCrud, setSelectedCrud] = useState([]);
	const [selectectIntegration, setSelectedIntegration] = useState(
		"From API 1 to API 2",
	);

	useEffect(() => {
		setSelectedProject(specc);
	}, [specc]);

	const getSelectedProjectValue = (value) => {
		setSelectedCrud(value);
	};

	const getIsOpen = (isOpen) => {
		setScheduleModalIsOpen(isOpen);
	};

	const { getAndSetOKStatuses } = useContext(WizardContext);

	const clickStartSpecc = (speccID) => {
		// Create a new promise to handle the async operations
		const myPromise = new Promise((resolve, reject) => {
			(async () => {
				try {
					// Run getAndSetOKStatuses first
					await getAndSetOKStatuses(true);

					// Then run startSpecc
					const res = await startSpecc(speccID);

					if (res.success) {
						setIsSpeccStarted(true);
						resolve();
					} else {
						setApiCallIsRunning(false);
						reject(res);
					}
				} catch (error) {
					console.error("Error in clickStartSpecc:", error);
					setApiCallIsRunning(false);

					// Reject the promise to mark the toast as an error
					reject(error);
				}
			})();
		});

		// Display the promiseToast immediately
		promiseToast(
			"Activating Specc",
			"Please complete mandatory steps to activate",
			myPromise,
		);
	};

	const clickStopSpecc = async (speccID) => {
		setApiCallIsRunning(true);
		await stopSpecc(speccID)
			.then((res) => {
				setIsSpeccStarted(false);
				setApiCallIsRunning(false);
			})
			.catch((err) => {
				setApiCallIsRunning(false);
			});
	};

	const handleCrudClick = (value) => {
		if (selectedCrud.includes(value)) {
			setSelectedCrud(selectedCrud.filter((item) => item !== value));
		} else {
			setSelectedCrud([...selectedCrud, value]);
		}
	};

	const { fitView } = useReactFlow();
	const { autoLayout } = useGlobalStore(useShallow(selector));
	const [loading, setLoading] = useState(false);
	const handleAutoLayout = async () => {
		try {
			await autoLayout(fitView);
		} catch (e) {
			console.error(e);
		} finally {
			//setLoading(false);
		}
	};

	return (
		<>
			<motion.div {...routeAnim} className="navbar-container">
				<Group className={"flex gap-6"}>
					<Group className={"flex lg:gap-[6px] xl:gap-[10px] items-center "}>
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
						<Group className="lg:p-1 2xl:p-2 ">
							<Button
								onClick={() => {
									props.toggleOperationsSidebar();
									//setIsSidebarOpen(isSidebarOpen === "ON" ? null : "ON");
								}}
								className="flex gap-[6px] items-center"
							>
								<Add className="h-[16px] w-fit s-icon-grey-5" />
								<div class="text-grey-5 text-xs font-semibold font-['Inter'] leading-3">
									Insert
								</div>
							</Button>
						</Group>
						<Group className="lg:p-1 2xl:p-2 ">
							<Button
								className="flex gap-[8px] items-center"
								onClick={() => { }}
							>
								<Modules className="h-[14px] w-fit s-icon-grey-5" />
								<div class="text-grey-5 text-xs font-semibold font-['Inter'] leading-3">
									Modules
								</div>
							</Button>
						</Group>
						<Group className="lg:p-1 2xl:p-2 ">
							<Button className="flex gap-[6px] items-center">
								<Eye className="h-[16px] w-fit s-icon-grey-5" />
								<div class="text-grey-5  text-xs font-semibold font-['Inter'] leading-3">
									Show/Hide
								</div>
							</Button>
						</Group>
						{/* 
						<Group className="lg:p-1 2xl:p-2 ">
							<Button className="flex gap-[6px] items-center">
								<Change className="h-[15px] w-fit s-icon-grey-5" />
								<div class="text-grey-5  text-xs font-semibold font-['Inter'] leading-3">
									Change
								</div>
							</Button>
						</Group>
						*/}
						<Group className="lg:p-1 2xl:p-2 ">
							<Button
								className="flex gap-[6px] items-center"
								onClick={handleAutoLayout}
							>
								<Arrange className="h-[16px] w-fit s-icon-grey-5" />
								<div class="text-grey-5  text-xs font-semibold font-['Inter'] leading-3">
									Arrange
								</div>
							</Button>
						</Group>
					</Group>
				</Group>

				<Group className="flex gap-[10px] items-center">
					<SettingsData className="h-[14px] w-fit s-icon-grey-2" />

					<SMenuButton
						className="p-2"
						label={
							<span className="cursor-pointer text-[14px]">
								From{" "}
								<p className="inline font-bold text-secondary-cerise">
									{sourceAPIName}
								</p>{" "}
								to{" "}
								<p className="inline font-bold text-secondary-mint-green">
									{destinationAPIName}
								</p>
							</span>
						}
					>
						<Section className="pb-[8px] menu-item-divider-bottom">
							<SMenuItem
								onAction={() => setSelectedIntegration("From API 1 to API 2")}
								className="flex gap-1 cursor-pointer"
							>
								{selectectIntegration === "From API 1 to API 2" && (
									<Tick className="s-icon-grey-5" alt="tick" />
								)}
								<span className="text-main-pink-1">From API 1 to API 2</span>
							</SMenuItem>
							<SMenuItem
								onAction={() => setSelectedIntegration("From API 2 to API 1")}
								className="flex gap-1 cursor-pointer"
							>
								{selectectIntegration === "From API 2 to API 1" && (
									<Tick className="s-icon-grey-5" alt="tick" />
								)}
								<span className="text-secondary-mint-green">
									From API 2 to API 1
								</span>
							</SMenuItem>
							<SMenuItem
								onAction={() => setSelectedIntegration("Two-way integration")}
								className="flex gap-1 cursor-pointer"
							>
								{selectectIntegration === "Two-way integration" && (
									<Tick className="s-icon-grey-5" alt="tick" />
								)}
								Two-way integration
							</SMenuItem>
						</Section>
						<Section className="pt-2">
							<SMenuItem
								onAction={() => handleCrudClick("GET data")}
								className="flex gap-1 cursor-pointer"
							>
								{selectedCrud.includes("GET data") && (
									<Tick className="s-icon-grey-5" alt="tick" />
								)}
								GET data
							</SMenuItem>
							<SMenuItem
								onAction={() => handleCrudClick("POST data")}
								className="flex gap-1 cursor-pointer"
							>
								{selectedCrud.includes("POST data") && (
									<Tick className="s-icon-grey-5" alt="tick" />
								)}
								POST data
							</SMenuItem>
							<SMenuItem
								onAction={() => handleCrudClick("PUT data")}
								className="flex gap-1 cursor-pointer"
							>
								{selectedCrud.includes("PUT data") && (
									<Tick className="s-icon-grey-5" alt="tick" />
								)}
								PUT data
							</SMenuItem>
							<SMenuItem
								onAction={() => handleCrudClick("DELETE data")}
								className="flex gap-1 cursor-pointer"
							>
								{selectedCrud.includes("DELETE data") && (
									<Tick className="s-icon-grey-5" alt="tick" />
								)}
								DELETE data
							</SMenuItem>
						</Section>
					</SMenuButton>
					{selectedProject?.started === 1 && (
						<SSpeccStatus
							text={
								selectedProject && selectedProject.started === 1
									? "LIVE"
									: "STOPPED"
							}
						/>
					)}
				</Group>
				<Group className={"flex lg:gap-[6px] 2xl:gap-[10px] items-center"}>
					<Group className="p-2 mr-2 relative flex items-center">
						<Button
							onClick={() => setScheduleModalIsOpen(!scheduleModalIsOpen)}
							className={`flex gap-[6px] items-center ${apiCallIsRunning ? "cursor-not-allowed" : "cursor-pointer"
								} `}
						>
							<ToggleOval className="h-[14px] w-fit s-icon-grey-5 mr-1" />
							<div class="text-grey-5  text-xs font-semibold font-['Inter'] leading-3">
								Frequency
							</div>
							<CaretClose className="h-[14px] w-fit icon-grey-5" />
						</Button>

						{scheduleModalIsOpen && (
							<div className="absolute max-h-[80vh] md:w-[35vw] lg:w-[32vw]  xl:w-[27vw] -right-1/2 z-[100000] top-[45px] ">
								<SchedulingModal getIsOpen={getIsOpen} />
							</div>
						)}
					</Group>
					<AIButton />

					{false && (
						<SButton
							sType={"paused"}
							className={`flex gap-1 ${apiCallIsRunning ? "cursor-not-allowed" : "cursor-pointer"
								}`}
						//   onClick={() => {
						//     navigate("/projects");
						//   }}
						>
							<Start className="h-[14px] w-fit icon-white flex gap-[8px]" />
							<div class="text-white text-xs font-semibold font-['Inter'] leading-[14px] tracking-tight">
								Paused
							</div>
						</SButton>
					)}
					{isSpeccStarted ? (
						<SButton
							sType={"success"}
							className={`flex gap-2 ${apiCallIsRunning ? "cursor-not-allowed" : "cursor-pointer"
								}`}
							onClick={() => {
								clickStopSpecc(speccID);
							}}
						>
							<LiveIcon className="h-[12px] w-fit icon-white flex gap-[8px]" />
							<div class="text-white text-xs font-semibold font-['Inter'] leading-[14px] tracking-tight">
								Live
							</div>
						</SButton>
					) : (
						<>
							<SButton
								sType={"build"}
								className={
									apiCallIsRunning ? "cursor-not-allowed" : "cursor-pointer"
								}
								onClick={() => {
									clickStartSpecc(speccID);
									props.activateSpecc();
								}}
							>
								<Start className="h-[14px] w-fit icon-white flex gap-[8px]" />
								<div class="text-white text-xs font-semibold font-['Inter'] leading-[14px] tracking-tight">
									Activate
								</div>
							</SButton>
						</>
					)}
				</Group>
			</motion.div>
		</>
	);
}
