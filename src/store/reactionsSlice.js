import { uniqueId } from "lodash";

export const ACTIONS = {
  OPEN: "OPEN",
  CLOSE: "CLOSE",
  REFRESH: "REFRESH",
  CHOOSE: "CHOOSE",
};

export const createReactionsSlice = (set, get) => ({
  reactions: {
    list: { byId: {}, allIds: [] },
    addReaction: (reaction) => {
      const [key, value] = Object.entries(reaction)[0];
      set((state) => {
        if (!state.reactions.list.byId[key]) {
          // if key does not exist, add new key-value pair
          state.reactions.list.byId[key] = value;
          state.reactions.list.allIds.push(key);
        }
      });
    },
    removeReaction: (reactionId) => {
      set((state) => {
        delete state.reactions.list.byId[reactionId];
        state.reactions.list.allIds = state.reactions.list.allIds.filter((id) => id !== reactionId);
      });
    },
    updateReaction: (reaction) => {
      set((state) => {
        state.reactions.list.byId[reaction.id] = reaction;
      });
    },
  },
});
