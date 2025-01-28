import { WizardContext } from "@contexts/WizardContext";
import { useEffect, useContext, useState } from "react";
import GroupRelatedNode from "./GroupRelatedNode";

const GroupRelatedNodes = ({ parentNode, direction, dataForSchemas }) => {
    const { activeNodes } = useContext(WizardContext);

    const [relatedNodes, setRelatedNodes] = useState([]);
    useEffect(() => {
        if (activeNodes) {
            const getNodesByParent = (id) => {
                let output = [];
                activeNodes
                    .filter((schema) => schema.parentNode === id)
                    .forEach((item) => {
                        output = [
                            ...output,
                            item,
                            ...getNodesByParent(item.id),
                        ];
                    });
                return output;
            };
            setRelatedNodes(getNodesByParent(parentNode.id));
        }
    }, [parentNode, direction, activeNodes]);
    return relatedNodes.map((relatedNode) => (
        <GroupRelatedNode
            key={relatedNode.id}
            node={relatedNode}
            {...dataForSchemas}
            direction={direction}
        />
    ));
};

export default GroupRelatedNodes;
