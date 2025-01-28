import { ProjectContext } from "@/contexts/ProjectContext";
import useGlobalStore from "@/store/globalStore";
import { ELEMENTS, TOGGLES } from "@/store/uiSlice";
import { colors, DIRECTION } from "@constants";
import { WizardContext } from "@contexts/WizardContext";
import { Position, useNodeId, useUpdateNodeInternals } from "@xyflow/react";
import { motion } from "framer-motion";
import { useCallback, useContext, useEffect, useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import { RelatedNodesHandles } from "../RelatedNodesLinks";
import NodeComponentHeader from "./NodeComponent/NodeComponentHeader";
import SchemaComponent from "./SchemaComponent";
import ShadowField from "./ShadowField";
import ShadowNode from "./ShadowNode";

const selector = (state) => ({
  speccID: state.speccId,
  activeNodes: state.activeNodes,
  activeFields: state.activeFields,
  shadowActiveFields: state.shadow.activeFields.allIds.map((id) => state.shadow.activeFields.byId[id]),
  shadowActiveNodes: state.shadow.activeNodes.allIds.map((id) => state.shadow.activeNodes.byId[id]),
  selectedNode: state.UI.VALUES.SELECTED_NODE,
  setModal: state.UI.setModal,
  setSelectedMenuItem: state.UI.setSelectedMenuItem,
  wizardMode: state.UI.TOGGLES.WIZARD_MODE,
});

export default function NodeComponent(props) {
  const { fullNode, direction, isRelatedNode, isNodeAsON, ON, isNodeAsOnConnected, renderType, isShowModal, level = 1, isON, skipMargin } = props;

  const { sourceAPICustomName, destinationAPICustomName } = useContext(ProjectContext);
  const updateNodeInternals = useUpdateNodeInternals();

  const { sourceAPIName, destinationAPIName } = useContext(WizardContext);

  const { setNodeContextMenu } = useContext(WizardContext);
  const { activeNodes, activeFields, shadowActiveFields, shadowActiveNodes, selectedNode, wizardMode } = useGlobalStore(selector);
  const nodeId = useNodeId();
  const { setModal, setSelectedMenuItem } = useGlobalStore(useShallow(selector));

  const { exampleDataRows } = useGlobalStore((state) => ({
    exampleDataRows: state.exampleDataRows.map((row) => row.datarow),
  }));

  const isCollapsed = false;

  const memoisedActiveNodes = useMemo(() => {
    return isON ? ON.activeNodes.allIds.map((id) => ON.activeNodes.byId[id]) : activeNodes.allIds.map((id) => activeNodes.byId[id]);
  }, [isON, ON?.activeNodes, activeNodes]);

  const memoisedActiveFields = useMemo(() => {
    return isON ? ON.activeFields.allIds.map((id) => ON.activeFields.byId[id]) : activeFields.allIds.map((id) => activeFields.byId[id]);
  }, [isON, ON?.activeFields, activeFields]);

  const nodeName = useMemo(() => {
    if (isRelatedNode) {
      return fullNode.name;
    }
    return fullNode.endpoint.split(["/"]).pop();
  }, [isRelatedNode, fullNode]);

  const activeFieldsInNode = useMemo(() => {
    const fields = [
      ...memoisedActiveFields.filter((field) => (isON ? field.onNodeID === fullNode.id : field.nodeID === fullNode.id)),
      ...shadowActiveFields.filter((field) => field.nodeID === fullNode.id),
    ];
    return fields;
  }, [memoisedActiveFields, shadowActiveFields, fullNode.id]);

  useEffect(() => {
    updateNodeInternals("API1");
  }, [updateNodeInternals, direction, activeFieldsInNode]);

  const relatedNodes = [
    ...memoisedActiveNodes?.filter((activeNode) => activeNode.parentNode === fullNode.id),
    ...shadowActiveNodes?.filter((activeNode) => activeNode.parentNode === fullNode.id),
  ];

  // const OpenExampleDataIcon = () => (
  // 	<TestData
  // 		className="cursor-pointer"
  // 		onClick={() => {
  // 			changeExampleDataIsOpen(true);
  // 		}}
  // 	/>
  // );

  const getHandleDataBaseIconClick = useCallback(() => {
    if (wizardMode === TOGGLES.WIZARD_MODE.MATCH) {
      if (direction === DIRECTION.SOURCE) {
        return () => setModal(ELEMENTS.MODAL.MATCH.GET_DATA_SOURCE);
      } else {
        return () => setModal(ELEMENTS.MODAL.MATCH.GET_DATA_DESTINATION);
      }
    } else if (wizardMode === TOGGLES.WIZARD_MODE.RUN) {
      if (direction === DIRECTION.SOURCE) {
        return () => {
          setModal(ELEMENTS.MODAL.RUN.GET_DATA);
          setSelectedMenuItem("Get data");
        };
      } else {
        return null;
      }
    }
  }, [wizardMode, direction, setModal, setSelectedMenuItem]);

  const APIColour = direction === DIRECTION.SOURCE ? colors.secondary["pink-light-1"] : colors.secondary["aqua-1"];

  let marginLeft = "0";
  let marginRight = "0";

  if (direction === DIRECTION.SOURCE || isON) {
    if (skipMargin) {
      marginLeft = `${(level - 1) * 50}px`;
    } else {
      marginLeft = `${level * 50}px`;
    }
  } else {
    if (skipMargin) {
      marginRight = `${(level - 1) * 50}px`;
    } else {
      marginRight = `${level * 50}px`;
    }
  }
  return (
    <>

      <motion.div
        // todo: figure it out
        // layout="size"
        className={`
          				${selectedNode != null && selectedNode === fullNode.id ? `border-2 border-[${APIColour}]` : "border-2 border-transparent"}
						${!isRelatedNode && "rounded-tl-none"}
				text-white p-[12px] bg-grey-15 rounded-api-component flex flex-col gap-[12px] w-[300px] relative`}
        data-node-title={nodeName}
        style={{
          marginLeft: marginLeft,
          marginRight: marginRight,
        }}
        data-node-name={`${fullNode.endpoint}${direction}`}
        iscollapsed={isCollapsed ? "1" : "0"}>
        {fullNode.id && (
          <>
            <RelatedNodesHandles
              type={"source"}
              id={`source-${fullNode.id}`}
              style={direction === DIRECTION.SOURCE ? { left: "0%" } : { left: "100%" }}
              position={Position.Bottom}
            />

            <RelatedNodesHandles type={"target"} id={`target-${fullNode.id}`} position={direction === DIRECTION.SOURCE ? Position.Left : Position.Right} />
          </>
        )}
        {!isRelatedNode && (
          <span
            className={`absolute top-[-27px] left-[-2px] h-[27px] bg-[${APIColour}] text-custom-blackPearl flex justify-center items-center px-[8px] rounded-t-label text-base font-semibold uppercase leading-none`}>
            {direction === DIRECTION.SOURCE ? sourceAPIName : destinationAPIName}
          </span>
        )}
        <NodeComponentHeader
          direction={direction}
          nodeName={nodeName}
          isCollapsed={isCollapsed}
          isShowModal={isShowModal}
          handlerClickIcon={(e) => {
            if (renderType === "wizard") {
              setNodeContextMenu({
                event: e,
                direction,
                nodeName,
              });
            }
          }}
          isNodeAsOnConnected={isNodeAsOnConnected}
          // parentOpenToolbar={parentOpenToolbar}
          isFirstLevel={level === 1}
          ON={ON}
          isNodeAsON={isNodeAsON}
          fullNode={fullNode}
          //   OpenExampleDataIcon={nodeId === "API1" && !isRelatedNode && exampleDataRows.length > 0 && OpenExampleDataIcon}
          renderType={renderType}
          handleDataBaseIconClick={getHandleDataBaseIconClick()}
        />
        {!isCollapsed && !isNodeAsOnConnected && activeFieldsInNode.length > 0 && (
          <>
            <div className={"flex flex-col w-full"}>
              {activeFieldsInNode?.map((activeField, index) => {
                if (activeField.type === "SHADOW_FIELD") return <ShadowField field={activeField} />;
                return (
                  <SchemaComponent
                    key={activeField.id}
                    activeField={activeField}
                    direction={direction}
                    index={index}
                    isCollapsed={isCollapsed}
                    isNodeAsON={isNodeAsON}
                    isShowModal={isShowModal}
                    isON={isON}
                  />
                );
              })}
            </div>
          </>
        )}
      </motion.div>

      {!isNodeAsOnConnected && (
        // <div className={`ml-[${direction === DIRECTION.SOURCE ? '50px' : '-50px'}] flex flex-col gap-4`}>
        <>
          {relatedNodes.map((relatedNode) => {
            if (relatedNode.type === "SHADOW_NODE") return <ShadowNode node={relatedNode} />;

            return (
              <NodeComponent
                {...props}
                key={relatedNode.name}
                fullNode={relatedNode}
                {...relatedNode}
                direction={direction}
                isRelatedNode={(isRelatedNode || 0) + 1}
                parentNodeId={fullNode.id}
                isNodeAsON={isNodeAsON}
                level={level + 1}
                isShowModal={isShowModal}
                isON={isON}
                ON={ON}
              />
            );
          })}
        </>
        // </div>
      )}
    </>
  );
}
