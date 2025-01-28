import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { createAISlice } from "./aiSlice";
import { createCacheSlice } from "./cacheSlice";
import { createEndpointsSlice } from "./endpointsSlice";
import { createExecutionSummarySlice } from "./executionSummarySlice";
import { createModuleResultsSlice } from "./moduleResultsSlice";
import { createReactFlowSlice } from "./reactFlowSlice";
import { createReactionsSlice } from "./reactionsSlice";
import { createUISlice } from "./uiSlice";
import { createWebhookSlice } from "./webhookSlice";
import { createWizardSlice } from "./wizardSlice";
import { createXofSlice } from "./xofSlice";

const useGlobalStore = create(
  devtools(
    immer((...a) => ({
      ...createWizardSlice(...a),
      ...createWebhookSlice(...a),
      ...createReactFlowSlice(...a),
      ...createExecutionSummarySlice(...a),
      ...createEndpointsSlice(...a),
      ...createUISlice(...a),
      ...createAISlice(...a),
      ...createReactionsSlice(...a),
      ...createXofSlice(...a),
      ...createModuleResultsSlice(...a),
      ...createCacheSlice(...a),
    }))
  )
);

export default useGlobalStore;
