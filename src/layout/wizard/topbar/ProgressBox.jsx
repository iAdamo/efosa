import { deleteGenericCRUDWithID, postGenericCRUD } from "@/axios/apiCalls";
import { SMenuButton, SMenuItem } from "@/components/MenuDropdown";
import { ProjectContext } from "@/contexts/ProjectContext";
import { WizardContext } from "@/contexts/WizardContext";
import useGlobalStore from "@/store/globalStore";
import { ELEMENTS, TOGGLES } from "@/store/uiSlice";
import Filter from "@assets/icons/filter.svg?react";
import GroupIcon from "@assets/icons/group.svg?react";
import Modules from "@assets/icons/modules.svg?react";
import Add from "@assets/icons/new-add.svg?react";
import FilterIcon from "@assets/icons/new-filter.svg?react";
import Globe from "@assets/icons/new-globe.svg?react";
import NewGroupIcon from "@assets/icons/new-group.svg?react";
import Schedular from "@assets/icons/new-scheduler.svg?react";
import Question from "@assets/icons/question.svg?react";
import Union from "@assets/icons/union.svg?react";
import Webhook from "@assets/icons/webhook.svg?react";
import SAccordion from "@components/SAccordion";
import SidebarMenuItem from "@components/SSidebar/SidebarMenuItem";
import { errorToast } from "@components/toasts/error-toast";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import KeyboardArrowUpRoundedIcon from "@mui/icons-material/KeyboardArrowUpRounded";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import { styled, Tooltip } from "@mui/material";
import Step from "@mui/material/Step";
import Stepper from "@mui/material/Stepper";
import { useContext, useEffect, useState } from "react";
import { Header, Section } from "react-aria-components";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { useShallow } from "zustand/react/shallow";
import CircularProgressBar from "./CircularProgressBar";
import ColorlibConnector from "./ColorlibConnector";
import { getIcon } from "./progressIcon";
import UniqueIDButton from "./UniqueIDButton";

const selector = (state) => ({
  transferKey: state.transferKey,
  resetTransferKey: state.resetTransferKey,
  activeNodes: state.activeNodes,
  setToggle: state.UI.setToggle,
  setSidebar: state.UI.setSidebar,
  setModal: state.UI.setModal,
  removeModal: state.UI.removeModal,
  selectedModal: state.UI.ELEMENTS.MODAL,
  setSelectedMenuItem: state.UI.setSelectedMenuItem,
  selectedMenuItem: state.UI.selectedMenuItem,
  setPopover: state.UI.setPopover,
});

export default function ProgressBox(props) {
  const { transferKey, resetTransferKey, activeNodes, setToggle, setModal, removeModal, selectedModal, setSelectedMenuItem, selectedMenuItem, setPopover } =
    useGlobalStore(useShallow(selector));

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isErrored, setIsErrored] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCollapsed, setCollapsed] = useState(false);
  const { speccID, project, scheduleModalIsOpen, setScheduleModalIsOpen, availableModules, activeModules, setActiveModules, refreshInitialData } =
    useContext(WizardContext);
  const [uniqueIdentifierIsOpen, setUniqueIdentifierIsOpen] = useState(false);
  const [uniqueIdentifier, setUniqueIdentifier] = useState();
  const { sourceAPICustomName } = useContext(ProjectContext);
  const { sourceAPIName, destinationAPIName } = useContext(WizardContext);

  useEffect(() => {
    console.log("params", window.location.pathname);
    const pathname = window.location.pathname.split("/");
    console.log("params", pathname);
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
    }
  }, []);

  useEffect(() => {
    setUniqueIdentifier(transferKey);
  }, [transferKey]);

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
        return <FilterIcon alt="filters" className="h-s16 w-s16 icon-grey-13 hover-icon-white" />;
      case "GROUPDATA":
        return <NewGroupIcon alt="group" className="h-s16 w-s16 icon-grey-13 hover-icon-white" />;
      case "MANIPULATION":
        return <Question alt="manipulation" className="icon-grey-5" />;
      case "WEBHOOK":
        return <Globe alt="webhook" className="h-s16 w-s16 icon-grey-13 hover-icon-white" />;
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
  ]);

  useEffect(() => {
    setIsAuthenticated(props.isAuthenticated);
    setIsErrored(props.isErrored);
    setIsLoading(props.isLoading);
  }, [props]);

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
      case "Matching":
        return matchingHandler;
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
    isFilterOK,
    setIsFilterOK,
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
      case "Group":
        return isGroupingOK;
      case "Manipulation":
        return null;
      case "Webhook":
        return isWebhookOK;
      case "Filter":
        return isFilterOK;
    }
  };

  const getIconClass = (icon) => {
    return isAuthenticated ? "icon-success" : isErrored ? "icon-error" : icon === selectedMenuItem ? "icon-white" : "icon-grey-5";
  };

  const uploadAPIHandler = () => {
    navigate(`/project/${project.id}/settings`);
  };
  const authenticationHandler = () => {
    navigate(`/project/${project.id}/settings`);
  };
  const addNodesHandler = () => {
    setToggle(TOGGLES.WIZARD_MODE.RUN);
    removeModal();
    navigate(`/specc/${speccID}/transformation`);
    setPopover(null);
  };
  const getDataHandler = () => {
    setModal(ELEMENTS.MODAL.RUN.GET_DATA);
    setPopover(null);
  };
  const connectHandler = () => {
    setToggle(TOGGLES.WIZARD_MODE.RUN);
    removeModal();
    navigate(`/specc/${speccID}/transformation`);
    setPopover(null);
  };
  // const uniqueIdentifierHandler = (e) => {
  //     console.log("uniqueIdentifierHandler", e);
  //     // selectedModal === ELEMENTS.MODAL.RUN.TRANSFER_KEY ? removeModal() : setModal(ELEMENTS.MODAL.RUN.TRANSFER_KEY);
  //     setPopover(ELEMENTS.POPOVER.RUN.TRANSFER_KEY);
  //     setModal(ELEMENTS.POPOVER.RUN.TRANSFER_KEY);
  //     removeModal();
  // };
  const uniqueDestinationIdentifierHandler = () => {
    navigate(`/specc/${speccID}/unique-destination`);
  };
  const testHandler = () => {
    setModal(ELEMENTS.MODAL.RUN.TRANSFER);
    setPopover(null);
  };
  const strategyHandler = () => {
    navigate(`/specc/${speccID}/strategy`);
  };
  const schedulerHandler = () => {
    navigate(`/specc/${speccID}/scheduler`);
  };
  const filterHandler = () => {
    setModal(ELEMENTS.MODAL.RUN.FILTER);
  };
  const manipulationHandler = () => { };
  const groupHandler = () => {
    setModal(ELEMENTS.MODAL.RUN.GROUP);
  };
  const subsetHandler = () => { };
  const webhookHandler = () => {
    setModal(ELEMENTS.MODAL.RUN.WEBHOOK);
  };
  const matchingHandler = () => {
    setToggle(TOGGLES.WIZARD_MODE.MATCH);
    navigate(`/specc/${speccID}/matching/build-match`);
  };

  const webhookModule = activeModules.find((module) => module.config.displayname === "Webhook");

  const handleChange = () => {
    props.setShowTab((prev) => !prev);
  };

  const StyledTooltip = styled(({ className, showTab, ...props }) => (
    <Tooltip
      title={showTab ? "Hide this tab" : "Show this tab"}
      slotProps={{ popper: { sx: { zIndex: 99999 } } }}
      arrow
      placement="bottom"
      {...props}
      classes={{ popper: className }}
    />
  ))`
    & .MuiTooltip-tooltip {
      background: #141619;
      color: #f8f9fa;
      font-size: 10px;
      font-weight: 400;
      margin-top: 2px !important;
      border-radius: 8px;
      padding: 8px;
      box-shadow: 0px 4px 5px 0px #a8a9ab1f;
    }
    & .MuiTooltip-arrow {
      color: #141619;
    }
  `;

  return (
    <>
      <div className="w-full px-s16 py-s12 bg-grey-15 rounded-api-component flex-col justify-start items-start gap-s24 inline-flex relative">
        <div className="h-s16 self-stretch justify-between items-center inline-flex">
          <div className="justify-start items-center gap-2.5 flex">
            <div className="w-4 h-4 relative">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M10 4L6 8L10 12" stroke="#F8F9FA" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </div>
            <div className="justify-start items-center gap-2 flex">
              <div className="w-3 h-4 relative">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="16" viewBox="0 0 12 16" fill="none">
                  <path
                    d="M5.99819 12.8828C4.47545 12.7117 3.32316 11.5549 3.18281 10.1255C3.09909 9.27011 2.46903 8.56692 1.59141 8.56692C0.713784 8.56692 0 9.26598 0 10.1255C0 10.3302 0.0331292 10.5007 0.0945688 10.6417C0.316836 11.2198 0.907138 11.6068 1.59141 11.6841C3.11415 11.8552 4.26644 13.012 4.40679 14.4414C4.49051 15.2968 5.12057 16 5.99819 16C6.87582 16 7.5896 15.3009 7.5896 14.4414C7.5896 14.2951 7.57213 14.17 7.54021 14.0621C7.36372 13.4079 6.73547 12.9654 5.99819 12.8828ZM6.00181 3.11717C7.52455 3.28825 8.67684 4.4451 8.81719 5.87449C8.90091 6.72989 9.53097 7.43308 10.4086 7.43308C11.2862 7.43308 12 6.73402 12 5.87449C12 5.72819 11.9825 5.60313 11.9506 5.49517C11.7741 4.84094 11.1459 4.3985 10.4086 4.31591C8.88585 4.14483 7.73356 2.98798 7.59321 1.55859C7.50949 0.703193 6.87943 0 6.00181 0C5.12418 0 4.4104 0.699063 4.4104 1.55859C4.4104 1.76329 4.44353 1.93378 4.50497 2.07477C4.72724 2.6529 5.31754 3.03989 6.00181 3.11717ZM5.99819 8.63535C4.47545 8.46427 3.32316 7.30743 3.18281 5.87803C3.09909 5.02264 2.46903 4.31945 1.59141 4.31945C0.713784 4.31945 0 5.01851 0 5.87803C0 6.08274 0.0331292 6.25323 0.0945688 6.39422C0.316836 6.97235 0.907138 7.35934 1.59141 7.43662C3.11415 7.6077 4.26644 8.76455 4.40679 10.1939C4.49051 11.0493 5.12057 11.7525 5.99819 11.7525C6.87582 11.7525 7.5896 11.0535 7.5896 10.1939C7.5896 10.0476 7.57213 9.92257 7.54021 9.81462C7.36372 9.16039 6.73547 8.71794 5.99819 8.63535ZM10.4086 8.56338C8.88585 8.3923 7.73356 7.23545 7.59321 5.80606C7.50949 4.95067 6.87943 4.24747 6.00181 4.24747C5.12418 4.24747 4.4104 4.94654 4.4104 5.80606C4.4104 6.01077 4.44353 6.18125 4.50497 6.32225C4.72724 6.90038 5.31754 7.28737 6.00181 7.36465C7.52455 7.53573 8.67684 8.69257 8.81719 10.122C8.90091 10.9774 9.53097 11.6806 10.4086 11.6806C11.2862 11.6806 12 10.9815 12 10.122C12 9.97567 11.9825 9.8506 11.9506 9.74264C11.7741 9.08842 11.1459 8.64597 10.4086 8.56338Z"
                    fill="#A8A9AB"
                  />
                </svg>
              </div>
              <div className="text-[#f8f9fa] text-xs font-medium font-['Inter'] leading-3">Untitled Specc</div>
            </div>
          </div>
          <div className="justify-end items-center gap-1 flex">
            <StyledTooltip showTab={props.showTab}>
              <div className="cursor-pointer relative" onClick={handleChange}>
                {props.showTab ? (
                  <VisibilityOffOutlinedIcon htmlColor="#454C54" sx={{ height: "14px", width: "14px" }} />
                ) : (
                  <RemoveRedEyeOutlinedIcon sx={{ height: "14px", width: "14px" }} />
                )}
              </div>
            </StyledTooltip>
          </div>
        </div>
        <div className="self-stretch justify-start items-center inline-flex">
          <CircularProgressBar value={20} />
          <div className="ml-[21px] text-[#f8f9fa] text-[14px] font-medium font-['Inter']">Progress</div>
        </div>
        <div className="self-stretch flex-col justify-start items-start flex pb-s12 border-b border-grey-9 border-opacity-20">
          <SAccordion
            title={<div className="flex items-center text-lg font-medium font-['Inter']">Universal Settings</div>}
            iconClassName="h-s16 justify-end items-center flex-grow"
            openIcon={<KeyboardArrowDownRoundedIcon fontSize="small" sx={{ color: "#454C54" }} />}
            closeIcon={<KeyboardArrowUpRoundedIcon fontSize="small" sx={{ color: "#454C54" }} />}
            content={
              <>
                <div className="flex flex-col mt-s12 pt-s6 border-t  border-grey-9 border-opacity-20">
                  <div className="rounded cursor-pointer flex-grow hover:bg-gradient-grey-13 bg-opacity-25">
                    <div className="justify-start items-center gap-2 flex py-s6 px-s12">
                      <div className="w-4 h-4 relative">
                        <div className="w-4 h-4 left-0 top-0 absolute rounded-full">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <circle cx="8" cy="8" r="7" stroke="#85F996" stroke-width="2" />
                            <path
                              fill-rule="evenodd"
                              clip-rule="evenodd"
                              d="M11.3744 5.29289C11.7649 5.68342 11.7649 6.31658 11.3744 6.70711L7.70776 10.3738C7.31723 10.7643 6.68407 10.7643 6.29354 10.3738L4.62688 8.70711C4.23635 8.31658 4.23635 7.68342 4.62688 7.29289C5.0174 6.90237 5.65057 6.90237 6.04109 7.29289L7.00065 8.25245L9.96021 5.29289C10.3507 4.90237 10.9839 4.90237 11.3744 5.29289Z"
                              fill="#85F996"
                            />
                          </svg>
                        </div>
                      </div>
                      <div className="text-[#f8f9fa] text-xs font-medium font-['Inter']">Select APIs</div>
                    </div>
                  </div>

                  <div className="rounded cursor-pointer flex-grow hover:bg-gradient-grey-13 bg-opacity-25">
                    <div className="justify-start items-center gap-[8px] flex py-s6 px-s12">
                      <div className="w-4 h-4 relative">
                        <div className="w-4 h-4 left-0 top-0 absolute rounded-full">
                          {getIcon("Authentication", getIsOKFunction("Authentication"), isCollapsed)}
                        </div>
                      </div>
                      <div className="text-[#f8f9fa] text-xs font-medium font-['Inter']">Authentication</div>
                    </div>
                  </div>
                </div>
              </>
            }
            open={true}
            titleClassname="flex "
            accordionClassname="rounded-[10px] flex flex-col w-[28vw]"
          />
        </div>
        <div className="self-stretch flex-col justify-start items-start flex">
          <SAccordion
            title={<div className="flex items-center text-lg font-medium font-['Inter']">Build Specc</div>}
            iconClassName="h-s16 justify-end items-center flex-grow"
            openIcon={<KeyboardArrowDownRoundedIcon fontSize="small" sx={{ color: "#454C54" }} />}
            closeIcon={<KeyboardArrowUpRoundedIcon fontSize="small" sx={{ color: "#454C54" }} />}
            content={
              <>
                <Stepper
                  className="w-full mt-s12 pt-s2 border-t  border-grey-9 border-opacity-20"
                  nonLinear
                  alternativeLabel
                  orientation="vertical"
                  connector={<ColorlibConnector />}>
                  {webhookModule && (
                    <Step className="w-full" completed={getIsOKFunction("Webhook") === "OK"}>
                      <SidebarMenuItem
                        className={"bg-transparent"}
                        name={<div className="text-xs font-medium">Webhook</div>}
                        onClick={() => {
                          setSelectedMenuItem("Webhook");
                          webhookHandler();
                        }}
                        isSelected={selectedMenuItem === "Webhook"}
                        icon={getIcon("Webhook", getIsOKFunction("Webhook"), isCollapsed, selectedMenuItem === "Webhook")}
                        showDelete={true}
                        deleteClick={() => {
                          deleteGenericCRUDWithID("Active_Modules", webhookModule.id);

                          setActiveModules(activeModules.filter((activeModule) => activeModule.id !== webhookModule.id));
                        }}
                      />
                    </Step>
                  )}
                  <Step className="w-full" completed={getIsOKFunction("Add nodes") === "OK"}>
                    <SidebarMenuItem
                      className={"bg-transparent"}
                      name={<div className="text-xs font-medium">Add nodes</div>}
                      onClick={() => {
                        setSelectedMenuItem("Add nodes");
                        addNodesHandler();
                      }}
                      isSelected={selectedMenuItem === "Add nodes"}
                      icon={getIcon("Add nodes", getIsOKFunction("Add nodes"), isCollapsed, selectedMenuItem === "Add nodes")}
                    />
                  </Step>
                  <UniqueIDButton />
                  {activeModules
                    .sort((a, b) => (a.order > b.order ? 1 : -1))
                    .map((module) => {
                      if (module.config.displayname === "Webhook") {
                        return <></>;
                      }
                      return (
                        <Step className="w-full" key={module?.id} completed={getIsOKFunction(module.config.displayname) === "OK"}>
                          <SidebarMenuItem
                            key={uuidv4()}
                            className={"bg-transparent"}
                            showDelete={!!module.config.canBeDeleted}
                            name={
                              <div className="flex text-xs font-medium gap-s10">
                                {module.config.displayname}
                                {(module.config.displayname === "Get data" && sourceAPIName) && (
                                  <div className="bg-secondary-pink-light-1 bg-opacity-15 rounded-base flex px-s2 font-semibold uppercase text-secondary-pink-light-1 text-base">
                                    {sourceAPIName}
                                  </div>
                                )}
                              </div>
                            }
                            onClick={() => {
                              setSelectedMenuItem(module.config.displayname);
                              const clickHandler = getClickHandler(module.config.displayname);
                              clickHandler();
                            }}
                            isSelected={selectedMenuItem === module.config.displayname}
                            icon={getIcon(
                              module.config.displayname,
                              getIsOKFunction(module.config.displayname),
                              isCollapsed,
                              selectedMenuItem === module.config.displayname
                            )}
                            deleteClick={() => {
                              deleteGenericCRUDWithID("Active_Modules", module.id);
                              setActiveModules(activeModules.filter((activeModule) => activeModule.id !== module.id));
                            }}
                          />
                        </Step>
                      );
                    })}
                </Stepper>
              </>
            }
            open={true}
            titleClassname="flex "
            accordionClassname="rounded-[10px] flex flex-col w-[28vw]"
          />
          <SMenuButton
            placement="left"
            popoverClassName="mr-s20 shadow-add-module !p-[10px] w-[228px] ml-[5px] !p-s12 !bg-grey-15"
            label={(isOpen) => (
              <div
                className={`flex mt-s12 h-s28 items-center gap-s8 p-s10 cursor-pointer ${isOpen ? "bg-gradient-grey-13 w-full rounded-base" : "border-t border-b border-gradient-grey-9"}`}>
                <Add alt="add" className={isOpen ? "icon-white" : "icon-grey-13"} />
                <span className={`text-base ${isOpen ? "text-custom-ghostWhite" : "text-gradient-grey-10"} `}>Add Module</span>
              </div>
            )}
            className="flex flex-col gap-s8 w-full">
            <Section className="">
              <Header className="text-grey-5">
                <div class="text-gradient-grey-12 text-sm font-normal font-['Inter'] pb-s12">Drag the module to place it in the process.</div>
              </Header>
              {allNonActivatedModules.map((module) => {
                return (
                  !module.isSelected && (
                    <>
                      <SMenuItem
                        className={`flex group h-s24 items-center mb-s6 gap-s4 !px-s4 hover:!bg-gradient-grey-13 cursor-pointer ${module.disabled ? "line-through" : ""}`}
                        onAction={async () => {
                          if (!module.disabled) {
                            const activatedModule = await postGenericCRUD("Active_Modules", {
                              speccID: speccID,
                              moduleConfigID: module.id,
                            });

                            await refreshInitialData();

                            setActiveModules(activatedModule.data[0].allModules);
                          }
                        }}>
                        <div className="group h-5 w-5 flex justify-center items-center capitalize">{getIconForAvailableModule(module.name)}</div>
                        <span className="text-custom-ghostWhite font-medium text-base">{module.name}</span>
                      </SMenuItem>
                    </>
                  )
                );
              })}
            </Section>
          </SMenuButton>
          <SAccordion
            title={<div className="flex items-center font-medium text-base ">Activate</div>}
            iconClassName="justify-end items-center flex-grow"
            openIcon={<KeyboardArrowDownRoundedIcon fontSize="small" sx={{ color: "#454C54" }} />}
            closeIcon={<KeyboardArrowUpRoundedIcon fontSize="small" sx={{ color: "#454C54" }} />}
            content={
              <div className="pl-s12 flex flex-col gap-s12">
                <div className="flex items-center gap-s8 pt-s12">
                  <Union />
                  <span className="text-custom-patternGrey">Strategy</span>
                </div>
                <div className="flex items-center gap-s8">
                  <Schedular />
                  <span className="text-custom-patternGrey">Scheduler</span>
                </div>
              </div>
            }
            open={true}
            titleClassname="flex border-b border-gradient-grey-9 pb-s4 mt-s20"
            accordionClassname="rounded-[10px] flex flex-col w-[28vw]"
          />
        </div>
      </div>
    </>
  );
}
