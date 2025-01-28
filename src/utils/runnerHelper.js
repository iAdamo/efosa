export const objToText = (obj) => {
    const result = JSON.stringify(obj, null, 4)
        .slice(1, -1)
        .replace(/,/g, ",\n")
        .replace(/^\s*\n/gm, "")
        .trim();

    const resultLength = result.split("\n").length;

    return { result, resultLength };
};

export const formatObject = (obj) => {
    let result = "";
    for (const key in obj) {
        if (typeof obj[key] === "object") {
            result += `${key} : object\n`;
            const innerObj = obj[key];
            for (const innerKey in innerObj) {
                result += `    "${innerKey}": ${innerObj[innerKey]},\n`;
            }
        } else {
            result += `${key} : ${obj[key]}\n`;
        }
    }
    const resultLength = result.trim().split("\n").length;
    return { result: result.trim(), resultLength };
};
