import { createLinkAPI, deleteLinkAPI, deleteOperationNodeApi, updateOperationNodeApi } from "@/axios/apiCalls";
import { DIRECTION, NODE_TYPES, WIZARD_COMPONENT_TYPE } from "@/constants";
import { calculateNodesBoundingRect } from "@/utils/calculateNodesBoundingRect";
import { convertDbtoNodeLinks, convertNodeToDbLinks } from "@/utils/nodeDbLinksConvert";
import { applyEdgeChanges, applyNodeChanges, getConnectedEdges } from "@xyflow/react";
import { animate } from "framer-motion/dom";
import { throttle } from "lodash";
import { nanoid } from "nanoid";
import { getNodesUpdatedPos } from "./elkJsAutoPos";

const updateNodePositionAPICall = async (node) => {
  if (node.id !== "API1" && node.id !== "API2")
    await updateOperationNodeApi(node.id, {
      positionX: node.position.x,
      positionY: node.position.y,
    });
};

const deleteNodeOnChange = async (id) => {
  await deleteOperationNodeApi(id);
};

const deleteEdgeHandler = async (linkId) => {
  await deleteLinkAPI(linkId);
};

const addEdgeHandler = async (sourceNode, destinationNode, sourceHandle, targetHandle, speccID) => {
  const data = convertNodeToDbLinks(sourceNode, destinationNode, sourceHandle, targetHandle);
  data.speccID = speccID;
  data.isMatching = false;
  data.pairingID = null;
  return await createLinkAPI(data);
};

export const createReactFlowSlice = (set, get) => ({
  center: {
    x: 0,
    y: 0,
  },
  shadow: {
    nodes: {
      byId: {},
      allIds: [],
    },
    edges: {
      byId: {},
      allIds: [],
    },
    activeNodes: {
      byId: {},
      allIds: [],
    },
    activeFields: {
      byId: {},
      allIds: [],
    },
  },
  nodes: {
    byId: {},
    allIds: [],
  },
  edges: {
    byId: {},
    allIds: [],
  },
  relation: {
    edges: { byId: {}, allIds: [] },
    handles: { byId: {}, allIds: [] },
  },
  handles: {
    byId: {},
    allIds: [],
  },
  onNodesChange: (changes) => {
    if (changes[0].type === "position" && changes[0].dragging === false) {
      const node = get().nodes.byId[changes[0].id];
      updateNodePositionAPICall(node);
      get().updateAPINodesPositionUsingBoundingRect();
    }
    if (changes[0].type === "remove") {
      deleteNodeOnChange(changes[0].id);
    }
    const nodes = applyNodeChanges(changes, get().getAllNodes());
    get().setNodes(nodes);
  },
  onEdgesChange: async (changes) => {
    if (changes[0].type === "remove") {
      await deleteEdgeHandler(changes[0].id);
      get().deleteEdge(changes[0].id);
    } else {
      const edges = applyEdgeChanges(changes, get().getAllEdges());
      get().setEdges(edges);
    }
    get().setExampleDataRows();
    get().setExampleDataGraph();
  },
  onConnect: async (connection) => {
    const tempEdgeId = nanoid();
    const sourceNode = get().getNode(connection.source);
    const destinationNode = get().getNode(connection.target);
    const sourceHandle = get().handles.byId[connection.sourceHandle];
    const targetHandle = get().handles.byId[connection.targetHandle];
    const tempEdge = {
      id: tempEdgeId,
      source: sourceNode.id,
      target: destinationNode.id,
      sourceHandle: sourceHandle.id,
      targetHandle: targetHandle.id,
      type: "loading",
    };
    get().addEdge(tempEdge);
    const edge = await addEdgeHandler(sourceNode, destinationNode, sourceHandle, targetHandle, get().speccId);
    get().deleteEdge(tempEdgeId);
    get().addEdge(convertDbtoNodeLinks(edge.data[0]));
    get().setExampleDataRows();
    get().setExampleDataGraph();
  },
  setNodes: async (nodes) => {
    for (const node of nodes) {
      const nodeId = node.id;
      set((state) => {
        const availableNode = get().nodes.byId[nodeId];
        if (availableNode) {
          state.nodes.byId[nodeId] = { ...availableNode, ...node };
        } else {
          state.nodes.byId[nodeId] = { ...node };
          state.nodes.allIds.push(nodeId);
        }
      });
    }
  },
  updateNode: (nodeId, node) => {
    set((state) => {
      state.nodes.byId[nodeId] = { ...state.nodes.byId[nodeId], ...node };
    });
  },
  addNode: (node) => {
    set((state) => {
      const nodeId = node.id;
      state.nodes.byId[nodeId] = node;
      state.nodes.allIds.push(nodeId);
    });
  },
  addRelationNode: (handle) => {
    set((state) => {
      const handleId = handle.id;
      state.relation.handles.byId[handleId] = handle;
      state.relation.handles.allIds.push(handleId);
    });
  },
  addRelationHandle: (handle) => {
    set((state) => {
      const handleId = handle.id;
      state.relation.handles.byId[handleId] = handle;
      state.relation.handles.allIds.push(handleId);
    });
  },
  removeRelationHandle: (handleId) => {
    set((state) => {
      delete state.relation.handles.byId[handleId];
      state.relation.handles.allIds = state.relation.handles.allIds.filter((id) => id !== handleId);
    });
  },
  addHandle: (handle) => {
    const handleNodeId = handle.data.nodeId;
    const node = get().nodes.byId[handleNodeId];
    if (!node) return;
    if (!node.sourceHandles) {
      set((state) => {
        state.nodes.byId[handleNodeId].sourceHandles = [];
      });
    }
    if (!node.targetHandles) {
      set((state) => {
        state.nodes.byId[handleNodeId].targetHandles = [];
      });
    }
    if (!node.defaultHandles) {
      set((state) => {
        state.nodes.byId[handleNodeId].defaultHandles = [];
      });
    }
    if (handle.data.direction === "source")
      set((state) => {
        state.nodes.byId[handleNodeId].sourceHandles.push(handle.id);
      });
    else if (handle.data.direction === "target")
      set((state) => {
        state.nodes.byId[handleNodeId].targetHandles.push(handle.id);
      });
    else
      set((state) => {
        state.nodes.byId[handleNodeId].defaultHandles.push(handle.id);
      });
    set((state) => {
      state.handles.byId[handle.id] = handle;
      state.handles.allIds.push(handle.id);
    });
  },
  removeHandle: (handleId) => {
    const handle = get().handles.byId[handleId];
    const handleNodeId = handle?.data.nodeId;
    const node = get().nodes.byId[handleNodeId];
    if (handle && node) {
      if (handle.data.direction === "source")
        set((state) => {
          state.nodes.byId[handleNodeId].sourceHandles = state.nodes.byId[handleNodeId].sourceHandles.filter((handleID) => handleID !== handle.id);
        });
      else if (handle.data.direction === "target")
        set((state) => {
          state.nodes.byId[handleNodeId].targetHandles = state.nodes.byId[handleNodeId].targetHandles.filter((handleID) => handleID !== handle.id);
        });
      else
        set((state) => {
          state.nodes.byId[handleNodeId].defaultHandles = state.nodes.byId[handleNodeId].defaultHandles.filter((handleID) => handleID !== handle.id);
        });

      set((state) => {
        delete state.handles.byId[handle.id];
        state.handles.allIds = state.handles.allIds.filter((id) => id !== handle.id);
      });
    }
  },
  deleteNode: (nodeId) => {
    const nodes = get().getAllNodes();
    const edges = get().getAllEdges();
    const node = nodes.filter((node) => node.id === nodeId)[0];
    const conectedEdges = getConnectedEdges([node], edges);
    const conectedEdgesIds = conectedEdges.map((edge) => edge.id);
    for (const connectedEdgeId of conectedEdgesIds) {
      get().deleteEdge(connectedEdgeId);
    }
    set((state) => {
      delete state.nodes.byId[nodeId];
      state.nodes.allIds = state.nodes.allIds.filter((eachId) => eachId !== nodeId);
    });
    if (node.type === "operationNode") deleteOperationNodeApi(nodeId);
  },
  getNode: (id) => {
    return get().nodes.byId[id];
  },
  getAllNodes: () => {
    return get().nodes.allIds.map((id) => get().nodes.byId[id]);
  },
  getAllEdges: () => {
    return get().edges.allIds.map((id) => get().edges.byId[id]);
  },
  getAllHandles: () => {
    return get().handles.allIds.map((id) => get().handles.byId[id]);
  },
  getHandle: (id) => {
    return get().handles.byId[id];
  },
  setEdges: async (edges) => {
    for (const edge of edges) {
      const edgeId = edge.id;
      set((state) => {
        const availableEdge = get().edges.byId[edgeId];
        if (availableEdge) {
          state.edges.byId[edgeId] = { ...availableEdge, ...edge };
        } else {
          state.edges.byId[edgeId] = { ...edge };
          state.edges.allIds.push(edgeId);
        }
      });
    }
  },
  addEdge: (edge) => {
    set((state) => {
      const edgeId = edge.id;
      state.edges.byId[edgeId] = edge;
      state.edges.allIds.push(edgeId);
    });
  },
  deleteEdge: (edgeId) => {
    set((state) => {
      delete state.edges.byId[edgeId];
      state.edges.allIds = state.edges.allIds.filter((eachId) => eachId !== edgeId);
    });
  },
  addRelationEdge: (edge) => {
    set((state) => {
      const edgeId = edge.id;
      state.relation.edges.byId[edgeId] = edge;
      state.relation.edges.allIds.push(edgeId);
    });
  },
  deleteRelationEdge: (edgeId) => {
    set((state) => {
      delete state.relation.edges.byId[edgeId];
      state.relation.edges.allIds = state.relation.edges.allIds.filter((eachId) => eachId !== edgeId);
    });
  },
  setActiveConnectionLine: (connectionLine) => {
    set({ activeConnectionLine: connectionLine });
  },
  removeActiveConnectionLine: () => {
    set({ activeConnectionLine: null });
  },
  activeConnectionLineDisableHandles: () => {
    const type = get().activeConnectionLine.type;
    for (const handle of get().getAllHandles()) {
      if (handle.data.type)
        if (handle.data.type !== type && handle.data.type !== "default" && type !== "default") {
          handle.disableHandle();
        }
    }
  },
  enableAllHandles: () => {
    for (const handle of get().getAllHandles()) {
      handle.enableHandle();
    }
  },
  autoLayout: async (fitView) => {
    const nodes = get().getAllNodes();
    const edges = get().getAllEdges();
    const layoutedNodes = await getNodesUpdatedPos(nodes, edges);
    for (const node of layoutedNodes) {
      get().changeNodePositionAndAnimate(node.id, node.position);
    }
    fitView();
    get().updateAPINodesPositionUsingBoundingRect();
    for (const node of layoutedNodes) {
      await updateNodePositionAPICall(node);
    }
  },
  updateAPINodesPositionUsingBoundingRect: () => {
    const nodes = get().getAllNodes();
    const ONNodes = nodes.filter((node) => node.id !== "API1" && node.id !== "API2");

    const boundingRect = calculateNodesBoundingRect(ONNodes);

    set((state) => {
      const API1Node = get().nodes.byId.API1;
      const API2Node = get().nodes.byId.API2;
      get().changeNodePositionAndAnimate("API1", {
        y: API1Node.position.y,
        x: boundingRect.minX - API1Node.measured.width - 150,
      });
      get().changeNodePositionAndAnimate("API2", {
        y: API2Node.position.y,
        x: boundingRect.maxX + API2Node.measured.width + 100,
      });
    });
  },
  isNodeAsOnConnected: () => {
    const links = get().getAllEdges();
    for (const link of links) {
      if (link.targetHandle === "API2-ON-connection") {
        return true;
      }
    }
    return false;
  },
  // wizard initializeNodes
  initializeNodes: (addNodeClickHandler, centerX, centerY, isMatching = false) => {
    get().updatePageCenter(centerX, centerY);
    const wizardComponentType = isMatching ? WIZARD_COMPONENT_TYPE.MATCH : WIZARD_COMPONENT_TYPE.RUN;
    const ApiNodes = [
      {
        id: "API1",
        type: "APIComponent",
        position: {
          x: 0,
          y: 0,
        },
        data: {
          direction: DIRECTION.SOURCE,
          onAddNode: addNodeClickHandler,
          nodeType: NODE_TYPES.API,
          nodeId: get().sourceAPIData.id,
          speccId: get().speccId,
          activeNodes: get().activeNodes.allIds.map((id) => get().activeNodes.byId[id]),
          sourceAPIID: get().sourceAPIData.id,
          destinationAPIID: get().destinationAPIData.id,
        },
      },
      {
        id: "API2",
        type: "APIComponent",
        position: {
          x: 1000,
          y: 0,
        },
        data: {
          direction: DIRECTION.DESTINATION,
          onAddNode: addNodeClickHandler,
          nodeType: NODE_TYPES.API,
          nodeId: get().destinationAPIData.id,
          speccId: get().speccId,
          activeNodes: get().activeNodes.allIds.map((id) => get().activeNodes.byId[id]),
          destinationAPIID: get().destinationAPIData.id,
          sourceAPIID: get().sourceAPIData.id,
          isMatching: isMatching,
        },
      },
    ];

    const operationNodes = get()
      .operationNodesFiltered.allIds.map((id) => get().operationNodesFiltered.byId[id])
      .filter((ON) => ON.type === wizardComponentType)
      .map((node) => {
        return {
          id: String(node.id),
          type: "operationNode",
          position: {
            x: node.positionX || centerX,
            y: node.positionY || centerY,
          },
          data: {
            ONConfig: get().getONConfig(node.configID),
            ONID: node.id,
            inputs: get().getONnputs(node.configID),
            nodeType: NODE_TYPES.OPERATION,
          },
        };
      });
    console.log(
      `get()
      .linksFiltered`,
      get().linksFiltered
    );
    const links = get()
      .linksFiltered.filter((link) => link.type === wizardComponentType)
      .map((link) => {
        const returnLink = convertDbtoNodeLinks(link);
        console.log("returnLink", returnLink);
        return returnLink;
      })
      .filter((link) => {
        if (link.source && link.target && link.sourceHandle && link.targetHandle) {
          return true;
        }
        return false;
      });
    const allNodes = get().getFilteredSourceActiveNodes(get().activeNodes);
    if (isMatching) {
      allNodes.push(...get().getFilteredMatchActiveNodes(get().activeNodes));
      operationNodes.push({
        id: "matchbox",
        type: "matchbox",
        position: {
          x: 500,
          y: 0,
        },
      });
    } else {
      allNodes.push(...get().getFilteredDesitantionActiveNodes(get().activeNodes));
    }

    for (const node of allNodes) {
      get().createRelationEdgeRecursively(node.id);
    }
    get().setNodes([...ApiNodes, ...operationNodes]);
    get().setEdges(links);
  },
  // End initializeNodes
  clearNodeStore: () => {
    set((state) => {
      state.nodes = {
        byId: {},
        allIds: [],
      };
      state.edges = {
        byId: {},
        allIds: [],
      };
      state.relation = {
        edges: { byId: {}, allIds: [] },
        handles: { byId: {}, allIds: [] },
      };
    });
  },
  createRelationEdgeRecursively: (nodeID) => {
    const node = get().activeNodes.byId[nodeID];
    if (node.parentNode) {
      const nodeName = node.APIID === get().sourceAPIData.id ? "API1" : "API2";
      get().addRelationEdge({
        id: `relation-edge-${node.id}`,
        source: nodeName,
        target: nodeName,
        sourceHandle: `source-${node.parentNode}`,
        targetHandle: `target-${node.id}`,
        type: "relatedNodeLink",
      });
    }
    const relatedNodes = [
      ...get()
        .activeNodes.allIds.map((id) => get().activeNodes.byId[id])
        .filter((activeNode) => activeNode.parentNode === node.id),
      ...get()
        .shadow.activeNodes.allIds.map((id) => get().shadow.activeNodes.byId[id])
        .filter((activeNode) => activeNode.parentNode === node.id),
    ];
    for (const node of relatedNodes) {
      get().createRelationEdgeRecursively(node.id);
    }
  },
  deleteRelationEdgeRecursively: (nodeID) => {
    const node = get().activeNodes.byId[nodeID];
    const relatedNodes = [
      ...get()
        .activeNodes.allIds.map((id) => get().activeNodes.byId[id])
        .filter((activeNode) => activeNode.parentNode === node?.id),
      ...get()
        .shadow.activeNodes.allIds.map((id) => get().shadow.activeNodes.byId[id])
        .filter((activeNode) => activeNode.parentNode === node?.id),
    ];
    for (const node of relatedNodes) {
      get().deleteRelationEdgeRecursively(node.id);
    }
    get().deleteRelationEdge(`relation-edge-${node.id}`);
  },
  changeNodePositionAndAnimate: (nodeId, position) => {
    const node = get().getNode(nodeId);
    const currentPosition = {
      x: node.position.x,
      y: node.position.y,
    };

    // Throttle function to limit update frequency
    const throttledUpdate = throttle((axis, value) => {
      set((state) => {
        state.nodes.byId[nodeId].position[axis] = value;
        return state;
      });
    }, 30);

    // Animate X position
    animate(currentPosition.x, position.x, {
      duration: 0.4,
      ease: "easeOut",
      type: "spring",
      onUpdate: (value) => {
        throttledUpdate("x", value);
      },
    });

    // Animate Y position
    animate(currentPosition.y, position.y, {
      duration: 0.4,
      ease: "easeOut",
      type: "spring",
      onUpdate: (value) => {
        throttledUpdate("y", value);
      },
    });
  },
  resetNodeStore: () => {
    set((state) => {
      state.speccId = null;
      state.nodes = {
        byId: {},
        allIds: [],
      };
      state.edges = {
        byId: {},
        allIds: [],
      };
      state.relationEdges = {
        byId: {},
        allIds: [],
      };
      state.handles = {
        byId: {},
        allIds: [],
      };
      state.exampleDataRows = [];
      state.exampledataIndex = null;
      state.exampleData = {
        handles: {},
        links: {},
      };
      state.activeModules = [];
      state.operationNodesConfig = [];
      state.operationNodesInnerInputConfig = [];
      state.activeConnectionLine = null;
      state.conditionalComparisons = [];
      state.activeNodes = {
        byId: {},
        allIds: [],
      };
      state.matchbox = null;
      state.activeFields = { byId: {}, allIds: [] };
      state.dataFetched = {
        initialSpeccValues: false,
      };
      state.operationNodesFiltered = {
        byId: {},
        allIds: [],
      };
    });
  },
  addShadowNode: (label, inputs, outputs) => {
    const nodeId = nanoid();
    const node = {
      id: nodeId,
      type: "shadowNode",
      position: {
        x: get().center.x,
        y: get().center.y,
      },
      data: {
        label: label,
        inputs: inputs,
        outputs: outputs,
      },
    };
    set((state) => {
      state.shadow.nodes.byId[node.id] = node;
      state.shadow.nodes.allIds.push(node.id);
    });
    return nodeId;
  },
  addShadowEdge: (sourceNode, destinationNode, sourceHandle, targetHandle) => {
    const edgeId = nanoid();
    const edge = {
      id: edgeId,
      source: sourceNode,
      target: destinationNode,
      sourceHandle: sourceHandle,
      targetHandle: targetHandle,
      type: "shadow",
    };
    set((state) => {
      state.shadow.edges.byId[edge.id] = edge;
      state.shadow.edges.allIds.push(edge.id);
    });
  },
  clearShadowNodes: () => {
    set((state) => {
      state.shadow.nodes.byId = {};
      state.shadow.nodes.allIds = [];
    });
  },
  clearShadowEdges: () => {
    set((state) => {
      state.shadow.edges.byId = {};
      state.shadow.edges.allIds = [];
    });
  },
  clearShadow: () => {
    get().clearShadowNodes();
    get().clearShadowEdges();
  },
  updatePageCenter: (centerX, centerY) => {
    set((state) => {
      state.center.x = centerX;
      state.center.y = centerY;
    });
  },
  addShadowActiveField: (field) => {
    const id = nanoid();
    field.type = "SHADOW_FIELD";
    set((state) => {
      state.shadow.activeFields.byId[id] = field;
      state.shadow.activeFields.allIds.push(id);
    });
    return id;
  },
  clearShadowActiveField: () => {
    set((state) => {
      state.shadow.activeFields.byId = {};
      state.shadow.activeFields.allIds = [];
    });
  },
  addShadowActiveNode: (node) => {
    const id = nanoid();
    node.type = "SHADOW_NODE";
    set((state) => {
      state.shadow.activeNodes.byId[id] = node;
      state.shadow.activeNodes.allIds.push(id);
    });
    return id;
  },
  clearShadowActiveNode: () => {
    set((state) => {
      state.shadow.activeNodes.byId = {};
      state.shadow.activeNodes.allIds = [];
    });
  },
});
