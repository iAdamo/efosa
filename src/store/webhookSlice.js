export const createWebhookSlice = (set, get) => ({
	webhook: {},
	webhookVariables: [],
	updateWebhookVariables: (newVariables) => {
		set((state) => {
			state.webhookVariables = [...newVariables];
		});
	},
	setWebhookSNCSubscribeID: (SNCSubscribeID) => {
		set((state) => {
			state.webhook.SNCSubscribeID = SNCSubscribeID;
		});
	}
})