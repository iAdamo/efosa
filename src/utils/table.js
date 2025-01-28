export const getTypeValuesFromObjRow = (row) => {
	const singleValues = [];
	const objectValues = [];
	const arrayValues = [];

	Object.keys(row).forEach((colName) => {
		const colValue = row[colName];
		if (colValue === null || colValue === undefined || colValue === "") {
			singleValues.push({ name: colName, value: "<No Value>" });
		} else if (typeof colValue === "string" || typeof colValue === "number") {
			singleValues.push({ name: colName, value: colValue });
		} else if (typeof colValue === "boolean") {
			singleValues.push({ name: colName, value: String(colValue) });
		} else if (typeof colValue === "object") {
			if (Array.isArray(colValue) && colValue.length > 0) {
				arrayValues.push({ name: colName, value: colValue });
			} else if (Object.keys(colValue).length > 0) {
				objectValues.push({ name: colName, value: colValue });
			}
		}
	});
	return [singleValues, objectValues, arrayValues];
};

export const getTypeValuesFromArrRow = (row) => {
	const singleValues = [];
	const objectValues = [];
	const arrayValues = [];

	row.forEach((col) => {
		if (col === null || col === undefined || col === "") {
			singleValues.push("<No Value>");
		} else if (typeof col === "string" || typeof col === "number") {
			singleValues.push(col);
		} else if (typeof col === "boolean") {
			singleValues.push(String(col));
		} else if (typeof col === "object") {
			if (Array.isArray(col) && col.length > 0) {
				arrayValues.push(col);
			} else if (Object.keys(col).length > 0) {
				objectValues.push(col);
			}
		}
	});

	return [singleValues, objectValues, arrayValues];
};
