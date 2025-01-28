import {
  addActiveFieldApi,
  addActiveNode,
  addConditionRow,
  addOperationNodeApi,
  deleteActiveFieldApi,
  deleteActiveNodeApi,
  deleteConditionRow,
  getActiveNodesApi,
  getModuleInput,
  getSpecInitialValuesAPI,
  runModule,
  updateActiveFieldDefaultValueApi,
  updateConditionRow,
  updateOperationNodeInputApi,
  updateSwitch,
} from "@/axios/apiCalls";
import { nanoid } from "nanoid";

import {
  addActiveONFieldApi,
  addActiveONNodeApi,
  deleteActiveONFieldApi,
  deleteActiveONNodeApi,
} from "@/axios/ONAPICalls";
import {
  DIRECTION,
  modules,
  NODE_TYPES,
  WIZARD_COMPONENT_TYPE,
} from "@/constants";

export const DATA = {
  ACTIVE_NODE: {
    ONE: "DATA.ACTIVE_NODE.ONE",
    ALL: "DATA.ACTIVE_NODE.ALL",
    SOURCE: "DATA.ACTIVE_NODE.SOURCE",
    DESTINATION: "DATA.ACTIVE_NODE.DESTINATION",
  },
  ACTIVE_FIELD: {
    NODE: "DATA.ACTIVE_FIELD.NODE",
    ALL: "DATA.ACTIVE_FIELD.ALL",
    SOME: "DATA.ACTIVE_FIELD.SOME",
  },
};

export const createWizardSlice = (set, get) => ({
  dataFetched: {
    initialSpeccValues: false,
  },
  activeNodes: {
    byId: {},
    allIds: [],
  },
  activeFields: {
    byId: {},
    allIds: [],
  },
  exampleDataRows: [],
  exampledataIndex: null,
  exampleData: {
    handles: {},
    links: {},
  },
  activeModules: [],
  matchingActivated: false,
  matchbox: null,
  operationNodesConfig: [],
  operationNodesFiltered: {
    byId: {},
    allIds: [],
  },
  operationNodesInnerInputConfig: [],
  activeConnectionLine: null,
  conditionalComparisons: [],
  speccId: null,
  sourceAPIID: null,
  destinationAPIID: null,
  sourceAPIData: {},
  destinationAPIData: {},
  transferKey: null,
  meatballs: [],
  selectedFieldID: null,
  selectedVariableID: null,
  createdVariableID: null,
  variableObjectType: null,

  fetchNodeData: async (speccId) => {
    // already Fetch
    if (get().dataFetched.initialSpeccValues) return;
    const res = await getSpecInitialValuesAPI(speccId);
    const activeNodes = res.activeNodes;
    const sourceAPIID = res.sourceAPIID;
    const destinationAPIID = res.destinationAPIID;
    const linksFiltered = res.links;
    const operationNodesConfig = res.operationNodesConfig;
    const conditionalComparisons = res.conditionalComparisons;
    const activeModules = res.activeModules;
    const matchingActivated = res.matchingActivated;
    const matchbox = res.matchbox;
    const meatballs = res.meatballs;
    const transformationModule = activeModules.find(
      (module) => module.config.name === modules.TRANSFORMATION
    );
    const sourceAPIName = res.sourceAPIName;
    const destinationAPIName = res.destinationAPIName;
    const sourceAPIDescription = res.sourceAPIDescription;
    const destinationAPIDescription = res.destinationAPIDescription;
    const transferKey = res.transferkey;
    const operationNodesInnerInputConfig = res.operationNodeConfigInnerInput;
    const activeFields = res.activeFields;
    const webhook = res.webhook;
    const webhookVariables = res.webhookVariables;

    if (transformationModule) {
      const exampleDataRows = await getModuleInput(
        speccId,
        transformationModule.id
      );
      exampleDataRows &&
        set((state) => {
          state.exampleDataRows = exampleDataRows.listOfDataObjects;
        });
    }
    const operationNodesFiltered = res.operationNodes.filter((ON) => {
      if (ON.pairingID == null) {
        return true;
      }
      return false;
    });
    for (const field of activeFields) {
      set((state) => {
        state.activeFields.byId[field.id] = field;
        state.activeFields.allIds.push(field.id);
      });
    }
    for (const node of activeNodes) {
      set((state) => {
        state.activeNodes.byId[node.id] = node;
        state.activeNodes.allIds.push(node.id);
      });
    }
    for (const ON of operationNodesFiltered) {
      set((state) => {
        state.operationNodesFiltered.byId[ON.id] = {
          ...ON,
          activeNodes: {
            allIds: ON.activeNodes.map((activeNodes) => activeNodes.id),
            byId: ON.activeNodes.reduce((acc, activeNode) => {
              acc[activeNode.id] = activeNode;
              return acc;
            }, {}),
          },
          activeFields: {
            allIds: ON.activeFields.map((activeFields) => activeFields.id),
            byId: ON.activeFields.reduce((acc, activeField) => {
              acc[activeField.id] = activeField;
              return acc;
            }, {}),
          },
        };
        state.operationNodesFiltered.allIds.push(ON.id);
      });
    }
    set((state) => {
      state.activeModules = activeModules;
      state.operationNodesConfig = operationNodesConfig;
      state.conditionalComparisons = conditionalComparisons;
      state.operationNodesInnerInputConfig = operationNodesInnerInputConfig;
      state.speccId = speccId;
      state.meatballs = meatballs;
      state.matchingActivated = matchingActivated;
      state.matchbox = matchbox;
      state.linksFiltered = linksFiltered;
      state.transferKey = transferKey;
      state.sourceAPIData = {
        name: sourceAPIName,
        id: sourceAPIID,
        description: sourceAPIDescription,
      };
      state.destinationAPIData = {
        name: destinationAPIName,
        id: destinationAPIID,
        description: destinationAPIDescription,
      };
      state.dataFetched.initialSpeccValues = true;
      state.webhook = webhook;
      state.webhookVariables = webhookVariables;
    });
  },
  getFilteredSourceActiveNodes: (activeNodes) => {
    return activeNodes.allIds
      .map((id) => activeNodes.byId[id])
      .filter((node) => {
        if (String(node.APIID) !== String(get().sourceAPIData.id)) {
          return false;
        }
        return true;
      })
      .filter((activeNode) => {
        if (activeNode.parentNode == null) {
          return true;
        }
        return false;
      });
  },
  getFilteredDestinationONActiveNodes: (activeNodes) => {
    return activeNodes.allIds
      .map((id) => activeNodes.byId[id])
      .filter((node) => {
        if (String(node.APIID) !== String(get().destinationAPIData.id)) {
          return false;
        }
        return true;
      })
      .filter((activeNode) => {
        if (activeNode.parentNode == null) {
          return true;
        }
        return false;
      });
  },
  getFilteredMatchActiveNodes: (activeNodes) => {
    return activeNodes.allIds
      .map((id) => activeNodes.byId[id])
      .filter((node) => {
        if (String(node.APIID) !== String(get().destinationAPIData.id)) {
          return false;
        }
        if (node.isPostResponse) {
          return false;
        }
        if (node.type !== WIZARD_COMPONENT_TYPE.MATCH) {
          return false;
        }
        if (node.pairingID == null) {
          return true;
        }
        return false;
      })
      .filter((activeNode) => {
        if (activeNode.parentNode == null) {
          return true;
        }
        return false;
      });
  },
  getFilteredDesitantionActiveNodes: (activeNodes) => {
    return activeNodes.allIds
      .map((id) => activeNodes.byId[id])
      .filter((node) => {
        if (String(node.APIID) !== String(get().destinationAPIData.id)) {
          return false;
        }
        if (node.isPostResponse) {
          return false;
        }
        if (node.type !== WIZARD_COMPONENT_TYPE.RUN) {
          return false;
        }
        if (node.pairingID == null) {
          return true;
        }
        return false;
      })
      .filter((activeNode) => {
        if (activeNode.parentNode == null) {
          return true;
        }
        return false;
      });
  },
  getONConfig: (configID) => {
    return {
      ...get().operationNodesConfig.find((el) => el.id === configID),
    };
  },
  getONnputs: (configID) => {
    return get().operationNodesInnerInputConfig.filter(
      (el) => el.configID === configID
    );
  },
  addOperationNode: async (configID, position) => {
    if (!position) {
      position = {
        x: get().center.x,
        y: get().center.y,
      };
    }
    const nodeid = nanoid();
    const node = {
      id: nodeid,
      type: "loadingNode",
      position: position,
      sourceHandles: [],
      targetHandles: [],
      defaultHandles: [],
    };
    get().addNode(node);
    const { data } = await addOperationNodeApi(get().speccId, configID);
    get().deleteNode(nodeid);
    //*** */
    const ON = data[0];
    const updatedNode = {
      ...node,
      id: String(data[0].id),
      type: "operationNode",
      data: {
        ONConfig: get().getONConfig(data[0].configID),
        ONID: ON.id,
        inputs: get().getONnputs(data[0].configID),
        nodeType: NODE_TYPES.OPERATION,
      },
    };
    set((state) => {
      state.operationNodesFiltered.allIds.push(ON.id);
      state.operationNodesFiltered.byId[ON.id] = {
        ...ON,
        activeNodes: {
          allIds: [],
          byId: {},
        },
        activeFields: {
          allIds: [],
          byId: {},
        },
      };
    });
    get().addNode(updatedNode);
    return updatedNode.id;
  },
  updateOperationNodeInput: async (nodeId, inputId, payload) => {
    const updatedValue = await updateOperationNodeInputApi(inputId, payload);
    set((state) => {
      state.nodes.byId[nodeId].data.ON.operationNodeInputs = state.nodes.byId[
        nodeId
      ].data.ON.operationNodeInputs.map((input) => {
        if (input.id === inputId) {
          return { ...input, ...updatedValue.data };
        }
        return input;
      });
    });
  },
  changeSwitchReturnType: async (nodeId, switchObjId, returnType) => {
    const switchData = await updateSwitch(switchObjId, {
      returnType: returnType,
    });

    set((state) => {
      state.nodes.byId[nodeId].data.ON.switchObject = {
        ...state.nodes.byId[nodeId].data.ON.switchObject,
        ...switchData.data,
      };
    });
  },
  conditionRowChangeFieldType: async (nodeId, rowId, isFirst, isField) => {
    const postData = {};
    if (isFirst) {
      postData.firstType = isField ? "FIELD" : "VALUE";
    } else {
      postData.secondType = isField ? "FIELD" : "VALUE";
    }

    const newConditionData = await updateConditionRow(rowId, postData);

    set((state) => {
      state.nodes.byId[nodeId].data.ON.conditionRows = state.nodes.byId[
        nodeId
      ].data.ON.conditionRows.map((row) => {
        if (row.id === rowId) {
          return { ...row, ...newConditionData.data };
        }
        return row;
      });
    });
  },
  conditionRowChangeLinkValue: async (nodeId, rowId, value, field) => {
    const postData = {};
    if (field === "firstLinkID") {
      postData.firstLinkID = value || null;
    } else if (field === "secondLinkID") {
      postData.secondLinkID = value || null;
    }
    const newConditionData = await updateConditionRow(rowId, postData);

    set((state) => {
      state.nodes.byId[nodeId].data.ON.conditionRows = state.nodes.byId[
        nodeId
      ].data.ON.conditionRows.map((row) => {
        if (row.id === rowId) {
          return { ...row, ...newConditionData.data };
        }
        return row;
      });
    });
  },
  conditionRowChangeComparison: async (nodeId, rowId, value) => {
    const postData = {
      comparisonId: value,
    };
    const newConditionData = await updateConditionRow(rowId, postData);

    set((state) => {
      state.nodes.byId[nodeId].data.ON.conditionRows = state.nodes.byId[
        nodeId
      ].data.ON.conditionRows.map((row) => {
        if (row.id === rowId) {
          return { ...row, ...newConditionData.data };
        }
        return row;
      });
    });
  },
  conditionRowChangeConstantValue: async (nodeId, rowId, field, value) => {
    const postData = {};
    if (field === "firstValue") {
      postData.firstValue = value;
    } else if (field === "secondValue") {
      postData.secondValue = value;
    }

    const newConditionData = await updateConditionRow(rowId, postData);

    set((state) => {
      state.nodes.byId[nodeId].data.ON.conditionRows = state.nodes.byId[
        nodeId
      ].data.ON.conditionRows.map((row) => {
        if (row.id === rowId) {
          return { ...row, ...newConditionData.data };
        }
        return row;
      });
    });
  },
  conditionRowUpdateThenValue: async (nodeId, rowId, value) => {
    const postData = {
      thenValue: value,
    };
    const newConditionData = await updateConditionRow(rowId, postData);

    set((state) => {
      state.nodes.byId[nodeId].data.ON.conditionRows = state.nodes.byId[
        nodeId
      ].data.ON.conditionRows.map((row) => {
        if (row.id === rowId) {
          return { ...row, ...newConditionData.data };
        }
        return row;
      });
    });
  },
  addConditionRow: async (nodeId) => {
    const newSwitchCase = await addConditionRow({
      ONID: nodeId,
    });
    set((state) => {
      state.nodes.byId[nodeId].data.ON.conditionRows.push(
        newSwitchCase.data[0]
      );
    });
  },
  deleteConditionRow: async (nodeId, rowId) => {
    await deleteConditionRow(rowId);
    set((state) => {
      state.nodes.byId[nodeId].data.ON.conditionRows = state.nodes.byId[
        nodeId
      ].data.ON.conditionRows.filter((row) => row.id !== rowId);
    });
  },
  setExampleDataGraph: async (index) => {
    if (index) {
      set((state) => {
        state.exampledataIndex = String(index);
      });
    } else {
      index = get().exampledataIndex;
      if (!index) {
        index = 0;
      }
    }

    const extra = {
      exampledataIndex: String(index),
    };

    const transformationModule = get().activeModules.find(
      (module) => module.config.name === modules.TRANSFORMATION
    );
    const exampleData = await runModule(
      transformationModule.speccID,
      transformationModule.id,
      extra
    );
    const dataToSave = {};
    if (exampleData.frontend.fields)
      for (const data of exampleData.frontend.fields) {
        dataToSave[data.model.id] = data.result;
      }
    if (exampleData.frontend.ONs)
      for (const data of exampleData.frontend.ONs) {
        //In the data object, if the key "fieldResultList" exists, we should do something else
        if (data.result?.fieldResultList) {
          //data.result.fieldResultList is not a list, but a key value pair. I would like to iterate over all of the keys and values in the object.
          for (const [key, value] of Object.entries(
            data.result.fieldResultList
          )) {
            dataToSave[`ON-input-${data.model.id}-${key}`] = value;
          }
        } else {
          //if the data.result is an array, loop through and save the data
          if (Array.isArray(data.result)) {
            for (const [index, result] of data.result.entries()) {
              dataToSave[`ON-output-${data.model.id}-${index}`] = result;
            }
          } else {
            dataToSave[`ON-output-${data.model.id}-0`] = data.result;
          }
        }
      }
    if (exampleData.frontend.links)
      for (const data of exampleData.frontend.links) {
        dataToSave[`input-${data.model.ONdestinationID}-${data.model.order}`] =
          data.result;
      }

    set((state) => {
      state.exampleData.handles = dataToSave;
    });
  },
  setExampleDataRows: async () => {
    const transformationModule = get().activeModules.find(
      (module) => module.config.name === modules.TRANSFORMATION
    );
    if (transformationModule) {
      const exampleDataRows = await getModuleInput(
        transformationModule.speccID,
        transformationModule.id
      );

      exampleDataRows &&
        set((state) => {
          state.exampleDataRows = exampleDataRows.listOfDataObjects;
        });
    }
  },
  updateExampleDataRows: async (listOfDataObjects) => {
    const transformationModule = get().activeModules.find(
      (module) => module.config.name === modules.TRANSFORMATION
    );
    if (transformationModule) {
      set((state) => {
        state.exampleDataRows = listOfDataObjects;
      });
    }
  },
  activateNode: async ({ direction, url, isMatching = false }) => {
    const model = {
      speccID: Number(get().speccId),
      APIID:
        direction === DIRECTION.SOURCE
          ? get().sourceAPIData.id
          : get().destinationAPIData.id,
      endpoint: url,
      name: url,
      parentNode: null,
      isMatching: isMatching,
      pairingID: null,
      type: isMatching
        ? WIZARD_COMPONENT_TYPE.MATCH
        : WIZARD_COMPONENT_TYPE.RUN,
    };

    const response = await addActiveNode(model);
    if (response?.httpcode === 400) {
      return errorToast("Add node failed", response.message, null, false);
    }
    const data = response.data[0];

    if (direction === DIRECTION.DESTINATION)
      get().refreshActiveNodes(DIRECTION.DESTINATION);
    else
      set((state) => {
        state.activeNodes.byId[String(data.id)] = data;
        state.activeNodes.allIds.push(data.id);
      });
    get().AI.actions.fetchNodeAddIntent();
    get().AI.actions.fetchFieldAddIntent();
    return data;
  },
  addActiveNode: async (
    nodeName,
    parentNodeId,
    isMatching,
    direction,
    isPostResponse = false
  ) => {
    const model = {
      speccID: get().speccId,
      APIID:
        direction === DIRECTION.SOURCE
          ? get().sourceAPIData.id
          : get().destinationAPIData.id,
      endpoint: null,
      name: nodeName,
      speccpageid: null,
      parentNode: parentNodeId,
      isMatching: isMatching,
      pairingID: null,
      type: isMatching
        ? WIZARD_COMPONENT_TYPE.MATCH
        : WIZARD_COMPONENT_TYPE.RUN,
      isPostResponse: isPostResponse,
    };
    const response = await addActiveNode(model);
    const data = response.data[0];
    set((state) => {
      state.activeNodes.byId[String(data.id)] = data;
      state.activeNodes.allIds.push(data.id);
    });
    get().createRelationEdgeRecursively(data.id);
    get().AI.actions.fetchNodeAddIntent();
    get().AI.actions.fetchFieldAddIntent();
  },
  deactivateNode: async (node) => {
    await deleteActiveNodeApi(node.id, get().speccId);
    set((state) => {
      delete state.activeNodes.byId[node.id];
      state.activeNodes.allIds = state.activeNodes.allIds.filter(
        (id) => id !== node.id
      );
    });
    get().deleteRelationEdgeRecursively(node.id);
  },
  updateActiveNode: async (node) => {
    set((state) => {
      state.activeNodes.byId[node.id] = node;
    });
  },
  activateONNode: async ({
    ONID,
    direction,
    name = null,
    url,
    parentNode = null,
  }) => {
    const model = {
      ONID: ONID,
      speccID: get().speccId,
      APIID:
        direction === DIRECTION.SOURCE
          ? get().sourceAPIData.id
          : get().destinationAPIData.id,
      endpoint: url,
      name: parentNode ? name : url,
      parentNode: parentNode,
    };
    const { data } = await addActiveONNodeApi(model);
    set((state) => {
      state.operationNodesFiltered.byId[ONID].activeNodes.byId[data[0].id] =
        data[0];
      state.operationNodesFiltered.byId[ONID].activeNodes.allIds.push(
        data[0].id
      );
    });
    return data;
  },
  deactivateONNode: async (node) => {
    await deleteActiveONNodeApi(node.id, get().speccId);
    set((state) => {
      delete state.operationNodesFiltered.byId[node.ONID].activeNodes.byId[
        node.id
      ];
      state.operationNodesFiltered.byId[node.ONID].activeNodes.allIds =
        state.operationNodesFiltered.byId[node.ONID].activeNodes.allIds.filter(
          (id) => id !== node.id
        );
    });
  },
  resetTransferKey: (transferKey) => {
    set((state) => {
      state.transferKey = transferKey;
    });
  },
  getNodeDirection: (APIID) => {
    if (APIID === get().sourceAPIData.id) {
      return DIRECTION.SOURCE;
    }
    if (APIID === get().destinationAPIData.id) {
      return DIRECTION.DESTINATION;
    }
  },
  addActiveField: async (nodeId, field) => {
    const { data } = await addActiveFieldApi(nodeId, field.name, get().speccId);
    set((state) => {
      state.activeFields.byId[data[0].id] = data[0];
      state.activeFields.allIds.push(data[0].id);
    });
    get().AI.actions.fetchLinksAddIntent();
    get().AI.actions.fetchFieldAddIntent();
    get().AI.actions.fetchONNodeAddIntent();
  },
  deleteActiveField: async (fieldId) => {
    await deleteActiveFieldApi(fieldId);
    set((state) => {
      delete state.activeFields.byId[fieldId];
      state.activeFields.allIds = state.activeFields.allIds.filter(
        (id) => id !== fieldId
      );
    });
  },
  addONActiveField: async (onNodeID, ONID, fieldName) => {
    const { data } = await addActiveONFieldApi(
      onNodeID,
      fieldName,
      get().speccId
    );
    set((state) => {
      state.operationNodesFiltered.byId[ONID].activeFields.byId[data[0].id] =
        data[0];
      state.operationNodesFiltered.byId[ONID].activeFields.allIds.push(
        data[0].id
      );
    });
  },
  deleteONActiveField: async (fieldId, ONID) => {
    await deleteActiveONFieldApi(fieldId, get().speccId);
    set((state) => {
      delete state.operationNodesFiltered.byId[ONID].activeFields.byId[fieldId];
      state.operationNodesFiltered.byId[ONID].activeFields.allIds =
        state.operationNodesFiltered.byId[ONID].activeFields.allIds.filter(
          (id) => id !== fieldId
        );
    });
  },
  updateActiveField: async (field) => {
    set((state) => {
      state.activeFields.byId[field.id] = field;
    });
  },
  setActiveFieldDefaultValue: async (fieldId, value) => {
    const { data } = await updateActiveFieldDefaultValueApi(fieldId, value);
    set((state) => {
      state.activeFields.byId[fieldId] = data;
    });
  },
  removeActiveFieldDefaultValue: async (fieldId) => {
    const { data } = await updateActiveFieldDefaultValueApi(fieldId, null);
    set((state) => {
      state.activeFields.byId[fieldId] = data;
    });
  },
  setActiveNodes: (nodes) => {
    set((state) => {
      state.activeNodes.byId = nodes.reduce((acc, node) => {
        acc[node.id] = node;
        return acc;
      }, {});
      state.activeNodes.allIds = nodes.map((node) => node.id);
    });
  },
  refreshActiveNodesByDirection: (nodes, direction) => {
    set((state) => {
      // Remove all active nodes of the specified direction
      state.activeNodes.allIds = state.activeNodes.allIds.filter(
        (id) =>
          state.activeNodes.byId[id].APIID !==
          (direction === DIRECTION.SOURCE
            ? state.sourceAPIData.id
            : state.destinationAPIData.id)
      );
      state.activeNodes.byId = state.activeNodes.allIds.reduce((acc, id) => {
        acc[id] = state.activeNodes.byId[id];
        return acc;
      }, {});

      // Add the new nodes
      nodes.forEach((node) => {
        state.activeNodes.byId[node.id] = node;
        state.activeNodes.allIds.push(node.id);
      });
    });
  },
  refreshAllActiveNodes: (nodes) => {
    set((state) => {
      state.activeNodes.byId = nodes.reduce((acc, node) => {
        acc[node.id] = node;
        return acc;
      }, {});
      state.activeNodes.allIds = nodes.map((node) => node.id);
    });
  },
  updateSomeActiveFields: (fields) => {
    set((state) => {
      fields.forEach((field) => {
        state.activeFields.byId[field.id] = field;
      });
    });
  },
  refreshAllActiveFields: (fields) => {
    set((state) => {
      state.activeFields.byId = fields.reduce((acc, field) => {
        acc[field.id] = field;
        return acc;
      }, {});
      state.activeFields.allIds = fields.map((field) => field.id);
    });
  },
  refreshActiveFieldsByNode: (fields, nodeID) => {
    set((state) => {
      // Remove all active fields of the specified node
      state.activeFields.allIds = state.activeFields.allIds.filter(
        (id) => state.activeFields.byId[id].nodeID !== nodeID
      );
      state.activeFields.byId = state.activeFields.allIds.reduce((acc, id) => {
        acc[id] = state.activeFields.byId[id];
        return acc;
      }, {});

      // Add the new fields
      fields.forEach((field) => {
        state.activeFields.byId[field.id] = field;
        state.activeFields.allIds.push(field.id);
      });
    });
  },
  refreshActiveNodes: async (direction) => {
    const APIID =
      direction === DIRECTION.SOURCE
        ? get().sourceAPIData.id
        : get().destinationAPIData.id;
    const res = await getActiveNodesApi(get().speccId, APIID);
    const data = res.data;
    if (data) {
      let otherActiveNodes = get()
        .activeNodes.allIds.map((id) => get().activeNodes.byId[id])
        .filter((node) => node.APIID !== APIID);
      let activeNodes = data.filter(
        (node) => Number(node.speccID) === Number(get().speccId)
      );
      activeNodes = [...activeNodes, ...otherActiveNodes];
      set((state) => {
        state.activeNodes.allIds = activeNodes.map((node) => node.id);
        state.activeNodes.byId = activeNodes.reduce((acc, node) => {
          acc[node.id] = node;
          return acc;
        }, {});
      });
    }
  },
  setSelectedFieldID: (fieldID) => {
    set((state) => {
      state.selectedFieldID = fieldID;
    });
  },
  setSelectedVariableID: (variableID) => {
    set((state) => {
      state.selectedVariableID = variableID;
    });
  },
  setCreatedVariableID: (variableID) => {
    set((state) => {
      state.createdVariableID = variableID;
    });
  },
  setVariableObjectType: (objectType) => {
    set((state) => {
      state.variableObjectType = objectType;
    });
  },
});
