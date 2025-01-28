import { ApiClientSingleton } from "./conf";

const { axiosInstance } = ApiClientSingleton.getInstance();

export const fetchProjectInitial = async (projectID) => {
  const { data } = await axiosInstance.get(`/project/${projectID}/initial`);

  return data;
};

export const fetchAPIInitial = async (APIID) => {
  const { data } = await axiosInstance.get(`/API/${APIID}/initialll`);

  return data;
};

export const fetchProjectErrors = async (projectID, date = null) => {
  const { data } = await axiosInstance.get(`/project/${projectID}/initial/errors${date != null ? `?date=${date}` : ""}`);

  return data;
};
