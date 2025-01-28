import {ApiClientSingleton} from "@axios/conf.js";

const { axiosInstance } = ApiClientSingleton.getInstance();

export const storeAuth = async (formData) => {
        const { data } = await axiosInstance.post(
        `/MyAuth`,
        formData
    );

    return data;
};