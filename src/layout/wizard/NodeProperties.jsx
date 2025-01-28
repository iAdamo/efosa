import SAccordion from "@/components/SAccordion";
import SButton from "@/components/SButton";
import { DIRECTION, WIZARD_COMPONENT_TYPE } from "@/constants";
import useGlobalStore from "@/store/globalStore";
import { ELEMENTS } from "@/store/uiSlice";
import { colors } from "@constants";
import { useCallback, useEffect, useMemo, useState } from "react";

function NodeProperties() {
  const {
    selectedNode,
    activeNodes,
    activeFields,
    addONActiveField,
    addActiveField,
    deleteActiveField,
    deleteONActiveField,
    destinationAPIData,
    sourceAPIData,
    setModal,
    setPopover,
    selectedOperationNode,
    operationNodes,
  } = useGlobalStore((state) => ({
    selectedNode: state.UI.VALUES.SELECTED_NODE,
    selectedOperationNode: state.UI.VALUES.SELECTED_OPERATION_NODE,
    activeNodes: state.activeNodes,
    activeFields: state.activeFields,
    addActiveField: state.addActiveField,
    addONActiveField: state.addONActiveField,
    deleteActiveField: state.deleteActiveField,
    deleteONActiveField: state.deleteONActiveField,
    sourceAPIData: state.sourceAPIData,
    destinationAPIData: state.destinationAPIData,
    setModal: state.UI.setModal,
    setPopover: state.UI.setPopover,
    operationNodes: state.operationNodesFiltered,
  }));

  const [node, setNode] = useState(null);
  const [nodeDetails, setNodeDetails] = useState({});


  const isOperationNodeSelected = useMemo(() => !!selectedOperationNode, [selectedOperationNode]);

  const memoizedActiveFields = useMemo(
    () => (isOperationNodeSelected ? operationNodes.byId[selectedOperationNode].activeFields : activeFields),
    [isOperationNodeSelected, activeFields, operationNodes, selectedOperationNode]
  );

  useEffect(() => {
    if (isOperationNodeSelected) {
      const opetationNode = operationNodes.byId[selectedOperationNode];
      setNode(opetationNode.activeNodes.byId[selectedNode]);
    } else {
      setNode(activeNodes.byId[selectedNode]);
    }
  }, [activeNodes, selectedNode, isOperationNodeSelected, selectedOperationNode]);

  useEffect(() => {
    if (node) {
      const { availableFields, availableRelatedNodes, id: nodeID, name, description, parentNode } = node;
      setNodeDetails({ availableFields, availableRelatedNodes, nodeID, name, description, parentNode });
    } else {
      setNodeDetails({});
    }
  }, [node]);

  const handleFieldClick = useCallback(
    (field, isActive, activeField) => {
      if (isActive) {
        if (isOperationNodeSelected) {
          const opetationNode = operationNodes.byId[selectedOperationNode];
          deleteONActiveField(activeField.id, opetationNode.id);
        } else {
          deleteActiveField(activeField.id);
        }
      } else {
        if (isOperationNodeSelected) {
          const opetationNode = operationNodes.byId[selectedOperationNode];
          addONActiveField(nodeDetails.nodeID, opetationNode.id, field.name);
        } else {
          addActiveField(nodeDetails.nodeID, field);
        }
      }
    },
    [
      deleteActiveField,
      addActiveField,
      nodeDetails.nodeID,
      isOperationNodeSelected,
      deleteONActiveField,
      addONActiveField,
      operationNodes,
      selectedOperationNode,
    ]
  );
  const isMatching = node?.type === WIZARD_COMPONENT_TYPE.MATCH;
  const direction = node?.APIID === sourceAPIData.id ? DIRECTION.SOURCE : DIRECTION.DESTINATION;

  const renderFields = useMemo(
    () =>
      nodeDetails.availableFields?.map((field) => {
        const activeField = memoizedActiveFields.allIds
          .map((id) => memoizedActiveFields.byId[id])
          .filter((activeField) => (isOperationNodeSelected ? activeField.onNodeID === nodeDetails.nodeID : activeField.nodeID === nodeDetails.nodeID))
          .find((activeField) => activeField.name === field.name);
        const isActive = !!activeField;

        return (
          <button key={field.id} className={`flex gap-[24px]`} onClick={() => handleFieldClick(field, isActive, activeField)}>
            {isActive ? (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clip-path="url(#clip0_11121_11591)">
                  <rect width="16" height="16" rx="4" fill={`${direction === DIRECTION.DESTINATION ? colors.secondary["aqua-1"] : colors.secondary["pink-light-1"]}`} />
                  <path d="M12 5L6.5 11L4 8.27273" stroke="#141619" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </g>
                <defs>
                  <clipPath id="clip0_11121_11591">
                    <rect width="16" height="16" rx="4" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clip-path="url(#clip0_11121_11596)"></g>
                <rect x="0.5" y="0.5" width="15" height="15" rx="3.5" stroke="#454C54" />
                <defs>
                  <clipPath id="clip0_11121_11596">
                    <rect width="16" height="16" rx="4" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            )}
            <span className="text-lg font-medium">{field.name}</span>
          </button>
        );
      }),
    [nodeDetails.availableFields, memoizedActiveFields, nodeDetails.nodeID, handleFieldClick, isOperationNodeSelected]
  );



  const changeStructure = () => {
    const getModalType = () => {
      if (isMatching) {
        return direction === DIRECTION.SOURCE ? ELEMENTS.MODAL.RUN.ADD_NODE_SOURCE : ELEMENTS.MODAL.MATCH.ADD_NODE_DESTINATION;
      }
      if (isOperationNodeSelected) {
        return direction === DIRECTION.SOURCE ? ELEMENTS.MODAL.ON.ADD_NODE_SOURCE : ELEMENTS.MODAL.ON.ADD_NODE_DESTINATION;
      }
      return direction === DIRECTION.SOURCE ? ELEMENTS.MODAL.RUN.ADD_NODE_SOURCE : ELEMENTS.MODAL.RUN.ADD_NODE_DESTINATION;
    };
    const modalType = getModalType();
    setModal(modalType);
  };

  if (!node) return <div>No node selected</div>;

  const renderExampleDataSelector = () => {
    return (
      <SAccordion
        title={
          <div className="flex flex-col gap-[8px] items-start">
            <span className="font-medium text-lg">Example Data</span>
            <span className="font-light text-sm">An explainer about what example data does, toggling it on here will toggle it on for all nodes</span>
          </div>
        }
        open={true}
        content={
          <button className="w-full border mt-[20px]" onClick={() => setPopover(ELEMENTS.POPOVER.RUN.EXAMPLE_DATA)}>
            Example Data
          </button>
        }
      />
    );
  };

  return (
    <div className="flex-col justify-start items-start gap-6 inline-flex relative w-full">
      <span className="font-medium text-lg">Node Menu</span>
      <span className="font-bolder text-lg">{nodeDetails?.name}</span>
      <SButton className={"w-full !rounded-[10px] !bg-grey-13"} onClick={changeStructure}>
        <span className="text-base font-bold">Change Structure</span>
      </SButton>
      <SAccordion
        open={true}
        titleClassname="flex justify-between w-full"
        closeIcon={
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M12 10L8 6L4 10" stroke="#454C54" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        }
        openIcon={
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 6L8 10L12 6" stroke="#454C54" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        }
        title={<span className="font-medium text-lg">Available parameters ({nodeDetails?.availableFields?.length})</span>}
        content={<div className="flex flex-col gap-[12px] py-[12px]">{renderFields}</div>}
      />
      {nodeDetails?.parentNode === null && renderExampleDataSelector()}
    </div>
  );
}

export default NodeProperties;
