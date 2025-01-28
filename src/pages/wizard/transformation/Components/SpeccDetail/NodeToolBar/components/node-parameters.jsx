import STooltip from "@components/STooltip";
import check from "@assets/icons/tick.svg";
import info from "@assets/icons/info.svg";
import Insert from "@assets/icons/insert.svg";
import {
  sourceTextColor,
  destinationTextColor,
  destinationIconClass,
} from "./color-variables";
import {
  Button,
  OverlayArrow,
  Tooltip,
  TooltipTrigger,
} from "react-aria-components";
import SInput from "@/components/SInput";
import { postGenericCRUDWithID } from "@/axios/apiCalls";
import React, { useState } from "react";
import { useContext } from "react";
import { WizardContext } from "@/contexts/WizardContext";

import { toKeys, typeColors } from "@/constants";
import { SCheckbox } from "@components/SCheckbox.jsx";

export default function NodeParameters({ ...props }) {
  console.log("NodeParameters", props);

  const filteredParams = props.selectedOnly
    ? props.params.filter((item) =>
      props.activeFields.some((field) => field.name === item.name)
    )
    : props.params;

  return (
    <div className="flex flex-col node-param-container">
      {!!props.params.length ? (
        props.params.map((item, index) => {
          if (props.selectedOnly === true) {
            const activeField = props.activeFields.find((field) => {
              return field.name === item.name;
            });
            console.log("find result", activeField);
            if (activeField != null) {
              return paramInfo(
                item,
                index,
                props.isSource,
                true,
                props.toggleParameter,
                activeField,
                props.isShowModal,
                props.directionInfo
              );
            }
          } else {
            return paramInfo(
              item,
              index,
              props.isSource,
              props.activeFields.filter((field) => {
                return field.name === item.name;
              }).length > 0,
              props.toggleParameter,
              props.activeFields.find((field) => {
                return field.name === item.name;
              }),
              props.isShowModal,
              props.directionInfo
            );
          }
        })
      ) : (
        <div className="text-grey-7 text-[12px] font-medium font-['Inter'] text-center mt-[10px]">
          No parameters available
        </div>
      )}
    </div>
  );
}

const paramInfo = (
  item,
  index,
  isSource,
  isSelected,
  toggleParameter,
  activeField,
  isShowModal = false,
  directionInfo
) => {
  const { activeFields, setActiveFields } = useContext(WizardContext);

  const changeDefaultValue = async (e) => {
    await postGenericCRUDWithID("Active_Fields", activeField.id, {
      defaultValue: e.target.value,
    });

    const newListOfFields = activeFields.map((field) => {
      if (field.id === activeField.id) {
        field.defaultValue = e.target.value;
      }
      return field;
    });
    setActiveFields(newListOfFields);
  };

  const [isDefaultValueOpen, setDefaultValueOpen] = useState(
    activeField?.defaultValue ? true : false
  );

  return (
    <TooltipTrigger>
      <div className="flex">
        <div className="flex-grow flex">
          {isShowModal ? <div key={index} className='w-full p-[10px] h-full flex items-start gap-[30px]'>
            <div className="max-w-[120px] w-full flex items-center gap-[10px] font-bold">
              <SCheckbox
                isSelected={!!isSelected}
                value="isBasicAuth"
                className={directionInfo.checkboxClass}
                onChange={(isChecked) => {
                  toggleParameter(item.name, isChecked);
                }}
              />
              <div className='flex flex-col items-start break-all'>
                {item.name}
                <span className='text-[10px] font-medium text-[#FF9A33]'>required</span>
              </div>
            </div>
            <div className='w-full flex meatballs-view flex-col items-start'>
              <div className="flex gap-[5px] items-center">
                <div
                  className={`w-[6px] h-[6px] ${item.type === "string"
                      ? "bg-[#ee6b7e]"
                      : item.type === "integer"
                        ? "bg-[#9f4df8]"
                        : item.type === "number"
                          ? "bg-[#00df9c]"
                          : item.type === "boolean"
                            ? "bg-[#2f9bff]"
                            : "bg-[#ff0000]"
                    } rounded`}
                />
                <span
                  className="text-[#AEAEAE] text-[10px] font-medium font-['Inter']">
                  {item.type}
                </span>
              </div>

              {item.enum && <div className="mb-[5px]">
                <span className="text-[#AEAEAE] text-[11px] font-medium font-['Inter'] mr-[30px]">
                  Enum:
                </span>
                {["ECOM", "RECURRING"].map((item, index) => (
                  <span
                    key={index}
                    className="bg-grey-2 text-grey-6 px-[5px] ml-[10px]"
                  >
                    {`"${item}"`}
                  </span>
                ))}
              </div>}
            </div>
          </div> :
            <Button className={"flex-grow"}>
              <STooltip
                shouldOpen={!!item.description}
                content={
                  <div className="py-[12px] px-[16px]">
                    <div class=" text-neutral-200 text-xs font-medium leading-tight tracking-tight">
                      {item.name}
                    </div>
                    <div
                      class={`py-[7px] text-xs font-normal leading-tight tracking-tight ${isSource ? sourceTextColor : destinationTextColor
                        }`}
                    >
                      {item.type}
                    </div>
                    <div class=" text-neutral-200 text-xs font-normal font-['Inter'] leading-tight tracking-tight">
                      {item.description
                        ? item.description.replaceAll("<br>", "\n")
                        : ""}
                    </div>
                  </div>
                }
              />
              {/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
              <div
                onClick={() => {
                  toggleParameter(item.name);
                }}
                class="flex justify-between items-start py-[10px] px-[5px] group hover:bg-[#2B2B2B80] hover:rounded-[5px] cursor-pointer hover-div"
              >
                <div className="flex gap-[10px] items-start">
                  {isSelected ? (
                    <img
                      src={check}
                      alt={check}
                      className={`${isSource ? "icon-grey-5" : destinationIconClass
                        }`}
                      width="22px"
                      height="22px"
                    />
                  ) : (
                    <div className="w-[22px] h-[22px] text-transparent">Hwy</div>
                  )}
                  <div className="flex flex-col items-start gap-[4px]">
                    <div className="flex items-center gap-[4px]">
                      <div
                        className={`w-[10px] h-[10px] ${item.type === "string"
                            ? "bg-[#ee6b7e]"
                            : item.type === "integer"
                              ? "bg-[#9f4df8]"
                              : item.type === "number"
                                ? "bg-[#00df9c]"
                                : item.type === "boolean"
                                  ? "bg-[#2f9bff]"
                                  : "bg-[#ff0000]"
                          }  rounded mr-[5px]`}
                      />
                      <div class="text-zinc-400 text-[14px] font-normal font-['Inter'] leading-[14px] tracking-tight">
                        {item.name}
                      </div>
                    </div>
                  </div>
                </div>
                <img
                  src={info}
                  alt={check}
                  className="hidden group-hover:block icon-grey-5"
                  width="10px"
                  height="10px"
                />
              </div>
            </Button>}
        </div>
        {isSelected && !isShowModal && (
          <>
            <div className="flex flex-col  justify-center">
              {isDefaultValueOpen ? (
                <>
                  <div>
                    <img
                      src={Insert}
                      alt={check}
                      className="icon-grey-9 inline mr-[5px]"
                      width="10px"
                      height="10px"
                      onClick={async () => {
                        await postGenericCRUDWithID(
                          "Active_Fields",
                          activeField.id,
                          {
                            defaultValue: null,
                          }
                        );

                        const newListOfFields = activeFields.map((field) => {
                          if (field.id === activeField.id) {
                            field.defaultValue = null;
                          }
                          return field;
                        });
                        setActiveFields(newListOfFields);

                        setDefaultValueOpen(!isDefaultValueOpen);
                      }}
                    />
                    Default value
                  </div>
                  <SInput
                    className="w-[100px] h-[10px] s-search-mint"
                    defaultValue={activeField.defaultValue}
                    onBlur={(e) => {
                      changeDefaultValue(e);
                    }}
                  />
                </>
              ) : (
                <img
                  src={Insert}
                  alt={check}
                  className="icon-grey-9 inline mr-[5px]"
                  width="15px"
                  height="15px"
                  onClick={() => {
                    setDefaultValueOpen(!isDefaultValueOpen);
                  }}
                />
              )}
            </div>
          </>
        )}
      </div>
    </TooltipTrigger>
  );
};
