import useGlobalStore from "@/store/globalStore";
import { getTypeValuesFromObjRow } from "@/utils/table";
import CheckedApi2 from "@assets/icons/checked-api2.svg?react";
import Checked from "@assets/icons/checked-icon.svg?react";
import UnChecked from "@assets/icons/un-check-icon.svg?react";
import { Checkbox } from "@mui/material";
import { cloneDeep } from "lodash";
import { useEffect, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import LeftArrow from "../../assets/icons/left-arrow-purple.svg?react";
import MinusIcon from "../../assets/icons/minus-icon.svg";
import PlusIcon from "../../assets/icons/plus-icon.svg";
import TestLeftArrow from "../../assets/icons/test-arrow.svg?react";

const selector = (state) => ({
  transferKey: state.transferKey,
});

const ObjectView = ({
  gridData,
  isCheckbox,
  setAction,
  currentChecked,
  isTest,
  groupedData,
  isResult,
  getHoverResult,
  handleRowClick,
  hoverResultParent,
  isListOfDataObjects,
  isSingleSelect = true,
}) => {
  const { transferKey } = useGlobalStore(useShallow(selector));
  const [rows, setRows] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [checked, setChecked] = useState({});
  const [currentModule, setCurrentModule] = useState("");

  const [hoverResult, setHoverResult] = useState(null);

  useEffect(() => {
    if (checked && setAction) {
      setAction(Object.keys(checked).filter((key) => checked[key] === true));
    }
  }, [checked, setAction]);

  useEffect(() => {
    window.location.pathname.includes("group-data") ? setCurrentModule("GROUPDATA") : setCurrentModule("");
  }, []);

  const handleChange = (e, name) => {
    setChecked((currentChecked) => {
      if (currentChecked[name] && isSingleSelect) {
        return {
          [name]: true,
        };
      }
      return {
        ...currentChecked,
        [name]: e.target.checked,
      };
    });
  };

  useEffect(() => {
    if (currentChecked?.length) {
      const res = {};
      currentChecked.forEach((checked) => {
        res[checked] = true;
      });
      setChecked(res);
    }
  }, []);

  useEffect(() => {
    if (gridData == null) {
      return;
    }
    if (Array.isArray(gridData)) {
      const rowData = gridData?.map((row) => {
        if (!row) return;
        const [singleValues, objectValues, arrayValues] = getTypeValuesFromObjRow(row);

        const expandableValues = [...arrayValues, ...objectValues];

        if (!singleValues?.length) {
          setHeaders([]);
        }

        return {
          mainRowData: singleValues,
          subRows: expandableValues,
          listOfUID: row?.listOfUID ?? [],
        };
      });
      setRows(rowData);
    } else {
      const row = gridData;
      const [singleValues, objectValues, arrayValues] = getTypeValuesFromObjRow(row);

      const expandableValues = [...arrayValues, ...objectValues];
      if (!singleValues?.length) {
        setHeaders([]);
      }

      setRows([
        {
          mainRowData: singleValues,
          subRows: expandableValues,
          listOfUID: row?.listOfUID ?? [],
        },
      ]);
    }
  }, [gridData]);

  useEffect(() => {
    if (rows?.length && !headers?.length) {
      const newHeader = rows[0]?.mainRowData?.map((currentrow) => currentrow?.name);

      setHeaders(newHeader);
    }
  }, [rows]);

  useEffect(() => {
    if (headers?.length && isCheckbox) {
      const newRows = rows?.map((row) => {
        let currentRow = cloneDeep(row);
        headers?.forEach((head) => {
          if (!row?.mainRowData?.some((rw) => (rw?.name ? rw["name"] === head : null))) {
            currentRow = {
              ...currentRow,
              mainRowData: [
                ...currentRow?.mainRowData,
                {
                  name: head,
                  value: "<No value>",
                },
              ],
            };
          }
        });
        return currentRow;
      });
      setRows(newRows);
    }
  }, [headers]);

  const Header = ({ renderHeader, rowExpanded }) => {
    const newHeaders = renderHeader;
    if (newHeaders?.length === 0) return null;
    return (
      <div className={`min-w-[890px] h-[32px] flex items-center w-full ${rowExpanded ? "bg-transparent" : "bg-hover-grey-1"} bg-hover-grey-1`}>
        <span className="min-w-[40px] h-[32px] flex items-center"></span>
        {newHeaders?.map((column) => (
          <span className="styled-text min-w-[205px] h-[12px] text-[12px] capitalize">{column}</span>
        ))}
      </div>
    );
  };

  const getCurrentRowSpecs = (row, keys) => {
    const currentRowObjects = [];
    const currentRowData = [];
    const currentRowValues = [];
    for (let i = 0; i < keys?.length; i++) {
      if (typeof row[keys[i]] === "object" && !(row[keys[i]] === null)) {
        currentRowObjects?.push({
          [keys[i]]: row[keys[i]],
        });
        continue;
      }

      if (Array.isArray(row) && row?.length) {
        for (let j = 0; j < row?.length; j++) {
          const crRow = row[j];
          currentRowData?.push({
            [keys[i]]: crRow[keys[i]],
          });
          currentRowValues?.push(crRow[keys[i]]);
        }
        continue;
      }

      if (row[keys[i]] === null || row[keys[i]] === "" || row[keys[i]] === undefined) {
        currentRowData?.push({
          [keys[i]]: "<No Value>",
        });
        currentRowValues?.push("<No Value>");
        continue;
      }

      currentRowData?.push({
        [keys[i]]: row[keys[i]],
      });
      currentRowValues?.push(row[keys[i]]);
    }

    return { currentRowObjects, currentRowData, currentRowValues };
  };

  const getHeaders = (rowData, currentHeaders = []) => {
    rowData?.forEach((currentRow) => {
      const currentRowKeys = Object.keys(currentRow);
      currentHeaders = [...currentHeaders, ...currentRowKeys];
    });
    return currentHeaders;
  };

  const getKeyByValue = (object, value) => {
    return Object.keys(object).find((key) => object[key] === value);
  };

  let count = 0;
  const checkifRowIsGrouped = (row) => {
    if (!groupedData) return;
    if (hoverResultParent) {
      const filterIndex = row.mainRowData.findIndex((data) => {
        if (data.name === transferKey.sourceKeyName) {
          return data;
        }
      });
      if (filterIndex === -1) {
        //return "row-normal-bg-color";
      }

      const result = hoverResultParent.filter((data) => {
        if ((filterIndex !== -1 && data === row.mainRowData[filterIndex].value) || row.listOfUID.filter((f) => f === data).length > 0) {
          return data;
        }
      }).length;
      if (result > 0) {
        if ((!isResult && hoverResultParent.length === 1) || isResult) {
          return "grouped-row grouped-row-last";
        }
        if (count === hoverResultParent.length - 1) {
          count = 0;
          return "grouped-row-last";
        }
        count++;
        return "grouped-row";
      }
    }
    return "row-normal-bg-color";
  };

  const Row = ({ row, isSubrow, idx, nestedRow, subHeader = "subHeader", currentDepth, rowClick }) => {
    const [rowExpanded, setRowExpanded] = useState(false);
    const depthOfCurrentRow = currentDepth ? currentDepth + 1 : 1;
    const currentShadowPX = depthOfCurrentRow * 40 - 500 || 0;
    let currentRowValues = [];
    let currentRowData = [];
    let currentRowObjects = [];
    let keys = [];

    if (nestedRow) {
      if (!row?.length && typeof row === "object") {
        keys = row ? Object.keys(row) : null;
      } else if (Array.isArray(row) && row?.length) {
        for (let i = 0; i < row?.length; i++) {
          keys = [...keys, Object.keys(row[i])].flat();
        }
      }

      const rowSpecs = getCurrentRowSpecs(row, keys);

      currentRowValues = rowSpecs?.currentRowValues;
      currentRowData = rowSpecs?.currentRowData;
      currentRowObjects = rowSpecs?.currentRowObjects;

      currentRowValues = currentRowValues?.map((val) => val?.toString());

      if (currentRowValues?.includes(subHeader)) {
        const currentRepitingFieldKey = getKeyByValue(row, subHeader);

        const idxForRepitingRowData = currentRowData?.findIndex((currentRow) => currentRow[currentRepitingFieldKey] === subHeader);
        const idxForRepitingRowValues = currentRowValues?.findIndex((currentRowValue) => currentRowValue === subHeader);

        currentRowData?.splice(idxForRepitingRowData, 1);
        currentRowValues?.splice(idxForRepitingRowValues, 1);
      }
    }
    const currenRowNestedHeaders = getHeaders(currentRowData, []);

    return nestedRow ? (
      <>
        <div>
          <div
            className={`sub-heading bg-transparent flex items-center`}
            // style={{
            //     boxShadow: `${currentShadowPX || 0}px 0px 0px ${isTest ? "#00EFD94D" : "red"
            //         }`,
            // }}
          >
            <div className={`min-w-[40px] h-[32px] flex items-center ${isSubrow ? "" : "justify-center"}`}>
              <span className="w-[20px] flex pl-[5px] gap-[5px]">{isTest ? <TestLeftArrow /> : <LeftArrow className="icon-pink-1" />}</span>
            </div>
            <div
              className={`min-w-[40px] h-[32px] flex items-center ${isSubrow ? "" : "justify-center"} cursor-pointer`}
              onClick={() => setRowExpanded(!rowExpanded)}>
              {rowExpanded ? (
                <span className="w-[20px] flex items-center justify-center gap-[10px]">
                  <img src={MinusIcon} width="10.4px" height="3px" />
                </span>
              ) : (
                <>
                  <span className="w-[13px] h-[15px] flex justify-center items-center">
                    <img src={PlusIcon} width="13px" height="15px" />
                  </span>
                </>
              )}
            </div>
            <span className="capitalize">{subHeader}</span>
          </div>
          {rowExpanded ? (
            <div
              style={{
                borderLeft: `2px dotted ${isTest ? "#00EFD980" : "#E9C2F080"}`,
              }}
              className={`inner-header-wrapper pl-[20px] ${isSubrow ? "ml-[12px]" : "ml-[20px]"}`}>
              {currentRowData?.length ? <Header renderHeader={currenRowNestedHeaders} rowExpanded={rowExpanded} /> : null}
              {currentRowValues?.length ? (
                <div className="flex">
                  <span className="min-w-[40px] h-[32px] flex items-center"></span>
                  {currentRowValues?.map((crRowData) => {
                    return <span className="styled-row min-w-[205px] flex flex-wrap text-ellipsis">{crRowData}</span>;
                  })}
                </div>
              ) : null}

              {currentRowObjects?.length
                ? currentRowObjects?.map((crObj) => {
                    const subHeader = Object.keys(crObj);
                    return <Row row={crObj[subHeader[0]]} nestedRow={true} subHeader={subHeader} currentDepth={depthOfCurrentRow || 1} />;
                  })
                : null}
            </div>
          ) : null}
        </div>
      </>
    ) : (
      <div
        onMouseEnter={() => {
          if (currentModule === "GROUPDATA") {
            if (isResult) {
              //setHoverResult(row);
              //getHoverResult(row.listOfUID);
            } else {
              //getHoverResult(row.listOfUID);
            }
          }
        }}
        onMouseLeave={() => {
          if (currentModule === "GROUPDATA") {
            //setHoverResult(row);
            //getHoverResult([]);
          }
        }}
        className={`border-t-transparent ${isCheckbox ? "pr-10" : ""} ${rowExpanded ? "bg-main-pink-8" : "bg-hover-grey-1"} ${checkifRowIsGrouped(row)}`}>
        <div
          className={`styled-text min-w-[890px] h-[32px] ${handleRowClick ? "hover:cursor-pointer" : ""} flex text-sm items-center ${
            rowExpanded ? (isTest ? "bg-[#8BDEE44D]" : "bg-main-pink-7") : ""
          } 
                        `}
          style={{
            boxShadow: `${isSubrow && rowExpanded ? `${currentShadowPX || 0}px 0px 0px 0px ${isTest ? "#00EFD94D" : "#D32DCA33"}` : ""}`,
          }}
          onClick={() => rowClick()}>
          {isTest && isCheckbox && <span className="min-w-[40px] h-[32px] flex items-center"></span>}
          {isTest && isCheckbox && (
            <>
              <span className="absolute bg-hover-grey-1 right-0 min-w-[42px] min-h-[32px] flex items-center justify-center">
                <span className="relative min-w-[40px] min-h-[32px] flex items-center justify-center">
                  {isCheckbox ? (
                    <Checkbox
                      icon={<UnChecked className="w-4 h-[15px]" />}
                      checkedIcon={isTest ? <CheckedApi2 className="w-4 h-[15px]" /> : <Checked className="w-4 h-[15px]" />}
                      sx={{
                        padding: 0,
                        cursor: "pointer",
                        pointerEvents: "all !important",
                      }}
                      checked={checked[idx]}
                      onChange={(e) => handleChange(e, idx)}
                    />
                  ) : null}
                </span>
              </span>
            </>
          )}
          {row?.subRows?.length > 0 ? (
            <>
              <div
                onClick={() => {
                  setRowExpanded(!rowExpanded);
                }}
                className="min-w-[40px] h-[32px] flex items-center justify-center cursor-pointer">
                {rowExpanded ? (
                  <>
                    <span className="w-[20px] flex items-center justify-center gap-[10px]">
                      <img src={MinusIcon} width="10.4px" height="3px" />
                    </span>
                  </>
                ) : isSubrow ? (
                  <div className="min-w-[40px] h-[32px] flex items-center pl-[7px]">
                    <span className="w-[13px] h-[15px] flex justify-center items-center">
                      <img src={PlusIcon} width="13px" height="15px" />
                    </span>
                  </div>
                ) : (
                  <div className="min-w-[40px] h-[32px] flex items-center justify-center">
                    <span className="w-[13px] h-[15px] flex justify-center items-center">
                      <img src={PlusIcon} width="13px" height="15px" />
                    </span>
                  </div>
                )}
              </div>
            </>
          ) : null}

          {!isSubrow ? (
            row?.mainRowData?.map((currentCell) => {
              return (
                <>
                  <span className="styled-row min-w-[205px] flex flex-wrap whitespace-nowrap text-ellipsis">{currentCell?.value}</span>
                </>
              );
            })
          ) : (
            <>
              <span className="styled-row min-w-[205px] flex flex-wrap whitespace-nowrap text-ellipsis">{row?.name}</span>
            </>
          )}
        </div>
        {rowExpanded && row?.subRows ? (
          <div
            // style={{
            //     borderLeft: `2px dotted ${isTest ? "#00EFD980" : "#E9C2F080"
            //         }`,
            // }}
            className={`pl-[0px] ${isSubrow ? "ml-[12px]" : "ml-0"} ${isSubrow ? "bg-transparent" : isTest ? "bg-[#8BDEE41A]" : "bg-[#E9C2F01A]"}`}>
            {row?.subRows?.map((subRow) => {
              return <Row row={subRow.value} isSubRow={true} nestedRow={true} subHeader={subRow?.name} firstSub={true} currentDepth={1} />;
            })}
          </div>
        ) : null}
      </div>
    );
  };

  return (
    <div className="relative w-full">
      <div className="overflow-x-scroll no-scrollbar h-full">
        <div className="min-w-max w-full">
          <Header renderHeader={headers} />
          <div>
            {rows?.map((row, index) => {
              return <Row idx={index} row={row} isSubrow={false} rowClick={() => handleRowClick(index)} />;
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ObjectView;
