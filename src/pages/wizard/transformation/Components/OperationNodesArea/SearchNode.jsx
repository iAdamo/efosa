import ModalContainer from "@/components/modals/ModalContainer";
import { DIRECTION } from "@/constants";
import useGlobalStore from "@/store/globalStore";
import { ELEMENTS, VALUES } from "@/store/uiSlice";
import { Button, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from "@mui/material";
import { useEffect, useState } from "react";
import AddNodeModal from "../AddNodeModal/AddNodeModal";
import NodeBlock from "../NodeBlock";

function SearchNode({ ON }) {
  const [selectedDirection, setSelectedDirection] = useState(null);
  const [nodes, setNodes] = useState(null);
  const [activatedParentNode, setActivatedParentNode] = useState(null);

  const { setModal, selectedModal, speccID, setValue, getNodeDirection } = useGlobalStore((s) => ({
    setModal: s.UI.setModal,
    speccID: s.speccId,
    selectedModal: s.UI.ELEMENTS.MODAL,
    setValue: s.UI.setValue,
    getNodeDirection: s.getNodeDirection,
  }));

  useEffect(() => {
    setNodes(ON?.activeNodes);
  }, [ON?.activeNodes]);

  useEffect(() => {
    if (nodes) {
      const allNodes = nodes.allIds.map((id) => nodes.byId[id]);
      const parentNode = allNodes.find((node) => node.parentNode === null);
      if (parentNode) {
        setActivatedParentNode(parentNode);
        setSelectedDirection(getNodeDirection(parentNode.APIID));
      }
    }
  }, [nodes]);

  const handleChange = (event) => {
    setSelectedDirection(event.target.value);
  };

  const handleSelectEndpoint = () => {
    setModal(selectedDirection === DIRECTION.SOURCE ? ELEMENTS.MODAL.ON.ADD_NODE_SOURCE : ELEMENTS.MODAL.ON.ADD_NODE_DESTINATION);
    setValue(VALUES.SELECTED_OPERATION_NODE, ON.id);
  };

  return (
    <div>
      {activatedParentNode === null && (
        <>
          <FormControl>
            <FormLabel>Select:</FormLabel>
            <RadioGroup value={selectedDirection} onChange={handleChange} row>
              <FormControlLabel value={DIRECTION.SOURCE} control={<Radio />} label="Source" />
              <FormControlLabel value={DIRECTION.DESTINATION} control={<Radio />} label="Destination" />
            </RadioGroup>
          </FormControl>
          {selectedDirection !== null && (
            <Button variant="contained" color="primary" onClick={handleSelectEndpoint} style={{ marginTop: "10px" }}>
              Select Endpoint
            </Button>
          )}
        </>
      )}

      {activatedParentNode && (
        <div className="mt-10 w-max flex flex-col gap-[15px]">
          <NodeBlock node={activatedParentNode} speccId={speccID} addNodeClickHandler={() => {}} direction={selectedDirection} isON ON={ON} />
        </div>
      )}
      {(selectedModal === ELEMENTS.MODAL.ON.ADD_NODE_DESTINATION || selectedModal === ELEMENTS.MODAL.ON.ADD_NODE_SOURCE) && (
        <ModalContainer
          open
          title="Add Node"
          onClose={() => {
            resetValue(VALUES.SELECTED_NODE);
            if (selectedSidebar === ELEMENTS.SIDEBAR.NODE_PROPERTIES) {
              removeSidebar(ELEMENTS.SIDEBAR.NODE_PROPERTIES);
            }
          }}>
          <AddNodeModal ON={ON} parentNode={activatedParentNode} />
        </ModalContainer>
      )}
    </div>
  );
}

export default SearchNode;
