import { DIRECTION } from "@/constants";
import useGlobalStore from "@/store/globalStore";
import { ACTIONS } from "@/store/reactionsSlice";
import { ELEMENTS } from "@/store/uiSlice";
import { DATA } from "@/store/wizardSlice";
import { useCallback, useEffect } from "react";
import { toast } from "sonner";
import { useShallow } from "zustand/react/shallow";

function ReactionsHandler() {
  const {
    reactions,
    activeNodes,
    updateActiveNode,
    setModal,
    setSidebar,
    setPopover,
    addXof,
    removeReaction,
    removeModal,
    addMonitor,
    updateActiveField,
    refreshActiveNodesByDirection,
    updateSomeActiveFields,
    refreshAllActiveFields,
    refreshAllActiveNodes,
    refreshActiveFieldsByNode,
  } = useGlobalStore(
    useShallow((s) => ({
      reactions: s.reactions.list,
      activeNodes: s.activeNodes,
      updateActiveNode: s.updateActiveNode,
      addXof: s.xOf.addXof,
      setModal: s.UI.setModal,
      setSidebar: s.UI.setSidebar,
      setPopover: s.UI.setPopover,
      removeReaction: s.reactions.removeReaction,
      removeModal: s.UI.removeModal,
      addMonitor: s.UI.addMonitor,
      updateActiveField: s.updateActiveField,
      refreshActiveNodesByDirection: s.refreshActiveNodesByDirection,
      refreshAllActiveNodes: s.refreshAllActiveNodes,
      updateSomeActiveFields: s.updateSomeActiveFields,
      refreshAllActiveFields: s.refreshAllActiveFields,
      refreshActiveFieldsByNode: s.refreshActiveFieldsByNode,
    }))
  );
  const handleXOf = useCallback(
    (reaction) => {
      const openXOfResolver = (reaction) => {
        addXof(reaction);
        setModal(ELEMENTS.MODAL.XOF_RESOLVER);
      };
      const { nodeID } = reaction.data;
      if (reaction.isInitial) {
        toast.success(reaction.frontendMessage, { action: { label: "Open", onClick: () => openXOfResolver(reaction) } });
        addMonitor(
          `monitor-${reaction.id}`,
          [["ELEMENTS.SIDEBAR", "==", ELEMENTS.SIDEBAR.NODE_PROPERTIES], "AND", ["VALUES.SELECTED_NODE", "==", nodeID]],
          () => openXOfResolver(reaction)
        );
      } else {
        openXOfResolver(reaction);
      }
    },
    [addXof, setModal, activeNodes]
  );

  const handleRefresh = useCallback(
    (reaction) => {
      switch (reaction.element) {
        case DATA.ACTIVE_NODE.ONE:
          if (reaction.data.node === null) {
            break;
          }
          updateActiveNode(reaction.data.node);
          removeReaction(reaction.id);
          break;
        case DATA.ACTIVE_NODE.ALL:
          if (reaction.data.nodes === null) {
            break;
          }
          refreshAllActiveNodes(reaction.data.nodes);
          removeReaction(reaction.id);
          break;
        case DATA.ACTIVE_NODE.SOURCE:
          if (reaction.data.nodes === null) {
            break;
          }
          refreshActiveNodesByDirection(reaction.data.nodes, DIRECTION.SOURCE);
          removeReaction(reaction.id);
          break;
        case DATA.ACTIVE_NODE.DESTINATION:
          if (reaction.data.nodes === null) {
            break;
          }
          refreshActiveNodesByDirection(reaction.data.nodes, DIRECTION.DESTINATION);
          removeReaction(reaction.id);
          break;
        case DATA.ACTIVE_FIELD.NODE:
          if (reaction.data.fields === null || reaction.data.nodeID === null) {
            break;
          }
          refreshActiveFieldsByNode(reaction.data.fields, reaction.data.nodeID);
          removeReaction(reaction.id);
          break;
        case DATA.ACTIVE_FIELD.ALL:
          if (reaction.data.fields === null) {
            break;
          }
          refreshAllActiveFields(reaction.data.fields);
          removeReaction(reaction.id);
          break;
        case DATA.ACTIVE_FIELD.SOME:
          if (reaction.data.fields === null) {
            break;
          }
          updateSomeActiveFields(reaction.data.fields);
          removeReaction(reaction.id);
          break;
        default:
          break;
      }
    },
    [updateActiveNode, removeReaction]
  );

  const handleOpen = useCallback(
    (reaction) => {
      switch (reaction.data.type) {
        case "MODAL":
          toast.success(reaction.frontendMessage, {
            action: {
              label: "Open",
              onClick: () => {
                setModal(reaction.element);
                removeReaction(reaction.id);
              },
            },
          });
          break;
        case "SIDEBAR":
          toast.success(reaction.frontendMessage, {
            action: {
              label: "Open",
              onClick: () => {
                removeModal();
                setSidebar(reaction.element);
                removeReaction(reaction.id);
              },
            },
          });
          break;
        case "POPOVER":
          toast.success(reaction.frontendMessage, {
            action: {
              label: "Open",
              onClick: () => {
                removeModal();
                setPopover(reaction.element);
                removeReaction(reaction.id);
              },
            },
          });
          break;
        default:
          break;
      }
    },
    [handleXOf]
  );

  const handleChoose = useCallback(
    (reaction) => {
      switch (reaction.element) {
        case ELEMENTS.MODAL.XOF_RESOLVER:
          handleXOf(reaction);
          break;
        default:
          break;
      }
    },
    [handleXOf]
  );

  useEffect(() => {
    const allReactions = reactions.allIds.map((id) => reactions.byId[id]);
    allReactions.forEach((reaction) => {
      switch (reaction.action) {
        case ACTIONS.OPEN:
          handleOpen(reaction);
          break;
        case ACTIONS.CLOSE:
          // todo: implement
          break;
        case ACTIONS.REFRESH:
          handleRefresh(reaction);
          break;
        case ACTIONS.CHOOSE:
          handleChoose(reaction);
          break;
        default:
          break;
      }
    });
  }, [reactions, handleRefresh, handleChoose]);
  return <></>;
}

export default ReactionsHandler;
