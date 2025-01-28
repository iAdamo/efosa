import { toast } from "react-toastify";

export const showValidationErrors = (e) => {
    Object.entries(e).forEach(([key, val]) =>
        toast.error(val, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
        })
    );
};

export const showApiErrors = (msg) => {
    toast.error(msg, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
    });
};

export const getOpenApiPaths = (obj) => {};

const getSmallestResponseCode = (obj) =>
    Object.keys(obj).sort(function (a, b) {
        return a - b;
    })[0];

export const renderNodeParameters = (node) => {
    if (node?.get) {
        if (
            node?.get?.responses[getSmallestResponseCode(node?.get?.responses)]
        ) {
            if (
                node?.get?.responses[
                    getSmallestResponseCode(node?.get?.responses)
                ]?.content
            ) {
                if (
                    node?.get?.responses[
                        getSmallestResponseCode(node?.get?.responses)
                    ]?.content["application/json"]
                ) {
                    return node?.get?.responses["200"]?.content[
                        "application/json"
                    ][0]?.schema.properties.filter((p) => p.isField === true);
                } else {
                    return [];
                }
            }
        }
    }

    return [];
};

export function hasSomeParentTheClass(element, classname) {
    if (element.className?.split(" ").indexOf(classname) >= 0) return true;
    return (
        element.parentNode &&
        hasSomeParentTheClass(element.parentNode, classname)
    );
}

export function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export const getGeneratedApiData = (data) => {
    const result = {};

    const { API: {
        customName = '',
        uploadUrl = null,
        uploadMethod = '',
        uploadFilename = ''
    } } = data || {};

    result.customName = customName;
    result.url = uploadUrl;
    result.uploadFilename = uploadFilename;
    result.uploadMethod = uploadMethod;

    return result;
}