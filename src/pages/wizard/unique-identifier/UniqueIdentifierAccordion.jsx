import SAccordion from "@/components/SAccordion";
import STooltip from "@/components/STooltip";
import { getNodeName } from "@/utils/nodeComponentHelpers";
import InfoIcon from "@assets/icons/infoIconDetails.svg?react";
import Tick from "@assets/icons/new-tick.svg?react";
import { useEffect, useRef } from "react";
import { Button, TooltipTrigger } from "react-aria-components";
import { v4 as uuidv4 } from "uuid";

export default function UniqueIdentifierAccordion({ endpoint, apiObject, item, paramListRef, isOpen, setNewUniqueClick, transferKey, isMatching }) {
  const ref = useRef(null);

  useEffect(() => {
    if (item.keyID) {
      const key = item.keyID;
      if (ref.current) {
        paramListRef.current[key] = ref.current;
      }
      return () => {
        delete paramListRef.current[key];
      };
    }
  }, [ref.current, item.keyID]);

  const isUniqueParam = (apiObject, item, param, endpoint) => {
    if (isMatching) {
      return transferKey && transferKey.matchingKeyNodeID === item.keyID && transferKey.matchingKeyName === param;
    } else if (endpoint === "SOURCE") {
      return transferKey && transferKey.sourceKeyNodeID === item.keyID && transferKey.sourceKeyName === param;
    }
    return transferKey && transferKey.destinationKeyNodeID === item.keyID && transferKey.destinationKeyName === param;
  };

  return (
    <div id={item.keyID} ref={ref}>
      <SAccordion
        title={
          <div class={` text-lg font-bolder font-['Inter'] ${endpoint === "SOURCE" ? "text-secondary-pink-light-1" : "text-secondary-aqua-1"}`}>
            {getNodeName(item, true)}
          </div>
        }
        open={isOpen}
        contentClassname={"mt-s4"}
        content={
          item.params.length > 0 ? (
            item.params.map((param, index) => {
              return (
                <div key={uuidv4()} className="flex flex-col h-8 justify-center">
                  <TooltipTrigger delay={0} closeDelay={0} trigger="hover">
                    <Button className={"flex justify-between items-center w-full h-full"}>
                      <STooltip
                        placement="bottom"
                        shouldOpen={true}
                        containerClassName="top-[12px] !right-0 left-[-20px] !w-[18vw]"
                        content={
                          <div className="p-2">
                            <div class=" text-neutral-200 text-xs font-medium leading-tight tracking-tight">{param.name}</div>
                            <div
                              class={`py-[7px] text-xs font-normal leading-tight tracking-tight ${
                                endpoint === "SOURCE" ? "text-main-pink-1" : "text-secondary-mint-green"
                              }`}>
                              {param.type}
                            </div>
                            <div class=" text-neutral-200 text-xs font-normal font-['Inter'] leading-tight tracking-tight break-words">{param.description}</div>
                          </div>
                        }
                      />

                      <div
                        onClick={() => {
                          setNewUniqueClick(item.keyID, param.name, endpoint, isMatching);
                        }}
                        onKeyDown={() => {
                          setNewUniqueClick(item.keyID, param.name, endpoint, isMatching);
                        }}
                        key={uuidv4()}
                        className="group h-full w-full">
                        <div
                          className={`h-full w-full flex justify-between items-center gap-s8 px-s4 py-s8 cursor-pointer border 
                             ${
                               isUniqueParam(apiObject, item, param.name, endpoint)
                                 ? endpoint === "SOURCE"
                                   ? "border-secondary-pink-light-1 bg-main-pink-8"
                                   : "border-secondary-aqua-1 bg-secondary-aqua"
                                 : "border-transparent"
                             } ${
                               endpoint === "SOURCE"
                                 ? "group-hover:border-secondary-pink-light-1 group-hover:bg-main-pink-8"
                                 : "group-hover:border-secondary-aqua-1 group-hover:bg-secondary-aqua"
                             }  rounded-base capitalize`}>
                          <div className="flex gap-s4 items-center w-full">
                            {isUniqueParam(apiObject, item, param.name, endpoint) && <Tick className={endpoint === "SOURCE" ? "icon-pink-1" : "icon-aqua-1"} />}
                            <div class="text-white text-xs font-normal font-['Inter'] leading-3 w-full truncate text-left">{param.name}</div>
                          </div>

                          <div className={` ${isUniqueParam(apiObject, item, param.name, endpoint) ? "flex" : "hidden"}  gap-4 items-center group-hover:flex `}>
                            <InfoIcon className="icon-white cursor-pointer" />
                          </div>
                        </div>
                      </div>
                    </Button>
                  </TooltipTrigger>
                </div>
              );
            })
          ) : (
            <div className="flex items-center justify-center">
              <div className="text-neutral-200 text-xs font-normal leading-tight tracking-tight break-words">No parameters available</div>
            </div>
          )
        }
      />
    </div>
  );
}
