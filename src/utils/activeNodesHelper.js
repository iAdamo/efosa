const getDeepSchema = (active, schema) => {
    if (!schema) return null;
    let output = null;

    for (const item of schema) {
        if (item.data.type === "object" && item.schemas != null) {
            const relatedSchema = item.schemas.find(
                (subitem) => subitem.name === active.name
            );
            if (relatedSchema?.data.type === "object") {
                output = relatedSchema;
            }
            if (relatedSchema?.data.type === "array") {
                if(relatedSchema.schemas != null){
                    output = relatedSchema.schemas[0];
                }
            }
            if (!relatedSchema) {
                output = getDeepSchema(active, item.schemas);
            }
        }
        if (item.data.type === "array" && item.schemas != null) {
            const searchSchema = item.schemas[0].schemas;
            const relatedSchema = searchSchema?.find(
                (subitem) => subitem.name === active.name
            );
            if (relatedSchema?.data.type === "object") {
                output = relatedSchema;
            }
            if (relatedSchema?.data.type === "array") {
                output = relatedSchema.schemas[0];
            }
            if (!relatedSchema) {
                output = getDeepSchema(active, searchSchema);
            }
        }
    }
    return output;
};

export const getNodeSchema = (activeNode, schema) => {
    if (!activeNode.parentNode) {
        return schema;
    }
    const relatedSchema = schema.schema.schemas.find(
        (item) => item.name === activeNode.name
    );
    if (relatedSchema?.data.type === "object") {
        return {
            ...schema,
            schema: relatedSchema,
        };
    }
    if (relatedSchema?.data.type === "array") {
        return {
            ...schema,
            schema: relatedSchema.schemas[0],
        };
    }
    if (!relatedSchema) {
        return {
            ...schema,
            schema: getDeepSchema(activeNode, schema.schema.schemas),
        };
    }
};
