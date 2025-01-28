import SidebarMenuItem from "@/components/SSidebar/SidebarMenuItem";
import { ProjectContext } from "@/contexts/ProjectContext";
import useGlobalStore from "@/store/globalStore";
import { ELEMENTS } from "@/store/uiSlice";
import { Step, Stepper } from "@mui/material";
import { useContext, useState } from "react";
import ColorlibConnector from "./ColorlibConnector";
import { getIcon } from "./progressIcon";
import UniqueIDButton from "./UniqueIDButton";

function MatchProgressBox() {
  const { sourceAPICustomName, destinationAPICustomName } = useContext(ProjectContext);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { setSidebar, setModal, removeModal, transferData } = useGlobalStore((s) => ({
    setSidebar: s.UI.setSidebar,
    setModal: s.UI.setModal,
    removeModal: s.UI.removeModal,
    transferData: s.cache.MATCH.TRANSFER,
  }));

  const getIsOKFunction = (name) => {
    return "NONE";
  };

  const actions = [
    {
      label: (
        <span>
          Add <span>{destinationAPICustomName}</span> node
        </span>
      ),
      id: "addDestinationNode",
    },
    {
      label: (
        <span>
          Get data <span>{sourceAPICustomName}</span>
        </span>
      ),
      id: "getSourceData",
    },
    {
      label: (
        <span>
          Get data <span>{destinationAPICustomName}</span>
        </span>
      ),
      id: "getDestinationData",
    },
    { label: <span>Build Match</span>, id: "buildMatch" },
    { label: <span>Results</span>, id: "results" },
  ];

  if (transferData !== null) {
    actions.push({ label: <span>Results from only {sourceAPICustomName}</span>, id: "transfer" });
  }

  const handleClick = (id) => {
    switch (id) {
      case "addDestinationNode":
        setModal(ELEMENTS.MODAL.MATCH.ADD_NODE_DESTINATION);
        break;
      case "getSourceData":
        setModal(ELEMENTS.MODAL.MATCH.GET_DATA_SOURCE);
        break;
      case "getDestinationData":
        setModal(ELEMENTS.MODAL.MATCH.GET_DATA_DESTINATION);
        break;
      case "setUniqueID":
        setModal(ELEMENTS.MODAL.MATCH.TRANSFER_KEY);
        break;
      case "buildMatch":
        removeModal();
        break;
      case "results":
        setModal(ELEMENTS.MODAL.MATCH.RESULTS);
        break;
      case "transfer":
        setModal(ELEMENTS.MODAL.MATCH.TRANSFER);
        break;
      default:
        break;
    }
  };
  return (
    <div className="px-[18px] py-3 bg-[#1e2125] rounded-lg flex-col justify-start items-start gap-2 inline-flex relative">
      <span>Matching</span>
      <div className="flex flex-col gap-[24px]">
        <Stepper
          className="w-full mt-s12 pt-s2 border-t  border-grey-9 border-opacity-20"
          nonLinear
          alternativeLabel
          orientation="vertical"
          connector={<ColorlibConnector />}>
          {actions.slice(0, 3).map((action) => (
            <Step className="w-full" completed={getIsOKFunction("Webhook") === "OK"}>
              <SidebarMenuItem
                className={"bg-transparent"}
                name={<div className="text-xs font-medium">{action.label}</div>}
                onClick={() => {
                  handleClick(action.id);
                }}
                isSelected={false}
                icon={getIcon("Webhook", getIsOKFunction("Webhook"), isCollapsed, false)}
              />
            </Step>
          ))}
          <UniqueIDButton />
          {actions.slice(3).map((action) => (
            <Step className="w-full" completed={getIsOKFunction("Webhook") === "OK"}>
              <SidebarMenuItem
                className={"bg-transparent"}
                name={<div className="text-xs font-medium">{action.label}</div>}
                onClick={() => {
                  handleClick(action.id);
                }}
                isSelected={false}
                icon={getIcon("Webhook", getIsOKFunction("Webhook"), isCollapsed, false)}
              />
            </Step>
          ))}
        </Stepper>
      </div>
    </div>
  );
}

export default MatchProgressBox;
