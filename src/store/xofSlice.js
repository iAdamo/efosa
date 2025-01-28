export const createXofSlice = (set, get) => ({
  xOf: {
    data: { reaction: null, show: false },
    addXof: (reaction) => {
      set((state) => {
        state.xOf.data.reaction = reaction;
        state.xOf.data.show = true;
      });
    },
    removeXof: () => {
      set((state) => {
        state.xOf.data.reaction = null;
        state.xOf.data.show = false;
      });
    },
  },
});
