export const CACHE_GROUP = {
  RUN: "RUN",
  MATCH: {
    GET_SOURCE: "MATCH.GET_SOURCE",
    GET_DESTINATION: "MATCH.GET_DESTINATION",
    RESULTS: "MATCH.RESULTS",
    TRANSFER: "MATCH.TRANSFER",
  },
};

const initializeCacheGroup = (cacheGroupObject) => {
  return Object.keys(cacheGroupObject).reduce((acc, key) => {
    acc[key] = typeof cacheGroupObject[key] === "object" && cacheGroupObject[key] !== null ? initializeCacheGroup(cacheGroupObject[key]) : null;
    return acc;
  }, {});
};

export const createCacheSlice = (set, get) => ({
  cache: {
    ...initializeCacheGroup(CACHE_GROUP),
    setCacheValue: (key, value) => {
      set((state) => {
        const keys = key.split(".");
        const lastKey = keys.pop();
        let currentState = state.cache;
        keys.forEach((k) => {
          currentState = currentState[k];
        });
        currentState[lastKey] = value;
      });
    },
    setDynamicCache: (key, dynamicKey, value) => {
      set((state) => {
        const keys = key.split(".");
        const lastKey = keys.pop();
        let currentState = state.cache;
        keys.forEach((k) => {
          currentState = currentState[k];
        });
        currentState[lastKey][dynamicKey] = value;
      });
    },
  },
});
