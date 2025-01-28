import { useContext, useMemo } from "react";
import { WizardContext } from "@contexts/WizardContext";

const useGroupRelatedNodeCollapse = (activeNodeId) => {
    const { collapsedNodes, setCollapsedNodes } = useContext(WizardContext);
    const handleNodeCollapse = (e) => {
        e.stopPropagation();
        const collapsedNodesCopy = [...collapsedNodes];
        const index = collapsedNodes.findIndex(
            (id) => id === `${activeNodeId}-group`
        );
        if (index !== -1) {
            collapsedNodesCopy.splice(index, 1);
        } else {
            collapsedNodesCopy.push(`${activeNodeId}-group`);
        }
        setCollapsedNodes(collapsedNodesCopy);
    };

    const isCollapsed = useMemo(
        () =>
            Boolean(
                collapsedNodes.find((id) => id === `${activeNodeId}-group`)
            ),
        [collapsedNodes, activeNodeId]
    );

    return { handleNodeCollapse, isCollapsed };
};

export default useGroupRelatedNodeCollapse;
