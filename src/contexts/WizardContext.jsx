import {
	getAllOKStatuses,
	getGenericCRUD,
	getGenericCRUDWithID,
	getSpecInitialValuesAPI,
} from "@axios/apiCalls";
import Loading from "@components/loaders/Loading";
import { DIRECTION } from "@constants";
import { createContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DataWrapper from "./DataContext";
import LinksWrapper from "./LinksContext";
import MatchContextWrapper from "./MatchContext";
import NodeToolBarWrapper from "./NodeToolBarContext";
import PagesWrapper from "./PagesContext";
import RunnerContextWrapper from "./RunnerContext";
export const WizardContext = createContext(null);

const WizardWrapper = ({ children, showLoader = true, customLoader }) => {
	const { speccID } = useParams();
	const [speccName, setSpeccName] = useState("");
	const [sourceAPIAuthGroups, setSourceAPIAuthGroups] = useState(null);
	const [destinationAPIAuthGroups, setDestinationAPIAuthGroups] =
		useState(null);

	const [webhook, setWebhook] = useState(null);

	const [booleanModal, setBooleanModal] = useState(null);
	const [dataModal, setDataModal] = useState(null);
	const [dataModalSearchValue, setDataModalSearchValue] = useState();
	const [dataModalDescription, setDataModalDescription] = useState();
	const [fetchedData, setFetchedData] = useState();

	const [isSidebarOpen, setIsSidebarOpen] = useState(null);

	const [isNavigationbarOpen, setIsNavigationbarOpen] = useState(true);

	const [isLoading, setIsLoading] = useState(false);

	const [operationNodes, setOperationNodes] = useState([]);
	const [operationNodesConfig, setOperationNodesConfig] = useState([]);
	const [operationNodesInnerInputConfig, setOperationNodesInnerInputConfig] =
		useState([]);
	const [operationNodesInput, setOperationNodesInput] = useState([]);

	const [meatballs, setMeatballs] = useState([]);

	const [links, setLinks] = useState([]);

	const [hideCollapsed, setHideCollapsed] = useState(false);

	const [selectedLink, setSelectedLink] = useState(null);

	const [layoutWidth, setLayoutWidth] = useState(0);

	const [activeNodes, setActiveNodes] = useState([]);
	const [activeFields, setActiveFields] = useState([]);
	const [sourceAPIID, setSourceAPIID] = useState(null);
	const [destinationAPIID, setDestinationAPIID] = useState(null);
	const [sourceAPIName, setSourceAPIName] = useState(null);
	const [destinationAPIName, setDestinationAPIName] = useState(null);

	const [activeSchemas, setActiveSchemas] = useState([]);
	const [schemasDescriptions, setSchemasDescriptions] = useState([]);
	const [relatedNodes, setRelatedNodes] = useState([]);
	const [relatedNodesLinks, setRelatedNodesLinks] = useState([]);
	const [dragElement, setDragElement] = useState(null);

	const [collapsedNodes, setCollapsedNodes] = useState([]);

	const [triggerInitRequest, setTriggerInitRequest] = useState(false);

	const [sourceSchemas, setSourceSchemas] = useState(null);
	const [destinationSchemas, setDestinationSchemas] = useState(null);
	const [activeSourceNodes, setActiveSourceNodes] = useState(null);
	const [activeDestinationNodes, setActiveDestinationNodes] = useState(null);

	const [activeModules, setActiveModules] = useState([]);
	const [availableModules, setAvailableModules] = useState([]);

	const [conditionalComparisons, setConditionalComparisons] = useState([]);

	const [envelopes, setEnvelopes] = useState([]);
	const [initialFullData, setInitialFullData] = useState([]);

	const [sourceAPI, setSourceAPI] = useState(null);
	const [destinationAPI, setDestinationAPI] = useState(null);

	const [exampleDataRunResult, setExampleDataRunResult] = useState(null);

	const [mustChooseXOf, setMustChooseXOf] = useState(false);
	const [listOfStrategies, setListOfStrategies] = useState([]);
	const [XOfActiveNode, setXOfActiveNode] = useState(null);

	const [isSpeccStarted, setIsSpeccStarted] = useState(null);

	//All of these should have the states "NONE", "OK", "ERROR", "LOADING"
	const [isUploadOK, setIsUploadOK] = useState("NONE");
	const [isAuthenticationOK, setIsAuthenticationOK] = useState("NONE");
	const [isAddNodesOK, setIsAddNodesOK] = useState("NONE");
	const [isGetDataOK, setIsGetDataOK] = useState("NONE");
	const [isConnectOK, setIsConnectOK] = useState("NONE");
	const [isTestTransferOK, setIsTestTransferOK] = useState("NONE");
	const [isUniqueIdentifierOK, setIsUniqueIdentifierOK] = useState("NONE");
	const [isWebhookOK, setIsWebhookOK] = useState("NONE");
	const [isGroupingOK, setIsGroupingOK] = useState("NONE");
	const [isSchedulerOK, setIsSchedulerOK] = useState("NONE");
	const [isFilterOK, setIsFilterOK] = useState("NONE");

	const [navigation, setNavigation] = useState("WIZARD");

	const [showDataInspector, setShowDataInspector] = useState(false);

	const [transferkey, setTransferkey] = useState(null);
	const [strategy, setStrategy] = useState(null);
	const [schedule, setSchedule] = useState(null);

	const [isReverse, setIsReverse] = useState(null);

	const [project, setProject] = useState(null);

	const [variables, setVariables] = useState([]);
	const [usedVariables, setUsedVariables] = useState([]);
	const [scheduleModalIsOpen, setScheduleModalIsOpen] = useState(false);

	const [webhookVariables, setWebhookVariables] = useState([]);

	const [updateExampledataOnNodeID, setUpdateExampledataOnNodeID] =
		useState(null);

	const [
		shouldUpdateNodesFieldAndMeatballs,
		setShouldUpdateNodesFieldAndMeatballs,
	] = useState(false);

	const [shouldUpdateOperationNodes, setShouldUpdateOperationNodes] =
		useState(false);

	const [isAIChatOpen, setIsAIChatOpen] = useState(false);

	const setAllStatuses = (status, isSpeccActivation, steps) => {
		if (!isSpeccActivation && status === "ERROR") {
			status = "NONE";
		}

		if (steps == null || steps.includes("UPLOAD")) {
			setIsUploadOK(status);
		}
		if (steps == null || steps.includes("AUTHENTICATION")) {
			setIsAuthenticationOK(status);
		}
		if (steps == null || steps.includes("ADD_NODES")) {
			setIsAddNodesOK(status);
		}
		if (steps == null || steps.includes("GET_DATA")) {
			setIsGetDataOK(status);
		}
		if (steps == null || steps.includes("CONNECT")) {
			setIsConnectOK(status);
		}
		if (steps == null || steps.includes("TEST_TRANSFER")) {
			setIsTestTransferOK(status);
		}
		if (steps == null || steps.includes("UNIQUE_IDENTIFIER")) {
			setIsUniqueIdentifierOK(status);
		}
		if (steps == null || steps.includes("WEBHOOK")) {
			setIsWebhookOK(status);
		}
		if (steps == null || steps.includes("FILTER")) {
			setIsFilterOK(status);
		}
		if (steps == null || steps.includes("GROUPING")) {
			setIsGroupingOK(status);
		}
		if (steps == null || steps.includes("SCHEDULER")) {
			setIsSchedulerOK(status);
		}
	};

	const createDelay = (name) => {
		let minNumber = 400;
		let maxNumber = 1000;
		switch (name) {
			case "UPLOAD":
				minNumber = 50;
				maxNumber = 200;
				break;
			case "AUTHENTICATION":
				minNumber = 50;
				maxNumber = 200;
				break;
			case "ADD_NODES":
				minNumber = 100;
				maxNumber = 400;
				break;
			case "GET_DATA":
				minNumber = 800;
				maxNumber = 1200;
				break;
			case "CONNECT":
				minNumber = 800;
				maxNumber = 1500;
				break;
			case "TEST_TRANSFER":
				minNumber = 800;
				maxNumber = 1500;
				break;
			case "UNIQUE_IDENTIFIER":
				minNumber = 100;
				maxNumber = 400;
				break;
			case "WEBHOOK":
				minNumber = 500;
				maxNumber = 1500;
				break;
			case "FILTER":
				minNumber = 500;
				maxNumber = 1500;
				break;
			case "GROUPING":
				minNumber = 400;
				maxNumber = 800;
				break;
			case "SCHEDULER":
				minNumber = 50;
				maxNumber = 200;
				break;
		}
		return Math.floor(Math.random() * maxNumber) + minNumber;
	};

	const getAndSetOKStatuses = async (isSpeccActivation, steps = null) => {
		setAllStatuses("LOADING", isSpeccActivation, steps);

		const allOKStatuses = await getAllOKStatuses(speccID, steps);
		const noneOrError = isSpeccActivation ? "ERROR" : "NONE";

		//If the isSpeccActivation is true, I want all of the if statements and set methods below to execute one after another, but with one second delay between each

		const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

		const updateStatuses = async () => {
			if (steps == null || steps.includes("UPLOAD")) {
				setIsUploadOK(allOKStatuses.isUploadOK ? "OK" : noneOrError);
				if (isSpeccActivation) await delay(createDelay("UPLOAD"));
			}

			if (steps == null || steps.includes("AUTHENTICATION")) {
				setIsAuthenticationOK(
					allOKStatuses.isAuthenticationOK ? "OK" : noneOrError,
				);
				if (isSpeccActivation) await delay(createDelay("AUTHENTICATION"));
			}

			if (steps == null || steps.includes("ADD_NODES")) {
				setIsAddNodesOK(allOKStatuses.isAddNodesOK ? "OK" : noneOrError);
				if (isSpeccActivation) await delay(createDelay("Add nodes"));
			}

			if (steps == null || steps.includes("GET_DATA")) {
				setIsGetDataOK(allOKStatuses.isGetDataOK ? "OK" : noneOrError);
				if (isSpeccActivation) await delay(createDelay("GET_DATA"));
			}

			if (steps == null || steps.includes("CONNECT")) {
				setIsConnectOK(allOKStatuses.isTransformationOK ? "OK" : noneOrError);
				if (isSpeccActivation) await delay(createDelay("CONNECT"));
			}

			if (steps == null || steps.includes("TEST_TRANSFER")) {
				setIsTestTransferOK(allOKStatuses.isTransferOK ? "OK" : noneOrError);
				if (isSpeccActivation) await delay(createDelay("TEST_TRANSFER"));
			}

			if (steps == null || steps.includes("UNIQUE_IDENTIFIER")) {
				setIsUniqueIdentifierOK(
					allOKStatuses.isUniqueSourceOK && allOKStatuses.isUniqueDestinationOK
						? "OK"
						: noneOrError,
				);
				if (isSpeccActivation) await delay(createDelay("UNIQUE_IDENTIFIER"));
			}

			if (steps == null || steps.includes("WEBHOOK")) {
				setIsWebhookOK(allOKStatuses.isWebhookOK ? "OK" : noneOrError);
				if (isSpeccActivation) await delay(createDelay("WEBHOOK"));
			}

			if (steps == null || steps.includes("FILTER")) {
				setIsFilterOK(allOKStatuses.isFilterOK ? "OK" : noneOrError);
				if (isSpeccActivation) await delay(createDelay("FILTER"));
			}

			if (steps == null || steps.includes("GROUPING")) {
				setIsGroupingOK(allOKStatuses.isGroupingOK ? "OK" : noneOrError);
				if (isSpeccActivation) await delay(createDelay("GROUPING"));
			}

			if (steps == null || steps.includes("SCHEDULER")) {
				setIsSchedulerOK(allOKStatuses.isSchedulerOK ? "OK" : noneOrError);
				if (isSpeccActivation) await delay(createDelay("SCHEDULER"));
			}
		};

		await updateStatuses();

		//Steps is an array of strings, each string is a step that should be checked
		//If the isSpeccActivated is true, then the status of each step should be set to "ERROR" if the step is not OK
	};

	useEffect(() => {
		getAndSetOKStatuses(false);
	}, []);

	useEffect(() => {
		const allLinks = [];
		for (let i = 0; i < links.length; i++) {
			if (links[i].fieldsourceID != null) {
				let theField = null;
				for (let j = 0; j < activeFields.length; j++) {
					if (links[i].fieldsourceID == activeFields[j].id) {
						theField = activeFields[j];
						break;
					}
				}
				if (theField != null) {
					links[i].type = theField.type;
				}
			}

			if (links[i].ONsourceID != null) {
				let theON = null;
				for (let j = 0; j < operationNodes.length; j++) {
					if (links[i].ONsourceID == operationNodes[j].id) {
						theON = operationNodes[j];
						break;
					}
				}
				if (theON != null) {
					links[i].type = theON?.outputType;
				}
			}

			allLinks.push(links[i]);
		}

		setLinks(allLinks);

		const allOperationNodes = [];

		for (let i = 0; i < operationNodes.length; i++) {
			const config = operationNodesConfig.find((operationNodeConfig) => {
				if (operationNodes[i].configID == operationNodeConfig.id) {
					return true;
				}
				return false;
			});
			if (config != null) {
				if (config.name == "IF Condition") {
					let thePassthroughLink = null;
					for (let j = 0; j < links.length; j++) {
						if (
							links[j].ONdestinationID == operationNodes[i].id &&
							links[j].isVariablePassthrough
						) {
							thePassthroughLink = links[j];

							break;
						}
					}
					if (thePassthroughLink != null) {
						operationNodes[i].outputType = thePassthroughLink.type;
					}
				} else if (config.name == "Switch") {
					operationNodes[i].outputType =
						operationNodes[i].switchObject.returnType.toLowerCase();
				} else if (config.name == "Node as ON") {
					operationNodes[i].outputType = "object";
				} else {
					if (config.toString) {
						operationNodes[i].outputType = "string";
					}
					if (config.toInteger) {
						operationNodes[i].outputType = "integer";
					}
					if (config.toDecimal) {
						operationNodes[i].outputType = "number";
					}
					if (config.toBoolean) {
						operationNodes[i].outputType = "boolean";
					}
				}
			}

			allOperationNodes.push(operationNodes[i]);
		}

		setOperationNodes(allOperationNodes);
	}, [
		JSON.stringify(activeFields),
		JSON.stringify(links),
		JSON.stringify(operationNodes),
		JSON.stringify(operationNodesConfig),
	]);

	useEffect(() => {
		const newActiveFieldsArray = [];
		activeFields.map((activeField) => {
			exampleDataRunResult?.fields?.map((field) => {
				if (activeField.id == field.model.id) {
					if (field.isRun) {
						activeField.result = field.result;
					} else {
						activeField.result = null;
					}
				}
			});
			newActiveFieldsArray.push(activeField);
		});

		setActiveFields(newActiveFieldsArray);

		const newLinksArray = [];
		links.map((link) => {
			exampleDataRunResult?.links?.map((linksResult) => {
				if (link.id == linksResult.model.id) {
					link.result = linksResult.result;
				}
			});
			newLinksArray.push(link);
		});

		setLinks(newLinksArray);

		const newONArray = [];
		operationNodes.map((operationNode) => {
			exampleDataRunResult?.ONs?.map((ONResult) => {
				if (operationNode.id == ONResult.model.id) {
					operationNode.result = ONResult.result;
				}
			});
			newONArray.push(operationNode);
		});

		setOperationNodes(newONArray);
	}, [exampleDataRunResult]);

	const fetchSourceAPI = async (id) => {
		const APICall = await getGenericCRUDWithID("API", id, {
			speccID: speccID,
			direction: "SOURCE",
		});
		setSourceAPI(
			typeof APICall?.data[0] === "undefined" ? null : APICall?.data[0],
		);
	};

	const fetchDestinationAPI = async (id) => {
		const APICall = await getGenericCRUDWithID("API", id, {
			speccID: speccID,
			direction: "DESTINATION",
		});
		setDestinationAPI(
			typeof APICall?.data[0] === "undefined" ? null : APICall?.data[0],
		);
	};

	const [ONAreaDetails, setONAreaDetails] = useState({});

	const [selectedOperationNodes, setSelectedOperationNodes] = useState([]);

	const [activeGroupNodeModalItem, setActiveGroupNodeModalItem] =
		useState(null);

	const [nodeContextMenu, setNodeContextMenu] = useState(null);

	const getNodeDirection = (node) => {
		if (node.APIID === sourceAPIID) {
			return DIRECTION.SOURCE;
		}
		if (node.APIID === destinationAPIID) {
			return DIRECTION.DESTINATION;
		}
	};

	const getAPIIDForDirection = (direction) => {
		if (direction === DIRECTION.SOURCE) {
			return sourceAPIID;
		}
		if (direction === DIRECTION.DESTINATION) {
			return destinationAPIID;
		}
	};

	const [isInitialDataFetched, setIsInitialDataFetched] = useState(false);

	const refreshInitialData = () => {
		getInitialData(speccID).then((initialData) => {
			setInitialData(initialData);
		});
	};

	const contextValue = {
		speccID,
		ONAreaDetails,
		setONAreaDetails,
		isLoading,
		setIsLoading,
		sourceAPI,
		setSourceAPI,
		destinationAPI,
		setDestinationAPI,
		selectedLink,
		setSelectedLink,
		layoutWidth,
		setLayoutWidth,
		schemasDescriptions,
		setSchemasDescriptions,
		activeSchemas,
		setActiveSchemas,
		relatedNodes,
		setRelatedNodes,
		collapsedNodes,
		setCollapsedNodes,
		relatedNodesLinks,
		setRelatedNodesLinks,
		hideCollapsed,
		setHideCollapsed,
		setDragElement,
		dragElement,
		booleanModal,
		setBooleanModal,
		dataModal,
		setDataModal,
		dataModalSearchValue,
		setDataModalSearchValue,
		dataModalDescription,
		setDataModalDescription,
		fetchedData,
		setFetchedData,
		triggerInitRequest,
		setTriggerInitRequest,
		sourceSchemas,
		setSourceSchemas,
		destinationSchemas,
		setDestinationSchemas,
		activeSourceNodes,
		setActiveSourceNodes,
		activeDestinationNodes,
		setActiveDestinationNodes,
		selectedOperationNodes,
		setSelectedOperationNodes,
		activeGroupNodeModalItem,
		setActiveGroupNodeModalItem,
		nodeContextMenu,
		setNodeContextMenu,
		isNavigationbarOpen,
		setIsNavigationbarOpen,

		activeNodes,
		setActiveNodes,
		activeFields,
		setActiveFields,
		sourceAPIID,
		setSourceAPIID,
		destinationAPIID,
		setDestinationAPIID,
		sourceAPIName,
		setSourceAPIName,
		destinationAPIName,
		setDestinationAPIName,
		getNodeDirection,
		getAPIIDForDirection,

		destinationAPIAuthGroups,
		sourceAPIAuthGroups,
		fetchSourceAPI,
		fetchDestinationAPI,
		refreshInitialData,

		operationNodes,
		setOperationNodes,
		operationNodesConfig,
		setOperationNodesConfig,
		operationNodesInnerInputConfig,
		operationNodesInput,
		setOperationNodesInput,
		conditionalComparisons,
		setConditionalComparisons,

		links,
		setLinks,
		speccName,
		setSpeccName,
		meatballs,
		setMeatballs,

		isSidebarOpen,
		setIsSidebarOpen,
		exampleDataRunResult,
		setExampleDataRunResult,
		mustChooseXOf,
		setMustChooseXOf,
		listOfStrategies,
		setListOfStrategies,
		XOfActiveNode,
		setXOfActiveNode,
		envelopes,
		setEnvelopes,
		setIsInitialDataFetched,
		updateExampledataOnNodeID,
		setUpdateExampledataOnNodeID,

		shouldUpdateNodesFieldAndMeatballs,
		setShouldUpdateNodesFieldAndMeatballs,

		shouldUpdateOperationNodes,
		setShouldUpdateOperationNodes,

		isSpeccStarted,
		setIsSpeccStarted,
		navigation,
		setNavigation,

		availableModules,
		activeModules,
		setAvailableModules,
		setActiveModules,
		showDataInspector,
		setShowDataInspector,

		transferkey,
		setTransferkey,

		strategy,
		setStrategy,

		schedule,
		setSchedule,
		project,
		variables,
		setVariables,
		usedVariables,
		setUsedVariables,
		webhook,
		setWebhook,
		webhookVariables,
		setWebhookVariables,
		scheduleModalIsOpen,
		setScheduleModalIsOpen,
		isAIChatOpen,
		setIsAIChatOpen,

		isUploadOK,
		setIsUploadOK,
		isAuthenticationOK,
		setIsAuthenticationOK,
		isAddNodesOK,
		setIsAddNodesOK,
		isGetDataOK,
		setIsGetDataOK,
		isConnectOK,
		setIsConnectOK,
		isTestTransferOK,
		setIsTestTransferOK,
		isUniqueIdentifierOK,
		setIsUniqueIdentifierOK,
		isWebhookOK,
		setIsWebhookOK,
		isGroupingOK,
		setIsGroupingOK,
		isSchedulerOK,
		setIsSchedulerOK,
		isFilterOK,
		setIsFilterOK,
		getAndSetOKStatuses,
		initialFullData,
		setIsReverse,
		isReverse,
	};

	const updateStateOfList = (newData, oldData, setFunction) => {
		const allNewObjects = [];
		const newObjectsData = newData;
		for (let i = 0; i < newObjectsData?.length; i++) {
			let found = false;
			let objectFound = null;
			for (let j = 0; j < oldData.length; j++) {
				if (newObjectsData[i].id == oldData[j].id) {
					found = true;
					objectFound = oldData[j];
					break;
				}
			}

			if (found) {
				allNewObjects.push(objectFound);
			} else {
				allNewObjects.push(newObjectsData[i]);
			}
		}

		setFunction(allNewObjects);
	};

	useEffect(() => {
		(async () => {
			if (shouldUpdateOperationNodes) {
				const allOperationNodes = await getGenericCRUD("Operation_Nodes", {
					speccID: speccID,
				});
				updateStateOfList(
					allOperationNodes.data,
					operationNodes,
					setOperationNodes,
				);

				setShouldUpdateOperationNodes(false);
			}
		})();
	}, [shouldUpdateOperationNodes]);

	useEffect(() => {
		(async () => {
			if (shouldUpdateNodesFieldAndMeatballs) {
				//Fetch all
				const allActiveNodes = await getGenericCRUD("Active_Nodes", {
					speccID: speccID,
				});

				const allActiveFields = await getGenericCRUD("Active_Fields", {
					speccID: speccID,
				});

				const allMeatballs = await getGenericCRUD("Meatballs", {
					speccID: speccID,
				});

				updateStateOfList(allActiveNodes.data, activeNodes, setActiveNodes);

				updateStateOfList(allActiveFields?.data, activeFields, setActiveFields);

				updateStateOfList(allMeatballs.data, meatballs, setMeatballs);

				//setActiveNodes(allNewActiveNodes);

				//setActiveFields(allNewActiveFields);

				//setMeatballs(allNewMeatballs);

				setShouldUpdateNodesFieldAndMeatballs(false);
			}
		})();
	}, [shouldUpdateNodesFieldAndMeatballs]);

	const getInitialData = async (speccID) => {
		const initialData = await getSpecInitialValuesAPI(speccID);
		return initialData;
	};

	const setInitialData = (initialData) => {
		setSpeccName(initialData?.specc?.name);
		setSourceAPI(initialData?.sourceAPI);
		setDestinationAPI(initialData?.destinationAPI);
		setSourceAPIName(initialData?.sourceAPIName);
		setDestinationAPIName(initialData?.destinationAPIName);
		setSourceAPIAuthGroups(
			initialData?.sourceAPIAuthGroups?.authenticationGroups,
		);
		setDestinationAPIAuthGroups(
			initialData?.destinationAPIAuthGroups?.authenticationGroups,
		);
		setWebhook(initialData?.webhook);

		setActiveNodes(initialData?.activeNodes);

		setActiveFields(initialData?.activeFields);
		setSourceAPIID(initialData?.sourceAPIID);
		setDestinationAPIID(initialData?.destinationAPIID);

		setAvailableModules(initialData?.availableModules);
		setActiveModules(initialData?.activeModules);

		setOperationNodes(initialData?.operationNodes);
		setOperationNodesConfig(initialData?.operationNodesConfig);
		setOperationNodesInnerInputConfig(
			initialData?.operationNodeConfigInnerInput,
		);
		setOperationNodesInput(initialData?.operationNodeInput);
		setMeatballs(initialData?.meatballs);

		setLinks(initialData?.links);
		setConditionalComparisons(initialData?.conditionalComparisons);

		setEnvelopes(initialData?.envelopes);

		setTransferkey(initialData?.transferkey);

		setStrategy(initialData?.specc?.strategy);

		setSchedule(initialData?.schedule);

		setIsSpeccStarted(initialData?.specc?.started == 0 ? false : true);
		setProject(initialData?.project);
		setUsedVariables(initialData?.usedVariables);
		setVariables(initialData?.variables);
		setWebhookVariables(initialData?.webhookVariables);
		setInitialFullData(initialData)
		setIsReverse(initialData?.isReverse);
	};

	useEffect(() => {
		if (!isInitialDataFetched) {
			setIsLoading(true);
			getInitialData(speccID).then((initialData) => {
				setInitialData(initialData);
				setIsInitialDataFetched(true);
				setIsLoading(false);
			});
		}
	}, [isInitialDataFetched, setIsInitialDataFetched]);

	if (!isInitialDataFetched) {
		return showLoader ? <Loading /> : customLoader || <></>;
	}

	if (isLoading) {
		return showLoader ? <Loading /> : customLoader || <></>;
	}

	return (
		<WizardContext.Provider value={contextValue}>
			<PagesWrapper speccID={speccID}>
				<RunnerContextWrapper>
					<MatchContextWrapper>
						<LinksWrapper>
							<DataWrapper speccID={speccID}>
								<NodeToolBarWrapper>{children}</NodeToolBarWrapper>
							</DataWrapper>
						</LinksWrapper>
					</MatchContextWrapper>
				</RunnerContextWrapper>
			</PagesWrapper>
		</WizardContext.Provider>
	);
};
export default WizardWrapper;
