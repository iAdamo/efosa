import React, { useState } from "react";
import plusIcon from "@assets/icons/plus-icon.svg";
import successIcon from "@assets/icons/success.svg";
import apiIcon from "@assets/icons/api.svg";
import errorIcon from "@assets/icons/error-new.svg";
import minusIcon from "@assets/icons/minus-icon.svg";
import SpeccTable from "./SpeccsTable";
import { cloneDeep } from "lodash";
import { useNavigate } from "react-router-dom";

const speccCol = [
  { label: "Specc", accessor: "specc_name", sortable: true },
  { label: "API 1 Endpoint", accessor: "api_1", sortable: false },
  { label: "API 2 Endpoint", accessor: "api_2", sortable: false },
  { label: "Status", accessor: "isLive", sortable: false },
  { label: "Last Run", accessor: "last_run", sortable: true },
  { label: "Execution", accessor: "execute", sortable: true },
];

const ProjectsTable = ({projectTableData, setProjectTableData }) => {

  const navigate = useNavigate();

  const GetBadge = ({ key, value, icon, color, text, badgeClass }) => {
    return (
      <div
        className={`bg-[#111111] text-[${color}] flex items-center 
        gap-[4px] rounded-[22px] pt-[5px] pr-[10px] pb-[5px] pl-[10px]`}
        style={{ color: `${color}` }}
      >
        <span>
          <img
            src={icon}
            alt=""
            width={10}
            height={12}
            className={`${badgeClass}`}
          />
        </span>
        <span>{value}</span>
        <span>{text}</span>
      </div>
    );
  };

  const updateProjectTableData = (project, isExpanded) => {
    let currentProjectInTable = cloneDeep(project);
    let currentProjectTableData = cloneDeep(projectTableData);
    const currentProjectIdx = currentProjectTableData?.findIndex(
      (crProject) => crProject?.project_id === project?.project_id
    );
    currentProjectInTable.isExpanded = isExpanded ? false : true;
    currentProjectTableData?.splice(currentProjectIdx, 1, currentProjectInTable);
    setProjectTableData(currentProjectTableData);
  };

  const Row = ({ rowData }) => {
    
    const keys = rowData?.details ? Object.keys(rowData?.details) : null;
    
    return (
      <div className="flex flex-col gap-2">
        <div
          className={`bg-[#2B2B2B] text-[white] w-[100%] flex items-center justify-between pt-[12px] pr-[16px] pb-[12px] pl-[16px] rounded-md gap-[16px] border border-[#3C3C3C]`}
        >
          <div className="flex">
            <div className="flex gap-2 items-center">
              <span
                className="min-w-[20px] min-h-[15px] flex items-center cursor-pointer"
                onClick={() =>
                  updateProjectTableData(rowData, rowData?.isExpanded)
                }
              >
                <img
                  src={rowData?.isExpanded ? minusIcon : plusIcon}
                  alt=""
                  width={13}
                  height={15}
                />
              </span>

              <span className="min-w-[24px] min-h-[24px]">
                <img
                  src={apiIcon}
                  alt=""
                  width={17}
                  height={20}
                  className="icon-pink"
                />
              </span>
            </div>

            <div className="flex gap-4 items-center">
              <span className="w-[150px] whitespace-nowrap overflow-hidden text-ellipsis" title={`${rowData?.project_name}`}>{rowData?.project_name}</span>

              <div className="flex justify-between">
                <span className="w-[100px] text-[#D32DCA] flex items-start">
                  {rowData?.api_1}
                </span>
                <span className="text-[#00EFD9]">{rowData?.api_2}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-[7px]">
            {keys?.map((key) => {
              return (
                <GetBadge
                  key={key}
                  value={rowData?.details[key]}
                  icon={
                    key === "live"
                      ? successIcon
                      : key === "no_of_specc"
                      ? apiIcon
                      : errorIcon
                  }
                  color={
                    key === "live"
                      ? "#00DF9C"
                      : key === "no_of_specc"
                      ? "#F6C519"
                      : "#FF3737"
                  }
                  text={
                    key === "live"
                      ? "Live"
                      : key === "no_of_specc"
                      ? "Speccs"
                      : "Stopped"
                  }
                  badgeClass={key === "no_of_specc" ? "icon-yellow-f6c519" : ""}
                />
              );
            })}
          </div>
        </div>
        {rowData?.isExpanded ? (
          <div className="overflow-scroll">
            <SpeccTable columns={speccCol} rows={rowData?.speccs} handleRowClick={(speccId) => navigate(`/execution-summary/details/${speccId}`)} />
          </div>
        ) : null}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-3 p-2">
      {projectTableData?.map((row) => {
        return <Row rowData={row} />;
      })}
    </div>
  );
};

export default ProjectsTable;
