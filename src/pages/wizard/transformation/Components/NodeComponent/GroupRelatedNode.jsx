import { NodeToolBarContext } from "@contexts/NodeToolBarContext";
import { WizardContext } from "@contexts/WizardContext";
import { PagesContext } from "@contexts/PagesContext";
import useGroupRelatedNodeCollapse from "@hooks/NodeComponent/useGroupRelatedNodeCollapse";
import SchemaComponent from "@pages/wizard/transformation/Components/SchemaComponent";
import { collectExampleData, getNodeName } from "@/utils/nodeComponentHelpers";
import { useContext, useMemo } from "react";
import GroupRelatedNodeTitle from "./GroupRelatedNodeTitle";

const GroupRelatedNode = ({
    node,
    direction,
    actualExampleData,
    fetchedExampleData,
    selectedExampledataIndex,
    setSelectedExampledataIndex,
}) => {
    const { speccID } = useContext(PagesContext);

    const { activeFields } = useContext(WizardContext);
    const { handleNodeCollapse, isCollapsed } = useGroupRelatedNodeCollapse(
        node.activeNodeId
    );

    const allActiveFields = activeFields.filter((activeField) => {
        if (activeField.nodeID === node.id) {
            return true;
        }
        return false;
    });

    return (
        <div>
            <GroupRelatedNodeTitle
                title={getNodeName(node, true)}
                onClick={handleNodeCollapse}
                isCollapsed={isCollapsed}
                direction={direction}
            />
            {!isCollapsed &&
                allActiveFields?.map((activeField, index) => {
                    const { actualExample, exampleObj } = collectExampleData(
                        actualExampleData,
                        fetchedExampleData,
                        node,
                        allActiveFields
                    );

                    return (
                        <SchemaComponent
                            key={activeField.id}
                            fullNode={node}
                            activeField={activeField}
                            direction={direction}
                            index={index}
                            speccid={speccID}
                            endpoint={node.endpoint}
                            isCollapsed={isCollapsed}
                            exampledata={exampleObj}
                            selectedExampledataIndex={selectedExampledataIndex}
                            setSelectedExampledataIndex={
                                setSelectedExampledataIndex
                            }
                            actualExampleData={actualExample}
                            isNodeAsONField={false}
                            ON={null}
                        />
                    );
                })}
        </div>
    );
};

export default GroupRelatedNode;
