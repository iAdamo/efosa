import { runTransfer } from "@/axios/matchAPICalls";
import ErrorMessage from "@/components/Alerts/ErrorMessage";
import Button from "@/components/Button";
import CustomInput from "@/components/CustomInput";
import CustomLoader from "@/components/CustomLoader";
import Pagination from "@/components/CustomPagination";
import NestedGrid from "@/components/NestedGrid/NestedGrid";
import { DataContext } from "@/contexts/DataContext";
import { ProjectContext } from "@/contexts/ProjectContext";
import useGlobalStore from "@/store/globalStore";
import { TOGGLES } from "@/store/uiSlice";
import apiIcon from "@assets/icons/api.svg";
import ApiIcon from "@assets/icons/api.svg?react";
import NewTag from "@assets/icons/new-tag.svg";
import { getModuleInput, runModule } from "@axios/apiCalls";
import TextLoaders from "@components/loaders/TextLoaders";
import { WizardContext } from "@contexts/WizardContext";
import KeyboardDoubleArrowLeftRoundedIcon from "@mui/icons-material/KeyboardDoubleArrowLeftRounded";
import KeyboardDoubleArrowRightRoundedIcon from "@mui/icons-material/KeyboardDoubleArrowRightRounded";
import { styled, Tooltip } from "@mui/material";
import { cloneDeep } from "lodash";
import { useContext, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useShallow } from "zustand/react/shallow";
import Expandable from "../get-data/Expandable";
import GetData from "../get-data/GetData";

const navigation = "TRANSFER";

const selector = (state) => ({
  selectedExecutionHash: state.selectedExecutionHash,
  removeModal: state.UI.removeModal,
  setSelectedMenuItem: state.UI.setSelectedMenuItem,
  wizardMode: state.UI.TOGGLES.WIZARD_MODE,
  transferData: state.cache.MATCH.TRANSFER,
  speccID: state.speccId,
});

export default function TransferPage({ renderFromDetails = false, transferListModuleResponse }) {
  const { meatballs, activeModules, setMeatballs, getAndSetOKStatuses } = useContext(WizardContext);
  const { control, setValue, handleSubmit } = useForm();
  const [moduleInputResponse, setModuleInputResponse] = useState(null);
  const [responseData, setResponseData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [transferExpanded, setTransferExpanded] = useState(true);
  const [responseExpanded, setResponseExpanded] = useState(false);
  const [detailsresponseExpanded, setDetailsResponseExpanded] = useState(true);

  const [currentDataAction, setCurrentDataAction] = useState([]);
  const [lastExpanded, setLastExpanded] = useState([]);
  const [expandedMeatballs, setExpandedMeatballs] = useState(true);
  const [parentNode, setParentNode] = useState(null);
  const { destinationActiveNodesFiltered } = useContext(DataContext);
  const [hovered, setHovered] = useState(false);
  const [showMsg, setShowMsg] = useState(true);
  const [errors, setErrors] = useState(null);
  const [detailsResponseList, setDetailsResponseList] = useState([]);
  const [moduleResponse, setModuleResponse] = useState(null);
  const { sourceAPICustomName, destinationAPICustomName } = useContext(ProjectContext);

  let module = null;
  const { wizardMode, transferData, selectedExecutionHash, speccID } = useGlobalStore(useShallow(selector));

  useEffect(() => {
    setDetailsResponseList([]);
  }, [selectedExecutionHash]);

  const parentNodeMeatballs = meatballs.filter((meatball) => {
    return meatball.nodeID === parentNode?.id;
  });

  const isMatching = useMemo(() => wizardMode === TOGGLES.WIZARD_MODE.MATCH, [wizardMode]);

  useEffect(() => {
    let parentNode = null;
    for (let i = 0; i < destinationActiveNodesFiltered.length; i++) {
      if (destinationActiveNodesFiltered[i].parentNode == null && !destinationActiveNodesFiltered[i].isPostResponse) {
        parentNode = destinationActiveNodesFiltered[i];
        break;
      }
    }
    if (!parentNode) {
      return;
    } else {
      setParentNode(parentNode);
    }
  }, []);

  for (let i = 0; i < activeModules.length; i++) {
    if (activeModules[i].config.name === navigation) {
      module = activeModules[i];
      break;
    }
  }

  if (!module) {
    return <>No module!</>;
  }

  const collapseLastExpanded = () => {
    const latestExpandedComp = cloneDeep(lastExpanded[lastExpanded?.length > 1 ? lastExpanded?.length - 2 : 0]);
    if (latestExpandedComp === "transform") {
      setTransferExpanded(false);
    }

    if (latestExpandedComp === "response") {
      setResponseExpanded(false);
    }

    if (latestExpandedComp === "meatballs") setExpandedMeatballs(false);
  };

  useEffect(() => {
    const allExpanded = [];
    if (transferExpanded) allExpanded.push(true);

    if (responseExpanded) allExpanded.push(true);

    if (expandedMeatballs) allExpanded.push(true);

    if (allExpanded?.length > 2) collapseLastExpanded();
  }, [transferExpanded, responseExpanded, expandedMeatballs]);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        if (isMatching) {
          const moduleResponseAnswer = {
            isUseable: true,
            listOfDataObjects: transferData.map((row) => ({ datarow: row })),
          };
          setModuleInputResponse(moduleResponseAnswer);
          //set all index as checked
          setCurrentDataAction(moduleResponseAnswer?.listOfDataObjects.map((_, idx) => idx));
        } else {
          const moduleResponseInputAnswer = await getModuleInput(speccID, module.id);
          if (!("found" in moduleResponseInputAnswer)) {
            setModuleInputResponse(moduleResponseInputAnswer);
          }
        }
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    })();
  }, []);

  const loaderDiv = () => (
    <div className="flex flex-col gap-3 px-3 h-[100%] w-[100%] mt-3">
      <TextLoaders count={5} containerClassName={"flex gap-2 h-[30px]"} />
      <TextLoaders count={5} containerClassName={"flex gap-2"} />
      <TextLoaders count={5} containerClassName={"flex gap-2"} />
      <TextLoaders count={5} containerClassName={"flex gap-2"} />
      <TextLoaders count={5} containerClassName={"flex gap-2"} />
    </div>
  );
  const getData = async () => {
    setLoading(true);
    let moduleResponseAnswer;
    if (isMatching) {
      const excudedIndexes = moduleInputResponse?.listOfDataObjects.map((_, idx) => idx).filter((idx) => !currentDataAction.includes(String(idx)));
      moduleResponseAnswer = await runTransfer({ speccID, excudedIndexes });
    } else {
      moduleResponseAnswer = await runModule(speccID, module.id, currentDataAction);
    }

    setModuleResponse(moduleResponseAnswer);

    if (!moduleResponseAnswer?.isUseable) {
      const errors = moduleResponseAnswer?.listOfDataObjects[currentDataAction[0]]?.response?.body;
      setErrors(errors);
      setResponseData(errors);
    }

    if (moduleResponseAnswer?.listOfDataObjects[currentDataAction[0]]) {
      setShowMsg(true);
      setExpandedMeatballs(false);
      setResponseExpanded(true);
      setLastExpanded([...lastExpanded, "response"]);
      setResponseData(moduleResponseAnswer?.listOfDataObjects[currentDataAction[0]]?.response?.body);
    }

    getAndSetOKStatuses(false, ["TEST_TRANSFER"]);

    setLoading(false);
  };

  const updateMeatballs = (meatball, idx, removeHover) => {
    const oldMeatballs = cloneDeep(meatballs);

    const newMeatballs = oldMeatballs?.map((crMeatball) => {
      const currentMeatball = crMeatball;
      if (crMeatball?.id === meatball?.id) {
        currentMeatball.isHoverable = removeHover;
      } else {
        currentMeatball.isHoverable = false;
      }
      return currentMeatball;
    });

    setMeatballs([...newMeatballs]);
  };

  let detailsListOfDataObjects = null;
  if (transferListModuleResponse?.isUseable) {
    detailsListOfDataObjects = [];
    transferListModuleResponse?.listOfDataObjects.forEach((data) => {
      detailsListOfDataObjects.push(data.datarow);
    });
  }

  let gridResponseList = null;
  if (gridResponseList?.length) {
    gridResponseList = [];
    detailsResponseList?.forEach((data) => {
      gridResponseList.push(data.datarow);
    });
  }

  useEffect(() => {
    console.log("setCurrentDataAction", currentDataAction);
  }, [currentDataAction]);

  const StyledTooltip = styled(({ className, TooltipText, ...props }) => (
    <Tooltip
      slotProps={{ popper: { style: { zIndex: 99999999 } } }}
      title={TooltipText || "Collapse"}
      arrow
      placement="right-start"
      {...props}
      classes={{ popper: className }}
    />
  ))`
    & .MuiTooltip-tooltip {
      background: #f8f9fa;
      color: #1e2023;
      font-size: 16px;
    }
    & .MuiTooltip-arrow {
      color: #f8f9fa;
    }
  `;

  const Header = ({ showBtn, TooltipText }) => {
    return (
      <div className="flex flex-col">
        <div className="flex justify-between items-center h-8 mb-3">
          <div className="flex gap-1.5 items-center">
            <ApiIcon className="icon-mint-green h-4 w-4" />
            <span className="text-16 font-semibold text-custom-ghostWhite"> {showBtn ? "Transfer List" : "Response List"}</span>
            {showBtn && (
              <Button className={"bg-secondary-aqua h-4 flex items-center justify-center rounded text-secondary-aqua-1"}>
                <div className="h-3 text-base font-semibold flex items-center justify-center px-1 uppercase">{destinationAPICustomName}</div>
              </Button>
            )}
            {
              <StyledTooltip showBtn={showBtn} TooltipText={TooltipText}>
                <span
                  className={`cursor-pointer rounded-full bg-gradient-grey-9 hover:bg-custom-ghostWhite h-5 w-5 flex items-center justify-center transition-all duration-250 ease-in`}
                  onClick={() => updateExpansion(showBtn ? "transform" : `${renderFromDetails ? "detailsResponse" : "response"}`)}>
                  <KeyboardDoubleArrowLeftRoundedIcon
                    style={{
                      color: "#454C54",
                      fontSize: "14px",
                      rotate: showBtn ? "0deg" : "180deg",
                    }}
                    className="hover:!text-[#141619]"
                  />
                </span>
              </StyledTooltip>
            }
          </div>

          <div>
            {showBtn && !renderFromDetails && (
              <Button
                disableClassName="border border-grey-13 h-8 px-3 rounded-[10px] text-grey-13 font-semibold text-lg leading-[14px]"
                disabled={!currentDataAction?.length}
                type="submit"
                className="w-max h-8 bg-primary-button-gradient rounded-containers py-0 px-3 text-lg leading-base font-semibold hover:shadow-primary-button">
                <span>Transfer</span>
              </Button>
            )}
          </div>
        </div>
        <div className={`h-10 ${!showBtn && "mb-3"}`}>
          <CustomInput
            variant="searchBox"
            className="w-full"
            inputClassName="w-full bg-transparent border border-hover-gray-1"
            placeholder="Search"
            placeholderColor={"grey-21"}
          />
        </div>
      </div>
    );
  };

  const handleTransferRowClick = (rowIndex) => {
    const getResponseListData = transferListModuleResponse?.listOfDataObjects?.[rowIndex];
    setDetailsResponseList([getResponseListData?.response?.body?.value]);
  };

  const renderTable = (data) => {
    const listOfDataObjects = [];
    if (moduleInputResponse?.isUseable) {
      moduleInputResponse?.listOfDataObjects.forEach((data) => {
        listOfDataObjects.push(data.datarow);
      });
    }

    return (
      <form className="h-full flex flex-col gap-3" onSubmit={handleSubmit(getData)}>
        <Header showBtn={true} TooltipText={"Collapse transfer"} />

        {loading ? (
          <div className="h-full flex justify-center items-center">
            <CustomLoader />
          </div>
        ) : (
          <>
            {moduleInputResponse?.listOfDataObjects?.length > 0 || transferListModuleResponse?.listOfDataObjects?.length > 0 ? (
              <div className="h-[calc(100%-135px)] w-full flex flex-col gap-3">
                {parentNodeMeatballs?.length > 0 && (
                  <div className="w-fit flex flex-wrap" onMouseOver={() => setHovered(true)} onMouseOut={() => setHovered(false)}>
                    {parentNodeMeatballs?.map((meatball, idx) => (
                      <div
                        className=" flex flex-wrap h-[34px] rounded p-[10px] border border-secondary-aqua-2 bg-gradient-grey-9 cursor-pointer"
                        onMouseOver={() => {
                          updateMeatballs(meatball, idx, true);
                        }}
                        onMouseOut={() => {
                          updateMeatballs(meatball, idx, false);
                        }}>
                        <div className=" h-[14px] flex gap-[2px] flexwrap">
                          <span>{meatball?.name} </span>
                          <span>=</span>
                          <span className="text-[#8BDEE4] font-[600] ">{meatball?.name || ""}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <div className="h-full p-2 rounded-lg bg-gradient-grey-9">
                  <NestedGrid
                    gridData={renderFromDetails ? detailsListOfDataObjects : listOfDataObjects}
                    isCheckbox={!renderFromDetails}
                    setAction={setCurrentDataAction}
                    currentChecked={currentDataAction}
                    isTest={true}
                    handleRowClick={(rowIndex) => handleTransferRowClick(rowIndex)}
                    isSingleSelect={false}
                  />
                </div>
                <div className="absolute bottom-[0px] w-full">
                  <Pagination />
                </div>
              </div>
            ) : (
              <div className="h-full w-full flex items-center justify-center bg-gradient-grey-9 rounded">
                <span className="text-gradient-grey-10 text-sm italic ">No data</span>
              </div>
            )}
          </>
        )}
      </form>
    );
  };

  const updateExpansion = (compToUpdate) => {
    if (compToUpdate === "transform") {
      if (!transferExpanded) {
        setLastExpanded((prev) => [...prev, compToUpdate]);
      }
      setTransferExpanded(!transferExpanded);
    }

    if (compToUpdate === "response") {
      if (!responseExpanded) {
        setLastExpanded((prev) => [...prev, compToUpdate]);
      }
      setResponseExpanded(!responseExpanded);
    }

    if (compToUpdate === "meatballs") {
      if (!expandedMeatballs) {
        setLastExpanded((prev) => [...prev, compToUpdate]);
      }
      setExpandedMeatballs(!expandedMeatballs);
    }

    if (compToUpdate === "detailsResponse") {
      if (!detailsresponseExpanded) {
        setLastExpanded((prev) => [...prev, compToUpdate]);
      }
      setDetailsResponseExpanded(!detailsresponseExpanded);
    }
  };

  const ShowMessage = ({ type }) => {
    return type === "success" && showMsg ? (
      // <SuccessMessage showMsg={showMsg} setShowMsg={setShowMsg} sourceAPICustomName={sourceAPICustomName} destinationAPICustomName={destinationAPICustomName} />
      <></>
    ) : type === "error" ? (
      <ErrorMessage />
    ) : null;
  };

  const allMeatballs = meatballs?.filter((meatball) => {
    if (meatball?.nodeID == parentNode?.id) {
      return true;
    }
    return false;
  });

  return (
    <div className="h-full">
      {/* <div className="flex justify-between items-center h-[34px] mb-[34px]">
        <span className="text-[28px] font-medium text-custom-ghostWhite leading-[34px]">Test</span>
        <Button
          onClick={() => {
            removeModal();
            setSelectedMenuItem("Add nodes");
          }}
          className="px-0 py-0 pr-[5px]">
          <CloseIcon className={"icon-white h-3.5 w-3.5"} />
        </Button>
      </div> */}
      <div className={`container-transition flex w-[100%] gap-3`}>
        {!renderFromDetails && (
          <Expandable
            expanded={expandedMeatballs}
            setExpansion={updateExpansion}
            toExpand={"meatballs"}
            isTest={true}
            hovered={hovered}
            imgCollapesClassName={"icon-mint-green h-4 w-4 mt-4"}
            collapseSrc={NewTag}
            expandedMaxWidth="max-w-[321px]"
            collapseStyle="max-h-full"
            TooltipText={"Expand criteria"}
            customIcon={
              expandedMeatballs ? (
                <></>
              ) : (
                <div
                  className="absolute top-0 left-1/2 translate-x-[-50%] cursor-pointer rounded-full bg-gradient-grey-9 hover:bg-custom-ghostWhite h-5 w-5 flex items-center justify-center transition-all duration-250 ease-in"
                  onClick={() => updateExpansion("meatballs")}>
                  <KeyboardDoubleArrowRightRoundedIcon
                    style={{
                      color: "#454C54",
                      fontSize: "14px",
                    }}
                    className="hover:!text-[#141619]"
                  />
                </div>
              )
            }>
            <GetData
              node={parentNode}
              meatballs={allMeatballs}
              expanded={expandedMeatballs}
              isTest={true}
              setExpansion={updateExpansion}
              toExpand={"meatballs"}
            />
          </Expandable>
        )}
        <Expandable
          expanded={transferExpanded}
          setExpansion={updateExpansion}
          toExpand={"transform"}
          isTest={true}
          imgCollapesClassName={"icon-mint-green h-4 w-4 mt-4"}
          collapseSrc={apiIcon}
          collapseStyle="max-h-full"
          TooltipText={"Expand transform"}
          customIcon={
            transferExpanded ? (
              <></>
            ) : (
              <div
                className="absolute top-0 left-1/2 translate-x-[-50%] cursor-pointer rounded-full bg-gradient-grey-9 hover:bg-custom-ghostWhite h-5 w-5 flex items-center justify-center transition-all duration-250 ease-in"
                onClick={() => updateExpansion("transform")}>
                <KeyboardDoubleArrowRightRoundedIcon
                  style={{
                    color: "#454C54",
                    fontSize: "14px",
                  }}
                  className="hover:!text-[#141619]"
                />
              </div>
            )
          }>
          <div className={`w-[100%] h-[100%] ${responseExpanded ? "border-r border-gradient-grey-1" : ""} pr-2.5 rounded-lg relative`}>{renderTable()}</div>
        </Expandable>
        {responseData || renderFromDetails ? (
          <>
            <Expandable
              expanded={renderFromDetails ? detailsresponseExpanded : responseExpanded}
              setExpansion={updateExpansion}
              toExpand={`${renderFromDetails ? "detailsResponse" : "response"}`}
              isTest={true}
              imgCollapesClassName={"icon-mint-green h-4 w-4 mt-4"}
              collapseSrc={apiIcon}
              collapseStyle="max-h-full"
              TooltipText={"Expand response"}
              expandedClassName="overflow-x-hidden w-full"
              collapseBordercolor="border-r-0 border-y-0 border-grey-2"
              toolTipPlacement={"left-start"}
              customIcon={
                renderFromDetails ? (
                  detailsresponseExpanded
                ) : responseExpanded ? (
                  <></>
                ) : (
                  <div
                    className="absolute top-0 left-1/2 translate-x-[-50%] cursor-pointer rounded-full bg-gradient-grey-9 hover:bg-custom-ghostWhite h-5 w-5 flex items-center justify-center transition-all duration-250 ease-in"
                    onClick={() => updateExpansion(`${renderFromDetails ? "detailsResponse" : "response"}`)}>
                    <KeyboardDoubleArrowRightRoundedIcon
                      style={{
                        color: "#454C54",
                        fontSize: "14px",
                        transform: "rotate(180deg)",
                      }}
                      className="hover:!text-[#141619]"
                    />
                  </div>
                )
              }>
              <div className={`p-0 bg-transparent rounded-lg w-[100%] h-[100%] relative`}>
                <div className="flex flex-col h-full">
                  <Header TooltipText="Collapse response" />
                  <ShowMessage type={!moduleResponse?.isUseable ? "error" : "success"} />
                  {(responseData?.length > 0 || detailsResponseList?.length > 0) && (
                    <div className={`${errors ? " h-[calc(100%-315px)] mt-3" : "h-[calc(100%-135px)]"} p-2 rounded-lg bg-[#454C5433]`}>
                      <NestedGrid
                        gridData={
                          errors ? (renderFromDetails ? detailsResponseList : responseData) : renderFromDetails ? detailsResponseList : responseData?.value
                        }
                        isTest={true}
                      />
                      <div className="absolute bottom-0 w-full">
                        <Pagination />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Expandable>
          </>
        ) : null}
      </div>
    </div>
  );
}
