import React from "react";
import successIcon from "@assets/icons/success.svg";
import warningIcon from "@assets/icons/warning-yellow.svg";
import errorIcon from "@assets/icons/error-new.svg";
import { useState } from "react";
import { useEffect } from "react";

const SpeccsTable = ({ columns, rows, isTab, handleRowClick }) => {
  const [speccs, setSpeccs] = useState(rows);

  useEffect(() => {
    if (isTab && rows?.length) {
      setSpeccs(rows);
    }
  }, [rows]);

  const Header = ({ columns }) => {
    return (
      <div className="bg-[#111] text-[white] w-full font-[700] flex items-center pt-[12px] pr-[16px] pb-[12px] pl-[16px] border-x border-t border-[#3C3C3C] rounded-t">
        {columns?.map((col) => {
          return (
            <div className={`w-[25%] h-fit flex`}>
              {col.label}
            </div>
          );
        })}
      </div>
    );
  };

  const GetBadge = ({
    isLive,
    badgeIcon,
    badgeText,
    textColor,
    badgeIconClass,
    bgColor,
    badgeKey,
  }) => {

    if ((badgeKey === "err" && badgeText === 0) || (badgeKey === "warning" && badgeText === 0)) {
      return null;
    }

    return isLive ? (
      <span className="-space-x-4  text-[11px] justify-center pr-[5px] pb-[1px] pl-[5px] border border-[#00DF9C] font-[600] text-[#00DF9C] rounded-[5px] ">
        LIVE
      </span>
    ) :
      (<div
        className={`flex gap-[4px] items-center pt-[5px] pr-[10px] pb-[5px] pl-[10px] rounded-[22px]`}
        style={{ background: `${bgColor}` }}
      >
        <span>
          <img src={badgeIcon} className={`${badgeIconClass} h-[15px] w-[15px]`} alt="" />
        </span>
        <span style={{ color: `${textColor}` }}>
          {badgeText === true ? "500" : badgeText}
        </span>
      </div>)
  };

  const ShowExecutions = ({ stats }) => {
    const keys = stats ? Object.keys(stats) : null;
    return (
      <div className="flex gap-[10px]">
        {keys?.map((badgeKey) => {
          return (
            <GetBadge
              badgeKey={badgeKey}
              isExecution={true}
              badgeIcon={
                badgeKey === "success"
                  ? successIcon
                  : badgeKey === "err"
                    ? errorIcon
                    : warningIcon
              }
              bgColor={
                badgeKey === "success"
                  ? "#005C404D"
                  : badgeKey === "err"
                    ? "#C700374D"
                    : "#FF9A334D"
              }
              textColor={
                badgeKey === "success"
                  ? "#00DF9C"
                  : badgeKey === "err"
                    ? "#FF3737"
                    : "#FF9A33"
              }
              badgeText={stats ? stats[badgeKey] : ""}
              badgeIconClass={badgeKey === "warning" ? "icon-yellow-2" : ""}
            />
          );
        })}
      </div>
    );
  };

  const Row = (props) => {
    const { rowData, rowOnClick } = props
    return (
      <div
        className={`bg-[#111] text-[white] cursor-pointer flex items-center pt-[12px] pr-[16px] pb-[12px] pl-[16px] w-full border border-[#3C3C3C]`}
        onClick={() => {
          rowOnClick?.(rowData.id)
        }}
      >
        {columns?.map((col, index) => {
          return (
            <span
              key={index}
              className={`w-[25%] h-max ${col.accessor === "isLive" ? "" : "overflow-hidden"
                } whitespace-nowrap text-ellipsis ${col.accessor === "api_1"
                  ? "text-[#D32DCA]"
                  : col.accessor === "api_2"
                    ? "text-[#00EFD9]"
                    : ""
                }`}
              title={`${rowData[col.accessor]}`}
            >
              {col.accessor === "isLive" ? (
                <GetBadge isLive={rowData[col.accessor]} />
              ) : col.accessor === "execute" ? (
                <ShowExecutions stats={rowData[col.accessor]} />
              ) : (
                rowData[col.accessor]
              )}
            </span>
          );
        })}
      </div>
    );
  };
  return speccs?.length ? (
    <div className="overflow-auto">
      <Header columns={columns} />
      {speccs?.map((row) => {
        return <Row rowData={row} rowOnClick={handleRowClick} />;
      })}
    </div>
  ) : (
    <span className="flex items-center justify-center"> No Data </span>
  );
};

export default SpeccsTable;
