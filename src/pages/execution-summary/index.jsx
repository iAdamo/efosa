import SDatePickerRange from "@/components/SDatePickerRange";
import ShowStats from "@/components/ShowStats";
import moment from "moment";
import React from "react";
import { useState } from "react";
import ShowStatChart from "./components/ShowStatsChart";
import { useEffect } from "react";
import { fetchExecutionSummary } from "@/axios/apiCalls";
import successIcon from "@assets/icons/success.svg";
import apiIcon from "@assets/icons/api.svg";
import warningIcon from "@assets/icons/warning-def.svg";
import errorIcon from "@assets/icons/error-new.svg";
import leftArrow from "@assets/icons/left-arrow.svg";
import rightArrow from "@assets/icons/right-arrow.svg";
import openIcon from "@assets/icons/caret-open.svg";
import SSearch from "@/components/SSearch";
import bellIcon from "@assets/icons/bell.svg";
import Notifications from "./components/Notifications";
import SpeccsTable from "./components/SpeccsTable";
import ProjectsTable from "./components/ProjectTable";
import { cloneDeep } from "lodash";

const tabs = ["All", "Live", "Stopped"];
const tableToshow = ["Projects", "Speccs"];
const columns = [
  { label: "Specc", accessor: "specc_name", sortable: true },
  { label: "Project", accessor: "project_name", sortable: false },
  { label: "API 1 Endpoint", accessor: "api_1", sortable: false },
  { label: "API 2 Endpoint", accessor: "api_2", sortable: false },
  { label: "Status", accessor: "isLive", sortable: false },
  { label: "Last Run", accessor: "last_run", sortable: true },
  { label: "Execution", accessor: "execute", sortable: true },
];

const ExecutionSummary = () => {
  const [currentDate, setCurrentDate] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [currentTable, setCurrentTable] = useState("projects");
  const [showNotifications, setShowNotifications] = useState(false);
  const [projectTableData, setProjectTableData] = useState();
  const [statistics, setStatistics] = useState({});
  const [currentSpeccs, setCurrentSpeccs] = useState([]);
  const getProjects = async (type, currentTab) => {
    const start = currentDate ? currentDate?.start || currentDate : null;
    const end = currentDate ? currentDate?.end || currentDate : null;
    const response = await fetchExecutionSummary(type, currentTab, {
      start: start,
      end: end,
    });
    setStatistics(response?.runStatistics);

    if (response?.speccs?.length) {
      transferData("speccs", response);
    } else if (response?.projects?.length) {
      transferData("projects", response);
    }
  };

  const transferData = (type, responseData) => {
    if (type === "speccs") {
      const updatedSpeccs = responseData?.speccs?.map((currentSpeccs) => {
        let latestRunid = 0;

        currentSpeccs?.runs?.forEach((run) => {
          if (run?.id > latestRunid) {
            latestRunid = run?.id;
          }
        });

        const latestRun = currentSpeccs?.runs?.length
          ? moment(
            currentSpeccs?.runs?.find(
              (currentRun) => currentRun?.id === latestRunid
            )?.end
          ).format("DD-MM-YYYY")
          : "--";
        const currentProject = projectTableData?.find(
          (currentProject) =>
            currentProject?.project_id === currentSpeccs?.projectID
        );
        return {
          specc_name: currentSpeccs?.name,
          project_name: currentProject?.project_name,
          api_1: "API 1",
          api_2: "API 2",
          isLive: currentSpeccs?.started ? true : false,
          last_run: latestRun ? latestRun : "--",
          execute: {
            success: currentSpeccs?.runStatistics?.success,
            err: currentSpeccs?.runStatistics?.errors,
            warning: currentSpeccs?.runStatistics?.warnings,
          },
        };
      });

      setCurrentSpeccs(updatedSpeccs);
    }

    if (type === "projects") {
      const transferedData = responseData?.projects?.map((currentProject) => {
        let currentProjectLive = 0;
        let currentProjectStopped = 0;

        currentProject?.speccs?.forEach((currentSpecc) => {
          if (currentSpecc?.started) {
            currentProjectLive += 1;
          } else {
            currentProjectStopped += 1;
          }
        });

        const currentSpeccs = cloneDeep(currentProject?.speccs);

        const updatedSpeccs = currentSpeccs?.map((specc) => {
          let latestRunid = 0;

          specc?.runs?.forEach((run) => {
            if (run?.id > latestRunid) {
              latestRunid = run?.id;
            }
          });

          const latestRun = moment(
            specc?.runs?.find((currentRun) => currentRun?.id === latestRunid)
              ?.end
          ).format("DD-MM-YYYY");

          return {
            id: specc?.id,
            specc_name: specc?.name,
            project_name: currentProject?.name,
            api_1: "API 1",
            api_2: "API 2",
            isLive: specc?.started ? true : false,
            last_run: latestRun ? latestRun : "--",
            execute: {
              success: specc?.runStatistics?.success,
              err: specc?.runStatistics?.errors,
              warning: specc?.runStatistics?.warnings,
            },
          };
        });
        return {
          project_id: currentProject?.id,
          project_name: currentProject?.name,
          api_1: "API Alpha",
          api_2: "API Beta",
          details: {
            live: currentProjectLive,
            no_of_specc: currentProject?.speccs?.length,
            errors: currentProjectStopped,
          },
          isExpanded: false,
          speccs: updatedSpeccs,
        };
      });
      setProjectTableData(transferedData);
    }
  };

  useEffect(() => {
    getProjects("all", "projects");
  }, []);

  const handleSelectChange = (e) => {
    const currentTableSelected = e.target?.value?.toLowerCase();
    setCurrentTable(currentTableSelected);
    getProjects(activeTab, currentTableSelected);
  };

  const increaseCurrentDate = () => {
    const new_date = currentDate ? moment(currentDate).add(1, "days") : moment();
    setCurrentDate(new_date);
    updateExecutionSummary(null, new_date);
  };

  const decreaseCurrentDate = () => {
    const new_date = currentDate ? moment(currentDate).subtract(1, "days") : moment();
    setCurrentDate(new_date);
    updateExecutionSummary(null, new_date);
  };

  const updateExecutionSummary = async (event, updatedDate) => {
    const start = updatedDate ? updatedDate : event?.start || currentDate;
    const end = updatedDate ? updatedDate : event?.end || currentDate;
    const executionSummary = await fetchExecutionSummary(
      activeTab,
      currentTable,
      {
        start: start,
        end: end,
      }
    );
    setStatistics(executionSummary?.runStatistics);
    if (executionSummary?.speccs?.length) {
      transferData("speccs", response);
    } else if (executionSummary?.projects?.length) {
      transferData("projects", response);
    }
  };

  const updateTab = (tabValue) => {
    const currentTabvalue = tabValue?.toLowerCase();
    setActiveTab(currentTabvalue);
    getProjects(currentTabvalue, currentTable);
  };

  return (
    <div className="w-[100vw] h-[100vh] flex p-[20px] overflow-hidden">
      <div className="w-[100%] h-[100%] bg-[#111111] rounded-[10px] flex flex-col gap-[20px] p-[20px]">
        <div className="w-[100%] h-[32px] flex items-center gap-[60px]">
          <span className="text-[14px] font-[700]">
            Execution Summary Overview
          </span>
          <div className="flex items-center gap-2 border border-[#8C8C8C] rounded-md">
            <span
              className="min-w-[40px] h-[32px] flex items-center justify-center border-r border-[#8c8c8c] cursor-pointer"
              onClick={decreaseCurrentDate}
            >
              <img src={leftArrow} className="icon-white" />
            </span>
            <SDatePickerRange
              onChange={(e) => updateExecutionSummary(e)}
              defaultValue={{
                start: currentDate,
                end: currentDate,
              }}
              currentValue={currentDate}
              setCurrentValue={setCurrentDate}
            />
            <span
              className="min-w-[40px] h-[32px] flex items-center justify-center border-l border-[#8c8c8c] cursor-pointer"
              onClick={increaseCurrentDate}
            >
              <img src={rightArrow} />
            </span>
          </div>
        </div>

        <div className="w-[100%] min-h-[130px] flex items-center gap-[20px]">
          <div className="min-w-[40%] h-[100%] flex items-center">
            <div className="w-[50%] min-h-[100%]">
              <ShowStatChart
                successValue={statistics?.success}
                maxValue={statistics?.totalRuns}
                errorValue={statistics?.errors}
                warningValue={statistics?.warnings}
              />
            </div>
            <div className="w-[50%] h-[100%] flex items-center pl-[2.5rem]">
              <div className="flex gap-[10px]">
                <div className="flex-1 flex gap-1">
                  <span className="w-[3px] h-[100%] rounded"
                    style={{
                      background: "linear-gradient(180deg, #00DF9C 0%, #2BFF6B 100%)",
                    }}
                  ></span>
                  <div className="flex flex-col justify-between gap-1">
                    <span className="text-[#00DF9C]">
                      {Math.round(
                        (statistics?.success / statistics?.totalRuns) * 100
                      ) || 0}
                      %
                    </span>
                    <span className="text-grey-4">success</span>
                  </div>
                </div>
                <div className="flex-1 flex gap-1">
                  <span className="w-[3px] h-[100%] rounded"
                    style={{
                      background: "linear-gradient(180deg, #FF3737 0%, #C80025 100%)",
                    }}
                  ></span>
                  <div className="flex flex-col justify-between">
                    <span className="text-[#FF3737]">
                      {Math.round(
                        (statistics?.errors / statistics?.totalRuns) * 100
                      ) || 0}
                      %
                    </span>
                    <span className="text-grey-4">error</span>
                  </div>
                </div>
                <div className="flex-1 flex gap-1">
                  <span className="w-[3px] h-[100%] rounded"
                    style={{
                      background: "linear-gradient(180deg, #FFC011 0%, #FF8533 100%)",
                    }}></span>
                  <div className="flex flex-col justify-between">
                    <span className="text-[#FF9A33]">
                      {Math.round(
                        (statistics?.warnings / statistics?.totalRuns) * 100
                      ) || 0}
                      %
                    </span>
                    <span className="text-grey-4">warning</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="w-[60%] flex gap-[10px]">
            <ShowStats
              header={"TOTAL PROJECTS"}
              value={statistics?.totalRuns}
              bgColor={"#F6C5190D"}
              borderColor={"#F6C519"}
              elipseIconClassname={"icon-yellow-f6c519"}
              iconToShow={apiIcon}
            />
            <ShowStats
              header={"SUCCESSFUL"}
              value={statistics?.success}
              bgColor={"#00DF9C0D"}
              borderColor={"#00DF9C"}
              elipseIconClassname={"icon-success"}
              iconToShow={successIcon}
            />
            <ShowStats
              header={"WARNINGS"}
              value={statistics?.warnings}
              bgColor={"#F6C5190D"}
              borderColor={"#FF9A33"}
              elipseIconClassname={"icon-yellow-2"}
              iconToShow={warningIcon}
            />
            <ShowStats
              header={"ERRORS"}
              value={statistics?.errors}
              bgColor={"#FF37370D"}
              borderColor={"#FF3737"}
              elipseIconClassname={"icon-red"}
              iconToShow={errorIcon}
            />
          </div>
        </div>

        <div className="w-[100%] relative">
          <div className="relative flex w-[600px] gap-[10px] items-center">
            <div className="relative flex gap-[5px] border border-[#8C8C8C] rounded-[5px] items-center">
              <select
                className="appearance-none w-[80px] bg-[#111111] p-2 rounded-md focus:outline-none transition duration-300 ease-in-out"
                defaultValue="projects"
                onChange={handleSelectChange}
              >
                {tableToshow.map((table, index) => (
                  <option key={index} value={table}>
                    {table}
                  </option>
                ))}
              </select>

              <span className="absolute right-[10px]">
                <img src={openIcon} className="icon-white" />
              </span>
            </div>

            <div className="flex-1">
              <SSearch showFull={true} />
            </div>

            <div className="flex min-w-[180px] items-center">
              {tabs?.map((value, idx) => {
                return (
                  <span
                    key={idx}
                    className={`${activeTab === value.toLowerCase()
                      ? "border border-[#F6C519] bg-[#F6C51933] mr-[-0.8px] ml-[-0.80px] z-10"
                      : `border border-[#8C8C8C] ${idx !== tabs.length - 1 ? 'border-r-0' : ''}`
                      } 
                      ${value.toLocaleLowerCase() === 'all' && 'rounded-l'}
                      ${value.toLocaleLowerCase() === 'stopped' && 'rounded-r'}
                      flex-1 flex justify-center p-2  cursor-pointer`}
                    onClick={() => updateTab(value)}
                  >
                    {value}
                  </span>
                );
              })}
            </div>

            <div
              className="relative w-[20px] h-[20px] cursor-pointer"
              onClick={() => {
                setShowNotifications(!showNotifications);
              }}
            >
              <span>
                <img src={bellIcon} />
              </span>

              <span className="absolute top-0 right-0 w-[5px] h-[5px] rounded-[50%] p-1 bg-[#FF3737]"></span>
            </div>
            <div className="absolute top-[50px] right-[-380px]">
              {showNotifications ? (
                <Notifications
                  hardError={0}
                  softError={2}
                  warnings={2}
                  setShowNotifications={setShowNotifications}
                />
              ) : null}
            </div>
          </div>
        </div>

        <div className="w-[100%] overflow-scroll  rounded-md">
          {currentTable === "projects" ? (
            <ProjectsTable
              projectTableData={projectTableData}
              setProjectTableData={setProjectTableData}
            />
          ) : (
            <div className="">
              <SpeccsTable
                columns={columns}
                rows={currentSpeccs}
                isTab={true}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExecutionSummary;
