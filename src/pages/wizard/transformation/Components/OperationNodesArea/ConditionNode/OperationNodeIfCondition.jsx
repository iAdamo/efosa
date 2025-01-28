import useGlobalStore from "@/store/globalStore";
import { useNodeId } from "@xyflow/react";
import { useEffect } from "react";
import OperationNodeInputs from "../OperationNodeInputs";
import OperationNodeOutputs from "../OperationNodeOutputs";
import ConditionRow from "./ConditionRow";

const list = [
  { name: "Name", value: "Test example data" },
  { name: "Account", value: "Example data" },
  { name: "Amount", value: "Example data" },
  { name: "customerNumber", value: "Example data" },
  { name: "email", value: "Example data" },
];

const selector = (state) => ({
  activeConnectionLine: state.activeConnectionLine,
  allEdges: state.edges.allIds.map((id) => state.edges.byId[id]),
  handles: state.handles,
  conditionalComparisons: state.conditionalComparisons,
});

const OperationNodeIfCondition = ({ ON, ONConfig, nodeType, setNodeType, setNodePassthroughType, nodePassthroughType, isCollapsed }) => {
  const { activeConnectionLine, allEdges, handles, conditionalComparisons } = useGlobalStore(selector);
  const nodeId = useNodeId();

  if (!ON) {
    return null;
  }

  const linksToON = allEdges.filter((link) => link.target === nodeId && link.sourceHandle.split("-")[1] !== "passthrough");

  useEffect(() => {
    if (activeConnectionLine) {
      if (nodeType === null) {
        setNodeType(activeConnectionLine.type);
      }
      if (nodePassthroughType === null) {
        setNodePassthroughType(activeConnectionLine.type);
      }
    } else {
      const linksToON = allEdges.filter((link) => link.target === nodeId && !handles.byId[link.targetHandle]?.data.isPassthrough);
      console.log("linksToON", linksToON, handles);
      if (linksToON.length === 0) {
        setNodeType(null);
      } else {
        setNodeType(handles.byId[linksToON[0].sourceHandle]?.data.type);
      }
      const linksToPassthroughON = allEdges.find((link) => link.target === nodeId && handles.byId[link.targetHandle]?.data.isPassthrough);
      console.log("linksToPassthroughON", linksToPassthroughON);
      if (!linksToPassthroughON) {
        setNodePassthroughType(null);
      } else {
        setNodePassthroughType(handles.byId[linksToPassthroughON.sourceHandle]?.data?.type);
      }
    }
  }, [activeConnectionLine, allEdges, nodeId]);

  if (!ON || !ONConfig) {
    return <></>;
  }

  let logicalComparisons = [];
  if (nodeType != null) {
    logicalComparisons = conditionalComparisons.filter((item) => {
      if (item.type == nodeType) {
        return true;
      }
      return false;
    });
  }

  return (
    <div className="">
      <div className="rounded-md h-fit min-w-[100%] flex flex-col gap-[10px]">
        <OperationNodeInputs ON={ON} ONConfig={ONConfig} setNodeType={setNodeType} nodeType={nodeType} isCollapsed={isCollapsed} isIfCondition={true} />
        {!isCollapsed && (
          <>
            {nodeType != null && (
              <>
                {ON.conditionRows?.map((conditionRow, index) => {
                  return (
                    <ConditionRow
                      key={`condition-row-${ON.id}-${index}`}
                      conditionRow={conditionRow}
                      links={linksToON}
                      comparisons={logicalComparisons}
                      isSwitch={false}
                      numberOfConditionRows={ON.conditionRows.length}
                      nodeType={nodeType}
                    />
                  );
                })}
              </>
            )}
          </>
        )}
        <OperationNodeOutputs
          ON={ON}
          ONConfig={ONConfig}
          nodePassthroughType={nodePassthroughType}
          setNodePassthroughType={setNodePassthroughType}
          isCollapsed={isCollapsed}
        />
      </div>
    </div>
  );
};

export default OperationNodeIfCondition;
