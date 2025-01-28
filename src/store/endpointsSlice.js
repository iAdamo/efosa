import { getApiEndpoints } from "@/axios/apiCalls";

export const createEndpointsSlice = (set, get) => ({
	endpoints: {
		run: {
			source: [],
			destination: [],
		},
		matching: {
			destination: [],
		},
	},
	selectedParentNode: {
		run: { source: null, destination: null },
		matching: { destination: null },
	},
	setMatchingParentNode: (node) => {
		set((state) => {
			state.selectedParentNode.matching.destination = node;
		});
	},
	updateEndpoints: async (speccID) => {
		const sourceRunEndpoints = await getApiEndpoints(speccID, "SOURCE", false);
		const destinationRunEndpoints = await getApiEndpoints(
			speccID,
			"DESTINATION",
			false,
		);
		const destinationMatchEndpoints = await getApiEndpoints(
			speccID,
			"DESTINATION",
			true,
		);

		set((state) => {
			state.endpoints.run.source = [...sourceRunEndpoints];
			state.endpoints.run.destination = [...destinationRunEndpoints];
			state.endpoints.matching.destination = [...destinationMatchEndpoints];
		});
	},
});
