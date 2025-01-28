export const ELEMENTS = {
  SIDEBAR: {
    OPERATION_NODES: "ELEMENTS.SIDEBAR.OPERATION_NODES",
    RUN_PROGRESS: "ELEMENTS.SIDEBAR.RUN_PROGRESS",
    MATCH_PROGRESS: "ELEMENTS.SIDEBAR.MATCH_PROGRESS",
    NODE_PROPERTIES: "ELEMENTS.SIDEBAR.NODE_PROPERTIES",
    VARIABLE_MENU: "ELEMENTS.SIDEBAR.VARIABLE_MENU",
    CREATE_VARIABLE_MENU: "ELEMENTS.SIDEBAR.CREATE_VARIABLE_MENU",
  },
  MODAL: {
    DATA_INSPECTOR: "ELEMENTS.MODAL.DATA_INSPECTOR",
    XOF_RESOLVER: "ELEMENTS.MODAL.XOF_RESOLVER",
    RUN: {
      GET_DATA: "ELEMENTS.MODAL.RUN.GET_DATA",
      NODE_SELECTOR_SOURCE: "ELEMENTS.MODAL.RUN.NODE_SELECTOR_SOURCE",
      NODE_SELECTOR_DESTINATION: "ELEMENTS.MODAL.RUN.NODE_SELECTOR_DESTINATION",
      TRANSFER_KEY: "ELEMENTS.MODAL.RUN.TRANSFER_KEY",
      TRANSFER: "ELEMENTS.MODAL.RUN.TRANSFER",
      GROUP: "ELEMENTS.MODAL.RUN.GROUP",
      FILTER: "ELEMENTS.MODAL.RUN.FILTER",
      WEBHOOK: "ELEMENTS.MODAL.RUN.WEBHOOK",
      EVENTS: "ELEMENTS.MODAL.RUN.EVENTS",
      ADD_NODE_DESTINATION: "ELEMENTS.MODAL.RUN.ADD_NODE_DESTINATION",
      ADD_NODE_SOURCE: "ELEMENTS.MODAL.RUN.ADD_NODE_SOURCE",
    },
    ON: {
      ADD_NODE_DESTINATION: "ELEMENTS.MODAL.ON.ADD_NODE_DESTINATION",
      ADD_NODE_SOURCE: "ELEMENTS.MODAL.ON.ADD_NODE_SOURCE",
    },
    MATCH: {
      GET_DATA_SOURCE: "ELEMENTS.MODAL.MATCH.GET_DATA_SOURCE",
      GET_DATA_DESTINATION: "ELEMENTS.MODAL.MATCH.GET_DATA_DESTINATION",
      NODE_SELECTOR_DESTINATION:
        "ELEMENTS.MODAL.MATCH.NODE_SELECTOR_DESTINATION",
      NODE_SELECTOR_SOURCE: "ELEMENTS.MODAL.MATCH.NODE_SELECTOR_SOURCE",
      TRANSFER_KEY: "ELEMENTS.MODAL.MATCH.TRANSFER_KEY",
      RESULTS: "ELEMENTS.MODAL.MATCH.RESULTS",
      TRANSFER: "ELEMENTS.MODAL.MATCH.TRANSFER",
      ADD_NODE_DESTINATION: "ELEMENTS.MODAL.MATCH.ADD_NODE_DESTINATION",
    },
  },
  POPOVER: {
    RUN: {
      TRANSFER_KEY: "ELEMENTS.POPOVER.RUN.TRANSFER_KEY",
      EXAMPLE_DATA: "ELEMENTS.POPOVER.RUN.EXAMPLE_DATA",
    },
    MATCH: {
      TRANSFER_KEY: "ELEMENTS.POPOVER.MATCH.TRANSFER_KEY",
    },
  },
};

export const TOGGLES = {
  WIZARD_MODE: {
    RUN: "TOGGLES.WIZARD_MODE.RUN",
    MATCH: "TOGGLES.WIZARD_MODE.MATCH",
  },
};

export const VALUES = {
  SELECTED_NODE: "VALUES.SELECTED_NODE",
  SELECTED_OPERATION_NODE: "VALUES.SELECTED_OPERATION_NODE",
};

const initializeToggleState = (toggleObject) => {
  return Object.keys(toggleObject).reduce((acc, key) => {
    if (typeof Object.values(toggleObject[key])[0] === "object") {
      acc[key] = initializeToggleState(toggleObject[key]);
    } else {
      acc[key] = Object.values(toggleObject[key])[0];
    }
    return acc;
  }, {});
};

const initializeValues = (valuesObject) => {
  return Object.keys(valuesObject).reduce((acc, key) => {
    acc[key] = null;
    return acc;
  }, {});
};

// Helper to evaluate nested conditions
const evaluateNestedConditions = (conditionNode, get) => {
  if (!Array.isArray(conditionNode)) {
    throw new Error("Condition node must be an array.");
  }
  const [left, operator, right] = conditionNode;
  // Check if this is a simple condition
  if (!Array.isArray(left) && !Array.isArray(right)) {
    return evaluateCondition(conditionNode, get);
  }

  // Otherwise, it's a logical group (AND/OR condition)
  switch (operator) {
    case "AND": {
      const leftResult = evaluateNestedConditions(left, get);
      const rightResult = evaluateNestedConditions(right, get);
      return leftResult && rightResult;
    }
    case "OR": {
      const leftResult = evaluateNestedConditions(left, get);
      const rightResult = evaluateNestedConditions(right, get);
      return leftResult || rightResult;
    }
    default:
      throw new Error(
        `Invalid logical operator: ${operator}. Operator value: ${operator}`
      );
  }
};

const evaluateCondition = ([path, operator, value], get) => {
  const keys1 = path.split(".");
  const value1 = keys1.reduce((acc, key) => acc?.[key], get().UI); // Get first value
  const value2 = value;

  switch (operator) {
    case "==":
      return value1 === value2;
    case "!=":
      return value1 !== value2;
    case "<":
      return value1 < value2;
    case "<=":
      return value1 <= value2;
    case ">":
      return value1 > value2;
    case ">=":
      return value1 >= value2;
    case "includes":
      return Array.isArray(value1) && value1.includes(value2);
    default:
      throw new Error(`Invalid operator: ${operator}`);
  }
};

export const createUISlice = (set, get) => {
  return {
    UI: {
      ELEMENTS: {
        SIDEBAR: null,
        MODAL: null,
        POPOVER: null,
        DEFAULT_SIDEBAR: ELEMENTS.SIDEBAR.RUN_PROGRESS,
      },
      TOGGLES: { ...initializeToggleState(TOGGLES) },
      VALUES: { ...initializeValues(VALUES) },
      selectedMenuItem: "Add nodes",
      accordionToggle: null,
      MONITOR: { allIds: [], byId: {} },
      setSidebar: (key) => {
        set((state) => {
          state.UI.ELEMENTS.SIDEBAR = key;
        });
      },
      removeSidebar: () => {
        set((state) => {
          state.UI.ELEMENTS.SIDEBAR = state.UI.ELEMENTS.DEFAULT_SIDEBAR;
        });
      },
      setModal: (key) => {
        set((state) => {
          state.UI.ELEMENTS.MODAL = key;
        });
      },
      removeModal: () => {
        set((state) => {
          state.UI.ELEMENTS.MODAL = null;
        });
      },
      setPopover: (key) => {
        set((state) => {
          state.UI.ELEMENTS.POPOVER = key;
        });
      },
      removePopover: () => {
        set((state) => {
          state.UI.ELEMENTS.POPOVER = null;
          state.UI.ELEMENTS.POPOVER_REF = null;
        });
      },
      setToggle: (key) => {
        const keys = key.split(".").slice(0, -1);
        const value = key
          .split(".")
          .slice(1)
          .reduce((acc, curr) => acc?.[curr], TOGGLES);
        set((state) => {
          let current = state.UI;
          keys.forEach((k, index) => {
            if (index === keys.length - 1) {
              current[k] = value;
            } else {
              current = current[k];
            }
          });
        });
      },
      setValue: (key, value) => {
        const keys = key.split(".");
        if (keys[0] === "VALUES") {
          set((state) => {
            let current = state.UI.VALUES;
            keys.slice(1).forEach((k, index) => {
              if (index === keys.slice(1).length - 1) {
                current[k] = value;
              } else {
                current = current[k];
              }
            });
          });
        }
      },
      resetValue: (key) => {
        const keys = key.split(".");
        if (keys[0] === "VALUES") {
          set((state) => {
            let current = state.UI.VALUES;
            keys.slice(1).forEach((k, index) => {
              if (index === keys.slice(1).length - 1) {
                current[k] = null;
              } else {
                current = current[k];
              }
            });
          });
        }
      },
      setDefaultSidebar: (key) => {
        set((state) => {
          state.UI.ELEMENTS.DEFAULT_SIDEBAR = key;
        });
      },
      addMonitor: (id, conditionTree, callback) => {
        if (typeof callback !== "function") {
          throw new Error("Invalid callback: Must be a function.");
        }
        set((state) => {
          if (!state.UI.MONITOR.byId[id]) {
            state.UI.MONITOR.allIds.push(id);
            state.UI.MONITOR.byId[id] = { conditionTree, callback };
          }
        });
      },
      removeMonitor: (idToRemove) => {
        set((state) => {
          const { allIds } = state.UI.MONITOR;
          if (idToRemove) {
            state.UI.MONITOR.allIds = allIds.filter((id) => id !== idToRemove);
            delete state.UI.MONITOR.byId[idToRemove];
          }
        });
      },
      evaluateMonitors: () => {
        const { allIds, byId } = get().UI.MONITOR;
        allIds.forEach((id) => {
          const { conditionTree, callback } = byId[id];
          if (evaluateNestedConditions(conditionTree, get)) {
            callback();
          }
        });
      },
      setSelectedMenuItem: (menuItem) => {
        set((state) => {
          state.UI.selectedMenuItem = menuItem;
        });
      },
      setAccordionToggle: (value) => {
        set((state) => {
          state.UI.accordionToggle = value;
        });
      },
    },
  };
};
