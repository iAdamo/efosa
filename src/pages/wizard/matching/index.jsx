import ModalContainer from "@/components/modals/ModalContainer";
import PopoverContainer from "@/components/Popovers/PopoverContainer";
import AnimatedOutlet from "@/layout/AnimatedOutlet";
import useGlobalStore from "@/store/globalStore";
import { ELEMENTS, TOGGLES } from "@/store/uiSlice";
import { AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import GetDataPage from "../get-data";
import AddNodeModal from "../transformation/Components/AddNodeModal/AddNodeModal";
import UniqueIdentifier from "../unique-identifier";
import Results from "./results";
import Transfer from "./transfer";

function Matching() {
  const location = useLocation();
  const { setToggle, setSidebar, selectedModal, selectedPopover, setDefaultSidebar } = useGlobalStore((s) => ({
    setSidebar: s.UI.setSidebar,
    setToggle: s.UI.setToggle,
    selectedModal: s.UI.ELEMENTS.MODAL,
    selectedPopover: s.UI.ELEMENTS.POPOVER,
    setDefaultSidebar: s.UI.setDefaultSidebar,
  }));

  useEffect(() => {
    setToggle(TOGGLES.WIZARD_MODE.MATCH);
    setSidebar(ELEMENTS.SIDEBAR.MATCH_PROGRESS);
    setDefaultSidebar(ELEMENTS.SIDEBAR.MATCH_PROGRESS);
  }, []);

  return (
    <div className="relative w-full h-full border-[4px] border-highlight-yellow rounded-api-component">
      <AnimatePresence mode="wait">
        <ModalContainer
          title={"Change Structure"}
          open={selectedModal === ELEMENTS.MODAL.MATCH.ADD_NODE_DESTINATION || selectedModal === ELEMENTS.MODAL.RUN.ADD_NODE_SOURCE}>
          <AddNodeModal />
        </ModalContainer>
        <ModalContainer title={"Get data"} open={selectedModal === ELEMENTS.MODAL.MATCH.GET_DATA_SOURCE}>
          <GetDataPage />
        </ModalContainer>
        <ModalContainer title={"Get data"} open={selectedModal === ELEMENTS.MODAL.MATCH.GET_DATA_DESTINATION}>
          <GetDataPage />
        </ModalContainer>
        <ModalContainer title={"Results"} open={selectedModal === ELEMENTS.MODAL.MATCH.RESULTS}>
          <Results />
        </ModalContainer>
        <ModalContainer title={"Results from only"} open={selectedModal === ELEMENTS.MODAL.MATCH.TRANSFER}>
          <Transfer />
        </ModalContainer>
        <PopoverContainer
          open={selectedPopover === ELEMENTS.POPOVER.MATCH.TRANSFER_KEY}
          onClose={() => console.log("Modal closed")}
          paperStyle={"border border-grey-17 border-opacity-20 !shadow-modal"}
          column={4.2}
          row={2}>
          <UniqueIdentifier />
        </PopoverContainer>
        <AnimatedOutlet key={location.pathname} />
      </AnimatePresence>
    </div>
  );
}

export default Matching;
