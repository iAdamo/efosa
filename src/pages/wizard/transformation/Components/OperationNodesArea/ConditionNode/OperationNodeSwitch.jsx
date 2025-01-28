import useGlobalStore from "@/store/globalStore";
import { useNodeId } from "@xyflow/react";
import { useEffect } from "react";
import { Button } from "react-aria-components";
import { SelectItem, WizardSelect } from "../../../WizardSelect";
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
  changeSwitchReturnType: state.changeSwitchReturnType,
  conditionalComparisons: state.conditionalComparisons,
  addConditionRow: state.addConditionRow,
  deleteConditionRow: state.deleteConditionRow,
});

const OperationNodeSwitch = ({ ON, fullNode, allActiveFields, ONConfig, nodeType, setNodeType, setNodePassthroughType, nodePassthroughType, isCollapsed }) => {
  const { activeConnectionLine, allEdges, handles, changeSwitchReturnType, conditionalComparisons, addConditionRow, deleteConditionRow } =
    useGlobalStore(selector);

  const nodeId = useNodeId();

  let logicalComparisons = [];
  if (nodeType != null) {
    logicalComparisons = conditionalComparisons.filter((item) => {
      if (item.type === nodeType) {
        return true;
      }
      return false;
    });
  }

  const linksToON = allEdges.filter((link) => link.target === nodeId);

  useEffect(() => {
    if (activeConnectionLine) {
      if (nodeType === null) {
        setNodeType(activeConnectionLine.type);
      }
    } else {
      if (linksToON.length === 0) {
        setNodeType(null);
      } else {
        setNodeType(handles.byId[linksToON[0].sourceHandle]?.data.type);
      }
    }
  }, [activeConnectionLine, allEdges, nodeId]);

  if (!ON || !ONConfig) {
    return <></>;
  }

  const changeReturnType = async (returnType) => {
    changeSwitchReturnType(ON.id, ON.switchObject.id, returnType);
  };

  const addConditionRowClick = async () => {
    addConditionRow(ON.id);
  };

  const deleteConditionRowClick = async (id) => {
    deleteConditionRow(ON.id, id);
  };

  return (
    <div className="">
      <div className="rounded-md h-fit min-w-[100%] flex flex-col gap-[10px]">
        <OperationNodeInputs ON={ON} ONConfig={ONConfig} setNodeType={setNodeType} nodeType={nodeType} isCollapsed={isCollapsed} />
        {!isCollapsed && (
          <>
            <div>
              <WizardSelect
                label={"Return type"}
                onSelectionChange={(selected) => changeReturnType(String(selected).toUpperCase())}
                defaultSelectedKey={ON.switchObject.returnType}>
                <SelectItem id="STRING">String</SelectItem>
                <SelectItem id="INTEGER">Integer</SelectItem>
                <SelectItem id="NUMBER">Number</SelectItem>
                <SelectItem id="BOOLEAN">Boolean</SelectItem>
              </WizardSelect>
            </div>
            {nodeType != null && (
              <>
                {ON.conditionRows?.map((conditionRow) => {
                  return (
                    <ConditionRow
                      key={`condition-row-${ON.id}-${conditionRow.id}`}
                      conditionRow={conditionRow}
                      links={linksToON}
                      comparisons={logicalComparisons}
                      isSwitch={true}
                      deleteConditionRowClick={deleteConditionRowClick}
                      numberOfConditionRows={ON.conditionRows.length}
                    />
                  );
                })}

                <Button className="py-[6px] px-[10px] border border-grey-1 bg-secondary-yellow/10 rounded-base" onClick={addConditionRowClick}>
                  Add condition row+
                </Button>
              </>
            )}
          </>
        )}
        <OperationNodeOutputs
          ON={ON}
          ONConfig={ONConfig}
          nodePassthroughType={ON.switchObject.returnType.toLowerCase()}
          setNodePassthroughType={null}
          isCollapsed={isCollapsed}
        />
      </div>
    </div>
  );
};

export default OperationNodeSwitch;
