import { DIRECTION } from "@/constants";
import { WizardContext } from "@/contexts/WizardContext";
import useGlobalStore from "@/store/globalStore";
import { ELEMENTS } from "@/store/uiSlice";
import { useNodeId } from "@xyflow/react";
import { useContext, useEffect, useState } from "react";
import { Button } from "react-aria-components";
import NodeBlock from "./NodeBlock";

const selector = (state) => ({
  isNodeAsOnConnected: state.isNodeAsOnConnected,
  getFilteredMatchActiveNodes: state.getFilteredMatchActiveNodes,
  getFilteredSourceActiveNodes: state.getFilteredSourceActiveNodes,
  getFilteredDesitantionActiveNodes: state.getFilteredDesitantionActiveNodes,
  sourceAPIID: state.sourceAPIData.id,
  destinationAPIID: state.destinationAPIData.id,
  initialSpeccValuesFetched: state.dataFetched.initialSpeccValues,
  activeNodes: state.activeNodes,
  sourceEndpoints: state.endpoints.run.source,
  destinationEndpoints: state.endpoints.run.destination,
  matchEndpoints: state.endpoints.matching.destination,
  setModal: state.UI.setModal,
  wizardMode: state.UI.TOGGLES.WIZARD_MODE,
});

export default function APIComponent({ data, renderType }) {
  const {
    isNodeAsOnConnected,
    getFilteredMatchActiveNodes,
    getFilteredSourceActiveNodes,
    getFilteredDesitantionActiveNodes,
    initialSpeccValuesFetched,
    activeNodes,
    setModal,
  } = useGlobalStore(selector);

  const nodeId = useNodeId();
  const { sourceAPIName, destinationAPIName } = useContext(WizardContext);

  const { direction, onAddNode, isMatching = false } = data;

  const [activeParentNodes, setActiveParentNodes] = useState([]);

  useEffect(() => {
    if (!initialSpeccValuesFetched) return;
    console.log("activeNodes", activeNodes);
    if (isMatching) {
      setActiveParentNodes(getFilteredMatchActiveNodes(activeNodes));
    } else {
      if (direction === DIRECTION.SOURCE) {
        setActiveParentNodes(getFilteredSourceActiveNodes(activeNodes));
      } else {
        setActiveParentNodes(getFilteredDesitantionActiveNodes(activeNodes));
      }
    }
  }, [
    getFilteredMatchActiveNodes,
    getFilteredSourceActiveNodes,
    getFilteredDesitantionActiveNodes,
    direction,
    initialSpeccValuesFetched,
    isMatching,
    activeNodes,
  ]);

  const number = direction === DIRECTION.SOURCE ? 1 : 2;

  const addNodeClickHandler = () => {
    const modalType = isMatching
      ? direction === DIRECTION.SOURCE
        ? ELEMENTS.MODAL.RUN.ADD_NODE_SOURCE
        : ELEMENTS.MODAL.MATCH.ADD_NODE_DESTINATION
      : direction === DIRECTION.SOURCE
        ? ELEMENTS.MODAL.RUN.ADD_NODE_SOURCE
        : ELEMENTS.MODAL.RUN.ADD_NODE_DESTINATION;
    setModal(modalType);
  };

  const renderNodes = () => {
    if (isNodeAsOnConnected() && nodeId === "API2")
      return activeParentNodes
        .slice(0, 1)
        .map((node) => (
          <NodeBlock
            key={node.activeNodeId}
            {...data}
            node={node}
            addNodeClickHandler={addNodeClickHandler}
            parentNodeId={node.parentNode}
            isNodeAsOnConnected={true}
            renderType={renderType}
          />
        ));

    return activeParentNodes.map((node) => (
      <NodeBlock
        renderType={renderType}
        key={node.activeNodeId}
        {...data}
        node={node}
        addNodeClickHandler={addNodeClickHandler}
        parentNodeId={node.parentNode}
      />
    ));
  };
  return (
    <div
      className="flex flex-col gap-4"
      style={{
        alignItems: direction === DIRECTION.SOURCE ? "flex-start" : "flex-end",
      }}>
      {!activeParentNodes || !activeParentNodes.length || !activeParentNodes.length ? (
        <Button onPress={addNodeClickHandler} className="relative">
          <span className={`absolute top-[-30px] left-0 h-[27px] ${direction === DIRECTION.DESTINATION ? 'bg-secondary-aqua text-secondary-aqua-1' : 'bg-secondary-pink-light text-secondary-pink-light-1'}  flex justify-center items-center px-[8px] rounded-label text-base font-semibold uppercase leading-none`}>
            {direction === DIRECTION.SOURCE ? sourceAPIName : destinationAPIName}
          </span>
          <div className={`p-[10px] h-[148px] w-[400px]   flex justify-center items-center rounded-base border border-dashed  ${direction === DIRECTION.DESTINATION ? 'bg-secondary-aqua border-secondary-aqua-1' : 'bg-secondary-pink-light border-secondary-pink-light-1'}`}>
            <span className={`text-lg font-normal ${direction === DIRECTION.DESTINATION ? 'text-secondary-aqua-1' : 'text-secondary-pink-light-1'}`}>Add parent node</span>
          </div>
        </Button>
      ) : (
        renderNodes()
      )}
    </div>
  );
}
