import { showApiErrors } from "@utils/helpers";
import axios from "axios";
import { ApiClientSingleton } from "./conf";

const { axiosInstance } = ApiClientSingleton.getInstance();

export const login = async ({ email, password }) => {
  const { data } = await axios.post("/proxy/login", {
    email,
    password,
  });
  return data;
};

export const fetchAllSpeccs = async ({ queryKey }) => {
  const { data } = await axiosInstance.get(`/speccs/${queryKey[1]}`);
  return data;
};

export const fetchExecutionSummary = async (status, type, dateRange, projectID = null) => {
  const params = {};
  const formatDate = (date) => {
    const year = date?.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };
  if (projectID) {
    params.projectID = projectID;
  }

  if (status) {
    switch (status) {
      case "all":
        break;
      case "live":
        params.runStatus = "STARTED";
        break;
      case "stopped":
        params.runStatus = "STOPPED";
        break;
      default:
        break;
    }
  }
  if (type) {
    switch (type) {
      case "all":
        break;
      case "projects":
        params.type = "PROJECTS";
        break;
      case "speccs":
        params.type = "SPECCS";
        break;
      default:
        break;
    }
  }
  if (dateRange?.start && dateRange?.end) {
    const start = new Date(dateRange.start);
    const end = new Date(dateRange.end);
    params.startDate = formatDate(start);
    params.endDate = formatDate(end);
  }

  //Change params object to a string that is a query request
  const { data } = await axiosInstance.get("/summary", {
    params: params,
  });

  return data;
};

export const getExecutionDetails = async ({ speccID, dateRange }) => {
  const { startDate, endDate } = dateRange;

  const { data } = await axiosInstance.get(`/summary?speccID=${speccID}&startDate=${startDate}&endDate=${endDate}`);
  return data;
};

export const fetchExecutionsModule = async ({ selectedExecutionHash }) => {
  const { data } = await axiosInstance.get(`/summary/run/${selectedExecutionHash}`);

  return data;
};

export const getExecutionsModuleById = async ({ selectedExecutionHash, moduleId }) => {
  const { data } = await axiosInstance.get(`/summary/run/${selectedExecutionHash}/module/${moduleId}`);

  return data;
};

export const getSpeccById = async ({ queryKey }) => {
  const { data } = await axiosInstance.get(`/specc/${queryKey[1]}`);

  return data;
};

export const createNewSpecc = async (speccData) => {
  const { data } = await axiosInstance.post("/specc", speccData);

  return data;
};

export const createUploadApi = async (speccData) => {
  const { data } = await axiosInstance.post("/upload-api", speccData);

  if (!data) {
    showApiErrors("Server Error");
    return;
  }

  if (data.success) {
    return data;
  }
  // showApiErrors("An error has occurred, Please try again later");
};

export const uploadAPIFile = async (formData) => {
  const data = await axiosInstance.post("/upload-api", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  if (!data) {
    showApiErrors("Server Error");
    return;
  }

  // showApiErrors("An error has occurred, Please try again later");
  return data;
};

export const deleteSpecc = async (formData) => {
  const { data } = await axiosInstance.post("/delete-specc", formData);

  return data;
};

export const connectApis = async (speccData) => {
  const { data } = await axiosInstance.post("/connect", speccData);

  return data;
};

export const deleteSchemaLink = async (schemaLinkData) => {
  const { data } = await axiosInstance.post("/delete-link", schemaLinkData);

  return data;
};

export const getAPIAuth = async (APIId) => {
  const { data } = await axiosInstance.get(`/API/${APIId}/auth`);

  return data;
};

export const getSchemaLinks = async (speccID) => {
  const { data } = await axiosInstance.get(`/specc/${speccID}/schemalinks`);
  return data;
};

export const getApiEndpoints = async (speccID, direction, isMatching) => {
  const { data } = await axiosInstance.get(`/specc/${speccID}/endpoints/${isMatching}/${direction}`);
  return data;
};

export const getEndpointSchema = async (speccID, direction, endpoint) => {
  const { data } = await axiosInstance.get(`/specc/${speccID}/endpoints/${direction}/schemas?endpoint=${endpoint}`);
  return data;
};

export const deleteLinks = async (linkIDs) => {
  const { data } = await axiosInstance.post("/links/delete", { linkIDs });

  return data;
};

export const addAuth = async (value) => {
  const { data } = await axiosInstance.post("/auth", value);

  return data;
};

export const runSpecc = async (speccID) => {
  const { data } = await axiosInstance.get(`/run/${speccID}`);

  return data;
};

export const getExampleData = async (speccID, nodeID) => {
  const { data } = await axiosInstance.get(`/exampledata/${speccID}?nodeID=${nodeID}`);
  return data;
};

export const runExampleData = async (nodeID, exampledata) => {
  const { data } = await axiosInstance.post(`/exampledata/${nodeID}/run`, {
    exampledata: exampledata,
  });
  return data;
};

export const getMyAPIs = async (userID) => {
  const { data } = await axiosInstance.get(`/MyAPIs/${userID}`);
  return data;
};

export const createMyAPIs = async (value, userID) => {
  const { data } = await axiosInstance.post(`/MyAPIs/${userID}`, value);
  return data;
};

export const getMyAPI = async (userID, APIID) => {
  const { data } = await axiosInstance.get(`/MyAPIs/${userID}/${APIID}`);
  return data;
};

export const updateMyApi = async (value, userID, APIID) => {
  const { data } = await axiosInstance.post(`/MyAPIs/${userID}/${APIID}`, value);
  return data;
};

export const deleteMyApi = async (APIID) => {
	const { data } = await axiosInstance.delete(
		`/CRUD/MyAPIs/${APIID}`,
	);
	return data;
};

// Test

export const getSpeccpagesApi = async (specId) => {
  const { data } = await axiosInstance.get(`/CRUD/Speccpages?speccID=${specId}`);
  return data;
};

export const postSpeccpagesApi = async (obj) => {
  const { data } = await axiosInstance.post("/CRUD/Speccpages", obj);
  return data;
};

export const updateSpeccpagesApi = async (obj, pageId) => {
  const { data } = await axiosInstance.post(`/CRUD/Speccpages/${pageId}`, obj);
  return data;
};

export const deleteSpeccpagesApi = async (pageId, speccID) => {
  const { data } = await axiosInstance.delete(`/CRUD/Speccpages/${pageId}?speccID=${speccID}`);
  return data;
};

export const getActiveNodesApi = async (speccID, APIID) => {
  const { data } = await axiosInstance.get(`/CRUD/Active_Nodes?speccID=${speccID}&APIID=${APIID}`);
  return data;
};

export const getActiveNodeFromID = async (ID) => {
  const { data } = await axiosInstance.get(`/CRUD/Active_Nodes/${ID}/extended`);
  return data;
};

export const addActiveNode = async (model) => {
  const { data } = await axiosInstance.post("/CRUD/Active_Nodes", model);
  return data;
};

export const updateActiveNodeApi = async (activeNodeId, fields) => {
  const { data } = await axiosInstance.post(`/CRUD/Active_Nodes/${activeNodeId}`, fields);
  return data;
};

export const deleteActiveNodeApi = async (nodeId, speccID) => {
  const { data } = await axiosInstance.delete(`/CRUD/Active_Nodes/${nodeId}?speccID=${speccID}`);
  return data;
};

export const getActiveFieldsApi = async (nodeID) => {
  const { data } = await axiosInstance.get(`/CRUD/Active_Fields?nodeID=${nodeID}`);
  return data;
};

export const updateActiveFieldDefaultValueApi = async (fieldID, newDefaultValue) => {
  const { data } = await axiosInstance.post(`/CRUD/Active_Fields/${fieldID}`, {
    defaultValue: newDefaultValue,
  });
  return data;
};

export const addActiveFieldApi = async (nodeID, name, speccID) => {
  const { data } = await axiosInstance.post("/CRUD/Active_Fields", {
    nodeID,
    name,
    speccID,
  });
  return data;
};

export const deleteActiveFieldApi = async (fieldId) => {
  const { data } = await axiosInstance.delete(`/CRUD/Active_Fields/${fieldId}`);
  return data;
};

export const getSpecInitialValuesAPI = async (initialID) => {
  const { data } = await axiosInstance.get(`/specc/${initialID}/initial`);
  return data;
};

export const getSpecInitialValuesAPIQuery = async ({ queryKey }) => {
  const { data } = await axiosInstance.get(`/specc/${queryKey[1]}/initial`);
  return data;
};

export const getOperationNodesConfigApi = async () => {
  const { data } = await axiosInstance.get("CRUD/Operation_Node_Config");
  return data;
};

export const getOperationNodesApi = async (speccID) => {
  const { data } = await axiosInstance.get("CRUD/Operation_Nodes", {
    params: { speccID },
  });
  return data;
};

export const addOperationNodeApi = async (speccID, configID, nodeID) => {
  const { data } = await axiosInstance.post("CRUD/Operation_Nodes", {
    speccID: speccID,
    configID: configID,
    nodeID: nodeID,
  });
  return data;
};

export const updateOperationNodeApi = async (nodeId, nodeData) => {
  const { data } = await axiosInstance.post(`CRUD/Operation_Nodes/${nodeId}`, nodeData);
  return data;
};

export const deleteOperationNodeApi = async (nodeId) => {
  const { data } = await axiosInstance.delete(`CRUD/Operation_Nodes/${nodeId}`);
  return data;
};

export const getOperationNodeConfigInnerInputApi = async () => {
  const { data } = await axiosInstance.get("CRUD/Operation_Node_Config_Inner_Input");
  return data;
};

export const getOperationNodeInputApi = async (operationnodeID) => {
  const { data } = await axiosInstance.get("CRUD/Operation_Node_Input", {
    params: { operationnodeID },
  });
  return data;
};

export const postOperationNodeInputApi = async (body) => {
  const { data } = await axiosInstance.post("CRUD/Operation_Node_Input", {
    ...body,
  });
  return data;
};

export const updateOperationNodeInputApi = async (id, body) => {
  const { data } = await axiosInstance.post(`CRUD/Operation_Node_Input/${id}`, {
    ...body,
  });
  return data;
};

export const getLinksAPI = async (speccID, pageID) => {
  const { data } = await axiosInstance.get("CRUD/Link", {
    params: { speccID, pageID },
  });
  return data;
};

export const createLinkAPI = async (linkData) => {
  const { data } = await axiosInstance.post("CRUD/Link", linkData);
  return data;
};

export const deleteLinkAPI = async (linkId) => {
  const { data } = await axiosInstance.delete(`CRUD/Link/${linkId}`);
  return data;
};

export const getGenericCRUD = async (object, arrayOfRequirements) => {
  const params = new URLSearchParams(arrayOfRequirements);
  const { data } = await axiosInstance.get(`CRUD/${object}?${params.toString()}`);
  return data;
};

export const getGenericCRUDWithID = async (object, id, arrayOfRequirements) => {
  const { data } = await axiosInstance.get(`CRUD/${object}/${id}`);
  return data;
};

export const getSpeccPairing = async (speccID) => {
  const { data } = await axiosInstance.get(`specc/${speccID}/nodepairing`);
  return data;
};

export const postGenericCRUD = async (object, info) => {
  const { data } = await axiosInstance.post(`CRUD/${object}`, info);
  return data;
};

export const postGenericCRUDWithID = async (object, id, info) => {
  const { data } = await axiosInstance.post(`CRUD/${object}/${id}`, info);
  return data;
};

export const deleteGenericCRUDWithID = async (object, id) => {
  const { data } = await axiosInstance.delete(`CRUD/${object}/${id}`);
  return data;
};

export const copySpeccWithID = async (id, name) => {
  const { data } = await axiosInstance.post(`/copy/${id}`, {
    name: name,
  });
  return data;
};

export const updateSpeccName = async (speccID, speccName) => {
  const { data } = await axiosInstance.post(`CRUD/Speccs/${speccID}`, {
    name: speccName,
  });
  return data;
};

export const updateSourceTransferKey = async (id, sourceKeyNodeID, sourceKeyName) => {
  const transfer = {
    sourceKeyNodeID: sourceKeyNodeID,
    sourceKeyName: sourceKeyName,
  };
  const { data } = await axiosInstance.post(`CRUD/Transferkey/${id}`, transfer);
  return data;
};

export const updateDestinationTransferKey = async (id, destinationKeyNodeID, destinationKeyName, isMatching = false) => {
  const transfer = isMatching
    ? {
        matchingKeyNodeID: destinationKeyNodeID,
        matchingKeyName: destinationKeyName,
      }
    : {
        destinationKeyNodeID: destinationKeyNodeID,
        destinationKeyName: destinationKeyName,
      };
  const { data } = await axiosInstance.post(`CRUD/Transferkey/${id}`, transfer);
  return data;
};

export const updateMatchingTransferKey = async (id, matchingKeyNodeID, matchingKeyName) => {
  const transfer = {
    matchingKeyNodeID: matchingKeyNodeID,
    matchingKeyName: matchingKeyName,
  };
  const { data } = await axiosInstance.post(`CRUD/Transferkey/${id}`, transfer);
  return data;
};

export const updateAPICustomName = async (APIID, customName) => {
  const { data } = await axiosInstance.post(`CRUD/API/${APIID}`, {
    customName: customName,
  });
  return data;
};

export const getAPIDetails = async (APIID) => {
  const { data } = await axiosInstance.get(`CRUD/API/${APIID}`);
  return data;
};

export const updateTransferKey = async (id, firstIdentifier, secondIdentifier, thirdIdentifier) => {
  const transfer = {};
  if (firstIdentifier) {
    transfer.sourceKeyNodeID = firstIdentifier?.nodeID;
    transfer.sourceKeyName = firstIdentifier?.keyName;
  }
  if (secondIdentifier) {
    transfer.destinationKeyNodeID = secondIdentifier?.nodeID;
    transfer.destinationKeyName = secondIdentifier?.keyName;
  }
  if (thirdIdentifier) {
    transfer.matchingKeyNodeID = thirdIdentifier?.nodeID;
    transfer.matchingKeyName = thirdIdentifier?.keyName;
  }
  const { data } = await axiosInstance.post(`CRUD/Transferkey/${id}`, transfer);
  return data;
};

export const addMeatball = async ({ speccID, nodeID, meatballName, inType, isPagination, typeOfPagination }) => {
  const body = {
    speccID,
    nodeID,
    name: meatballName,
    in: inType,
  };

  if (isPagination !== undefined) {
    body.isPagination = isPagination;
  }

  if (typeOfPagination !== undefined) {
    body.typeOfPagination = typeOfPagination;
  }

  const { data } = await axiosInstance.post("CRUD/Meatballs", body);
  return data;
};

export const updateMeatballValue = async (meatballID, value) => {
  const { data } = await axiosInstance.post(`CRUD/Meatballs/${meatballID}`, {
    value: value,
  });
  return data;
};

export const deleteMeatball = async (meatballID) => {
  const { data } = await axiosInstance.delete(`/CRUD/Meatballs/${meatballID}`);
  return data;
};

export const updateMeatballPagination = async (meatballID, pagination) => {
  const { data } = await axiosInstance.post(`CRUD/Meatballs/${meatballID}`, {
    isPagination: pagination,
  });
  return data;
};

export const updateMeatballPaginationType = async (meatballID, pagination) => {
  const { data } = await axiosInstance.post(`CRUD/Meatballs/${meatballID}`, {
    typeOfPagination: pagination,
  });
  return data;
};

export const getHistoricGUID = async (nodeID, pairingID) => {
  const { data } = await axiosInstance.get(`specc/historic/${nodeID}/${pairingID}`);
  return data;
};

export const generateMatchingCriterias = async (guid) => {
  const { data } = await axiosInstance.get(`/specc/matching/store/${guid.GUID}`);
  return data;
};

export const getHistoricGUIDData = async (guid) => {
  const { data } = await axiosInstance.get(`specc/historic/data/${guid}`);
  return data;
};

export const getMatchingGUIDData = async (guid) => {
  const { data } = await axiosInstance.get(`specc/matching/data/${guid}`);
  return data;
};

export const getInitialUniques = async (pairingID) => {
  const { data } = await axiosInstance.get(`specc/${pairingID}/uniqueID`);
  return data;
};

export const getUniquesFromPath = async (pairingID, path) => {
  const { data } = await axiosInstance.get(`specc/${pairingID}/uniqueID?path=${path}`);
  return data;
};

export const getMatches = async (guid1, guid2) => {
  const { data } = await axiosInstance.get(`specc/matching/matches/${guid1}/${guid2}`);
  return data;
};

export const getAPIOnly = async (guid1, guid2) => {
  const { data } = await axiosInstance.get(`specc/matching/sourceonly/${guid1}/${guid2}`);
  return data;
};

export const getDuplicates = async (guid1, guid2) => {
  const { data } = await axiosInstance.get(`specc/matching/duplicates/${guid1}/${guid2}`);
  return data;
};

export const insertManuallyMatched = async (GUID1, matchingID1, GUID2, matchingID2, pairingID) => {
  const { data } = await axiosInstance.post("CRUD/Manually_Matched", {
    GUID1: GUID1,
    MatchingID1: matchingID1,
    GUID2: GUID2,
    MatchingID2: matchingID2,
    pairingID: pairingID,
  });
  return data;
};

export const runMatching = async (pairingID, GUID1, GUID2) => {
  const { data } = await axiosInstance.post("matching/run", {
    pairingID: pairingID,
    GUID1: GUID1,
    GUID2: GUID2,
  });
  return data;
};

export const deleteManuallyMatched = async (matchedID) => {
  const { data } = await axiosInstance.delete(`/CRUD/Manually_Matched/${matchedID}`);
  return data;
};

export const updateNodePairingStrategy = async (pairingID, strategy) => {
  const { data } = await axiosInstance.post(`/CRUD/NodePairing/${pairingID}`, {
    strategy: strategy,
  });
  return data;
};

export const updateSpeccStrategy = async (speccID, strategy) => {
  const { data } = await axiosInstance.post(`/CRUD/Speccs/${speccID}`, {
    strategy: strategy,
  });
  return data;
};

export const updateScheduleInterval = async (pairingID, interval) => {
  const { data } = await axiosInstance.post(`/CRUD/Schedule/${pairingID}`, {
    interval: interval,
  });
  return data;
};

export const updateConditionRow = async (conditionID, conditionData) => {
  const { data } = await axiosInstance.post(`/CRUD/ConditionRow/${conditionID}`, conditionData);
  return data;
};

export const updateSwitch = async (switchID, switchData) => {
  const { data } = await axiosInstance.post(`/CRUD/SwitchObject/${switchID}`, switchData);
  return data;
};

export const updateSwitchCase = async (switchCaseID, switchData) => {
  const { data } = await axiosInstance.post(`/CRUD/SwitchCase/${switchCaseID}`, switchData);
  return data;
};

export const addSwitchCase = async (switchData) => {
  const { data } = await axiosInstance.post("/CRUD/SwitchCase", switchData);
  return data;
};

export const deleteSwitchCase = async (id) => {
  const { data } = await axiosInstance.delete(`/CRUD/SwitchCase/${id}`);
  return data;
};

export const addConditionRow = async (conditionData) => {
  const { data } = await axiosInstance.post("/CRUD/ConditionRow", conditionData);
  return data;
};

export const deleteConditionRow = async (id) => {
  const { data } = await axiosInstance.delete(`/CRUD/ConditionRow/${id}`);
  return data;
};

export const updateXOfChoices = async (nodeID, listOfStrategies) => {
  const { data } = await axiosInstance.post("/CRUD/XOfChoice", {
    nodeID: nodeID,
    listOfStrategies: listOfStrategies,
  });
  return data;
};

export const updateIndexForON = async (ONID, objectIndexes) => {
  const { data } = await axiosInstance.post(`/CRUD/Operation_Nodes/${ONID}`, {
    objectIndexes: objectIndexes,
  });
  return data;
};

export const updateFieldForON = async (ONID, fieldID) => {
  const { data } = await axiosInstance.post(`/CRUD/Operation_Nodes/${ONID}`, {
    workOnFieldID: fieldID,
  });
  return data;
};

export const addEnvelope = async (APIID, name) => {
  const { data } = await axiosInstance.post("/CRUD/Envelopes", {
    APIID: APIID,
    startvalue: name,
  });
  return data;
};

export const startSpecc = async (speccID) => {
  const { data } = await axiosInstance.post(`/specc/${speccID}/toggle`);
  return data;
};

export const stopSpecc = async (speccID) => {
  const { data } = await axiosInstance.post(`/CRUD/Speccs/${speccID}`, {
    started: 0,
  });
  return data;
};

export const deleteEnvelope = async (envelopeID) => {
  const { data } = await axiosInstance.delete(`/CRUD/Envelopes/${envelopeID}`);
  return data;
};

export const deleteGrouping = async (groupingID) => {
  const { data } = await axiosInstance.delete(`/CRUD/Grouping/${groupingID}`);
  return data;
};

export const addGrouping = async (speccID, nodeID) => {
  const { data } = await axiosInstance.post("/CRUD/Grouping", {
    speccID: speccID,
    nodeID: nodeID,
  });
  return data;
};

export const setGroupingFieldID = async (groupingID, fieldID) => {
  const { data } = await axiosInstance.post(`/CRUD/Grouping/${groupingID}`, {
    groupByFieldID: fieldID,
  });
  return data;
};

export const removeGroupingFieldID = async (groupingID) => {
  const { data } = await axiosInstance.post(`/CRUD/Grouping/${groupingID}`, {
    groupByFieldID: null,
  });
  return data;
};

export const addGroupingAggregation = async (fieldID, aggregation, isGroup) => {
  const { data } = await axiosInstance.post("/CRUD/Grouping_Aggregation", {
    function: aggregation,
    fieldID: fieldID,
    groupBy: isGroup,
  });
  return data;
};

export const deleteGroupingAggregation = async (groupingID) => {
  const { data } = await axiosInstance.delete(`/CRUD/Grouping_Aggregation/${groupingID}`);
  return data;
};

export const activateModule = async (moduleID, speccID) => {
  const { data } = await axiosInstance.get(`specc/${speccID}/module/${moduleID}/activate`);
  return data;
};

export const deactivateModule = async (activeModuleID) => {
  const { data } = await axiosInstance.get(`module/${activeModuleID}/deactivate`);
  return data;
};

export const getSearchNodeEndpoints = async (speccID, direction) => {
  const { data } = await axiosInstance.get(`/specc/${speccID}/endpoints/1/${direction}`);
  return data;
};

export const getMeatballsForEndpoint = async (projectID, direction, endpoint) => {
  const { data } = await axiosInstance.get(`/project/${projectID}/direction/${direction}/meatballs?endpoint=${endpoint}`);
  return data;
};

export const getInspectorData = async (speccID, direction, endpoint, meatballs) => {
  const { data } = await axiosInstance.post(`/project/${speccID}/inspector`, {
    direction: direction,
    endpoint: endpoint,
    meatballs: meatballs,
  });
  return data;
};

export const setNodeForON = async (ONID, model) => {
  const { data } = await axiosInstance.post(`/ON/${ONID}/node`, model);
  return data;
};

export const runModule = async (speccID, moduleID, extra = null) => {
  const { data } = await axiosInstance.post(`/specc/${speccID}/module/run/${moduleID}`, {
    isFrontendRun: true,
    extra,
  });
  return data;
};

export const getModule = async (speccID, moduleID) => {
  const { data } = await axiosInstance.post(`/specc/${speccID}/module/get/${moduleID}`, {
    isFrontendRun: true,
  });
  return data;
};

export const getModuleInput = async (speccID, moduleID) => {
  const { data } = await axiosInstance.post(`/specc/${speccID}/module/get/${moduleID}/input`, {
    isFrontendRun: true,
  });
  return data;
};

export const postOAuthCredentials = async (APIID, credentialObjects) => {
  const { data } = await axiosInstance.post(`/api/${APIID}/oauth`, credentialObjects);
  return data;
};

export const makeNewIntegration = async (projectID) => {
  const { data } = await axiosInstance.post("/CRUD/Speccs", {
    projectID: projectID,
  });
  return data;
};

export const testDateTimeCall = async (varID, timestamp) => {
  const { data } = await axiosInstance.get(`/variable/test/${varID}?timestamp=${timestamp}`);
  return data;
};
export const askQuestionToAI = async (question) => {
  const { data } = await axiosInstance.post("/AI/ask", {
    question: question,
  });
  return data;
};

export async function checkForIncomingWebhook(guid, startTime) {
  const response = await axiosInstance.get(`/webhook/incoming/${guid}`, {
    params: { startTime },
  });
  return response.data;
}
export const fetchAutolist = async (autolistID, endpoint, meatballs) => {
  const { data } = await axiosInstance.post(`/autolist/fetch/${autolistID}`, {
    endpoint: endpoint,
    meatballs: meatballs,
  });
  return data;
};

export const setAutoListWayToList = async (autolistID, wayToList) => {
  const { data } = await axiosInstance.post(`/autolist/wayToList/${autolistID}`, {
    wayToList: wayToList,
  });
  return data;
};

export const setAutoListUnique = async (autolistID, unique) => {
  const { data } = await axiosInstance.post(`/autolist/unique/${autolistID}`, {
    unique: unique,
  });
  return data;
};

export const generateRows = async (autolistID) => {
  const { data } = await axiosInstance.get(`/autolist/generate/${autolistID}`);
  return data;
};

export const validateAPI = async (APIID) => {
  const { data } = await axiosInstance.get(`/API/${APIID}/validate`);
  return data;
};

export const askAI = async (searchText) => {
  const { data } = await axiosInstance.post("/AI/ask", {
    question: searchText,
  });
  return data;
};

export const getAllOKStatuses = async (speccID, steps) => {
  const { data } = await axiosInstance.post(`/specc/${speccID}/valid`, {
    steps: steps,
  });
  return data;
};

export const addMyAuth = async (name, client_id, api_authentication_id) => {
  const { data } = await axiosInstance.post("/CRUD/MyAuth", {
    name,
    client_id,
    api_authentication_id,
  });

  return data;
};

export const updateMyAuth = async (authData, id) => {
  const { data } = await axiosInstance.post(`/CRUD/MyAuth/${id}`, authData, { headers: { "Content-Type": "multipart/form-data" } });
  return data;
};

export const deleteMyAuth = async (id) => {
  const { data } = await axiosInstance.delete(`/CRUD/MyAuth/${id}`);
  return data;
};
