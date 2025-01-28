import { runModule } from "@/axios/apiCalls";
import ModalContainer from "@/components/modals/ModalContainer";
import PopoverContainer from "@/components/Popovers/PopoverContainer";
import { WizardContext } from "@/contexts/WizardContext";
import Webhook from "@/pages/wizard/webhook";
import useGlobalStore from "@/store/globalStore";
import { ELEMENTS, TOGGLES, VALUES } from "@/store/uiSlice";
import groupUrls from "@utils/groupUrls";
import { useContext, useEffect } from "react";
import { useShallow } from "zustand/react/shallow";
import FilterData from "../filter-data";
import GetDataPage from "../get-data";
import GroupData from "../group-data";
import TransferPage from "../transfer";
import UniqueIdentifier from "../unique-identifier";
import AddNodeModal from "./Components/AddNodeModal/AddNodeModal";
import ToolBar from "./Components/AddNodeModal/ToolBar";
import ExampleDataSelector from "./Components/ExampleDataSelector/ExampleDataSelector";
import NodeActivationModal from "./Components/OperationNodesArea/SearchNode/NodeActivationModal";
import Wizard from "./Wizard";

export default function TransformationPage(props) {
  const {
    setSidebar,
    setToggle,
    selectedModal,
    selectedPopover,
    resetValue,
    selectedSidebar,
    removeSidebar,
    getFilteredSourceActiveNodes,
    activeNodes,
    exampleDataRows,
    setExampleDataGraph,
    setDefaultSidebar,
  } = useGlobalStore((s) => ({
    setSidebar: s.UI.setSidebar,
    setToggle: s.UI.setToggle,
    selectedModal: s.UI.ELEMENTS.MODAL,
    selectedSidebar: s.UI.ELEMENTS.SIDEBAR,
    selectedPopover: s.UI.ELEMENTS.POPOVER,
    resetValue: s.UI.resetValue,
    removeSidebar: s.UI.removeSidebar,
    activeNodes: s.activeNodes,
    getFilteredSourceActiveNodes: s.getFilteredSourceActiveNodes,
    exampleDataRows: s.exampleDataRows,
    setExampleDataGraph: s.setExampleDataGraph,
    setDefaultSidebar: s.UI.setDefaultSidebar,
  }));

  const selector = (state) => ({
    setSelectedMenuItem: state.UI.setSelectedMenuItem,
  });
  const { setSelectedMenuItem } =
    useGlobalStore(useShallow(selector));

  const { sourceAPIName, destinationAPIName } = useContext(WizardContext);

  useEffect(() => {
    setToggle(TOGGLES.WIZARD_MODE.RUN);
    setSidebar(ELEMENTS.SIDEBAR.RUN_PROGRESS);
    setDefaultSidebar(ELEMENTS.SIDEBAR.RUN_PROGRESS);
  }, []);

  const addNodeClickHandler = (endpoints, direction) => {
    setAddNodeModeValues({
      endpoints: groupUrls(endpoints, direction),
      direction,
    });
  };

  const handleCloseClick = () => {
    setSelectedMenuItem("Add nodes");
    removeSidebar();
  }

  return (
    <>
      <div className="relative w-full">
        <Wizard addNodeClickHandler={addNodeClickHandler} type="wizard" />
        <ToolBar />
      </div>
      {selectedModal === ELEMENTS.MODAL.RUN.GET_DATA && (
        <ModalContainer open title="Get Data" onClose={handleCloseClick} {...props.modalContainerProps}>
          <GetDataPage
            parentNode={getFilteredSourceActiveNodes(activeNodes)}
            fetchDataFunction={async (pageNumber) => await runModule(speccID, module.id, { pageNumber })}
          />
        </ModalContainer>
      )}
      {selectedModal === ELEMENTS.MODAL.RUN.TRANSFER && (
        <ModalContainer open title="Transfer" onClose={handleCloseClick} {...props.modalContainerProps}>
          <TransferPage />
        </ModalContainer>
      )}
      {selectedModal === ELEMENTS.MODAL.RUN.GROUP && (
        <ModalContainer open title="Group Data" onClose={handleCloseClick} {...props.modalContainerProps}>
          <GroupData />
        </ModalContainer>
      )}
      {selectedModal === ELEMENTS.MODAL.RUN.FILTER && (
        <ModalContainer open title="Filter Data" onClose={handleCloseClick} {...props.modalContainerProps}>
          <FilterData />
        </ModalContainer>
      )}
      {selectedModal === ELEMENTS.MODAL.RUN.WEBHOOK && (
        <ModalContainer open title="Webhook" onClose={handleCloseClick} {...props.modalContainerProps}>
          <Webhook />
        </ModalContainer>
      )}
      {(selectedModal === ELEMENTS.MODAL.RUN.ADD_NODE_DESTINATION ||
        selectedModal === ELEMENTS.MODAL.RUN.ADD_NODE_SOURCE ||
        selectedModal === ELEMENTS.MODAL.MATCH.ADD_NODE_DESTINATION) && (
          <ModalContainer
            open
            title={<><div className="flex"><div>Create structure</div>
              {selectedModal === ELEMENTS.MODAL.RUN.ADD_NODE_SOURCE && (
                <div className="bg-secondary-pink-light-1 px-2 bg-opacity-15 rounded-base flex font-semibold uppercase text-secondary-pink-light-1 text-xs items-center ml-2">
                  {sourceAPIName}
                </div>
              )}

              {(selectedModal === ELEMENTS.MODAL.RUN.ADD_NODE_DESTINATION || selectedModal === ELEMENTS.MODAL.MATCH.ADD_NODE_DESTINATION) && (
                <div className="bg-secondary-aqua-1 px-2 bg-opacity-15 rounded-base flex font-semibold uppercase text-secondary-aqua-1 text-xs items-center ml-2">
                  {destinationAPIName}
                </div>
              )}

            </div>

            </>
            }
            onClose={() => {
              resetValue(VALUES.SELECTED_NODE);
              if (selectedSidebar === ELEMENTS.SIDEBAR.NODE_PROPERTIES) {
                removeSidebar(ELEMENTS.SIDEBAR.NODE_PROPERTIES);
              }
            }}
            {...props.modalContainerProps}>
            <AddNodeModal />
          </ModalContainer >
        )
      }
      <PopoverContainer
        open={selectedPopover === ELEMENTS.POPOVER.RUN.TRANSFER_KEY}
        onClose={() => console.log("Modal closed")}
        paperStyle={"border border-grey-17 border-opacity-20 !shadow-modal"}
        column={4.2}
        row={2}>
        <UniqueIdentifier />
      </PopoverContainer>
      <PopoverContainer
        open={selectedPopover === ELEMENTS.POPOVER.RUN.EXAMPLE_DATA}
        onClose={() => console.log("Modal closed")}
        paperStyle={"border border-grey-17 border-opacity-20 !shadow-modal"}
        column={3.3}
        widthClass="col-width-[6/12]"
        row={2}>
        <ExampleDataSelector exampleDataRows={exampleDataRows} direction="SOURCE" renderType={"wizard"} />
      </PopoverContainer>
      <NodeActivationModal />
    </>
  );
}
