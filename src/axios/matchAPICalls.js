import { ApiClientSingleton } from "./conf";

const { axiosInstance } = ApiClientSingleton.getInstance();

export const fetchDestinationData = async ({ speccID }) => {
  const { data } = await axiosInstance.get(`/specc/${speccID}/matching/getData/destination`);
  return data;
};

export const fetchSourceData = async ({ speccID }) => {
  const { data } = await axiosInstance.get(`/specc/${speccID}/matching/getData/source`);
  return data;
};

export const addMatchBoxData = async ({ speccID, sourceFieldID, destinationFieldID }) => {
  const model = {
    speccID,
    sourceFieldID,
    destinationFieldID,
  };
  const { data } = await axiosInstance.post("/CRUD/Matchbox", model);
  return data;
};

export const runMatch = async ({ speccID }) => {
  const { data } = await axiosInstance.get(`/specc/${speccID}/matching/runMatch`);
  return data;
};

export const runTransfer = async ({ speccID, excudedIndexes }) => {
  const { data } = await axiosInstance.post(`/specc/${speccID}/matching/runTransfer`, { excudedIndexes });
  return data;
};
