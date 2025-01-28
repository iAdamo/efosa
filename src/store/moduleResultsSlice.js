export const createModuleResultsSlice = (set, get) => ({
  moduleResults: {
    setModuleResults: (moduleName, results) => {
      set((state) => {
        state.moduleResults[moduleName] = results;
      });
    },
    clearModuleResults: (moduleName) => {
      set((state) => {
        state.moduleResults[moduleName] = null;
      });
    },
  },
});
