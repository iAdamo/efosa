import SSelectDropdown, { DropdownItem } from "@/components/SSelectDropdown";
import Group from "@assets/icons/group.svg?react";
import AddIcon from "@assets/icons/add.svg?react";
import Delete from "@assets/icons/delete.svg?react";
import Min from "@assets/icons/min.svg?react";
import Max from "@assets/icons/max.svg?react";
import Count from "@assets/icons/count.svg?react";
import Average from "@assets/icons/average.svg?react";
import { v4 as uuidv4 } from "uuid";
import { useState } from "react";
import useGlobalStore from "@/store/globalStore";
import { useShallow } from "zustand/react/shallow";
import Loading from "@/components/loaders/Loading";
import { useEffect } from "react";
import {
  addGrouping,
  addGroupingAggregation,
  deleteGenericCRUDWithID,
  deleteGroupingAggregation,
  getModuleInput,
  postGenericCRUD,
  postGenericCRUDWithID,
  runModule,
} from "@/axios/apiCalls";
import NestedGrid from "@/components/NestedGrid/NestedGrid";
import Node from "@/assets/icons/node.svg?react";
import { useMemo } from "react";

const selector = (state) => ({
  activeModules: state.activeModules,
  setActiveModules: state.setActiveModules,
  initialDataFetched: state.dataFetched.initialSpeccValues,
  speccId: state.speccId,
  sourceAPIData: state.sourceAPIData,
  activeFields: state.activeFields,
  activeNodes: state.activeNodes,
  updateActiveField: state.updateActiveField,
  transferKey: state.transferKey,
});

export default function GroupData({ renderFromDetails = false, groupModuleResponse }) {

  let gridDataFromDetails = null;
  let gridResultsFromDetails = null;

  if (groupModuleResponse) {
    if (groupModuleResponse.dataFromDetails?.isUseable) {
      gridDataFromDetails = groupModuleResponse?.dataFromDetails?.listOfDataObjects.map(
        (data) => data.datarow
      );
    }

    if (groupModuleResponse.resultsFromDetails?.isUseable) {
      gridResultsFromDetails = groupModuleResponse?.resultsFromDetails?.listOfDataObjects.map(
        (data) => data.datarow
      );
    }
  }

  const {
    activeModules,
    setActiveModules,
    initialDataFetched,
    speccId,
    sourceAPIData,
    activeFields,
    activeNodes,
    updateActiveField,
    transferKey,
  } = useGlobalStore(useShallow(selector));

  const [groupData, setGroupData] = useState({
    parameters: [],
    functions: [
      {
        aggregateParam: null,
        aggregateFunction: "SUM",
      },
    ],
  });
  const [moduleResponseAnswer, setModuleResponseAnswer] = useState(null);
  const [moduleResponseInput, setModuleResponseInput] = useState(null);
  const [groupingResults, setGroupingResults] = useState(null);
  const [activeFieldsInNode, setActiveFiledsInNode] = useState([]);
  const [sourceFields, setSourceFields] = useState([]);
  const [hoverResult, setHoverResult] = useState([]);

  const [grouping, setGrouping] = useState([]);

  const activeSourceNodes = useMemo(() => {
    if (activeNodes && sourceAPIData) {
      const temp = [
        ...activeNodes.allIds
          .map((id) => activeNodes.byId[id])
          .filter((node) => {
            if (node.APIID === sourceAPIData.id) {
              return node;
            }
          }),
      ];
      return temp;
    }
  }, [activeNodes, sourceAPIData]);

  useEffect(() => {
    if (activeFields && activeSourceNodes) {
      const result = activeFields.allIds
        .map((id) => activeFields.byId[id])
        .filter((field) =>
          activeSourceNodes.some((node) => field.nodeID === node.id),
        );
      setSourceFields(result);
    }
  }, [activeFields, activeSourceNodes]);

  useEffect(() => {
    if (sourceFields) {
      const fields = [];
      sourceFields.map((field) => {
        fields.push({ name: field.name, id: field.id, type: field.type });
      });
      setActiveFiledsInNode(fields);
    }
  }, [sourceFields]);

  useEffect(() => {
    console.log('All source fields', sourceFields);
    if (sourceFields) {
      const parameters = [];
      const functions = [];
      if (sourceFields.length > 0) {
        sourceFields.map((field) => {
          if (field.groupingAggregation) {
            if (field.type === "integer" || field.type === "number") {
              parameters.push(field);
              functions.push({
                aggregateParam: field,
                aggregateFunction: field.groupingAggregation.function,
              });
              parameters.push(field);
            } else {
              parameters.push(field);
            }
          }
        });

        if (parameters.length === 0) {
          parameters.push(sourceFields[0]);
        }
        if (functions.length === 0) {
          functions.push({
            aggregateParam: sourceFields[0],
            aggregateFunction: "SUM",
          });
        }

        setGroupData({
          parameters: parameters,
          functions: functions,
        });
      }
    }
  }, [sourceFields]);

  const getHoverResult = (result) => {
    setHoverResult(result);
  };

  const module = useMemo(() => {
    if (initialDataFetched && activeModules) {
      const module = activeModules.find(
        (module) => module.config.name === "GROUPDATA",
      );
      return module;
    }
  }, [activeModules, initialDataFetched]);

  useEffect(() => {
    if (module) {
      setGrouping(module.grouping);
    }

  }, [module]);

  const parentNode = useMemo(() => {
    let parent;

    activeNodes.allIds
      .map((id) => activeNodes.byId[id])
      .map((node) => {
        if (node.APIID === sourceAPIData.id) {
          if (node.parentNode === null) {
            parent = node;
          }
        }
      });

    return parent;
  }, [activeNodes, sourceAPIData]);



  useEffect(() => {
    (async () => {
      if (module) {
        const moduleResponseAnswer = await getModuleInput(speccId, module.id);

        setModuleResponseInput(moduleResponseAnswer);
      }
    })();
  }, [module, speccId, transferKey]);

  const runGroupingClick = async () => {
    if (module) {
      const moduleResponseAnswer = await runModule(speccId, module.id);
      setModuleResponseAnswer(moduleResponseAnswer);
    }
  };


  useEffect(() => {
    if (groupData) {
      runGroupingClick();
    }
  }, [groupData]);

  const handleGroupByChange = async (value, groupingID) => {

    const results = await postGenericCRUDWithID("Grouping_Aggregation", groupingID, {
      fieldID: value,
    });

    setGrouping(
      grouping.map((group) => {
        if (group.id === groupingID) {
          return results.data;
        }

        return group;
      })
    );

  };

  const handleAggregateParamChange = async (value, groupingID) => {

    const results = await postGenericCRUDWithID("Grouping_Aggregation", groupingID, {
      fieldID: value,
    });

    setGrouping(
      grouping.map((group) => {
        if (group.id === groupingID) {
          return results.data;
        }

        return group;
      })
    );
  };

  const handleAggregateFunctionChange = async (value, groupingID) => {

    const results = await postGenericCRUDWithID("Grouping_Aggregation", groupingID, {
      function: value,
    });

    setGrouping(
      grouping.map((group) => {
        if (group.id === groupingID) {
          return results.data;
        }

        return group;
      })
    );
  };


  const handleDeleteParameter = async (groupingID) => {
    await deleteGenericCRUDWithID("Grouping_Aggregation", groupingID);
    setGrouping(grouping.filter((group) => group.id !== groupingID));
  };

  const handleDeleteFunction = async (groupingID) => {
    await deleteGenericCRUDWithID("Grouping_Aggregation", groupingID);
    setGrouping(grouping.filter((group) => group.id !== groupingID));
  };

  const checkIfNumericParamAvailable = () => {
    const result = activeFieldsInNode.filter((field) => {
      if (field.type === "integer" || field.type === "number") {
        return field;
      }
    });
    if (result.length > 0) {
      return true;
    }
    return false;
  };

  const getAggregateIcon = (func, selected) => {
    switch (func) {
      case "SUM":
        return (
          <AddIcon
            className={`h-3 w-3 ${selected === "SUM" ? "icon-pink" : "icon-grey-5"
              }`}
          />
        );

      case "AVERAGE":
        return (
          <Average
            className={`h-3 w-3 ${selected === "AVERAGE" ? "icon-pink" : "icon-grey-5"
              }`}
          />
        );
      case "MIN":
        return (
          <Min
            className={`h-3 w-3 ${selected === "MIN" ? "icon-pink" : "icon-grey-5"
              }`}
          />
        );
      case "MAX":
        return (
          <Max
            className={`h-3 w-3 ${selected === "MAX" ? "icon-pink" : "icon-grey-5"
              }`}
          />
        );
      case "COUNT":
        return (
          <Count
            className={`h-3 w-3 ${selected === "COUNT" ? "icon-pink" : "icon-grey-5"
              }`}
          />
        );
      default:
        <AddIcon
          className={`h-3 w-3 ${selected === "SUM" ? "icon-pink" : "icon-grey-5"
            }`}
        />;
    }
  };

  const handleAddParameter = async () => {

    const result = await postGenericCRUD("Grouping_Aggregation", {
      moduleID: module.id,
      fieldID: null,
      function: null,
      groupBy: true,
    });

    // Update the activeModules using the setActiveModules, but add the result in the grouping property of the current module
    setGrouping([...grouping, result.data[0]]);

  };

  const handleAddAggregate = async () => {

    const result = await postGenericCRUD("Grouping_Aggregation", {
      moduleID: module.id,
      fieldID: null,
      function: null,
      groupBy: false,
    });

    setGrouping([...grouping, result.data[0]]);

  };

  const checkIfIntegerFieldAvailable = () => {
    let result = false;
    activeFieldsInNode.filter((field) => {
      if (field.type === "integer" || field.type === "number") {
        result = true;
      }
    });
    return result;
  };

  const checkIfNonIntegerFieldAvailable = () => {
    let result = false;
    activeFieldsInNode.filter((field) => {
      if (field.type !== "integer" || field.type !== "number") {
        result = true;
      }
    });
    return result;
  };

  useEffect(() => {
    runGroupingClick();
  }, [grouping]);

  return (
    <>
      {initialDataFetched ? (
        <div className="flex gap-[10px] w-full group-data-wrapper p-[10px] max-h-[98%] overflow-hidden">
          <div className="w-[35%] flex flex-col p-[10px] rounded-[5px] bg-[#080808] h-max max-h-[98%] gap-[10px]">
            <div class="text-white text-xs font-bold font-['Inter'] leading-[11px] tracking-tight">
              Data
            </div>
            {moduleResponseAnswer || groupModuleResponse?.dataFromDetails?.listOfDataObjects?.length ? (
              <NestedGrid
                gridData={renderFromDetails ? gridDataFromDetails : gridData}
                groupedData={groupingResults}
                hoverResultParent={hoverResult}
                isResult={false}
                getHoverResult={getHoverResult}
              />
            ) : (
              <div className="h-[30vh] flex bg-grey-1 rounded-[5px] items-center justify-center">
                <div class="text-[#aeaeae] text-xs font-normal font-['Inter'] leading-[11px]">
                  No parameters selected
                </div>
              </div>
            )}
          </div>
          <div className="flex flex-col w-[30%] bg-[#111111] p-5 gap-[10px] rounded-[5px] max-h-[98%] h-max overflow-y-scroll group-container">
            <div key={uuidv4()} className="flex flex-col gap-[10px]">
              <div className="flex justify-between">
                <div className="flex gap-[10px]">
                  <Group className="icon-pink" />
                  <div class=" text-white text-base font-bold font-['Inter'] leading-[16px] tracking-normal">
                    Group by
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-[10px]">

                {grouping.filter((group) => group.groupBy).map((group, index) => {
                  let field = null;
                  if (group.fieldID) {
                    field = activeFieldsInNode.find((field) => field.id === group.fieldID);
                  }

                  return (
                    <>
                      <div className="flex justify-between gap-[5px] items-center">

                        <SSelectDropdown
                          defaultValue={field ? field.name : ""}
                          placeholder={"Select parameter"}
                          onChange={(val) => {
                            handleGroupByChange(val, group.id);
                          }}
                          icon={<Node className={"icon-pink"} />}
                        >
                          {activeFieldsInNode?.map(
                            (activeField) =>
                            (
                              <DropdownItem
                                key={uuidv4()}
                                item={activeField.name}
                                id={activeField.id}
                                icon={
                                  <Node
                                    className={
                                      field?.name === activeField.name
                                        ? "icon-pink"
                                        : "icon-grey-5"
                                    }
                                  />
                                }
                              />
                            ),
                          )}
                          {!checkIfNonIntegerFieldAvailable() && (
                            <DropdownItem
                              item="No parameters found"
                              isDisabled={true}
                            />
                          )}
                        </SSelectDropdown>


                        {groupData?.parameters.length > 0 && index > 0 && !renderFromDetails && (
                          <Delete
                            onClick={() => {
                              handleDeleteParameter(index);
                            }}
                            className={`icon-white w-4 h-4 cursor-pointer`}
                          />
                        )}
                      </div>

                    </>
                  );

                })}

              </div>
              {checkIfNonIntegerFieldAvailable() && !renderFromDetails && (
                (<div
                  onClick={() => {
                    handleAddParameter();
                  }}
                  onKeyDown={() => {
                    handleAddParameter();
                  }}
                  className="flex gap-[10px] p-[10px] items-center cursor-pointer"
                >
                  <AddIcon className="icon-grey-5" />
                  <div class="text-[#aeaeae] text-xs font-normal font-['Inter'] leading-[14px] tracking-tight">
                    Add another parameter
                  </div>
                </div>)
              )}

              <div className="flex flex-col gap-5">
                {grouping.filter((group) => !group.groupBy).map((group, index) => {
                  let field = null;
                  if (group.fieldID) {
                    field = activeFieldsInNode.find((field) => field.id === group.fieldID);
                  }
                  return (
                    <>
                      <div
                        key={uuidv4()}
                        className="flex gap-[10px] justify-between items-center"
                      >
                        <div className="flex flex-col w-1/2 gap-[10px]">
                          <div class="text-white text-xs font-bold font-['Inter'] leading-[11px] tracking-tight">
                            Aggregate
                          </div>
                          {activeFieldsInNode && (
                            <SSelectDropdown
                              defaultValue={
                                field ? field.name : ""
                              }
                              placeholder={"Select parameter"}
                              onChange={(val) => {
                                handleAggregateParamChange(val, group.id);
                              }}
                              icon={<Node className={"icon-pink"} />}
                            >
                              {activeFieldsInNode.map(
                                (activeField) =>
                                  (activeField.type === "integer" ||
                                    activeField.type === "number") && (
                                    <DropdownItem
                                      key={uuidv4()}
                                      item={activeField.name}
                                      id={activeField.id}
                                      icon={
                                        <Node
                                          className={
                                            field?.name === activeField.name
                                              ? "icon-pink"
                                              : "icon-grey-5"
                                          }
                                        />
                                      }
                                    />
                                  ),
                              )}
                              {!checkIfIntegerFieldAvailable() && (
                                <DropdownItem
                                  item="No parameters found"
                                  isDisabled={true}
                                />
                              )}
                            </SSelectDropdown>
                          )}
                        </div>
                        <div className="flex flex-col w-1/2 gap-[10px]">
                          <div class="text-white text-xs font-bold font-['Inter'] leading-[11px] tracking-tight">
                            Function
                          </div>
                          <SSelectDropdown
                            defaultValue={group.function ? group.function : ""}
                            placeholder={"Select a function"}
                            onChange={(val) => {
                              handleAggregateFunctionChange(val, group.id);
                            }}
                            icon={getAggregateIcon(
                              group.function,
                              group.function,
                            )}
                          >
                            <DropdownItem
                              item="SUM"
                              icon={getAggregateIcon("SUM", group.function)}
                            />
                            <DropdownItem
                              item="AVERAGE"
                              icon={getAggregateIcon(
                                "AVERAGE",
                                group.function,
                              )}
                            />
                            <DropdownItem
                              item="MIN"
                              icon={getAggregateIcon("MIN", group.function)}
                            />
                            <DropdownItem
                              item="MAX"
                              icon={getAggregateIcon("MAX", group.function)}
                            />
                            <DropdownItem
                              item="COUNT"
                              icon={getAggregateIcon(
                                "COUNT",
                                group.function,
                              )}
                            />
                          </SSelectDropdown>
                        </div>
                        {groupData?.functions.length > 1 && index > 0 && !renderFromDetails && (
                          <Delete
                            onClick={() => {
                              handleDeleteFunction(index);
                            }}
                            className={`icon-white w-4 h-4 mt-5 cursor-pointer}`}
                          />
                        )}
                      </div>
                    </>
                  );

                })}

              </div>
            </div>

            {checkIfNumericParamAvailable() && (
              <div
                onClick={() => {
                  handleAddAggregate();
                }}
                onKeyDown={() => {
                  handleAddAggregate();
                }}
                className="flex gap-[10px] p-[10px] items-center cursor-pointer"
              >
                <AddIcon className="icon-grey-5" />
                <div class="text-[#aeaeae] text-xs font-normal font-['Inter'] leading-[14px] tracking-tight">
                  Add another Aggregate and Function
                </div>
              </div>
            )}
          </div>
          <div className="w-[35%] flex flex-col p-[10px] rounded-[5px] bg-[#080808] h-max max-h-[98%] gap-5">
            <div class="text-white text-xs font-bold font-['Inter'] leading-[11px] tracking-tight">
              Results
            </div>


            {moduleResponseAnswer && groupingResults || groupModuleResponse?.resultsFromDetails?.listOfDataObjects?.length ? (
              <NestedGrid
                gridData={renderFromDetails ? gridResultsFromDetails : gridResults}
                groupedData={moduleResponseAnswer?.listOfDataObjects || []}
                isResult={true}
                getHoverResult={getHoverResult}
                hoverResultParent={hoverResult}
                isListOfDataObjects={true}
              />
            ) : (
              <div className="h-[30vh] flex bg-grey-1 rounded-[5px] items-center justify-center">
                <div class="text-[#aeaeae] text-xs font-normal font-['Inter'] leading-[11px]">
                  No parameters selected
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <Loading className="h-full w-full flex justify-center items-center" />
      )}
    </>
  );
}