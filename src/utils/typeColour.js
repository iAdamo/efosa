import { toKeys, typeColors } from "@/constants";

export const getTypeColor = (type) => {
	switch (type) {
		case "string":
			return typeColors.STRING;
		case "integer":
			return typeColors.INTEGER;
		case "number":
			return typeColors.NUMBER;
		case "boolean":
			return typeColors.BOOLEAN;
		case "object":
			return typeColors.OBJECT;
		case "connection":
			return typeColors.CONNECTION;
		default:
			return typeColors.DEFAULT;
	}
};

export const getOutputTypeFromConfig = (config) => {
	const outputTypes = [];
	for (const key of toKeys) {
		console.log("config[key]", config[key], key, config.name);
		if (config[key] === 1) {
			switch (key) {
				case "toArray":
					outputTypes.push("object");
					break;
				case "toBoolean":
					outputTypes.push("boolean");
					break;
				case "toDecimal":
					outputTypes.push("number");
					break;
				case "toInteger":
					outputTypes.push("integer");
					break;
				case "toString":
					outputTypes.push("string");
					break;
				default:
					console.error("Unknown output type");
			}
		}
	}
	return outputTypes;
};
