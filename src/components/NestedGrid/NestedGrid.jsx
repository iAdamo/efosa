import LeftArrow from "../../assets/icons/left-arrow-purple.svg?react";

import TestLeftArrow from "../../assets/icons/test-arrow.svg?react";

import ObjectView from "./ObjectView";
import StringView from "./StringView";

const selector = (state) => ({
  transferKey: state.transferKey,
});

const NestedGrid = ({
  gridData,
  isCheckbox,
  setAction,
  currentChecked,
  isTest,
  groupedData,
  isResult,
  getHoverResult,
  hoverResultParent,
  handleRowClick,
  isListOfDataObjects,
  showLabel = true,
  isSingleSelect = true,
}) => {
  if (typeof gridData !== "string") {
    const newGridData = [];

    if (isListOfDataObjects) {
      if (Array.isArray(gridData)) {
        for (let i = 0; i < gridData.length; i++) {
          newGridData.push(gridData[i].datarow);
        }
        gridData = newGridData;
      }
    }
  }

  return (
    <>
      <div className="new-data-table h-full">
        {showLabel && (
          <div className={`w-full text-lg font-medium border-b border-grey-13 bg-hover-grey-1 flex gap-[4px] items-center`}>
            <div className="w-[40px] h-[40px] flex items-center justify-center">{isTest ? <TestLeftArrow /> : <LeftArrow className="icon-white" />}</div>
            Data Table heading
            <span className="styled-text w-[43px] h-[12px] flex gap-[8px] text-sm"></span>
          </div>
        )}

        {typeof gridData === "string" ? (
          <StringView gridData={gridData} />
        ) : (
          <>
            <ObjectView
              gridData={gridData}
              isTest={isTest}
              isCheckbox={isCheckbox}
              setAction={setAction}
              currentChecked={currentChecked}
              groupedData={groupedData}
              isResult={isResult}
              getHoverResult={getHoverResult}
              hoverResultParent={hoverResultParent}
              handleRowClick={handleRowClick}
              isListOfDataObjects={isListOfDataObjects}
              isSingleSelect={isSingleSelect}
            />
          </>
        )}
      </div>
    </>
  );
};

export default NestedGrid;
