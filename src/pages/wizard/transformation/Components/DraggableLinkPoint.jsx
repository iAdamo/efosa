import React, {
    useContext,
    useState,
} from "react";
import { DIRECTION } from "@constants";
import { WizardContext } from "@contexts/WizardContext";
import { LinksContext } from "@contexts/LinksContext";
import BooleanModal from "./BooleanModal";
import DataModal from "./DataModal";
import useSchemaFieldClasses from "@hooks/SchemaField/useSchemaFieldClasses";
import { MatchContext } from "@contexts/MatchContext";

export default function DraggableLinkPoint(props) {
    const [isHovered, setIsHovered] = useState(false);
    const { triggerLinksRebuild, startBuildLine } = useContext(LinksContext);

    const {
        activeField,
        direction,
        isCollapsed,
        isInGroupModal,
        isInOperationNode,
        ONConfig,
        ON,
        isInput,
        inputName,
        isOutput,
        indexOfOutput,
        orderOfInput,
        matchbox,
        isNodeAsONField,
        fullNode,

        linkToDraggablePoint,
        overrideType,
        isPassthrough,

        exampledata,
        setSelectedExampledataIndex,
        setIsExampledataFresh,
        actualExampleData,
        debug,
        isGhost,
    } = props;

    const { setBooleanModal, booleanModal, dataModal, setDataModal, links } =
        useContext(WizardContext);

    const {
        dragStarted,
        handleDrag,
        generateDraggablePointID,
        getType,
        dragEnded,
        dragElement,
        setDragElement,
    } = useContext(LinksContext);

    const { isMatchMode } = useContext(MatchContext);

    const isON = ON ? true : false;
    const isField = activeField ? true : false;
    const isMatchbox = matchbox ? true : false;
    let isSourceField = false;
    let isDestinationField = false;
    if (direction) {
        if (direction == "SOURCE" || isMatchMode) {
            isSourceField = true;
        }
        if (direction == "DESTINATION" && !isMatchMode) {
            isDestinationField = true;
        }
    }

    const thisObject = {
        isON,
        isField,
        isSourceField,
        isDestinationField,
        activeField,
        ON,
        ONConfig,
        isInput,
        inputName,
        isOutput,
        indexOfOutput,
        isInGroupModal,
        orderOfInput,
        isMatchbox,
        matchbox,
        isNodeAsONField,
        direction,
        fullNode,
        isPassthrough,
    };
    let type = null;

    if (overrideType) {
        type = overrideType;
    } else {
        type = getType(thisObject);
    }

    thisObject.type = type;

    const generatedID = generateDraggablePointID(thisObject);

    thisObject.generatedID = generatedID;

    let isLinkedTo = !!linkToDraggablePoint;

    if (fullNode && !isOutput && links) {
        for (let i = 0; i < links.length; i++) {
            if (links[i]?.nodedestinationID == fullNode?.id) {
                isLinkedTo = true;
                break;
            }
        }
    }

    const { className } = useSchemaFieldClasses(
        thisObject,
        dragElement,
        booleanModal,
        dataModal,
        isCollapsed,
        direction,
        isLinkedTo,
        links
    );






    return (
        <>
            {dataModal &&
                dataModal.target.id === generatedID &&
                direction === DIRECTION.DESTINATION &&
                activeField && (
                    <>
                        <DataModal
                            modal={dataModal}
                            onClose={() => setDataModal(null)}
                            schema={activeField}
                            exampledata={exampledata}
                            setSelectedExampledataIndex={
                                setSelectedExampledataIndex
                            }
                            setIsExampledataFresh={setIsExampledataFresh}
                            schemaName={activeField.name}
                            actualExampledata={actualExampleData}
                            direction={direction}
                            type={type}
                            activeField={activeField}
                        />
                    </>
                )}

            <div onClick={(e) => e.stopPropagation()}>
                <span
                    onClick={(e) => {
                        if (isField) {
                            setDataModal(e);
                        }
                    }}
                    className={className}
                    id={generatedID}
                    onDrag={handleDrag}
                    draggable={!isInGroupModal}
                    onDragStart={(e) => {
                        dragStarted(e, thisObject);
                    }}
                    onDragEnd={(e) => {
                        setDragElement(null);
                    }}
                    data-destination-id={generatedID}
                    data-schema={JSON.stringify(thisObject)}
                    onDragOver={(e) => {
                        e.preventDefault();
                    }}
                    onDrop={dragEnded}
                >
                    <span
                        id={generatedID}
                        data-destination-id={generatedID}
                        data-schema={JSON.stringify(thisObject)}
                    ></span>
                </span>
            </div>

            {isInOperationNode && isHovered && (
                <div>
                    <span className={operationNodeDotClass}>
                        <span className="translate-x-1/2"></span>
                    </span>
                </div>
            )}

            {booleanModal && booleanModal.target.id === generatedID && (
                <BooleanModal
                    modal={booleanModal}
                    onClose={() => setBooleanModal(null)}
                    schema={activeField}
                />
            )}
            {dataModal &&
                dataModal.target.id === generatedID &&
                direction === DIRECTION.SOURCE &&
                activeField && (
                    <>
                        <DataModal
                            modal={dataModal}
                            onClose={() => setDataModal(null)}
                            schema={activeField}
                            exampledata={exampledata}
                            setSelectedExampledataIndex={
                                setSelectedExampledataIndex
                            }
                            setIsExampledataFresh={setIsExampledataFresh}
                            schemaName={activeField.name}
                            actualExampledata={actualExampleData}
                            direction={direction}
                            type={type}
                            activeField={activeField}
                        />
                    </>
                )}
        </>
    );
}
