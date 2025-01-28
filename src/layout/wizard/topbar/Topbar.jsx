import { ProjectContext } from "@/contexts/ProjectContext";
import { WizardContext } from "@/contexts/WizardContext";
import { useContext, useState } from "react";
import Settings from "./Settings";

import { startSpecc, stopSpecc } from "@axios/apiCalls";

import Button from "@/components/Button";
import { promiseToast } from "@/components/toasts/promise-toast";
import useOutsideClickHandler from "@/hooks/useOutsideHandler";
import SchedulingModal from "@/pages/project-integrations/IntegrationModals/Scheduling";
import useGlobalStore from "@/store/globalStore";
import { TOGGLES } from "@/store/uiSlice";
import ChevronDown from "@assets/icons/chevrondownIcon.svg?react";
import RepeatIcon from "@assets/icons/repeatIcon.svg?react";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function Topbar(props) {
  const { sourceAPICustomName, destinationAPICustomName, specc } =
    useContext(ProjectContext);
  const {
    scheduleModalIsOpen,
    setScheduleModalIsOpen,
    setIsSpeccStarted,
    isSpeccStarted,
    schedule,
    sourceAPIName,
    destinationAPIName,
  } = useContext(WizardContext);
  const [apiCallIsRunning, setApiCallIsRunning] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { getAndSetOKStatuses } = useContext(WizardContext);
  const { wizardMode, setToggle, speccID } = useGlobalStore((s) => ({
    wizardMode: s.UI.TOGGLES.WIZARD_MODE,
    setToggle: s.UI.setToggle,
    speccID: s.speccId,
  }));
  const navigate = useNavigate();

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
      myPromise
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

  const getIsOpen = (isOpen) => {
    setScheduleModalIsOpen(isOpen);
  };

  const settingsRef = useRef(null);
  useOutsideClickHandler(settingsRef, async (e) => {
    setIsSettingsOpen(false);
  });

  const schedulerRef = useRef(null);
  useOutsideClickHandler(schedulerRef, async (e) => {
    setScheduleModalIsOpen(false);
  });

  return (
    <div className="flex flex-col gap-s20 items-center z-overlay col-width-[7.8/12] justify-center">
      <div>
        <div className="h-[54px] px-s8 py-s6 xl:py-s10 bg-topBar-gradient rounded-lg shadow-topBar border border-gradient-grey-1 justify-start items-center gap-s12 xl:gap-s24 inline-flex w-full">
          {/* API Name */}
          <div className="w-80 h-s32 flex gap-s4">
            <div className="w-[140px] h-s32 px-s40 py-s8 bg-grey-15 rounded border border-gradient-grey-11 justify-center items-center gap-s10 inline-flex">
              <div className="text-secondary-pink-light-1 text-xs font-semibold font-['Inter'] leading-[14px] tracking-tight">
                {sourceAPIName}
              </div>
            </div>
            <Button
              onClick={() => {
                setIsSettingsOpen(!isSettingsOpen);
              }}
              className={`w-s32 h-s32 group rounded-full flex items-center justify-center bg-grey-15 border-custom-blackPearl 
						hover:bg-source-gradient 
						hover:border-[0px] 
						hover:border-custom-blackPearl 
						hover:p-0.5 
						${isSettingsOpen ? "bg-source-gradient border-custom-blackPearl p-0.5 border-0" : "bg-grey-15 border-2 border-gradient-grey-3"} 
						`}
            >
              <div
                className={`
						group-hover:bg-grey-13 
						group-hover:rounded-full 
						group-hover:flex 
						group-hover:h-full 
						group-hover:w-full 
						group-hover:items-center 
						group-hover:justify-center
						${isSettingsOpen ? " bg-grey-13 rounded-full flex h-full w-full items-center justify-center" : ""}
						`}
              >
                <RepeatIcon className={`icon-grey79 `} />
                <Settings
                  settingsRef={settingsRef}
                  isSettingsOpen={isSettingsOpen}
                  setIsSettingsOpen={setIsSettingsOpen}
                  sourceAPICustomName={sourceAPICustomName}
                  destinationAPICustomName={destinationAPICustomName}
                />
              </div>
            </Button>
            <div className="w-[140px] h-s32 px-s40 py-s8 bg-grey-15 rounded border border-gradient-grey-11 justify-center items-center gap-s10 inline-flex">
              <div className="text-secondary-aqua-1 text-xs font-semibold font-['Inter'] leading-[14px] tracking-tight">
                {destinationAPIName}
              </div>
            </div>
          </div>

          {/* Runs Time */}
          <div className="flex items-center h-full border-l border-gradient-grey-1 pl-s4 max-w-[91px] lg:max-w-full">
            <div className="flex gap-s2">
              <span className="hidden lg:flex lg:text-grey-17 text-sm xl:text-xs font-normal lg:font-['Inter']">
                {" "}
                Runs Every
              </span>
            </div>
            <span className="flex underline underline-offset-2 px-s4 overflow-hidden max-w-[35px] lg:max-w-full">
              <span className="text-custom-ghostWhite text-sm xl:text-xs font-normal font-['Inter'] min-w-max">
                {" "}
                {schedule.every} {schedule.repeat}
              </span>
            </span>
            <div
              className="w-4 h-4"
              onClick={() => setScheduleModalIsOpen(!scheduleModalIsOpen)}
            >
              <ChevronDown className="icon-gray-1" />
            </div>
            <div className="relative">
              {scheduleModalIsOpen && (
                <div className="absolute max-h-[80vh] md:w-[35vw] lg:w-[32vw]  xl:w-[27vw]  z-[100000] top-[30px] left-[-100px] ">
                  <SchedulingModal
                    getIsOpen={getIsOpen}
                    schedulerRef={schedulerRef}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Status */}
          <div className="hidden lg:justify-start lg:items-center lg:gap-1 lg:flex lg:border-l lg:border-gradient-grey-1 lg:pl-s4 lg:h-full">
            <div className="justify-start items-center gap-1 flex">
              <div className="text-[#a8a9ab]  text-sm xl:text-xs font-normal font-['Inter']">
                STATUS :
              </div>
            </div>
            {isSpeccStarted ? (
              <>
                <div className="text-[#85f996]  text-sm xl:text-xs font-semibold font-['Inter'] uppercase leading-[11px] tracking-tight">
                  Live
                </div>
              </>
            ) : (
              <>
                <div className="text-[#f7866a]  text-sm xl:text-xs font-semibold font-['Inter'] uppercase leading-[11px] tracking-tight">
                  Paused
                </div>
              </>
            )}
          </div>
          <div className="justify-start items-center gap-6 flex">
            <div
              className={`cursor-pointer w-max h-8 px-s12 py-s8 ${
                isSpeccStarted ? "from-[#e6719c] to-[#e04fd9]" : "bg-[#454c54]"
              } rounded-lg justify-center items-center gap-3 flex`}
              onClick={() => {
                isSpeccStarted
                  ? clickStopSpecc(speccID)
                  : clickStartSpecc(speccID);
              }}
            >
              <div className="w-4 h-4 relative">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="17"
                  height="16"
                  viewBox="0 0 17 16"
                  fill="none"
                >
                  <path
                    d="M7.16667 2.66602H4.5V13.3327H7.16667V2.66602Z"
                    stroke="#F8F9FA"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M12.5007 2.66602H9.83398V13.3327H12.5007V2.66602Z"
                    stroke="#F8F9FA"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
              <div className="hidden xl:visible xl:flex lg:text-[#f8f9fa] lg:text-xs lg:font-semibold lg:font-['Inter'] lg:leading-[14px] lg:tracking-tight">
                Pause
              </div>
            </div>
          </div>
        </div>
      </div>
      {wizardMode === TOGGLES.WIZARD_MODE.MATCH && (
        <div className="py-[4px] px-[12px] rounded-api-component bg-exit-match-gradient flex gap-[12px] items-center z-overlay">
          <span className="text-custom-blackPearl font-semibold">
            Match mode
          </span>
          <button
            className="bg-custom-blackPearl/90 px-[10px] py-[12px] rounded-api-component"
            onClick={() => {
              setToggle(TOGGLES.WIZARD_MODE.RUN);
              navigate(`/specc/${speccID}/transformation`);
            }}
          >
            Exit
          </button>
        </div>
      )}
    </div>
  );
}
