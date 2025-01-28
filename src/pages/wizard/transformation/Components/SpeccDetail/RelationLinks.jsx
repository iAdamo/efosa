import { WizardContext } from "@contexts/WizardContext";
import { useContext, useEffect, useState } from "react";
import Xarrow from "react-xarrows";

const RelationLinks = ({ isOnCreation = false }) => {
    const [relatedArrows, setRelatedArrows] = useState([]);
    const {
        collapsedNodes,
        layoutWidth,
        relatedNodesLinks,
        activeFields,
        activeNodes,
        activeGroupNodeModalItem,
        operationNodes,
    } = useContext(WizardContext);

    useEffect(() => {
        const newArrows = relatedNodesLinks.map((link) => {
                `${link.parentNodeId}${
                    activeGroupNodeModalItem || isOnCreation ? "g" : ""
                }`;

            return (
                <Xarrow
                    key={link.relatedId + link.parentNodeId}
                    start={`${link.parentNodeId}${
                        activeGroupNodeModalItem || isOnCreation ? "g" : ""
                    }`}
                    end={`${link.relatedId}${
                        activeGroupNodeModalItem || isOnCreation ? "g" : ""
                    }`}
                    showHead={false}
                    color="#D32DCA"
                    strokeWidth={"2"}
                    headSize={2}
                    path="grid"
                    gridBreak="100%"
                    startAnchor={"bottom"}
                />
            );
        });

        setRelatedArrows(newArrows);
    }, [
        JSON.stringify(relatedNodesLinks),
        JSON.stringify(collapsedNodes),
        JSON.stringify(operationNodes),

        activeFields.length,
        activeNodes.length,
        layoutWidth,
        activeGroupNodeModalItem,
    ]);

    return relatedArrows;
};

export default RelationLinks;
