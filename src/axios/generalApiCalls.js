import { ApiClientSingleton } from "./conf";

const { axiosInstance } = ApiClientSingleton.getInstance();

export const fetchGeneralInitial = async () => {
  const { data } = await axiosInstance.get("/initial");
  return data;
};

export const createProject = async (projectData) => {
  const { data } = await axiosInstance.post("CRUD/Projects", projectData);
  return data;
};

export const createClient = async (clientData) => {
    const {data} = await axiosInstance.post("/clients", clientData, {headers: {"Content-Type": "multipart/form-data"}});
    return data;
};

export const updateClient = async (clientData, id) => {
    const {data} = await axiosInstance.post(`/clients/${id}`, clientData, {headers: {"Content-Type": "multipart/form-data"}});
    return data;
};

export const deleteClient = async (id) => {
    const {data} = await axiosInstance.delete(`/clients/${id}`);
    return data;
};
