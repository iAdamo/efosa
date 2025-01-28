import { ApiClientSingleton } from "./conf";

const { axiosInstance } = ApiClientSingleton.getInstance();

export const addActiveONNodeApi = async (node) => {
  const { data } = await axiosInstance.post("/CRUD/ON_Nodes", node);
  return data;
};

export const deleteActiveONNodeApi = async (nodeId, speccID) => {
  const { data } = await axiosInstance.delete(`/CRUD/ON_Nodes/${nodeId}?speccID=${speccID}`);
  return data;
};

export const addActiveONFieldApi = async (onNodeID, name, speccID) => {
  const { data } = await axiosInstance.post("/CRUD/ON_Fields", {
    onNodeID,
    name,
    speccID,
  });
  return data;
};

export const deleteActiveONFieldApi = async (fieldId, speccID) => {
  const { data } = await axiosInstance.delete(`/CRUD/ON_Fields/${fieldId}?speccID=${speccID}`);
  return data;
};
