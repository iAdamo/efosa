import React from "react";
import ElipseIcon from "@assets/icons/elipse-new.svg";

const ShowStats = ({
  header,
  value,
  borderColor,
  bgColor,
  elipseIconClassname,
  iconToShow
}) => {
  return (
    <div
      className={`w-[100%] h-[90px] flex flex-col gap-[10px] justify-between p-5 bg-[${bgColor || "#000000"
        }] border-[2px] border-[${borderColor}] rounded-lg`}
      style={{ background: bgColor }}
    >
      <div className="flex justify-between">
        <div className="flex gap-2 items-center">
          <span>
            <img src={ElipseIcon} className={`${elipseIconClassname}`} />
          </span>
          <span className="text-[12px] w-fit text-grey-5 font-semibold">{header}</span>
        </div>
        <span>
          <img src={iconToShow} className={`${elipseIconClassname}`} style={{ width: '16px', height: '20px' }} />
        </span>
      </div>

      <div className="">
        <span className="text-[20px] font-medium">{value}</span>
      </div>
    </div>
  );
};

export default ShowStats;
