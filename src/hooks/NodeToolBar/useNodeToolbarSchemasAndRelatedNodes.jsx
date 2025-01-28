import { useMemo } from "react";

const useNodeToolbarSchemasAndRelatedNodes = (toolbarNode) => {
    const { schemas, relatedNodes } = useMemo(() => {
        const output = {
            schemas: [],
            relatedNodes: [],
        };

        if (!toolbarNode || (!toolbarNode.schema && !toolbarNode.schemas)) {
            return output;
        }

        if (toolbarNode.schema) {
            if (toolbarNode.schema?.type === "array") {
                output.schemas = toolbarNode.schema.schemas[0].schemas ?? [];
                output.relatedNodes =
                    toolbarNode.schema.schemas[0].schemas.filter(
                        (item) =>
                            item.type === "object" || item.type === "array"
                    );
            } else {
                output.schemas = toolbarNode.schema.schemas ?? [];
                if (toolbarNode.schema.schemas) {
                    output.relatedNodes = toolbarNode.schema.schemas?.filter(
                        (item) =>
                            item.type === "object" || item.type === "array"
                    );
                } else {
                    output.relatedNodes = [];
                }
            }
        } else {
            if (toolbarNode.type === "array") {
                output.schemas = toolbarNode.schemas[0].schemas ?? [];
                output.relatedNodes = toolbarNode.schemas[0].schemas.filter(
                    (item) => item.type === "object" || item.type === "array"
                );
            } else {
                output.schemas = toolbarNode.schemas ?? [];
                output.relatedNodes = toolbarNode.schemas.filter(
                    (item) => item.type === "object" || item.type === "array"
                );
            }
        }

        output.schemas = output.schemas?.filter(
            (item) => !(item.type === "object" || item.type === "array")
        );
        return output;
    }, [toolbarNode]);

    return { schemas, relatedNodes };
};

export default useNodeToolbarSchemasAndRelatedNodes;
