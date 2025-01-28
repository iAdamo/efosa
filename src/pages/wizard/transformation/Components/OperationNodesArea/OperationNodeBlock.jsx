import useGlobalStore from "@/store/globalStore";
import { WizardContext } from "@contexts/WizardContext";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/outline";
import { useNodeId, useUpdateNodeInternals } from "@xyflow/react";
import { useContext, useEffect, useMemo, useState } from "react";
import { Button } from "react-aria-components";
import { useShallow } from "zustand/react/shallow";

import OperationNodeIfCondition from "./ConditionNode/OperationNodeIfCondition";
import OperationNodeSwitch from "./ConditionNode/OperationNodeSwitch";
import OperationNodeNodeAsON from "./OperationNodeNodeAsON";
import OperationNodeTransform from "./OperationNodeTransform";
import SearchNode from "./SearchNode";
import OperationNodeSearch from "./SearchNode/OperationNodeSearch";

const OperationNodeBlock = ({ data }) => {
  const { deleteNode, operationNodes } = useGlobalStore(
    useShallow((state) => ({
      deleteNode: state.deleteNode,
      operationNodes: state.operationNodesFiltered,
    }))
  );

  const [isCollapsed, setIsCollapsed] = useState(false);
  const nodeId = useNodeId();
  const updateNodeInternals = useUpdateNodeInternals();
  const { ONConfig, ONID, inputs } = data;

  const { setSelectedOperationNodes, selectedOperationNodes, operationNodesInput, activeNodes, activeFields } = useContext(WizardContext);

  const ON = useMemo(() => operationNodes.byId[ONID], [operationNodes, ONID]);

  useEffect(() => {
    updateNodeInternals(nodeId);
  }, [isCollapsed, nodeId, updateNodeInternals]);

  const openHandler = () => {
    updateNodeInternals(nodeId);
    setIsCollapsed((prev) => !prev);
  };

  const [nodeType, setNodeType] = useState(null);
  const [nodePassthroughType, setNodePassthroughType] = useState(null);

  let fullNode = null;
  let allActiveFields = null;

  if (ONConfig.package === "NodeAsON") {
    fullNode = activeNodes.find((node) => node.id === ON.nodeID);
    allActiveFields = activeFields.filter((field) => field.nodeID === fullNode?.id);
  }

  const renderNodeContent = () => {
    switch (ONConfig.package) {
      case "Search":
        return <SearchNode ON={ON} />;
      case "NodeAsON":
        return <OperationNodeNodeAsON ON={ON} ONConfig={ONConfig} fullNode={fullNode} allActiveFields={allActiveFields} isCollapsed={isCollapsed} />;
      case "Conditional":
        if (ONConfig.name === "IF Condition") {
          return (
            <OperationNodeIfCondition
              ON={ON}
              ONConfig={ONConfig}
              nodeType={nodeType}
              setNodeType={setNodeType}
              nodePassthroughType={nodePassthroughType}
              setNodePassthroughType={setNodePassthroughType}
              isCollapsed={isCollapsed}
            />
          );
        }
        if (ONConfig.name === "Switch") {
          return (
            <OperationNodeSwitch
              ON={ON}
              ONConfig={ONConfig}
              fullNode={fullNode}
              allActiveFields={allActiveFields}
              nodeType={nodeType}
              setNodeType={setNodeType}
              nodePassthroughType={nodePassthroughType}
              setNodePassthroughType={setNodePassthroughType}
              isCollapsed={isCollapsed}
            />
          );
        }
        break;
      case "TypeTransformation":
        return (
          <OperationNodeTransform
            ON={ON}
            ONConfig={ONConfig}
            nodeType={nodeType}
            setNodeType={setNodeType}
            inputs={inputs}
            operationNodesInput={operationNodesInput}
            isCollapsed={isCollapsed}
          />
        );
      case "SearchNode":
        return (
          <OperationNodeSearch
            ON={ON}
            ONConfig={ONConfig}
            nodeType={nodeType}
            setNodeType={setNodeType}
            inputs={inputs}
            operationNodesInput={operationNodesInput}
            isCollapsed={isCollapsed}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div
      className={`p-[12px] rounded-api-component ${ONConfig.package !== "NodeAsON" && ONConfig.package !== "Search" ? "w-[317px] bg-grey-15" : "w-max bg-transparent border"} rounded-base`}
      data-node-name={ON?.id}>
      {/* Header */}
      <div className="flex justify-between items-center handle mb-[20px]">
        <div className="font-semibold text-custom-ghostWhite">{ONConfig.package === "NodeAsON" ? fullNode?.name.split("/").pop() : ONConfig.name}</div>
        <div className="flex items-center">
          <Button onPress={() => deleteNode(nodeId)}>
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
              <title>Close</title>
              <g clipPath="url(#clip0_11532_81400)">
                <path d="M2.03125 4H3.19792H12.5312" stroke="#454C54" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path
                  d="M11.3639 4.00033V12.167C11.3639 12.4764 11.241 12.7732 11.0222 12.9919C10.8034 13.2107 10.5067 13.3337 10.1973 13.3337H4.36393C4.05451 13.3337 3.75777 13.2107 3.53897 12.9919C3.32018 12.7732 3.19727 12.4764 3.19727 12.167V4.00033M4.94727 4.00033V2.83366C4.94727 2.52424 5.07018 2.22749 5.28897 2.0087C5.50777 1.78991 5.80451 1.66699 6.11393 1.66699H8.44727C8.75668 1.66699 9.05343 1.78991 9.27222 2.0087C9.49102 2.22749 9.61393 2.52424 9.61393 2.83366V4.00033"
                  stroke="#454C54"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
              <defs>
                <clipPath id="clip0_11532_81400">
                  <rect width="14" height="14" fill="white" transform="translate(0.28125 0.5)" />
                </clipPath>
              </defs>
            </svg>
          </Button>
          <button type="button" onClick={openHandler} className="ml-1">
            {isCollapsed ? <ChevronDownIcon className="w-4 h-4" color="#9ca3af" /> : <ChevronUpIcon className="w-4 h-4" color="#9ca3af" />}
          </button>
        </div>
      </div>
      {renderNodeContent()}
    </div>
  );
};

export default OperationNodeBlock;
