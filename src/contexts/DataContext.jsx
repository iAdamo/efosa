import React, { createContext, useEffect, useState, useContext } from "react";
export const DataContext = createContext(null);
import { MatchContext } from "./MatchContext";
import { WizardContext } from "./WizardContext";
import { RunnerContext } from "./RunnerContext";

const DataWrapper = (props) => {
    const [operationNodesFiltered, setOperationNodesFiltered] = useState([]);

    const [linksFiltered, setLinksFiltered] = useState([]);

    const [sourceActiveNodesFiltered, setSourceActiveNodesFiltered] = useState(
        []
    );
    const [destinationActiveNodesFiltered, setDestinationActiveNodesFiltered] =
        useState([]);
    const [activeFieldsFiltered, setActiveFieldsFiltered] = useState([]);

    const {
        activeNodes,
        activeFields,
        operationNodes,
        links,
        sourceAPIID,
        destinationAPIID,
    } = useContext(WizardContext);

    const { isMatchMode } = useContext(MatchContext);
    const { selectedPairing } = useContext(RunnerContext);

    useEffect(() => {
        setSourceActiveNodesFiltered(
            activeNodes.filter((node) => {
                if (node.APIID != sourceAPIID) {
                    return false;
                }
                if (isMatchMode) {
                    if (!selectedPairing) {
                        return false;
                    }

                    let temp = node;
                    while (temp.parentNode != null) {
                        temp = activeNodes.find((tempNode) => {
                            if (tempNode.id == temp.parentNode) {
                                return true;
                            }
                            return false;
                        });
                    }
                    if (temp.id == selectedPairing.node1) {
                        return true;
                    }
                    return false;
                }
                return true;
            })
        );

        setDestinationActiveNodesFiltered(
            activeNodes.filter((node) => {
                if (node.APIID != destinationAPIID) {
                    return false;
                }
                if (node.isPostResponse) {
                    return false;
                }
                if (isMatchMode) {
                    if (selectedPairing == null) {
                        return false;
                    }
                    if (node.pairingID == selectedPairing?.id) {
                        return true;
                    }
                    return false;
                } else {
                    if (node.pairingID == null) {
                        return true;
                    }
                    return false;
                }
            })
        );

        setActiveFieldsFiltered(activeFields);

        setOperationNodesFiltered(
            operationNodes.filter((ON) => {
                if (isMatchMode) {
                    if (selectedPairing == null) {
                        return false;
                    }
                    if (ON.pairingID == selectedPairing?.id) {
                        return true;
                    }
                    return false;
                } else {
                    if (ON.pairingID == null) {
                        return true;
                    }
                    return false;
                }
            })
        );

        setLinksFiltered(links);
    }, [
        activeNodes,
        activeFields,
        operationNodes,
        links,
        isMatchMode,
        selectedPairing,
        JSON.stringify(activeNodes),
    ]);

    const contextValue = {
        sourceActiveNodesFiltered,
        destinationActiveNodesFiltered,
        activeFieldsFiltered,
        operationNodesFiltered,
        linksFiltered,
    };

    return (
        <DataContext.Provider value={contextValue}>
            {props.children}
        </DataContext.Provider>
    );
};
export default DataWrapper;
