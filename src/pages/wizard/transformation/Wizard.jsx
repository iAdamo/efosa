import { WizardContext } from "@/contexts/WizardContext";
import useGlobalStore from "@/store/globalStore";
import { useDrop } from "@react-aria/dnd";
import { Background, ReactFlow, useReactFlow, useStoreApi } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import APIComponent from "./Components/APIComponent";
import OperationNodeBlock from "./Components/OperationNodesArea/OperationNodeBlock";
import ConnectionLine from "./ConnectionLine";
import Edge from "./Edge";
import LoadingEdge from "./LoadingEdge";
import LoadingNode from "./LoadingNode";
import Matchbox from "./Matchbox";
import PlaceholderON from "./PlaceholderON";
import { RelatedNodesLinks } from "./RelatedNodesLinks";
import ShadowEdge from "./ShadowEdge";

const selector = (state) => ({
  allNodes: state.nodes.allIds.map((id) => state.nodes.byId[id]),
  allEdges: state.edges.allIds.map((id) => state.edges.byId[id]),
  allShadowNodes: state.shadow.nodes.allIds.map((id) => state.shadow.nodes.byId[id]),
  allShadowEdges: state.shadow.edges.allIds.map((id) => state.shadow.edges.byId[id]),
  handles: state.handles,
  activeConnectionLine: state.activeConnectionLine,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
  addEdge: state.addEdge,
  deleteEdge: state.deleteEdge,
  onReconnect: state.onReconnect,
  setNodes: state.setNodes,
  setEdges: state.setEdges,
  RelationEdges: state.relation.edges,
  initializeNodes: state.initializeNodes,
  updateAPINodesPositionUsingBoundingRect: state.updateAPINodesPositionUsingBoundingRect,
  initialSpeccValuesFetched: state.dataFetched.initialSpeccValues,
  updatePageCenter: state.updatePageCenter,
  addOperationNode: state.addOperationNode,
  clearNodeStore: state.clearNodeStore,
});

function Wizard({ addNodeClickHandler, type }) {
  const nodeTypes = useMemo(
    () => ({
      APIComponent: (props) => <APIComponent {...props} renderType={type} />,
      operationNode: OperationNodeBlock,
      loadingNode: LoadingNode,
      shadowNode: PlaceholderON,
      matchbox: Matchbox,
    }),
    [type]
  );

  const edgeTypes = useMemo(
    () => ({
      default: (props) => <Edge {...props} renderType={type} />,
      loading: LoadingEdge,
      relatedNodeLink: RelatedNodesLinks,
      shadow: ShadowEdge,
    }),
    [type]
  );

  const store = useStoreApi();
  const { speccID } = useParams();

  const {
    allEdges,
    allNodes,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addEdge,
    deleteEdge,
    onReconnect,
    initializeNodes,
    updateAPINodesPositionUsingBoundingRect,
    initialSpeccValuesFetched,
    allShadowNodes,
    allShadowEdges,
    updatePageCenter,
    addOperationNode,
    clearNodeStore,
    RelationEdges,
    handles,
  } = useGlobalStore(selector);

  const { getAndSetOKStatuses } = useContext(WizardContext);

  const { fitView, screenToFlowPosition } = useReactFlow();
  const ref = useRef(null);
  const [viewportPosition, setViewportPosition] = useState();

  const { dropProps, isDropTarget } = useDrop({
    ref,
    async onDrop(e) {
      console.log("event", e);
      const items = await Promise.all(e.items.filter((item) => item.kind === "text" && item.types.has("text/plain")).map((item) => item.getText("text/plain")));
      const data = JSON.parse(items[0]);
      const operationNode = data["selectedNode"];
      console.log("event", viewportPosition.x, e.x, viewportPosition.y, e.y);
      const pos = screenToFlowPosition({
        x: viewportPosition.x + e.x,
        y: viewportPosition.y + e.y,
      });
      addOperationNode(operationNode.id, pos);
    },
  });

  useEffect(() => {
    if (!initialSpeccValuesFetched) return;
    (async () => {
      const {
        height,
        width,
        transform: [transformX, transformY, zoomLevel],
      } = store.getState();
      setViewportPosition({
        x: transformX,
        y: transformY,
      });
      const zoomMultiplier = 1 / zoomLevel;
      const centerX = -transformX * zoomMultiplier + (width * zoomMultiplier) / 2;
      const centerY = -transformY * zoomMultiplier + (height * zoomMultiplier) / 2;
      switch (type) {
        case "wizard":
        case "executionSummary":
          initializeNodes(addNodeClickHandler, centerX, centerY);
          break;
        case "matching":
          initializeNodes(addNodeClickHandler, centerX, centerY, true);
          break;
      }
      // updateAPINodesPositionUsingBoundingRect();
      // fitView();
    })();

    setTimeout(() => {
      updateAPINodesPositionUsingBoundingRect();
      fitView({ padding: 100 });
    }, 500);

    return () => {
      clearNodeStore();
    };
  }, [initializeNodes, updateAPINodesPositionUsingBoundingRect, fitView, initialSpeccValuesFetched, type]);

  const updateCenter = useCallback(() => {
    const {
      height,
      width,
      transform: [transformX, transformY, zoomLevel],
    } = store.getState();
    const zoomMultiplier = 1 / zoomLevel;
    const centerX = -transformX * zoomMultiplier + (width * zoomMultiplier) / 2;
    const centerY = -transformY * zoomMultiplier + (height * zoomMultiplier) / 2;
    updatePageCenter(centerX, centerY);
  }, [store, updatePageCenter]);

  const additionalReactFlowProps = useMemo(() => {
    switch (type) {
      case "wizard":
        return {
          onNodesChange,
          onEdgesChange: async (changes) => {
            await onEdgesChange(changes);
            if (changes[0]?.type === "remove") {
              await getAndSetOKStatuses(false, ["CONNECT"]);
            }
          },
          onConnect: async (connection) => {
            await onConnect(connection, speccID);
            await getAndSetOKStatuses(false, ["CONNECT"]);
          },
          nodesDraggable: true,
          panOnDrag: true,
        };
      case "executionSummary":
        return {
          onNodesChange,
          nodesDraggable: false,
          nodesConnectable: false,
          panOnDrag: false,
        };
      case "matching":
        return {
          onNodesChange,
          onConnect: async (connection) => {
            console.log(connection);
            if (connection.source === "matchbox" || connection.target === "matchbox") {
              addEdge({ ...connection, id: `${connection.sourceHandle}-${connection.targetHandle}` });
            }
          },
          onEdgesChange: async (changes) => {
            if (changes[0].type === "remove") {
              deleteEdge(changes[0].id);
            }
          },
          nodesDraggable: false,
          nodesConnectable: true,
          panOnDrag: true,
        };
      default:
        return null;
    }
  }, [onNodesChange, onEdgesChange, onConnect, getAndSetOKStatuses, speccID, type]);

  const controlsProps = useMemo(() => {
    switch (type) {
      case "wizard":
      case "matching":
        return null;
      case "executionSummary":
        return {
          showZoom: true,
          showFitView: true,
          showInteractive: false,
        };
      default:
        return null;
    }
  }, [type]);

  return (
    <div {...dropProps} ref={ref} className="w-full h-full relative" data-is-drop-target={isDropTarget}>
      <ReactFlow
        nodes={[...allNodes, ...allShadowNodes]}
        edges={[...allEdges, ...allShadowEdges, ...RelationEdges.allIds.map((id) => RelationEdges.byId[id])]}
        {...additionalReactFlowProps}
        onReconnectStart={onReconnect}
        connectionLineComponent={ConnectionLine}
        fitView
        nodeTypes={nodeTypes}
        colorMode={"wizard"}
        // proOptions={{ hideAttribution: true }}
        edgeTypes={edgeTypes}
        onMoveEnd={updateCenter}>
        <Background color="transperent" variant="none" />
        {/* <Controls {...controlsProps} /> */}
        {/* <MiniMap /> */}
      </ReactFlow>
    </div>
  );
}

export default Wizard;
