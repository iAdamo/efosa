import { NodeToolBarContext } from "@contexts/NodeToolBarContext";
import { LinksContext } from "@contexts/LinksContext";
import { WizardContext } from "@contexts/WizardContext";
import { updateActiveNodeApi } from "@axios/apiCalls";
import { useContext } from "react";

export const nodeToolbarGroupHook = ({ toolbarNode }) => {
    const { triggerLinksRebuild } = useContext(LinksContext);
    const {
        sourceSchemas,
        destinationSchemas,
        setSourceSchemas,
        setDestinationSchemas,
        setActiveGroupNodeModalItem,
        setActiveNodes,
        activeNodes
    } = useContext(WizardContext);
    const { closeToolbar } = useContext(NodeToolBarContext);

        const toggleIsGroupNode = async () => {
        try {
            
            const { data } = await updateActiveNodeApi(toolbarNode.id, {
                isGroup: !toolbarNode.isGroup,
            });
            
            const newNodes = [...activeNodes];
            const currentNode = newNodes.find(
                (s) => s.id === toolbarNode.id
            );
            currentNode.isGroup = !toolbarNode.isGroup;
            setActiveNodes(newNodes);

            /*
            setActiveNodes((v) => {
                const value = v.filter((item) => item.id !== toolbarNode.id);
                return value;
            });

            console.log('Data from fetch');
            console.log(data);

            setActiveNodes((v) => [...v, data]);

            console.log(activeNodes);
*/

            /*
            setActiveGroupNodeModalItem(null);
            const sourceNode = sourceSchemas.find(
                (s) => s.activeNodeId === toolbarNode.activeNodeId
            );
            const destinationNode = destinationSchemas.find(
                (s) => s.activeNodeId === toolbarNode.activeNodeId
            );
            if (sourceNode) {
                const newNodes = [...sourceSchemas];
                const currentNode = newNodes.find(
                    (s) => s.activeNodeId === toolbarNode.activeNodeId
                );
                currentNode.isGroup = !toolbarNode.isGroup;
                setSourceSchemas(newNodes);
            }
            if (destinationNode) {
                const newNodes = [...destinationSchemas];
                const currentNode = newNodes.find(
                    (s) => s.activeNodeId === toolbarNode.activeNodeId
                );
                currentNode.isGroup = !toolbarNode.isGroup;
                setDestinationSchemas(newNodes);
            }
            */

            closeToolbar();
            triggerLinksRebuild();
        } catch (err) {
            console.log(err);
        }
    };

    return [toggleIsGroupNode];
};
