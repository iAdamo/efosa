import { LinksContext } from "@contexts/LinksContext";
import { WizardContext } from "@contexts/WizardContext";
import { updateOperationNodeApi } from "@axios/apiCalls";
import { useCallback, useContext, useState } from "react";
import Xarrow, { Xwrapper, useXarrow } from "react-xarrows";

const useOperationNodesDrag = () => {
    const { selectedOperationNodes, setOperationNodes } =
        useContext(WizardContext);
    const { triggerLinksRebuild } = useContext(LinksContext);
    const [dragStartPosition, setDragStartPosition] = useState({ x: 0, y: 0 });
    const [currentDragPosition, setCurrentDragPosition] = useState({
        x: 0,
        y: 0,
    });

    const onDragEndNode = async (e, data) => {
        const xDelta = data.x - dragStartPosition.x;
        const yDelta = data.y - dragStartPosition.y;
        setOperationNodes((prev) => {
            const updatedOperationNodes = [...prev];
            selectedOperationNodes.forEach((id) => {
                const node = updatedOperationNodes.find(
                    (item) => item.id === id
                );
                node.positionX += xDelta;
                node.positionY += yDelta;
                updateOperationNodeApi(node);
            });
            return updatedOperationNodes;
        });
        setDragStartPosition({ x: 0, y: 0 });
        setCurrentDragPosition({ x: 0, y: 0 });
    };

    const onDragStartNode = (e, data, node) => {
        setDragStartPosition(data);
        setCurrentDragPosition(data);
    };

    const onDragNode = useCallback(
        (() => {
            let pos = { x: 0, y: 0 };
            return (e, data) => {
                setCurrentDragPosition(data);
                if (pos.x !== data.x || pos.y !== data.y) {
                    pos = {
                        x: data.lastX,
                        y: data.lastY,
                    };

                    triggerLinksRebuild();
                }
            };
        })(),
        []
    );

    return {
        onDragEndNode,
        onDragNode,
        onDragStartNode,
        xDelta: currentDragPosition.x - dragStartPosition.x,
        yDelta: currentDragPosition.y - dragStartPosition.y,
    };
};

export default useOperationNodesDrag;
