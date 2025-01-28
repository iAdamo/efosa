import { DIRECTION } from "@/constants";
import { ProjectContext } from "@/contexts/ProjectContext";
import useGlobalStore from "@/store/globalStore";
import { ELEMENTS } from "@/store/uiSlice";
import APiContent from "@pages/wizard/transformation/Components/AddNodeModal/ApiContent.jsx";
import PreviewHierarchy from "@pages/wizard/transformation/Components/AddNodeModal/PreviewHierarchy.jsx";
import { destinationIconClass, sourceIconClass } from "@pages/wizard/transformation/Components/SpeccDetail/NodeToolBar/components/color-variables.jsx";
import { useContext, useMemo, useState } from "react";
import ApisDeepLevel from "./ApisDeepLevel";

const selector = (s) => ({
  sourceEndpoints: s.endpoints.run.source,
  destinationEndpoints: s.endpoints.run.destination,
  destinationGetEndpoints: s.endpoints.matching.destination,
  activeModal: s.UI.ELEMENTS.MODAL,
  activeNodes: s.activeNodes,
  getFilteredMatchActiveNodes: s.getFilteredMatchActiveNodes,
  getFilteredSourceActiveNodes: s.getFilteredSourceActiveNodes,
  getFilteredDesitantionActiveNodes: s.getFilteredDesitantionActiveNodes,
  speccID: s.speccId,
  sourceAPIData: s.sourceAPIData,
  destinationAPIData: s.destinationAPIData,
  selectedOperationNode: s.UI.VALUES.SELECTED_OPERATION_NODE,
  operationNodes: s.operationNodesFiltered,
});

const AddNodeModal = ({ parentNode }) => {
  const {
    sourceEndpoints,
    destinationEndpoints,
    destinationGetEndpoints,
    activeModal,
    getFilteredMatchActiveNodes,
    sourceAPIData,
    destinationAPIData,
    getFilteredSourceActiveNodes,
    getFilteredDesitantionActiveNodes,
    speccID,
    activeNodes,
    selectedOperationNode,
    operationNodes,
  } = useGlobalStore(selector);
  const { sourceAPICustomName, destinationAPICustomName } = useContext(ProjectContext);

  const [endpointsExpanded, setEndpointsExpanded] = useState(true);

  const direction = useMemo(() => {
    return activeModal === ELEMENTS.MODAL.RUN.ADD_NODE_DESTINATION ||
      activeModal === ELEMENTS.MODAL.MATCH.ADD_NODE_DESTINATION ||
      activeModal === ELEMENTS.MODAL.ON.ADD_NODE_DESTINATION
      ? DIRECTION.DESTINATION
      : DIRECTION.SOURCE;
  }, [activeModal]);

  const isOperationNodeSelected = useMemo(() => !!selectedOperationNode, [selectedOperationNode]);
  const ON = useMemo(() => {
    return isOperationNodeSelected ? operationNodes.byId[selectedOperationNode] : null;
  }, [isOperationNodeSelected, operationNodes, selectedOperationNode]);

  const isMatching = useMemo(() => {
    return activeModal === ELEMENTS.MODAL.MATCH.ADD_NODE_DESTINATION || activeModal === ELEMENTS.MODAL.MATCH.ADD_NODE_SOURCE;
  }, [activeModal]);

  const isON = useMemo(() => {
    return activeModal === ELEMENTS.MODAL.ON.ADD_NODE_DESTINATION || activeModal === ELEMENTS.MODAL.ON.ADD_NODE_SOURCE;
  }, [activeModal]);

  const activatedParentNode = useMemo(() => {
    if (parentNode || isON) {
      return parentNode;
    }
    const getFilteredNodes =
      direction === DIRECTION.SOURCE ? getFilteredSourceActiveNodes : isMatching ? getFilteredMatchActiveNodes : getFilteredDesitantionActiveNodes;
    return getFilteredNodes(activeNodes)?.[0];
  }, [parentNode, isON, direction, isMatching, activeNodes, getFilteredSourceActiveNodes, getFilteredMatchActiveNodes, getFilteredDesitantionActiveNodes]);

  const [isLoading, setIsLoading] = useState(false);

  const directionInfo = {
    iconStyle: direction === DIRECTION.SOURCE ? sourceIconClass : destinationIconClass,
    textStyle: direction === DIRECTION.SOURCE ? "text-secondary-cerise" : "text-secondary-mint-green",
    bgStyle: direction === DIRECTION.SOURCE ? "bg-secondary-cerise30" : "bg-custom-destinationSelectionColor",
    apiDescription: direction === DIRECTION.SOURCE ? sourceAPIData?.description : destinationAPIData?.description,
    apiName: direction === DIRECTION.SOURCE ? sourceAPICustomName : destinationAPICustomName,
    checkboxClass: direction === DIRECTION.SOURCE ? "" : "s-checkbox-mint-green",
    endpoint: direction === DIRECTION.SOURCE ? sourceAPICustomName : destinationAPICustomName,
    direction: direction,
    apiEndpoints: direction === DIRECTION.SOURCE ? sourceEndpoints : isMatching || isON ? destinationGetEndpoints : destinationEndpoints,
    isMatching: isMatching,
    isON: isON,
    activatedParentNode: activatedParentNode,
    isOperationNodeSelected: isOperationNodeSelected,
    speccID: speccID,
    ON: ON,
  };

  return (
    <div className="flex flex-grow h-[70%] gap-2">

      <ApisDeepLevel isLoading={isLoading} setIsLoading={setIsLoading} directionInfo={directionInfo} endpointsExpanded={endpointsExpanded} setEndpointsExpanded={setEndpointsExpanded} />

      <APiContent directionInfo={directionInfo} isLoading={isLoading} endpointsExpanded={endpointsExpanded} setEndpointsExpanded={setEndpointsExpanded} />
      <PreviewHierarchy isLoading={isLoading} directionInfo={directionInfo} endpointsExpanded={endpointsExpanded} setEndpointsExpanded={setEndpointsExpanded} />
    </div>
  );
};

export default AddNodeModal;
