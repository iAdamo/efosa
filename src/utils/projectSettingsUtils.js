import { fetchProjectInitial } from "@/services/Project_api_calls";
import {
    addAuth,
    createUploadApi,
    postOAuthCredentials,
    updateAPICustomName,
    uploadAPIFile,
} from "@axios/apiCalls";

export const handleAPIUpload = async (
    uploadData,
    direction,
    speccID,
    urlProjectID
) => {
    const speccData = {
        projectID: urlProjectID,
        speccID: speccID,
        direction,
    };
    if (uploadData.url) {
        speccData["url"] = uploadData.url;
        return await createUploadApi(speccData);
    } else if (uploadData.code) {
        speccData["jsontext"] = uploadData.code;
        speccData["jsonurl"] = "";
        speccData["jsonfile"] = "";
        return await createUploadApi(speccData);
    } else if (uploadData.file) {
        const formData = new FormData();
        formData.append("file", uploadData.file);
        formData.append("projectID", urlProjectID);
        formData.append("speccID", speccID);
        formData.append("direction", direction);

        //setIsLoading(true);
        return await uploadAPIFile(formData);
    }
};

export const handleAPIName = (APIID, apiName) => {
    return updateAPICustomName(APIID, apiName);
};

export const handleAuth = async (APIID, authData) => {
    console.log("authData", authData);
    if (authData.jwt) {
        const acc = [];

        acc.push({
            type: "jwt",
            name: "tokenAuthScheme",
            scheme: "http",
            value: authData.jwt,
        });

        const data = {
            APIID: APIID,
            auth: acc,
        };
        return await addAuth(data);
    } else if (authData.basic) {
        const acc = [];

        acc.push(
            {
                type: "basic",
                name: "basicUsername",
                scheme: "http",
                value: authData.basic.username,
            },
            {
                type: "basic",
                name: "basicPassword",
                scheme: "http",
                value: authData.basic.password,
            }
        );
        const data = {
            APIID: APIID,
            auth: acc,
        };
        return await addAuth(data);
    } else if (authData.oauth) {
        const refactoredAuthData = authData.oauth.map((data) => ({
            name: data.label,
            fieldName: data.fieldName ? data.fieldName : data.label,
            header: data.type === "header",
            body: data.type === "header",
            value: data.value,
            canBeDeleted: false,
            isEdit: false,
        }));
        return await postOAuthCredentials(APIID, {
            credentials: refactoredAuthData,
        });
    }
};
