import React, { useContext, useRef } from "react";
import Checkbox from "./Checkbox";
import { WizardContext } from "@contexts/WizardContext";

const UniqueIdentifierNodeSchema = (props) => {
    const { node, isRelatedNode = 0, selectedNodes, setSelectedNodes } = props;

    const nodeRef = useRef(null);

    const { activeNodes } = useContext(WizardContext);

    const allChildNodes = activeNodes.filter((activeNode) => {
        if (activeNode.parentNode == node.id) {
            return true;
        }
        return false;
    });

    return (
        <>
            <div
                ref={nodeRef}
                className="flex justify-between items-center cursor-pointer"
                style={{ marginLeft: isRelatedNode * 15 }}
                onClick={() =>
                    setSelectedNodes((paren) => {
                        if (paren.includes(node.id)) {
                            return paren.filter((id) => id !== node.id);
                        } else {
                            return [...paren, node.id];
                        }
                    })
                }
            >
                <p className="m-0 text-sm font-medium">{node.name}</p>
                <Checkbox
                    className="w-2.5 h-2.5 mb-1 cursor-pointer"
                    value={selectedNodes?.includes(node.id)}
                />
            </div>
            {allChildNodes?.map((child) => (
                <UniqueIdentifierNodeSchema
                    key={child.id}
                    node={child}
                    isRelatedNode={isRelatedNode + 1}
                    parentRef={nodeRef}
                    selectedNodes={selectedNodes}
                    setSelectedNodes={setSelectedNodes}
                />
            ))}
        </>
    );
};

export default UniqueIdentifierNodeSchema;
