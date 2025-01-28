const addTabs = (count) => new Array(count).fill(`\t`).join("");

export const parametersToText = (parameters, level = 0) => {
    let output = "";
    parameters.forEach((param) => {
        if (!param.name) {
            return;
        }
        if (param.type.heading !== "Object" && param.type.heading !== "Array") {
            output += `${addTabs(level)}"${param.name}":"${
                param.type.heading
            }",\n`;
        }
        if (param.type.heading === "Object") {
            output += `"${param.name}":{\n${parametersToText(
                param.parameters,
                level + 1
            )}},\n`;
        }
        if (param.type.heading === "Array") {
            output += `"${param.name}":[{\n${parametersToText(
                param.parameters,
                level + 1
            )}}],\n`;
        }
    });
    return output;
};

export const textToParameters = (json, level) => {
    let output = [];
    Object.keys(json).forEach((key) => {
        if (typeof json[key] !== "object" || !Array.isArray(json[key])) {
            if (json[key] === "Integer") {
                output.push({
                    id: Math.random() * 10000,
                    name: key,
                    type: {
                        id: 1,
                        heading: "Integer",
                        subHeading: "int32",
                    },
                    required: false,
                    readOnly: false,
                    parameters: [],
                });
            }
            if (json[key] === "Number") {
                output.push({
                    id: Math.random() * 10000,
                    name: key,
                    type: { id: 3, heading: "Number", subHeading: "float" },
                    required: false,
                    readOnly: false,
                    parameters: [],
                });
            }
            if (json[key] === "String") {
                output.push({
                    id: Math.random() * 10000,
                    name: key,
                    type: { id: 5, heading: "String" },
                    required: false,
                    readOnly: false,
                    parameters: [],
                });
            }
            if (json[key] === "Boolean") {
                output.push({
                    id: Math.random() * 10000,
                    name: key,
                    type: { id: 11, heading: "Boolean" },
                    required: false,
                    readOnly: false,
                    parameters: [],
                });
            }
        }
        if (Array.isArray(json[key])) {
            output.push({
                id: Math.random() * 10000,
                name: key,
                type: { id: 12, heading: "Array" },
                required: false,
                readOnly: false,
                parameters: textToParameters(json[key][0]),
            });
        }
        if (typeof json[key] === "object" && !Array.isArray(json[key])) {
            output.push({
                id: Math.random() * 10000,
                name: key,
                type: { id: 13, heading: "Object" },
                required: false,
                readOnly: false,
                parameters: textToParameters(json[key]),
            });
        }
    });
    return output;
};
