import ProjectWrapper from "@/contexts/ProjectContext";
import { WizardContext } from "@/contexts/WizardContext";
import { ReactFlowProvider } from "@xyflow/react";
import { AnimatePresence } from "framer-motion";
import { useContext, useState } from "react";
import { useLocation } from "react-router-dom";
import AnimatedOutlet from "../AnimatedOutlet";
import Utils from "./Utils";

import CustomCollapse from "@/components/CustomCollapse";
import ModalContainer from "@/components/modals/ModalContainer";
import SidebarContainer from "@/components/SSidebar/SidebarContainer";
import useResponsiveGrid from "@/hooks/useResponsiveGrid";
import CustomControls from "@/pages/wizard/transformation/CustomControls";
import useGlobalStore from "@/store/globalStore";
import { ELEMENTS, TOGGLES, VALUES } from "@/store/uiSlice";
import { Collapse } from "@mui/material";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../dashboard/Sidebar";
import AISidebar from "./ai/AISidebar";
import NodeProperties from "./NodeProperties";
import OperationNodesSidebar from "./operation-nodes-sidebar";
import Breadcrumb from "./topbar/Breadcrumb";
import MatchProgressBox from "./topbar/MatchProgressBox";
import ProgressBox from "./topbar/ProgressBox";
import Topbar from "./topbar/Topbar";
import VariableMenuSidebar from "./variable-menu-sidebar";
import CreateVariableMenu from "./variable-menu-sidebar/CreateVariableMenu";
import XOfResolver from "./Xof/XOfResolver";

export default function WizardLayout({ isRender = true }) {
  const location = useLocation();
  const { speccID } = useParams();
  const { project, speccName } = useContext(WizardContext);
  const {
    resetNodeStore,
    fetchNodeData,
    updateEndpoints,
    selectedModal,
    selectedSidebar,
    wizardMode,
    resetValue,
    removeSidebar,
  } = useGlobalStore((s) => ({
    resetNodeStore: s.resetNodeStore,
    fetchNodeData: s.fetchNodeData,
    updateEndpoints: s.updateEndpoints,
    selectedSidebar: s.UI.ELEMENTS.SIDEBAR,
    selectedModal: s.UI.ELEMENTS.MODAL,
    wizardMode: s.UI.TOGGLES.WIZARD_MODE,
    resetValue: s.UI.resetValue,
  }));
  const [data, setData] = useState({});
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isErrored, setIsErrored] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [aiSideOpen, setAiSideOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const { calculatePosition } = useResponsiveGrid();
  const { x, y } = calculatePosition(0, 0);

  const handleToggle = () => {
    setOpen(!open);
  };

  const activateSpecc = () => {
    setIsLoading(true);

    const timeoutId = setTimeout(() => {
      setIsLoading(false);
      setIsAuthenticated(true);
      //setIsErrored(true);
      return () => clearTimeout(timeoutId);
    }, 2500);
  };

  useEffect(() => {
    fetchNodeData(speccID);
    updateEndpoints(speccID);
    return () => {
      resetNodeStore();
    };
  }, [resetNodeStore, fetchNodeData, updateEndpoints, speccID]);

  const [showTab, setShowTab] = useState(true);

  return (
    <ReactFlowProvider>
      <ProjectWrapper projectId={project.id}>
        <div className="h-screen overflow-hidden flex flex-col w-full relative bg-custom-blackPearl">
          <div className="flex-grow flex">
            <CustomCollapse
              open={open}
              handleToggle={handleToggle}
              collapsedMinSize={84}
              tooltipText={"Collapse menu"}
              collapseButton={false}
            >
              <Sidebar collapsed={!open} />
            </CustomCollapse>
            <div className="w-full h-full flex flex-grow  flex-col relative">
              <div
                className="absolute lg:left-s20 xl:left-s40 node-overlay flex items-start col-width-[10.2/12]"
                style={{ top: y }}
              >
                <Breadcrumb
                  projectId={project.id}
                  speccName={speccName}
                  speccID={speccID}
                />
                <Topbar />
              </div>
              <SidebarContainer
                cannotBeClosed
                open={selectedSidebar === ELEMENTS.SIDEBAR.RUN_PROGRESS}
              >
                <Collapse
                  id="run-progress"
                  orientation="vertical"
                  in={showTab}
                  collapsedSize={40}
                >
                  <ProgressBox showTab={showTab} setShowTab={setShowTab} />
                </Collapse>
              </SidebarContainer>
              <SidebarContainer
                cannotBeClosed
                open={selectedSidebar === ELEMENTS.SIDEBAR.MATCH_PROGRESS}
              >
                <MatchProgressBox />
              </SidebarContainer>
              <SidebarContainer
                open={selectedSidebar === ELEMENTS.SIDEBAR.NODE_PROPERTIES}
                onClose={() => {
                  resetValue(VALUES.SELECTED_NODE);
                  resetValue(VALUES.SELECTED_OPERATION_NODE);
                }}
              >
                <NodeProperties />
              </SidebarContainer>
              {selectedModal === ELEMENTS.MODAL.XOF_RESOLVER && (
                <ModalContainer open title="Resolve">
                  <XOfResolver />
                </ModalContainer>
              )}
              <AnimatePresence mode="wait">
                <AnimatedOutlet key={location.pathname} />
              </AnimatePresence>
            </div>
            {isRender && (
              <>
                <AISidebar />
                <Utils />
              </>
            )}

            {selectedSidebar === ELEMENTS.SIDEBAR.OPERATION_NODES &&
              wizardMode === TOGGLES.WIZARD_MODE.RUN && (
                <motion.div
                  layout
                  initial={{ width: 0 }}
                  className="absolute z-overlay h-[calc(100%-96px)] [&>*:first-child]:!min-w-0"
                  animate={{ width: "min-content" }}
                  style={{ top: y, right: x }}
                  transition={{
                    opacity: { ease: "linear" },
                    layout: { duration: 0.8 },
                  }}
                >
                  <OperationNodesSidebar />
                </motion.div>
              )}

            {selectedSidebar === ELEMENTS.SIDEBAR.VARIABLE_MENU &&
              wizardMode === TOGGLES.WIZARD_MODE.RUN && (
                <motion.div
                  layout
                  initial={{ width: 0 }}
                  className="absolute z-dialog-overlay h-[calc(100%-96px)] [&>*:first-child]:!min-w-0"
                  animate={{ width: "min-content" }}
                  style={{ top: y, right: x }}
                  transition={{
                    opacity: { ease: "linear" },
                    layout: { duration: 0.8 },
                  }}
                >
                  <VariableMenuSidebar />
                </motion.div>
              )}

            {selectedSidebar === ELEMENTS.SIDEBAR.CREATE_VARIABLE_MENU &&
              wizardMode === TOGGLES.WIZARD_MODE.RUN && (
                <motion.div
                  layout
                  initial={{ width: 0 }}
                  className="absolute z-dialog-overlay h-[calc(100%-96px)] [&>*:first-child]:!min-w-0"
                  animate={{ width: "min-content" }}
                  style={{ top: y, right: x }}
                  transition={{
                    opacity: { ease: "linear" },
                    layout: { duration: 0.8 },
                  }}
                >
                  <CreateVariableMenu />
                </motion.div>
              )}
          </div>
          {isRender && <CustomControls />}
        </div>
      </ProjectWrapper>
    </ReactFlowProvider>
  );
}
