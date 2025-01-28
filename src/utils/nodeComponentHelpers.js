export const collectExampleData = (
    actualExampleData,
    fetchedExampleData,
    fullNode,
    schema
) => {
    let exampleObj;
    let example = "";
    if (fetchedExampleData != null) {
        exampleObj = fetchedExampleData;
    } else {
        exampleObj = example;
    }
    if (exampleObj) {
        if (fullNode.schema?.type === "array" || fullNode.type === "array") {
            let emptyArray = [];
            if (exampleObj != null && Array.isArray(exampleObj)) {
                exampleObj?.map((exampledataobject, index) => {
                    emptyArray.push(exampledataobject[schema.name]);
                });
            }
            exampleObj = emptyArray;
        } else {
            exampleObj = exampleObj;
        }
    }

    let actualExample = null;
    if (actualExampleData != null) {
        if (actualExampleData[schema.name] !== undefined) {
            actualExample = actualExampleData[schema.name];
        }
    }

    return {
        actualExample,
        exampleObj,
        example,
    };
};

export const collectRelatedNodeExampleData = (
    fetchedExampleData,
    fullNode,
    relatedNode
) => {
    let exampleObj;
    let example = "";

    let objToUse = null;
    if (fetchedExampleData != null) {
        objToUse = fetchedExampleData;
    } else {
        objToUse = example;
    }
    if (objToUse) {
        if (fullNode.schema?.type === "array" || fullNode.type === "array") {
            exampleObj = objToUse[0];
        } else {
            exampleObj = objToUse;
        }

        if (typeof exampleObj === "object" && exampleObj !== null) {
            let keys = Object.keys(exampleObj);
            keys.map((key) => {
                if (key === relatedNode.name) {
                    exampleObj = exampleObj[key];
                }
            });
        }
    }

    return { exampleObj };
};

export const getNodeName = (node, isEndpointRequired = false) => {
  if (isEndpointRequired)
    return node?.customName || node?.name || node?.endpoint || "";
  return node?.customName || node?.name || "";
};