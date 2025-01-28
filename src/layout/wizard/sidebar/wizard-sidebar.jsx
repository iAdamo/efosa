import { Group } from "react-aria-components";
import SidebarMenuItem from "@components/SSidebar/SidebarMenuItem";
import Upload from "@assets/icons/upload.svg?react";
import KeyIcon from "@assets/icons/key.svg?react";
import CollapseIcon from "@assets/icons/round-double-arrow.svg?react";
import ExpandIcon from "@assets/icons/round-double-arrow-open.svg?react";
import STabs from "@components/STabs";
import Node from "@assets/icons/node.svg?react";
import LeftArrow from "@assets/icons/left-arrow.svg?react";
import Connect from "@assets/icons/connect.svg?react";
import FingerScan from "@assets/icons/finger-scan.svg?react";
import TestTube from "@assets/icons/test-tube.svg?react";
import Add from "@assets/icons/add.svg?react";
import Strategy from "@assets/icons/strategy.svg?react";
import Scheduler from "@assets/icons/scheduler.svg?react";
import Check from "@assets/icons/tick.svg?react";
import Warning from "@assets/icons/warning.svg?react";
import CircularProgress from "@components/loaders/CircularLoader";
import { useState } from "react";
import SAccordion from "@components/SAccordion";
import Matching from "@assets/icons/matching.svg?react";
import SSidebar from "@/components/SSidebar/SSidebar";
import { SMenuButton } from "@/components/MenuDropdown";
import { SMenuItem } from "@/components/MenuDropdown";
import Modules from "@assets/icons/modules.svg?react";
import { Header } from "react-aria-components";
import { Section } from "react-aria-components";
import Filter from "@assets/icons/filter.svg?react";
import Question from "@assets/icons/question.svg?react";
import Webhook from "@assets/icons/webhook.svg?react";
import GroupIcon from "@assets/icons/group.svg?react";
import { v4 as uuidv4 } from "uuid";
import { useRef } from "react";
import { useEffect } from "react";
import { promiseToast } from "@components/toasts/promise-toast";
import { errorToast } from "@components/toasts/error-toast";
import TransferHistoric from "@assets/icons/transfer-historic.svg?react";
import CreateAsWeGo from "@assets/icons/create-as-we-go.svg?react";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { WizardContext } from "@/contexts/WizardContext";
import { deleteGenericCRUDWithID, postGenericCRUD } from "@/axios/apiCalls";
import UniqueIdentifier from "@/pages/wizard/unique-identifier";
import ResizableContainer from "@/components/SResizableContainer";
import Close from "@assets/icons/cross.svg?react";
import {
	updateSourceTransferKey,
	updateDestinationTransferKey,
} from "@/axios/apiCalls";
import { useShallow } from "zustand/react/shallow";
import useGlobalStore from "@/store/globalStore";
import { act } from "react";
import minimizeIcon from "@assets/icons/minimize-icon.svg";
import maximizeIcon from "@assets/icons/maximize-icon.svg";

const selector = (state) => ({
	transferKey: state.transferKey,
	resetTransferKey: state.resetTransferKey,
	activeNodes: state.activeNodes,
	matchingActivated: state.matchingActivated,
});

export default function WizardSidebar(props) {
	const { transferKey, resetTransferKey, activeNodes, matchingActivated } = useGlobalStore(
		useShallow(selector),
	);

	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [isErrored, setIsErrored] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [isCollapsed, setCollapsed] = useState(false);
	const [selectedMenuItem, setSelectedMenuItem] = useState("Add nodes");
	const {
		speccID,
		project,
		scheduleModalIsOpen,
		setScheduleModalIsOpen,
		availableModules,
		activeModules,
		setActiveModules,
		refreshInitialData,
	} = useContext(WizardContext);
	const [uniqueIdentifierIsOpen, setUniqueIdentifierIsOpen] = useState(false);
	const [uniqueIdentifier, setUniqueIdentifier] = useState();

	useEffect(() => {
		const pathname = window.location.pathname.split("/");
		const currentPath = pathname[pathname.length - 1];
		switch (currentPath) {
			case "transformation":
				setSelectedMenuItem("Add nodes");
				break;
			case "get-data":
				setSelectedMenuItem("Get data");
				break;
			case "group-data":
				setSelectedMenuItem("Group data");
				break;
			case "transfer":
				setSelectedMenuItem("Test");
				break;
			case "webhook":
				setSelectedMenuItem("Webhook");
				break;
			case "event":
				setSelectedMenuItem("Create event");
				break;
		}
	}, []);

	useEffect(() => {
		setUniqueIdentifier(transferKey);
	}, [transferKey]);

	const removeUniqueIdentifier = async (endpoint) => {
		let result = null;
		if (endpoint === "SOURCE") {
			result = await updateSourceTransferKey(uniqueIdentifier.id, null, null);
		} else {
			result = await updateDestinationTransferKey(
				uniqueIdentifier.id,
				null,
				null,
			);
		}
		resetTransferKey(result.data);
		return result;
	};

	const setUniqueIdentifierIsOpenState = (value) => {
		if (value === true) {
			if (activeNodes.allIds.length > 0) {
				setUniqueIdentifierIsOpen(value);
			} else {
				errorToast("Please add parent nodes");
			}
		} else {
			setUniqueIdentifierIsOpen(value);
		}
	};

	const getIconForAvailableModule = (moduleName) => {
		//Change the module name to upper case

		switch (moduleName.toUpperCase()) {
			case "SUBSET":
				return <Modules alt="modules" className="icon-grey-5" />;
			case "FILTER":
				return <Filter alt="filters" className="icon-grey-5" />;
			case "GROUPDATA":
				return <GroupIcon alt="group" className="icon-grey-5" />;
			case "MANIPULATION":
				return <Question alt="manipulation" className="icon-grey-5" />;
			case "WEBHOOK":
				return <Webhook alt="webhook" className="icon-grey-5" />;
		}
	};

	const allNonActivatedModules = [];
	for (let i = 0; i < availableModules.length; i++) {
		let found = false;
		for (let j = 0; j < activeModules.length; j++) {
			if (availableModules[i].id === activeModules[j].moduleConfigID) {
				found = true;
				break;
			}
		}
		if (!found) {
			allNonActivatedModules.push(availableModules[i]);
		}
	}

	const navigate = useNavigate();

	const [modules, setModules] = useState([
		{
			name: "Subset",
			icon: <Modules alt="modules" className="icon-grey-5" />,
			onClick: () => {
				subsetHandler();
			},
			isSelected: false,
			disabled: true,
		},
		{
			name: "Filter",
			icon: <Filter alt="filters" className="icon-grey-5" />,
			onClick: () => {
				filterHandler();
			},
			isSelected: false,
			disabled: true,
		},
		{
			name: "Group",
			icon: <GroupIcon alt="group" className="icon-grey-5" />,
			onClick: () => {
				groupHandler();
			},
			isSelected: false,
			disabled: false,
		},
		{
			name: "Manipulation",
			icon: <Question alt="manipulation" className="icon-grey-5" />,
			onClick: () => {
				manipulationHandler();
			},
			isSelected: false,
			disabled: true,
		},
		{
			name: "Webhook",
			icon: <Webhook alt="webhook" className="icon-grey-5" />,
			onClick: () => {
				webhookHandler();
			},
			isSelected: false,
			disabled: true,
		},
		{
			name: "Event",
			icon: <Webhook alt="webhook" className="icon-grey-5" />,
			onClick: () => {
				eventHandler();
			},
			isSelected: false,
			disabled: true,
		},
	]);

	useEffect(() => {
		setIsAuthenticated(props.isAuthenticated);
		setIsErrored(props.isErrored);
		setIsLoading(props.isLoading);
	}, [props]);

	const getIcon = (icon, isOK) => {
		if (isOK === "LOADING") {
			return <CircularProgress imgClassName="w-[15px] h-[15px]" />;
		}
		if (!isCollapsed) {
			if (isOK === "OK") {
				return <Check alt="check" className="icon-success" />;
			}
			if (isOK === "ERROR") {
				return <Warning alt="warning" className="icon-error" />;
			}
		}
		return getOptionIcon(icon);
	};

	const getClickHandler = (name) => {
		switch (name) {
			case "Connect":
				return connectHandler;
			case "Get data":
				return getDataHandler;
			case "Unique Identifier":
				return uniqueIdentifierHandler;
			case "Unique Identifier Destination":
				return uniqueDestinationIdentifierHandler;
			case "Test":
				return testHandler;
			case "Add module":
				return addModuleHandler;
			case "Strategy":
				return strategyHandler;
			case "Scheduler":
				return schedulerHandler;
			case "Subset":
				return subsetHandler;
			case "Filter":
				return filterHandler;
			case "Group data":
				return groupHandler;
			case "Manipulation":
				return manipulationHandler;
			case "Webhook":
				return webhookHandler;
			case "Create event":
				return eventHandler;
		}
	};

	const {
		isUploadOK,
		setIsUploadOK,
		isAuthenticationOK,
		setIsAuthenticationOK,
		isAddNodesOK,
		setIsAddNodesOK,
		isGetDataOK,
		setIsGetDataOK,
		isConnectOK,
		setIsConnectOK,
		isTestTransferOK,
		setIsTestTransferOK,
		isUniqueIdentifierOK,
		setIsUniqueIdentifierOK,
		isWebhookOK,
		setIsWebhookOK,
		isGroupingOK,
		setIsGroupingOK,
		isSchedulerOK,
		setIsSchedulerOK,
	} = useContext(WizardContext);

	const getIsOKFunction = (name) => {
		switch (name) {
			case "Upload":
				return isUploadOK;
			case "Authentication":
				return isAuthenticationOK;
			case "Add nodes":
				return isAddNodesOK;
			case "Connect":
				return isConnectOK;
			case "Get data":
				return isGetDataOK;
			case "Unique Identifier":
				return isUniqueIdentifierOK;
			case "Unique Identifier Destination":
				return isUniqueIdentifierOK;
			case "Test":
				return isTestTransferOK;
			case "Add module":
				return null;
			case "Strategy":
				return null;
			case "Scheduler":
				return isSchedulerOK;
			case "Subset":
				return null;
			case "Filter":
				return null;
			case "Group":
				return isGroupingOK;
			case "Manipulation":
				return null;
			case "Webhook":
				return isWebhookOK;
		}
	};

	const getIconClass = (icon) => {
		return isAuthenticated
			? "icon-success"
			: isErrored
				? "icon-error"
				: icon === selectedMenuItem
					? "icon-white"
					: "icon-grey-5";
	};

	const getOptionIcon = (option) => {
		switch (option) {
			case "Upload":
				return <Upload alt="upload" className={getIconClass(option)} />;
			case "Authentication":
				return <KeyIcon alt="key" className={getIconClass(option)} />;
			case "Add nodes":
				return <Node alt="node" className={getIconClass(option)} />;
			case "Get data":
				return <LeftArrow alt="arrow" className={getIconClass(option)} />;
			case "Connect":
				return <Connect alt="connect" className={getIconClass(option)} />;
			case "Unique Identifier":
				return (
					<FingerScan alt="finger-scan" className={getIconClass(option)} />
				);
			case "Unique Identifier Destination":
				return (
					<FingerScan alt="finger-scan" className={getIconClass(option)} />
				);
			case "Test":
				return <TestTube alt="finger-scan" className="icon-grey-5" />;
			case "Add module":
				return <Add alt="add" className="icon-grey-5" />;
			case "Strategy":
				return <Strategy alt="strategy" className={getIconClass(option)} />;
			case "Scheduler":
				return <Scheduler alt="scheduler" className={getIconClass(option)} />;
			case "Subset":
				return <Modules alt="scheduler" className={getIconClass(option)} />;
			case "Filter":
				return <Filter alt="scheduler" className={getIconClass(option)} />;
			case "Group":
				return <GroupIcon alt="scheduler" className={getIconClass(option)} />;
			case "Manipulation":
				return <Question alt="scheduler" className={getIconClass(option)} />;
			case "Webhook":
				return <Webhook alt="scheduler" className={getIconClass(option)} />;
		}
	};

	const uploadAPIHandler = () => {
		navigate(`/project/${project.id}/settings`);
	};
	const authenticationHandler = () => {
		navigate(`/project/${project.id}/settings`);
	};
	const addNodesHandler = () => {
		navigate(`/specc/${speccID}/transformation`);
	};
	const getDataHandler = () => {
		navigate(`/specc/${speccID}/get-data`);
	};
	const connectHandler = () => {
		navigate(`/specc/${speccID}/transformation`);
	};
	const matchGetSourceHandler = () => {
		navigate(`/specc/${speccID}/matching/get-data?direction=source`);
	};
	const matchGetDestinationHandler = () => {
		navigate(`/specc/${speccID}/matching/get-data?direction=destination`);
	};
	const matchBuildHandler = () => {
		navigate(`/specc/${speccID}/matching/build-match`);
	};
	const matchResults = () => {
		navigate(`/specc/${speccID}/matching/results`);
	};
	const matchUniqueId = () => {
		navigate(`/specc/${speccID}/matching/unique-id`);
	};
	const matchSelectEndpoint = () => {
		navigate(`/specc/${speccID}/matching/select-endpoint`);
	};
	const uniqueIdentifierHandler = () => {
		setUniqueIdentifierIsOpenState(!uniqueIdentifierIsOpen);
	};
	const uniqueDestinationIdentifierHandler = () => {
		navigate(`/specc/${speccID}/unique-destination`);
	};
	const testHandler = () => {
		navigate(`/specc/${speccID}/transfer`);
	};
	const strategyHandler = () => {
		navigate(`/specc/${speccID}/strategy`);
	};
	const schedulerHandler = () => {
		navigate(`/specc/${speccID}/scheduler`);
	};
	const filterHandler = () => {
		navigate(`/specc/${speccID}/filter-data`);
	};
	const manipulationHandler = () => { };
	const groupHandler = () => {
		navigate(`/specc/${speccID}/group-data`);
	};
	const subsetHandler = () => { };
	const webhookHandler = () => {
		navigate(`/specc/${speccID}/webhook`);
	};
	const eventHandler = () => {
		navigate(`/specc/${speccID}/event`);
	};

	const webhookModule = activeModules.find(
		(module) => module.config.displayname === "Webhook",
	);

	return (
		<div className="relative">
			{uniqueIdentifierIsOpen && (
				<ResizableContainer
					className="absolute bg-grey-1 w-max right-[300px] top-[30%]  example-resize-container"
					maxConstraints={[window.innerWidth * 0.5, window.innerHeight * 0.65]}
					minConstraints={[window.innerWidth * 0.3, window.innerHeight * 0.4]}
					width={window.innerWidth * 0.35}
					axis="both"
					height={window.innerHeight * 0.55}
				>
					<UniqueIdentifier
						setUniqueIdentifierIsOpenState={setUniqueIdentifierIsOpenState}
					/>
				</ResizableContainer>
			)}
			<SSidebar
				sidebarClassName="!overflow-y-hidden container-transition"
				isCollapsed={isCollapsed}
			>
				<div
					className={`absolute flex items-center justify-center cursor-pointer expand-btn-shadow ${"w-[25px] h-[25px] top-[-1px] right-[-7px]"} rounded-[50%] bg-[#080808] z-20`}
					onClick={() => setCollapsed(!isCollapsed)}
				>
					<span>
						{
							<img
								src={isCollapsed ? maximizeIcon : minimizeIcon}
								width={18}
								height={18}
								className="stroke-[#CDCDCD] min-w-[10px] min-h-[10px]"
							/>
						}
					</span>
				</div>
				<div className="flex flex-col wizard-sidebar overflow-y-scroll">
					{!isCollapsed ? (
						<>
							<div className="flex flex-col pt-[10px] pb-8">
								<Group className={"flex flex-col gap-[0px]"}>
									<div class="text-white text-xs font-normal font-['Inter'] leading-[14px] tracking-tight py-[10px]">
										Settings
									</div>

									<SidebarMenuItem
										onClick={() => {
											setSelectedMenuItem("Upload");
											uploadAPIHandler();
										}}
										isSelected={selectedMenuItem === "Upload"}
										name="Upload"
										icon={getIcon("Upload", getIsOKFunction("Upload"))}
									/>

									<SidebarMenuItem
										name="Authentication"
										onClick={() => {
											setSelectedMenuItem("Authentication");
											authenticationHandler();
										}}
										isSelected={selectedMenuItem === "Authentication"}
										icon={getIcon(
											"Authentication",
											getIsOKFunction("Authentication"),
										)}
									/>
								</Group>
								<div class="h-[0px] border-b border-grey-3 my-[8px]" />
								<Group className={"flex flex-col gap-[0px]"}>
									<div class="text-white text-xs font-normal font-['Inter'] leading-[14px] tracking-tight py-[10px]">
										Wizard
									</div>

									{webhookModule && (
										<SidebarMenuItem
											name="Webhook"
											onClick={() => {
												setSelectedMenuItem("Webhook");
												webhookHandler();
											}}
											isSelected={selectedMenuItem === "Webhook"}
											icon={getIcon("Webhook", getIsOKFunction("Webhook"))}
											showDelete={true}
											deleteClick={() => {
												deleteGenericCRUDWithID(
													"Active_Modules",
													webhookModule.id,
												);

												setActiveModules(
													activeModules.filter(
														(activeModule) =>
															activeModule.id !== webhookModule.id,
													),
												);
											}}
										/>
									)}
									<SidebarMenuItem
										name="Add nodes"
										onClick={() => {
											setSelectedMenuItem("Add nodes");
											addNodesHandler();
										}}
										isSelected={selectedMenuItem === "Add nodes"}
										icon={getIcon("Add nodes", getIsOKFunction("Add nodes"))}
									/>

									{activeModules
										.sort((a, b) => (a.order > b.order ? 1 : -1))
										.map((module) => {
											if (module.config.displayname === "Webhook") {
												return <></>;
											}
											return (
												<SidebarMenuItem
													key={uuidv4()}
													showDelete={!!module.config.canBeDeleted}
													name={module.config.displayname}
													onClick={() => {
														setSelectedMenuItem(module.config.displayname);
														const clickHandler = getClickHandler(
															module.config.displayname,
														);
														clickHandler();
													}}
													isSelected={
														selectedMenuItem === module.config.displayname
													}
													icon={getIcon(
														module.config.displayname,
														getIsOKFunction(module.config.displayname),
													)}
													deleteClick={() => {
														deleteGenericCRUDWithID(
															"Active_Modules",
															module.id,
														);

														setActiveModules(
															activeModules.filter(
																(activeModule) => activeModule.id !== module.id,
															),
														);
													}}
												/>
											);
										})}

									<SAccordion
										hidePlus={true}
										title={
											<>
												<SidebarMenuItem
													name="Unique Identifier"
													onClick={() => {
														setSelectedMenuItem("Unique Identifier");
														uniqueIdentifierHandler();
													}}
													isSelected={selectedMenuItem === "Unique Identifier"}
													icon={getIcon(
														"Unique Identifier",
														getIsOKFunction("Unique Identifier"),
													)}
												/>
											</>
										}
										content={
											<>
												{uniqueIdentifier?.sourceKeyName && (
													<div
														key={uuidv4()}
														className="group m-[10px] mb-[5px]"
													>
														<div className="flex justify-between items-center gap-2 px-[10px] py-[8px] cursor-pointer border  border-main-pink-1 group-hover:border-main-pink-1  rounded-[5px]">
															<div class="text-white text-xs font-medium font-['Inter'] leading-3">
																{uniqueIdentifier.sourceKeyName}
															</div>

															<div className={"gap-3 items-center flex "}>
																<FingerScan className="icon-white cursor-pointer mr-0" />
																<Close
																	onClick={() =>
																		removeUniqueIdentifier("SOURCE")
																	}
																	className="icon-white cursor-pointer mr-1"
																/>
															</div>
														</div>
													</div>
												)}
												{uniqueIdentifier?.destinationKeyName && (
													<div
														key={uuidv4()}
														className="group m-[10px] mb-[5px]"
													>
														<div
															className={`flex justify-between items-center gap-2 px-[10px] py-[8px] cursor-pointer border 
                              border-secondary-mint-green
                               group-hover:border-secondary-mint-green
                          rounded-[5px]`}
														>
															<div class="text-white text-xs font-medium font-['Inter'] leading-3">
																{uniqueIdentifier.destinationKeyName}
															</div>

															<div className={"gap-3 items-center flex "}>
																<FingerScan className="icon-white cursor-pointer mr-0" />
																<Close
																	onClick={() =>
																		removeUniqueIdentifier("DESTINATION")
																	}
																	className="icon-white cursor-pointer mr-1"
																/>
															</div>
														</div>
													</div>
												)}
											</>
										}
										open={uniqueIdentifierIsOpen}
										titleClassname="flex flex-grow justify-between items-center cursor-pointer group hover:bg-grey-1 rounded select-none  "
										accordionClassname="pb-[20px] container-divider-bottom "
										buttonClassname="flex flex-grow items-center gap-2"
										iconClassName="!w-[0px]"
										toggleAccordion={(e) => {
										}}
									/>

									<SMenuButton
										placement="right"
										popoverClassName="!left-[290px]  !p-[10px] w-[170px] ml-[5px]"
										label={
											<div className="flex items-center gap-[5px] p-[10px] cursor-pointer">
												<Add alt="add" className="icon-grey-5" />
												<div class="text-[#aeaeae] text-xs font-normal font-['Inter'] leading-[14px] tracking-tight">
													Add module
												</div>
											</div>
										}
										className="flex flex-col gap-[8px]"
									>
										<Section className="pb-[8px]">
											<Header className="p-[5px] text-grey-5">
												<div class="text-[#aeaeae] text-xs font-medium font-['Inter'] leading-3">
													Add module
												</div>
											</Header>

											{allNonActivatedModules.map((module) => {
												return (
													!module.isSelected && (
														<>
															<SMenuItem
																className={`flex items-center gap-[5px] !px-[5px] !py-[8px] cursor-pointer ${module.disabled ? "line-through" : ""
																	}`}
																key={uuidv4()}
																onAction={async () => {
																	if (!module.disabled) {
																		const activatedModule =
																			await postGenericCRUD("Active_Modules", {
																				speccID: speccID,
																				moduleConfigID: module.id,
																			});


																		await refreshInitialData();

																		setActiveModules(
																			activatedModule.data[0].allModules,
																		);
																	}
																}}
															>
																<div className="h-5 w-5 flex justify-center items-center">
																	{getIconForAvailableModule(module.name)}
																</div>
																<span>{module.name}</span>
															</SMenuItem>
														</>
													)
												);
											})}
										</Section>
									</SMenuButton>
								</Group>
								<div class="h-[0px] border-b border-grey-3 my-[8px]" />
								<Group className={"flex flex-col gap-[0px]"}>
									<div class="text-white text-xs font-normal font-['Inter'] leading-[14px] tracking-tight py-[10px]">
										Activate
									</div>

									<SidebarMenuItem
										name="Scheduler"
										onClick={() => {
											//setSelectedMenuItem("Scheduler");
											//schedulerHandler();
											setScheduleModalIsOpen(!scheduleModalIsOpen);
										}}
										isSelected={selectedMenuItem === "Scheduler"}
										icon={getIcon("Scheduler", getIsOKFunction("Scheduler"))}
									/>
									{matchingActivated && <><div class="text-white text-xs font-normal font-['Inter'] leading-[14px] tracking-tight py-[10px]">
										Matching
									</div>
										<SidebarMenuItem
											name="Select Endpoints"
											onClick={matchSelectEndpoint}
											isSelected={selectedMenuItem === "Scheduler"}
											icon={getIcon("Scheduler", getIsOKFunction("Scheduler"))}
										/>
										<SidebarMenuItem
											name="Get data from source"
											onClick={matchGetSourceHandler}
											isSelected={selectedMenuItem === "Scheduler"}
											icon={getIcon("Scheduler", getIsOKFunction("Scheduler"))}
										/>
										<SidebarMenuItem
											name="unique id"
											onClick={matchUniqueId}
											isSelected={selectedMenuItem === "Scheduler"}
											icon={getIcon("Scheduler", getIsOKFunction("Scheduler"))}
										/>
										<SidebarMenuItem
											name="Get data from destination"
											onClick={matchGetDestinationHandler}
											isSelected={selectedMenuItem === "Scheduler"}
											icon={getIcon("Scheduler", getIsOKFunction("Scheduler"))}
										/>
										<SidebarMenuItem
											name="build match"
											onClick={matchBuildHandler}
											isSelected={selectedMenuItem === "Scheduler"}
											icon={getIcon("Scheduler", getIsOKFunction("Scheduler"))}
										/>
										<SidebarMenuItem
											name="results"
											onClick={matchResults}
											isSelected={selectedMenuItem === "Scheduler"}
											icon={getIcon("Scheduler", getIsOKFunction("Scheduler"))}
										/></>}
								</Group>
							</div>
						</>
					) : (
						<>
							<div className="flex flex-col pt-[10px] px-0 collapse-container">
								<Group className="flex flex-col gap-[0px]">
									<div
										onClick={() => {
											setSelectedMenuItem("Upload");
											uploadAPIHandler();
										}}
										onKeyDown={() => {
											setSelectedMenuItem("Upload");
											uploadAPIHandler();
										}}
										className={`p-[10px] h-9 w-10 flex justify-center items-center cursor-pointer hover:bg-grey-3 rounded ${selectedMenuItem === "Upload" ? "bg-grey-3" : ""
											}`}
									>
										{getIcon("Upload")}
									</div>

									<div
										onClick={() => {
											setSelectedMenuItem("Authentication");
											authenticationHandler();
										}}
										onKeyDown={() => {
											setSelectedMenuItem("Authentication");
											authenticationHandler();
										}}
										className={`p-[10px] h-9 w-10 flex justify-center items-center cursor-pointer hover:bg-grey-3 rounded ${selectedMenuItem === "Authentication" ? "bg-grey-3" : ""
											}`}
									>
										{getIcon("Authentication")}
									</div>
								</Group>
								<div class="h-[0px] border-b border-grey-3 my-[8px]" />
								<Group className={"flex flex-col gap-[0px]"}>
									<div
										onClick={() => {
											setSelectedMenuItem("Add nodes");
											addNodesHandler();
										}}
										onKeyDown={() => {
											setSelectedMenuItem("Add nodes");
											addNodesHandler();
										}}
										className={`p-[10px] h-9 w-10 flex justify-center items-center cursor-pointer hover:bg-grey-3 rounded ${selectedMenuItem === "Add nodes" ? "bg-grey-3" : ""
											}`}
									>
										{getIcon("Add nodes")}
									</div>
									<div
										onClick={() => {
											setSelectedMenuItem("Get data");
											getDataHandler();
										}}
										onKeyDown={() => {
											setSelectedMenuItem("Get data");
											getDataHandler();
										}}
										className={`p-[10px] h-9 w-10 flex justify-center items-center cursor-pointer hover:bg-grey-3 rounded ${selectedMenuItem === "Get data" ? "bg-grey-3" : ""
											}`}
									>
										{getIcon("Get data")}
									</div>
									<div
										onClick={() => {
											setSelectedMenuItem("Connect");
											connectHandler();
										}}
										onKeyDown={() => {
											setSelectedMenuItem("Connect");
											connectHandler();
										}}
										className={`p-[10px] h-9 w-10 flex justify-center items-center cursor-pointer hover:bg-grey-3 rounded ${selectedMenuItem === "Connect" ? "bg-grey-3" : ""
											}`}
									>
										{getIcon("Connect")}
									</div>
									<div
										onClick={() => {
											setSelectedMenuItem("Unique Identifier");
											uniqueIdentifierHandler();
										}}
										onKeyDown={() => {
											setSelectedMenuItem("Unique Identifier");
											uniqueIdentifierHandler();
										}}
										className={`p-[10px] h-9 w-10 flex justify-center items-center cursor-pointer hover:bg-grey-3 rounded ${selectedMenuItem === "Unique Identifier"
											? "bg-grey-3"
											: ""
											}`}
									>
										{getIcon("Unique Identifier")}
									</div>
									<div
										onClick={() => {
											setSelectedMenuItem("Test");
											testHandler();
										}}
										onKeyDown={() => {
											setSelectedMenuItem("Test");
											testHandler();
										}}
										className={`p-[10px] h-9 w-10 flex justify-center items-center cursor-pointer hover:bg-grey-3 rounded ${selectedMenuItem === "Test" ? "bg-grey-3" : ""
											}`}
									>
										{" "}
										{getIcon("Test")}
									</div>
									{modules.map(
										(module) =>
											module.isSelected && (
												<div
													key={uuidv4()}
													className="flex items-center gap-[5px] "
												>
													<div
														onClick={() => {
															setSelectedMenuItem(module.name);
															module.onClick();
														}}
														onKeyDown={() => setSelectedMenuItem(module.name)}
														className={`p-[10px] h-9 w-10 flex justify-center items-center cursor-pointer hover:bg-grey-3 rounded ${selectedMenuItem === module.name
															? "bg-grey-3"
															: ""
															}`}
													>
														{getIcon(module.name)}
													</div>
												</div>
											),
									)}
									<SMenuButton
										placement="right"
										popoverClassName="!left-[90px]  !p-[10px] w-[170px] ml-[5px]"
										label={
											<div className="flex items-center gap-[5px] p-[10px] cursor-pointer">
												<Add alt="add" className="icon-grey-5" />
											</div>
										}
										className="flex flex-col gap-[8px]"
									>
										<Section className="pb-[8px]">
											<Header className="p-[5px] text-grey-5">
												<div class="text-[#aeaeae] text-xs font-medium font-['Inter'] leading-3">
													Add module
												</div>
											</Header>
											{modules.map(
												(module) =>
													!module.isSelected && (
														<SMenuItem
															className="flex items-center gap-[5px] !px-[5px] !py-[8px] cursor-pointer"
															key={uuidv4()}
															onAction={() => {
																module.onClick();
																setModules(
																	modules.map((m) =>
																		m.name === module.name
																			? {
																				...m,
																				isSelected: true,
																			}
																			: m,
																	),
																);
															}}
														>
															<div className="h-5 w-5 flex justify-center items-center">
																{module.icon}
															</div>
															<span>{module.name}</span>
														</SMenuItem>
													),
											)}
										</Section>
									</SMenuButton>
								</Group>
								<div class="h-[0px] border-b border-grey-3 my-[8px]" />
								<Group className={"flex flex-col gap-[0px]"}>
									<div
										onClick={() => {
											setSelectedMenuItem("Strategy");
											strategyHandler();
										}}
										onKeyDown={() => {
											setSelectedMenuItem("Strategy");
											strategyHandler();
										}}
										className={`p-[10px] h-9 w-10 flex justify-center items-center cursor-pointer hover:bg-grey-3 rounded ${selectedMenuItem === "Strategy" ? "bg-grey-3" : ""
											}`}
									>
										{getIcon("Strategy")}
									</div>
									<div
										className={
											"p-[10px] h-9 w-10 flex justify-center items-center cursor-pointer hover:bg-grey-3 rounded "
										}
									>
										<Matching
											alt="matching"
											className={`${isAuthenticated
												? "icon-success"
												: isErrored
													? "icon-error"
													: "icon-pink"
												}`}
										/>
									</div>

									<div
										onClick={() => {
											setSelectedMenuItem("Scheduler");
											schedulerHandler();
										}}
										onKeyDown={() => {
											setSelectedMenuItem("Scheduler");
											schedulerHandler();
										}}
										className={`p-[10px] h-9 w-10 flex justify-center items-center cursor-pointer hover:bg-grey-3 rounded ${selectedMenuItem === "Scheduler" ? "bg-grey-3" : ""
											}`}
									>
										{getIcon("Scheduler")}
									</div>
								</Group>
							</div>
						</>
					)}
				</div>
			</SSidebar>
		</div>
	);
}
