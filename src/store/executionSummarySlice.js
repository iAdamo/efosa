export const createExecutionSummarySlice = (set, get) => ({
    selectedExecutionHash: null,
    allExecutionDetailsData: null,
    transformationModuleData: null,

    actions: {
        setSelectedExecutionHash: (hash) => set(() => ({ selectedExecutionHash: hash })),
        setAllExecutionDetailsData: (data) => set(() => ({ allExecutionDetailsData: data })),
        setTransformationModuleData: (data) => set(() => ({ transformationModuleData: data })),
    },
})