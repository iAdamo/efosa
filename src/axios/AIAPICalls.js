import { ApiClientSingleton } from "./conf";

const { axiosInstance } = ApiClientSingleton.getInstance();

export const getLinksAddIntent = async (speccID) => {
  const { data } = await axiosInstance.get(`/AI/tasks/${speccID}/activatelink`);
  return data;
};
export const getFieldAddIntent = async (speccID) => {
  const { data } = await axiosInstance.get(`/AI/tasks/${speccID}/activatefield`);
  return data;
};
export const getNodeAddIntent = async (speccID) => {
  const { data } = await axiosInstance.get(`/AI/tasks/${speccID}/activatenode`);
  return data;
};
export const getONNodeAddIntent = async (speccID, exampleDataList) => {
  const { data } = await axiosInstance.post(`/AI/tasks/${speccID}/operationnodes`, {
    exampledata: exampleDataList,
  });
  return data;
};
