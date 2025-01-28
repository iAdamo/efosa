import {
	getFieldAddIntent,
	getLinksAddIntent,
	getNodeAddIntent,
	getONNodeAddIntent,
} from "@/axios/AIAPICalls";

export const createAISlice = (set, get) => ({
	AI: {
		suggestions: {
			byId: {},
			allIds: [],
		},
		actions: {
			fetchLinksAddIntent: async () => {
				if (import.meta.env.VITE_NODE_ENV === "development") return;
				const data = await getLinksAddIntent(get().speccId);
				const answer = data.answer.answer.availableFieldsToLink
					.filter(
						(suggestion) =>
							suggestion.similarity_score >
							Number(import.meta.env.VITE_SIMILARITY_THRESHOLD),
					)
					.map((suggestion) => suggestion.index);
				const context = data.context.availableFieldsToLink;
				const suggestedLinks = [];
				if (!answer || !context) return;
				for (const index of answer) {
					const link = context[index];
					if (
						!get().activeFields.byId[link.field1.id] ||
						!get().activeFields.byId[link.field2.id]
					)
						continue;
					link.id = `add-link-source-id-${link.field1.id}-destination-id-${link.field2.id}`;
					link.type = "ADD_LINK";
					link.status = "SUGGESTED";
					suggestedLinks.push(link);
				}
				get().clearSuggestionsByState("ADD_LINK");
				for (const suggestion of suggestedLinks) {
					if (get().AI.suggestions.byId[suggestion.id]) continue;
					set((state) => {
						state.AI.suggestions.byId[suggestion.id] = suggestion;
						state.AI.suggestions.allIds.push(suggestion.id);
					});
				}
			},
			fetchONNodeAddIntent: async () => {
				if (import.meta.env.VITE_NODE_ENV === "development") return;
				const exampleData = get().exampleData.handles;
				const API1Fields = get().nodes.byId.API1.sourceHandles;
				const exampleDataSend = [];
				for (const handle of API1Fields) {
					if (exampleData[Number(handle)])
						exampleDataSend.push({
							[handle]: exampleData[Number(handle)],
						});
				}
				const data = await getONNodeAddIntent(get().speccId, exampleDataSend);
				const answer = data.answer.answer;
				//   const context = data.context;
				const ONSuggestions = [];
				for (const suggestion of answer) {
					ONSuggestions.push({
						id: `add-on-source-id-${suggestion.sourceFieldID[0].fieldIndex}-destination-id-${suggestion.destinationFieldID[0].fieldIndex}-operation-id-${suggestion.operationNode}`,
						sourceFields: suggestion.sourceFieldID
							.map((node) => node.fieldIndex)
							.filter((fieldId) => get().activeFields.byId[fieldId]),
						destinationFields: suggestion.destinationFieldID
							.map((node) => node.fieldIndex)
							.filter((fieldId) => get().activeFields.byId[fieldId]),
						ON: get().getONConfig(suggestion.operationNode),
						type: "ADD_ON",
						status: "SUGGESTED",
						confidence: suggestion.similarity_score,
					});
				}
				get().clearSuggestionsByState("ADD_ON");
				for (const suggestion of ONSuggestions) {
					if (get().AI.suggestions.byId[suggestion.id]) continue;
					if (
						suggestion.sourceFields.length === 0 &&
						suggestion.destinationFields.length === 0
					)
						continue;
					set((state) => {
						state.AI.suggestions.byId[suggestion.id] = suggestion;
						state.AI.suggestions.allIds.push(suggestion.id);
					});
				}
			},
			fetchFieldAddIntent: async () => {
				if (import.meta.env.VITE_NODE_ENV === "development") return;
				const data = await getFieldAddIntent(get().speccId);
				const answers = data.answer.answer;
				const context = data.context;
				const fieldSuggestions = [];
				if (!answers || !context) return;
				const sourceFieldSuggestions = answers.availableFieldsAPI1.filter(
					(ans) =>
						ans.matchesWithActivated &&
						ans.similarity_score >
							Number(import.meta.env.VITE_SIMILARITY_THRESHOLD),
				);
				const destinationFieldSuggestions = answers.availableFieldsAPI2.filter(
					(ans) =>
						ans.matchesWithActivated &&
						ans.similarity_score >
							Number(import.meta.env.VITE_SIMILARITY_THRESHOLD),
				);
				const availableSourceFields = context.availableFieldsAPI1;
				const availableDestinationFields = context.availableFieldsAPI2;
				for (const sourceField of sourceFieldSuggestions) {
					const source = availableSourceFields[Number(sourceField.index)];
					if (!get().activeNodes.byId[source.ownerNode]) continue;
					fieldSuggestions.push({
						id: `add-field-owner-${source.ownerNode}-name-${source.name}`,
						field: source,
						type: "ADD_FIELD",
						status: "SUGGESTED",
						confidence: sourceField.similarity_score,
					});
				}
				for (const destinationField of destinationFieldSuggestions) {
					const destination =
						availableDestinationFields[Number(destinationField.index)];
					if (!get().activeNodes.byId[destination.ownerNode]) continue;
					fieldSuggestions.push({
						id: `add-field-owner-${destination.ownerNode}-name-${destination.name}`,
						field: destination,
						type: "ADD_FIELD",
						status: "SUGGESTED",
						confidence: destinationField.similarity_score,
					});
				}
				get().clearSuggestionsByState("ADD_FIELD");
				for (const suggestion of fieldSuggestions) {
					if (get().AI.suggestions.byId[suggestion.id]) continue;
					set((state) => {
						state.AI.suggestions.byId[suggestion.id] = suggestion;
						state.AI.suggestions.allIds.push(suggestion.id);
					});
				}
			},
			fetchNodeAddIntent: async () => {
				if (import.meta.env.VITE_NODE_ENV === "development") return;
				const data = await getNodeAddIntent(get().speccId);
				const answers = data.answer.answer;
				const context = data.context;
				const nodeSuggestions = [];
				if (!answers || !context) return;
				const sourceNodeSuggestions = answers.availableNodesAPI1.filter(
					(ans) =>
						ans.matchesWithActivated &&
						ans.similarity_score >
							Number(import.meta.env.VITE_SIMILARITY_THRESHOLD),
				);
				const destinationNodeSuggestions = answers.availableNodesAPI2.filter(
					(ans) =>
						ans.matchesWithActivated &&
						ans.similarity_score >
							Number(import.meta.env.VITE_SIMILARITY_THRESHOLD),
				);
				const availableSourceNodes = context.availableNodesAPI1;
				const availableDestinationNodes = context.availableNodesAPI2;
				for (const sourceNode of sourceNodeSuggestions) {
					const node = availableSourceNodes[Number(sourceNode.index)];
					if (!get().activeNodes.byId[node.ownerNode]) continue;
					nodeSuggestions.push({
						id: `add-node-owner-${node.ownerNode || "parent"}-name-${
							node.name
						}`,
						node: node,
						type: "ADD_NODE",
						status: "SUGGESTED",
						confidence: sourceNode.similarity_score,
					});
				}
				for (const destinationNode of destinationNodeSuggestions) {
					const node = availableDestinationNodes[Number(destinationNode.index)];
					if (!get().activeNodes.byId[node.ownerNode]) continue;
					nodeSuggestions.push({
						id: `add-node-owner-${node.ownerNode || "parent"}-name-${
							node.name
						}`,
						node: node,
						type: "ADD_NODE",
						status: "SUGGESTED",
						confidence: destinationNode.similarity_score,
					});
				}
				get().clearSuggestionsByState("ADD_NODE");
				for (const suggestion of nodeSuggestions) {
					if (get().AI.suggestions.byId[suggestion.id]) continue;
					set((state) => {
						state.AI.suggestions.byId[suggestion.id] = suggestion;
						state.AI.suggestions.allIds.push(suggestion.id);
					});
				}
			},
		},
	},
	setSuggestionAsApproved: (suggestionId) => {
		set((state) => {
			state.AI.suggestions.byId[suggestionId].status = "APPROVED";
		});
	},
	setSuggestionAsRejected: (suggestionId) => {
		set((state) => {
			state.AI.suggestions.byId[suggestionId].status = "REJECTED";
		});
	},
	clearSuggestionsByState: (state) => {
		for (const suggestionId of get().AI.suggestions.allIds) {
			if (get().AI.suggestions.byId[suggestionId].status === state) {
				set((state) => {
					delete state.AI.suggestions.byId[suggestionId];
					state.AI.suggestions.allIds = state.AI.suggestions.allIds.filter(
						(id) => id !== suggestionId,
					);
				});
			}
		}
	},
});
