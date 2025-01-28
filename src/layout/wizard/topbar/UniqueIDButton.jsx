import { updateDestinationTransferKey, updateSourceTransferKey } from "@/axios/apiCalls";
import SAccordion from "@/components/SAccordion";
import SidebarMenuItem from "@/components/SSidebar/SidebarMenuItem";
import useGlobalStore from "@/store/globalStore";
import { ELEMENTS, TOGGLES } from "@/store/uiSlice";
import FingerScan from "@assets/icons/finger-scan.svg?react";
import { Close } from "@mui/icons-material";
import { Step } from "@mui/material";
import { useCallback, useMemo } from "react";
import { getIcon } from "./progressIcon";

const selector = (state) => ({
  setModal: state.UI.setModal,
  removeModal: state.UI.removeModal,
  setSelectedMenuItem: state.UI.setSelectedMenuItem,
  selectedMenuItem: state.UI.selectedMenuItem,
  setPopover: state.UI.setPopover,
  uniqueIdentifier: state.transferKey,
  selectedPopover: state.UI.ELEMENTS.POPOVER,
  wizardMode: state.UI.TOGGLES.WIZARD_MODE,
  removePopover: state.UI.removePopover,
});

function UniqueIDButton() {
  const { removePopover, removeModal, setSelectedMenuItem, selectedMenuItem, setPopover, uniqueIdentifier, selectedPopover, wizardMode } =
    useGlobalStore(selector);

  const getIsOKFunction = (name) => {
    return "NONE";
  };

  const isMatching = useMemo(() => wizardMode === TOGGLES.WIZARD_MODE.MATCH, [wizardMode]);
  console.log("uniqueIdentifierIsOpen", selectedPopover);
  const uniqueIdentifierIsOpen = useMemo(
    () => selectedPopover === ELEMENTS.POPOVER.RUN.TRANSFER_KEY || selectedPopover === ELEMENTS.POPOVER.MATCH.TRANSFER_KEY,
    [selectedPopover]
  );

  console.log("uniqueIdentifierIsOpen", uniqueIdentifierIsOpen);

  const uniqueIdentifierHandler = useCallback(
    (e) => {
      uniqueIdentifierIsOpen ? removePopover() : setPopover(isMatching ? ELEMENTS.POPOVER.MATCH.TRANSFER_KEY : ELEMENTS.POPOVER.RUN.TRANSFER_KEY);
      removeModal();
    },
    [uniqueIdentifierIsOpen, removePopover, setPopover, isMatching, removeModal]
  );

  const removeUniqueIdentifier = async (endpoint) => {
    let result = null;
    if (endpoint === "SOURCE") {
      result = await updateSourceTransferKey(uniqueIdentifier.id, null, null);
    } else {
      result = await updateDestinationTransferKey(uniqueIdentifier.id, null, null);
    }
    resetTransferKey(result.data);
    return result;
  };

  return (
    <Step className="w-full" completed={getIsOKFunction("Unique Identifier") === "OK"}>
      <SAccordion
        hidePlus={true}
        contentWrapperClassname={`-mt-s10 pt-s10 z-10 ml-[17px] border-l-2 ${getIsOKFunction("Unique Identifier") === "OK" ? "border-secondary-pale-green" : "border-grey-13"}`}
        title={
          <>
            <SidebarMenuItem
              className={"bg-transparent"}
              name={<div className="text-xs font-medium">Unique Identifier</div>}
              icon={getIcon("UniqueID", getIsOKFunction("UniqueID"), false, false)}
              onClick={(e) => {
                setSelectedMenuItem("Unique Identifier");
                uniqueIdentifierHandler(e);
              }}
              isSelected={selectedMenuItem === "Unique Identifier"}
            />
          </>
        }
        content={
          <>
            {uniqueIdentifier?.sourceKeyName && (
              <div className="group m-s10 mb-s4">
                <div className="flex bg-secondary-pink-light-1 bg-opacity-10 justify-between items-center gap-s8 px-s10 py-s8 cursor-pointer border  border-secondary-pink-light-1 group-hover:border-secondary-pink-light-1 rounded-base">
                  <div class="text-white text-xs font-medium font-['Inter'] leading-3">{uniqueIdentifier.sourceKeyName}</div>

                  <div className={"gap-3 items-center flex "}>
                    <FingerScan className="icon-white cursor-pointer mr-0" />
                    <Close onClick={() => removeUniqueIdentifier("SOURCE")} className="icon-white cursor-pointer mr-1" />
                  </div>
                </div>
              </div>
            )}
            {uniqueIdentifier?.destinationKeyName && !isMatching && (
              <div className="group m-[10px] mb-[5px]">
                <div
                  className={`flex bg-secondary-aqua-1 bg-opacity-10 justify-between items-center gap-s8 px-s10 py-s8 cursor-pointer border 
border-secondary-aqua-1
group-hover:border-secondary-aqua-1
rounded-base`}>
                  <div class="text-white text-xs font-medium font-['Inter'] leading-3">{uniqueIdentifier.destinationKeyName}</div>

                  <div className={"gap-3 items-center flex "}>
                    <FingerScan className="icon-white cursor-pointer mr-0" />
                    <Close onClick={() => removeUniqueIdentifier("DESTINATION")} className="icon-white cursor-pointer mr-1" />
                  </div>
                </div>
              </div>
            )}
            {uniqueIdentifier?.matchingKeyName && isMatching && (
              <div className="group m-[10px] mb-[5px]">
                <div
                  className={`flex bg-secondary-aqua-1 bg-opacity-10 justify-between items-center gap-s8 px-s10 py-s8 cursor-pointer border 
border-secondary-aqua-1
group-hover:border-secondary-aqua-1
rounded-base`}>
                  <div class="text-white text-xs font-medium font-['Inter'] leading-3">{uniqueIdentifier.matchingKeyName}</div>

                  <div className={"gap-3 items-center flex "}>
                    <FingerScan className="icon-white cursor-pointer mr-0" />
                    <Close onClick={() => removeUniqueIdentifier("DESTINATION")} className="icon-white cursor-pointer mr-1" />
                  </div>
                </div>
              </div>
            )}
          </>
        }
        open={uniqueIdentifierIsOpen}
        titleClassname="flex flex-grow justify-between items-center cursor-pointer group rounded select-none w-full [&_div]:w-full"
        buttonClassname="flex flex-grow items-center gap-2"
        iconClassName="!w-[0px]"
        toggleAccordion={(e) => {}}
      />
    </Step>
  );
}

export default UniqueIDButton;
