import axios from "axios";
import Cookies from "js-cookie";

const createClient = () => {
  const apiClient = axios.create({
    headers: {
      "Content-Type": "application/json",
    },
    baseURL: "/proxy/api",
  });

  apiClient.interceptors.request.use((axiosConfig) => {
    axiosConfig.headers = { ...axiosConfig.headers };

    return axiosConfig;
  });

  apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 403) {
        Cookies.remove("token");
        window.location.href = "/login";
      }
      return Promise.reject(error);
    }
  );

  apiClient.interceptors.response.use(
    (response) => {
      // Extract reactions from the response, if they exist
      const reactions = response.data?.reactions;
      if (reactions) {
        import("../store/globalStore").then(({ default: useGlobalStore }) => {
          let isInitial = false;
          if (response.config.url.includes("initial")) {
            isInitial = true;
          }
          const addReaction = useGlobalStore.getState().reactions.addReaction;
          for (const [key, value] of Object.entries(reactions)) {
            addReaction({ [key]: { ...value, isInitial } });
          }
          addReaction(reactions);
        });
      }

      return response;
    },
    (error) => {
      console.error("API Error:", error);
      return Promise.reject(error);
    }
  );

  return apiClient;
};

export class ApiClientSingleton {
  axiosInstance;

  static instance;

  constructor() {
    this.axiosInstance = createClient();
  }

  static getInstance() {
    if (ApiClientSingleton.axiosInstance) {
      return ApiClientSingleton.axiosInstance;
    }

    const instance = new ApiClientSingleton();
    Object.freeze(instance);

    ApiClientSingleton.axiosInstance = instance;
    return ApiClientSingleton.axiosInstance;
  }
}
