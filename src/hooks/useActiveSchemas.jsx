import { WizardContext } from "@contexts/WizardContext";
import { addActiveNode, deleteActiveNodeApi } from "@axios/apiCalls";
import { MatchContext } from "@contexts/MatchContext";
import { RunnerContext } from "@contexts/RunnerContext";
import { useContext } from "react";

const useActiveSchemas = (speccID, sourceApiId, destinationApiId) => {
  const {
    sourceSchemas,
    setSourceSchemas,
    setDestinationSchemas,
    destinationSchemas,
    getAPIIDForDirection,
    setActiveNodes,
    setShouldUpdateNodesFieldAndMeatballs,
  } = useContext(WizardContext);

  const deleteSchema = (endpoint) => {
    setSourceSchemas((prev) =>
      prev.filter((item) => item.endpoint !== endpoint)
    );
    setDestinationSchemas((prev) =>
      prev.filter((item) => item.endpoint !== endpoint)
    );
  };

  const deleteActiveNode = async (id, direction) => {
    await deleteActiveNodeApi(id, speccID);
    if (direction === "SOURCE") {
      setSourceSchemas((prev) => prev.filter((el) => el.activeNodeId !== id));
    } else {
      setDestinationSchemas((prev) =>
        prev.filter((el) => el.activeNodeId !== id)
      );
    }
  };

  const addEndpointsSchemas = async (endpoints, startCall, endCall) => {
    if (startCall) {
      startCall();
    }
    const models = [];
    for (let i = 0; i < endpoints.length; i++) {
      const model = {
        speccID: speccID,
        APIID: getAPIIDForDirection(endpoints[i].direction),
        endpoint: endpoints[i].url,
        name: endpoints[i].url,
        parentNode: null,
        isMatching: isMatchMode,
        pairingID: selectedPairing ? selectedPairing.id : null,
      };

      models.push(model);
    }

    const { data } = await addActiveNode(models);
    if (endCall) {
      endCall();
    }
    setShouldUpdateNodesFieldAndMeatballs(true);

    setActiveNodes((v) => [...v, ...data]);
  };

  const { isMatchMode } = useContext(MatchContext);
  const { selectedPairing } = useContext(RunnerContext);

  const toggleEndpointSchema = async (endpoint, direction) => {
    const models = [];
    for (let i = 0; i < selectedNodes.length; i++) {
      const model = {
        speccID: speccID,
        APIID: getAPIIDForDirection(direction),
        endpoint: endpoint,
        name: selectedNodes[i],
        speccpageid: parentNode.speccpageid,
        parentNode: parentNode.id,
        isMatching: isMatchMode,
        pairingID: selectedPairing ? selectedPairing.id : null,
      };

      models.push(model);
    }

    const { data } = await addActiveNode(models);
    setActiveNodes((v) => [...v, ...data]);
  };

  return {
    source: sourceSchemas,
    destination: destinationSchemas,
    toggleEndpointSchema,
    addEndpointsSchemas,
    deleteSchema,
    deleteActiveNode,
  };
};

export default useActiveSchemas;
