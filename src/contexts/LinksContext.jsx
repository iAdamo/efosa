import React, {
    createContext,
    useEffect,
    useState,
    useContext,
} from "react";
import { WizardContext } from "./WizardContext";
import { createLinkAPI } from "@axios/apiCalls";
import { MatchContext } from "@contexts/MatchContext";
import { RunnerContext } from "@contexts/RunnerContext";
export const LinksContext = createContext(null);

const LinksWrapper = (props) => {
    const [rebuild, setRebuild] = useState(false);
    const [dotStyle, setDotStyle] = useState(null);
    const [dragElement, setDragElement] = useState(null);

    const [position, setPosition] = useState({});

    const {
        speccID,
        setLinks,
        links,
        setSchemaLinks,
        activeFields,
        activeNodes,
        operationNodes,
        operationNodesConfig,
    } = useContext(WizardContext);

    useEffect(() => {
        triggerLinksRebuild();
    }, [
        JSON.stringify(activeFields),
        JSON.stringify(links),
        JSON.stringify(operationNodes),
    ]);

    const triggerLinksRebuild = () => {
        setRebuild(new Date());
    };

    const startBuildLine = (e) => {
        setDotStyle({
            position: "fixed",
            left: e.clientX + "px",
            top: e.clientY + "px",
            width: "1px",
            height: "1px",
            zIndex: 100,
            background: "transparent",
            transform: "translateY(-5px) translateX(-5px)",
        });
    };

    const dragStarted = (e, object) => {
        e.dataTransfer.setData("draggedObject", JSON.stringify(object));
        setDragElement(object);
    };

    const handleDrag = (e) => {
        setPosition({
            position: "fixed",
            left: e.clientX + 8,
            top: e.clientY + 8,
            transform: "none",
            opacity: 0,
        });
    };

    const { isMatchMode } = useContext(MatchContext);
    const { selectedPairing } = useContext(RunnerContext);

    const dragEnded = async (e) => {
        e.preventDefault();
        setPosition({});

        const target = JSON.parse(e.target.getAttribute("data-schema"));

        const source = JSON.parse(e.dataTransfer.getData("draggedObject"));

        const newData = {
            speccID: speccID,
            isMatching: isMatchMode,
            pairingID: selectedPairing ? selectedPairing?.id : null,
        };

        if (target.isON) {
            if (target.isOutput) {
                newData.ONsourceID = target.ON.id;
                newData.outputIndex = target.indexOfOutput;
            }
            if (target.isInput) {
                newData.ONdestinationID = target.ON.id;
                if (target.isPassthrough) {
                    newData.isVariablePassthrough = true;
                }
            }
        }
        if (target.isField) {
            if (target.isSourceField) {
                newData.fieldsourceID = target.activeField.id;
            }
            if (target.isDestinationField) {
                newData.fielddestinationID = target.activeField.id;
            }
        }

        if (target.isMatchbox) {
            newData.matchboxDestinationID = target.matchbox.id;
        }

        if (target.fullNode) {
            newData.nodedestinationID = target.fullNode.id;
        }

        if (source.isON) {
            if (source.isOutput) {
                newData.ONsourceID = source.ON.id;
                newData.outputIndex = source.indexOfOutput;
            }
            if (source.isInput) {
                newData.ONdestinationID = source.ON.id;
            }
            if (source.ON.nodeID != null) {
                newData.containingNodeID = source.ON.nodeID;
            }
        }
        if (source.isField) {
            if (source.isSourceField) {
                newData.fieldsourceID = source.activeField.id;
            }
            if (source.isDestinationField) {
                newData.fielddestinationID = source.activeField.id;
            }
        }

        if (source.isMatchbox) {
            newData.matchboxDestinationID = source.matchbox.id;
        }

        if (source.type === target.type) {
            const response = await createLinkAPI(newData);
            setLinks((prev) => [...prev, response.data[0]]);
        }
    };

    const getType = (draggableObject) => {
        if (!draggableObject) {
            return "";
        }

        if (draggableObject.fullNode) {
            return "object";
        }

        if (draggableObject.isON) {
            if (draggableObject.isField) {
                return draggableObject.activeField.type;
            }

            if (!draggableObject.ONConfig) {
                return "";
            }

            if (draggableObject.isOutput) {
                if (draggableObject.ONConfig.isForObjects) {
                    return "object";
                }
                if (draggableObject.ONConfig) {
                    if (draggableObject.ONConfig.toString) {
                        return "string";
                    }
                    if (draggableObject.ONConfig.toBoolean) {
                        return "boolean";
                    }
                    if (draggableObject.ONConfig.toDecimal) {
                        return "number";
                    }
                    if (draggableObject.ONConfig.toInteger) {
                        return "integer";
                    }
                } else {
                    return "object";
                }
            }

            if (draggableObject.isInput) {
                if (draggableObject.ONConfig.isForObjects) {
                    return "object";
                }
                if (draggableObject.ONConfig.package != "Conditional") {
                    if (draggableObject.ONConfig.fromString) {
                        return "string";
                    }
                    if (draggableObject.ONConfig.fromBoolean) {
                        return "boolean";
                    }
                    if (draggableObject.ONConfig.fromDecimal) {
                        return "number";
                    }
                    if (draggableObject.ONConfig.fromInteger) {
                        return "integer";
                    }
                } else {
                    return "any";
                }
            }
        }
        if (draggableObject.isField) {
            if (!draggableObject.activeField) {
                return "";
            }
            return draggableObject.activeField.type;
        }

        if (draggableObject.isMatchbox) {
            return "string";
        }
    };

    const generateDraggablePointIDFromLink = (link) => {
        let start = "";
        let end = "";

        if (link.fieldsourceID) {
            start += "ActiveField-";
            start += link.fieldsourceID;

            const activeField = activeFields.find((activeField) => {
                if (activeField.id == link.fieldsourceID) {
                    return true;
                }
            });

            const activeNode = activeNodes.find((activeNode) => {
                if (activeNode.id == activeField.nodeID) {
                    return true;
                }
            });

            if (activeNode?.isGroup) {
                start += "-isInGroupModal";
            }
        }
        if (link.ONsourceID) {
            const operationNode = operationNodes.find((operationNode) => {
                if (operationNode.id == link.ONsourceID) {
                    return true;
                }
            });
            start += "OperationNode-" + operationNode?.id + "-";
            start += "OUTPUT-";
            start += link.outputIndex;
        }
        if (link.ONdestinationID) {
            const operationNode = operationNodes.find((operationNode) => {
                if (operationNode.id == link.ONdestinationID) {
                    return true;
                }
            });
            end += "OperationNode-" + operationNode?.id + "-";

            if (!link.fielddestinationID) {
                if (link.isVariablePassthrough == 1) {
                    end += "-PASSTHROUGH";
                } else {
                    end += "INPUT-";
                    end += link.order;
                }
            }
        }

        if (link.nodedestinationID) {
            end += "ActiveNode-" + link.nodedestinationID;
        }

        if (link.fielddestinationID) {
            end += "ActiveField-";
            end += link.fielddestinationID;

            const activeField = activeFields.find((activeField) => {
                if (activeField.id == link.fielddestinationID) {
                    return true;
                }
            });

            const activeNode = activeNodes.find((activeNode) => {
                if (activeNode.id == activeField.nodeID) {
                    return true;
                }
            });

            if (activeNode.isGroup) {
                end += "-isInGroupModal";
            }
        }

        if (link.matchboxDestinationID) {
            end = "Matchbox-" + link.matchboxDestinationID;
        }

        return [start, end];
    };

    const generateDraggablePointID = (draggableObject) => {
        let id = "";
        if (draggableObject) {
            if (draggableObject.isON) {
                id += "OperationNode-" + draggableObject.ON.id + "-";
                if (!draggableObject.isField) {
                    if (draggableObject.isInput) {
                        if (draggableObject.isPassthrough) {
                            id += "-PASSTHROUGH";
                        } else {
                            id += "INPUT-";

                            id += draggableObject.orderOfInput;
                        }
                    }
                    if (draggableObject.isOutput) {
                        id += "OUTPUT-";
                        id += draggableObject.indexOfOutput;
                    }
                }

                if (draggableObject.isField) {
                    id += "ActiveField-";

                    id += draggableObject.activeField.id;
                }
            } else {
                if (draggableObject.isField) {
                    id += "ActiveField-";

                    id += draggableObject.activeField.id;
                }
                if (draggableObject.isInGroupModal) {
                    id += "-isInGroupModal";
                }
                if (draggableObject.isMatchbox) {
                    id = "Matchbox-" + draggableObject.matchbox.id;
                }
                if (draggableObject.fullNode) {
                    id += "ActiveNode-";
                    id += draggableObject.fullNode.id;
                }
            }
        }
        return id;
    };

    const getLinkType = (link) => {
        if (link.type != null) {
            return link.type;
        }

        if (link.fieldsourceID != null) {
            const fieldInLink = activeFields.find((field) => {
                if (field.id == link.fieldsourceID) {
                    return true;
                }
                return false;
            });

            if (fieldInLink.type == "string") {
                return "string";
            }
            if (fieldInLink.type == "integer") {
                return "integer";
            }
            if (fieldInLink.type == "boolean") {
                return "boolean";
            }
            if (fieldInLink.type == "number") {
                return "number";
            }
        }
        if (link.ONsourceID != null) {
            const ONInLink = operationNodes.find((ON) => {
                if (ON.id == link.ONsourceID) {
                    return true;
                }
                return false;
            });

            const ONConfig = operationNodesConfig.find((config) => {
                if (config.id == ONInLink.configID) {
                    return true;
                }
                return false;
            });

            if (ONConfig) {
                if (ONConfig.toString) {
                    return "string";
                }
                if (ONConfig.toInteger) {
                    return "integer";
                }
                if (ONConfig.toDecimal) {
                    return "number";
                }
                if (ONConfig.toBoolean) {
                    return "boolean";
                }
            } else {
                //Node as ON
                return "object";
            }
        }

        return "any";
    };

    const getLinkLineColor = (link) => {
        const type = getLinkType(link);

        if (link.containingNodeID) {
            return "#ff0000";
        }

        if (type == "string") {
            return "#5588d3";
        }
        if (type == "integer") {
            return "#77c7bd";
        }
        if (type == "number") {
            return "#90ee90";
        }
        if (type == "boolean") {
            return "#f1b477";
        }
        if (type == "object") {
            return "#ff0000";
        }

        return "#5588d3";
    };

    return (
        <LinksContext.Provider
            value={{
                rebuild,
                triggerLinksRebuild,
                startBuildLine,
                dotStyle,
                dragStarted,
                handleDrag,
                dragElement,
                generateDraggablePointID,
                getType,
                dragEnded,
                setDragElement,
                generateDraggablePointIDFromLink,
                position,
                getLinkLineColor,
                getLinkType,
            }}
        >
            {props.children}
        </LinksContext.Provider>
    );
};
export default LinksWrapper;
