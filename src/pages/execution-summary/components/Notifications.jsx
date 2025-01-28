import React from "react";
import infoIcon from "@assets/icons/info.svg";
import closeIcon from "@assets/icons/close.svg";
import softErrorIcon from "@assets/icons/soft-error-icon.svg";
import hardErrorIcon from "@assets/icons/hard-error-icon.svg";
import warningIcon from "@assets/icons/elipse-new.svg";
const dummyArray = [
  {
    isError: true,
  },
  {
    isError: true,
  },
  {
    isError: false,
  },
  {
    isError: false,
  },
];
const Notifications = ({
  hardError,
  softError,
  warnings,
  setShowNotifications,
}) => {
  const ShowStats = () => {
    return (
      <div className="flex gap-[20px]">
        <div className="flex gap-[5px] items-center">
          <span>
            {" "}
            <img src={hardErrorIcon} width={10} height={10} />
          </span>
          <span>{hardError}</span>
          <span> Hard Errors </span>
        </div>
        <div className="flex gap-[5px] items-center">
          <span>
            <img src={softErrorIcon} width={10} height={10} />
          </span>
          <span>{softError}</span>
          <span> Soft Errors </span>
        </div>
        <div className="flex gap-[5px] items-center">
          <span>
            {" "}
            <img
              src={warningIcon}
              className="icon-yellow-f6c519"
              width={10}
              height={10}
            />
          </span>
          <span>{warnings}</span>
          <span> Warnings </span>
        </div>
      </div>
    );
  };

  const ShowMessage = ({ isError }) => {
    return (
      <div
        className={`flex p-[10px] gap-[5px] h-fit border rounded-md ${
          isError
            ? "bg-[#C700371A] border-[#FF3737]"
            : "bg-[#FF9A331A] border-[#FF9A33]"
        }`}
      >
        <span className="flex items-start">
          <img
            src={isError ? hardErrorIcon : warningIcon}
            className={`${isError ? "" : "icon-yellow-f6c519"}`}
            width={10}
            height={10}
          />
        </span>

        <div className="flex flex-col font-[500] gap-[5px] text-[12px]">
          <span>Heading For The Error</span>
          <span>Project name | Specc name | 18-08-24 04:00</span>
        </div>
        <div className="flex items-center">
          <div
            className={`text-[12px] w-[84px] h-[22px] flex items-center justify-center rounded-[5px] cursor-pointer ${
              isError ? "bg-[#FF3737]" : "bg-[#FF9A33]"
            }`}
          >
            View Details
          </div>
        </div>
      </div>
    );
  };
  return (
    <div className="w-[400px] h-[310px] flex flex-col gap-[5px] bg-[#2B2B2B] border-[0.5px] border-grey-5 z-10 relative rounded-lg px-2.5 pt-2.5 pb-5">
      <div className="flex justify-between px-2.5 pt-2.5">
        <div className="flex flex-col gap-[5px]">
          <div className="flex gap-[5px]">
            <span className="font-[700] text-[14px]">Updates</span>
            <span>
              <img src={infoIcon} className="icon-grey-5 cursor-pointer" />
            </span>
          </div>

          <span className="text-[#AEAEAE] h-[15px]">
            A list of errors and warnings in your projects and Speccs
          </span>
        </div>

        <span>
          <img
            src={closeIcon}
            className="icon-grey-5 cursor-pointer"
            onClick={() => setShowNotifications(false)}
          />
        </span>
      </div>

      <div className="flex flex-col gap-[10px] px-2.5 pb-1 overflow-y-scroll">
        <ShowStats />
        {dummyArray?.map((crValue) => {
          return <ShowMessage isError={crValue?.isError} />;
        })}
      </div>
    </div>
  );
};

export default Notifications;