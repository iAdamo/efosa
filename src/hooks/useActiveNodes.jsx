import { WizardContext } from "@contexts/WizardContext";
import { addActiveNode, deleteActiveNodeApi } from "@axios/apiCalls";

import { MatchContext } from "@contexts/MatchContext";
import { RunnerContext } from "@contexts/RunnerContext";
import { useContext } from "react";

const useActiveNodes = () => {
  const { activeNodes, setActiveNodes, speccID } = useContext(WizardContext);

  const deleteNode = async (activeNode, callFunction) => {
    await deleteActiveNodeApi(activeNode.id, speccID).then(() => {
      if (callFunction) callFunction();
    });
    setActiveNodes((prev) => prev.filter((el) => el.id !== activeNode.id));
  };

  const { isMatchMode } = useContext(MatchContext);
  const { selectedPairing } = useContext(RunnerContext);

  const activateNode = async (endpoint, direction) => {
    const models = [];
    for (let i = 0; i < selectedNodes.length; i++) {
      const model = {
        speccID: speccID,
        APIID: getAPIIDForDirection(direction),
        endpoint: endpoint,
        name: selectedNodes[i],
        parentNode: parentNode.id,
        isMatching: isMatchMode,
        pairingID: selectedPairing && isMatchMode ? selectedPairing.id : null,
      };

      models.push(model);
    }

    const { data } = await addActiveNode(models);
    setActiveNodes((v) => [...v, ...data]);
  };

  return {
    activateNode,
    deleteNode,
  };
};

export default useActiveNodes;
