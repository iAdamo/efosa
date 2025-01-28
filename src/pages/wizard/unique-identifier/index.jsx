import { updateDestinationTransferKey, updateSourceTransferKey } from "@/axios/apiCalls";
import CustomInput from "@/components/CustomInput";
import STabs from "@/components/STabs";
import { errorToast } from "@/components/toasts/error-toast";
import { DIRECTION, WIZARD_COMPONENT_TYPE } from "@/constants";
import { WizardContext } from "@/contexts/WizardContext";
import useGlobalStore from "@/store/globalStore";
import { TOGGLES } from "@/store/uiSlice";
import { getNodeName } from "@/utils/nodeComponentHelpers";
import CheckedApi2 from "@assets/icons/checked-api2.svg?react";
import Checked from "@assets/icons/checked-icon.svg?react";
import Node from "@assets/icons/node.svg?react";
import UnChecked from "@assets/icons/un-check-icon.svg?react";
import { Checkbox } from "@mui/material";
import Fuse from "fuse.js";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import UniqueIdentifierAccordion from "./UniqueIdentifierAccordion";

const selector = (state) => ({
  sourceAPIData: state.sourceAPIData,
  destinationAPIData: state.destinationAPIData,
  activeNodes: state.activeNodes,
  apiTransferKey: state.transferKey,
  resetTransferKey: state.resetTransferKey,
  initialSpeccValuesFetched: state.dataFetched.initialSpeccValues,
  addActiveNode: state.addActiveNode,
  destinationAPIID: state.destinationAPIData.id,
  removeModal: state.UI.removeModal,
  wizardMode: state.UI.TOGGLES.WIZARD_MODE,
});

export default function UniqueIdentifier() {
  const { getAndSetOKStatuses } = useContext(WizardContext);
  const {
    sourceAPIData,
    destinationAPIData,
    activeNodes,
    apiTransferKey,
    resetTransferKey,
    initialSpeccValuesFetched,
    addActiveNode,
    destinationAPIID,
    wizardMode,
  } = useGlobalStore(selector);

  const [api1Data, setApi1Data] = useState({
    sourceAPIID: "",
    destinationAPIID: "",
    activeNodes: [],
    identifiers: [],
    apiName: "",
    apiId: "",
  });
  const [api2Data, setApi2Data] = useState({
    sourceAPIID: "",
    destinationAPIID: "",
    activeNodes: [],
    identifiers: [],
    apiName: "",
    apiId: "",
  });
  const [api2DataMatch, setApi2DataMatch] = useState({
    sourceAPIID: "",
    destinationAPIID: "",
    activeNodes: [],
    identifiers: [],
    apiName: "",
    apiId: "",
  });

  const isMatching = useMemo(() => wizardMode === TOGGLES.WIZARD_MODE.MATCH, [wizardMode]);

  const paramListRef = useRef({});

  const [selectedTab, setSelectedTab] = useState("");
  const [selectedSourceEndpoint, setSelectedSourceEndpoint] = useState("");
  const [selectedDestinationEndpoint, setSelectedDestinationEndpoint] = useState("");
  const [transferKey, setTransferKey] = useState();

  const setNewUniqueClick = async (keyNodeID, keyName, endpoint, isMatching) => {
    console.log("keyNodeID", keyNodeID, keyName, endpoint, transferKey, apiTransferKey);
    let result;
    if (endpoint === "SOURCE") {
      result = await updateSourceTransferKey(transferKey.id, keyNodeID, keyName);
    } else {
      result = await updateDestinationTransferKey(transferKey.id, keyNodeID, keyName, isMatching);
    }
    if (result.errorcode) {
      errorToast(result.message);
    } else {
      resetTransferKey(result.data);
    }
    getAndSetOKStatuses(false, ["UNIQUE_IDENTIFIER"]);
  };

  useEffect(() => {
    if (api1Data.apiName && api2Data.apiName) {
      searchEndpoints();
    }
  }, [api1Data, api2Data]);

  useEffect(() => {
    if (initialSpeccValuesFetched) {
      setApi1Data(organiseData(true));
      setApi2Data(organiseData(false));
      setApi2DataMatch(organiseData(false, true));
    }
  }, [initialSpeccValuesFetched, activeNodes]);

  useEffect(() => {
    if (!selectedTab) {
      setSelectedTab(api1Data.apiName);
    }
  }, [api1Data, selectedTab]);

  useEffect(() => {
    setTransferKey(apiTransferKey);
  }, [apiTransferKey]);

  const organiseData = (isSource, isMatching = false) => {
    if (sourceAPIData.name === null) {
      console.error("sourceAPI name is null");
    }
    if (destinationAPIData.name === null) {
      console.error("destinationAPI name is null");
    }
    const apiName = isSource ? (sourceAPIData?.name ?? "API1") : (destinationAPIData?.name ?? "API2");
    const apiId = isSource ? (sourceAPIData?.id ?? "API1") : (destinationAPIData?.id ?? "API2");
    const activeNodesFiltered = filterActiveNodes(
      activeNodes.allIds.length > 0 ? [...activeNodes.allIds.map((id) => activeNodes.byId[id])] : [],
      apiId,
      isMatching
    );

    return {
      apiName: apiName,
      apiId: apiId,
      identifiers: activeNodesFiltered ? getIdentifiersList([...activeNodesFiltered], isSource, isMatching) : [],
      activeNodes: activeNodesFiltered,
      availableNodes: getNodeNames([...activeNodesFiltered], apiName, apiId),
      sourceAPIID: sourceAPIData?.id,
      destinationAPIID: destinationAPIData?.id,
    };
  };

  const filterActiveNodes = (activeNodes, apiId, isMatching) => {
    const list = [];

    activeNodes.map((node) => {
      if (node.APIID === apiId) {
        if (node.APIID === destinationAPIData.id) {
          isMatching
            ? node.type === WIZARD_COMPONENT_TYPE.MATCH && list.push(node)
            : node.type === WIZARD_COMPONENT_TYPE.RUN && node.isPostResponse && list.push(node);
        }
        if (node.APIID === sourceAPIData.id) {
          list.push(node);
        }
      }
    });

    return list;
  };

  const getSelectedTab = (value) => {
    setSelectedTab(value);
  };

  const activateDestinationNode = async (parentID, name) => {
    addActiveNode(name, parentID, false, DIRECTION.DESTINATION, true);
  };

  const getIdentifiersList = (activateNodes, isSource, isMatching = false) => {
    const list = [];
    const nodes = activateNodes.filter((activeNode) => (isSource || isMatching ? true : activeNode.isPostResponse));
    const traverseNodes = (nodes, parentId = null, level = 0) => {
      for (const i in nodes) {
        const node = nodes[i];
        const children = nodes.filter((child) => child.parentNode === node.id);
        if (node.parentNode === parentId) {
          list.push(getIdentifierOptions(node.id, getNodeName(node), node.availableFields));

          if (children.length > 0) {
            traverseNodes(nodes, node.id, level + 1);
          }
        }
      }
    };

    traverseNodes(nodes);
    return list;
  };

  const getNodeNames = (activateNodes, apiName, apiId) => {
    const list = [];

    const traverseNodes = (nodes, parentId = null, level = 0) => {
      for (const i in nodes) {
        const node = nodes[i];
        const children = nodes.filter((child) => child.parentNode === node.id);
        if (node.parentNode === parentId) {
          list.push({
            isParent: parentId === null,
            name: children.length !== 0 && parentId !== null ? `/${getNodeName(node)}` : getNodeName(node),
            parentId: node.parentNode,
            nodeId: node.id,
            level: parentId === null ? 0 : level + 1,
          });

          if (children.length > 0) {
            traverseNodes(activateNodes, node.id, level + 1);
          }
        }
      }
    };

    traverseNodes(activateNodes);
    if (list.length > 0) {
      setSelectedSourceEndpoint(list[0].nodeId);
    }

    return list;
  };

  const getIdentifierOptions = (id, endpointName, availableFields) => {
    const list = [];
    availableFields.map((field) => {
      list.push(field);
    });
    return { endpoint: endpointName, keyID: id, params: list };
  };

  const accordionItems = (endpoint, apiObject, isMatching = false) => {
    const list = [];

    if (apiObject?.identifiers.length > 0) {
      apiObject?.identifiers.map((item, index) =>
        list.push({
          isOpen: true,
          id: item.keyID,
          component: (
            <UniqueIdentifierAccordion
              apiObject={apiObject}
              endpoint={endpoint}
              item={item}
              paramListRef={paramListRef}
              isOpen={true}
              isMatching={isMatching}
              setNewUniqueClick={setNewUniqueClick}
              transferKey={transferKey}
            />
          ),
        })
      );
    }

    return list;
  };

  const openAccordion = (apiObject, index) => {
    const temp = [...apiObject.identifiers];
    temp[index].isOpen = true;
    setApi1Data({
      ...apiObject,
      identifiers: temp,
    });
  };

  const identifierComponentDestination = (endpoint, apiObject) => {
    return (
      <>
        <div className="flex gap-s20 endpoints-container relative h-full w-full">
          <div className="pr-s20 border-r rounded-api-component rounded-tl-none border-grey-13 w-1/2 flex flex-col gap-s12 overflow-scroll">
            <div class="h-s14 rounded-base flex items-center justify-center bg-secondary-aqua-1 bg-opacity-10 w-max px-s2 text-secondary-aqua-1 text-s12 font-bold font-['Inter'] tracking-tight uppercase">
              {apiObject.apiName}
            </div>
            <CustomInput variant="searchBox" className="w-full" inputClassName="w-full bg-transparent" placeholder="Search" onChange={(e) => {}} />

            <div class="flex gap-s4 items-center px-s4">
              <Node className={endpoint === "SOURCE" ? "icon-pink-1" : "icon-aqua-1"} />
              <div class={`text-lg font-bolder font-['Inter'] ${endpoint === "SOURCE" ? "text-secondary-pink-light-1" : "text-secondary-aqua-1"} `}>
                Node name
              </div>
            </div>

            <div className="flex flex-col gap-s4">
              {apiObject.activeNodes?.map((node, index) => (
                <>
                  <div
                    onClick={() => {
                      endpoint === "SOURCE" ? setSelectedSourceEndpoint(node.nodeId) : setSelectedDestinationEndpoint(node.nodeId);

                      paramListRef.current[node.nodeId].scrollIntoView({
                        block: "start",
                        behavior: "smooth",
                        inline: "start",
                      });
                    }}
                    onKeyDown={() => {
                      openAccordion(apiObject, index);
                      endpoint === "SOURCE" ? setSelectedSourceEndpoint(node.nodeId) : setSelectedDestinationEndpoint(node.nodeId);

                      document.getElementById(node.nodeId).scrollIntoView();
                    }}
                    key={uuidv4()}
                    className={`flex items-center gap-s4 cursor-pointer px-s4 h-s24 rounded-base ${
                      (selectedTab === api1Data.apiName && selectedSourceEndpoint === node.nodeId) ||
                      (selectedTab === api2Data.apiName && selectedDestinationEndpoint === node.nodeId)
                        ? "bg-grey-13 bg-opacity-40"
                        : ""
                    } `}>
                    {node.level > 0
                      ? Array.from({ length: node.level }, (_, index) => (
                          <>
                            <span key={uuidv4()} className="tab-space">
                              {"\t"}
                            </span>
                            <span key={uuidv4()} className="tab-space">
                              <Checkbox
                                icon={<UnChecked />}
                                checkedIcon={<Checked />}
                                sx={{
                                  padding: 0,
                                }}
                                checked={false}
                              />
                            </span>
                          </>
                        ))
                      : ""}
                    {/* 
									<Tick
										className={
											endpoint === "SOURCE" ? "icon-pink-1" : "icon-aqua-1"
										}
									/>
									 */}
                    <Checkbox
                      defaultChecked
                      icon={<UnChecked />}
                      checkedIcon={endpoint === "SOURCE" ? <Checked /> : <CheckedApi2 />}
                      sx={{
                        padding: 0,
                      }}
                      readOnly
                      checked={true}
                    />

                    <div class={` text-xs font-display font-['Inter'] leading-3 ${"text-white"}`}>{getNodeName(node)}</div>
                  </div>
                  {node.availableRelatedNodes?.map((childNode, index) => {
                    let isAlreadyActivated = false;

                    for (let i = 0; i < apiObject.activeNodes.length; i++) {
                      if (apiObject.activeNodes[i].name === childNode.name && apiObject.activeNodes[i].parentNode === node.id) {
                        isAlreadyActivated = true;
                        break;
                      }
                    }

                    if (isAlreadyActivated) {
                      return <></>;
                    }

                    return (
                      <>
                        <div
                          key={uuidv4()}
                          className={`flex gap-s4 items-center cursor-pointer px-s4 h-s24 rounded-base ${
                            (selectedTab === api1Data.apiName && selectedSourceEndpoint === node.nodeId) ||
                            (selectedTab === api2Data.apiName && selectedDestinationEndpoint === node.nodeId)
                              ? ""
                              : ""
                          } `}
                          onClick={() => {
                            activateDestinationNode(node.id, childNode.name);
                          }}
                          onKeyDown={() => {}}>
                          <span key={uuidv4()} className="tab-space">
                            {"\t"}
                          </span>
                          <span key={uuidv4()} className="tab-space">
                            {"\t"}
                          </span>
                          <span key={uuidv4()} className="tab-space">
                            <Checkbox
                              icon={<UnChecked />}
                              checkedIcon={<Checked />}
                              sx={{
                                padding: 0,
                              }}
                              checked={false}
                            />
                          </span>

                          {/*
												<Tick
													className={
														endpoint === "SOURCE"
															? "icon-pink"
															: "icon-mint-green"
													}
												/>
												 */}

                          <div class={` text-xs font-display font-['Inter'] leading-3 ${"text-white"}`}>{childNode.name}</div>
                        </div>
                      </>
                    );
                  })}
                </>
              ))}
            </div>
          </div>
          <div className="w-1/2 pr-s20 flex flex-col gap-s12 overflow-scroll h-full">
            <div class="text-white text-lg font-bold font-['Inter'] tracking-tight">Unique identifier</div>
            <CustomInput variant="searchBox" className="w-full" inputClassName="w-full bg-transparent" placeholder="Search" onChange={(e) => {}} />
            {accordionItems(endpoint, apiObject).map((item) => item.component)}
          </div>
        </div>
      </>
    );
  };

  const identifierComponent = (endpoint, apiObject, isMatching = false) => {
    console.log("apiObject", apiObject);
    return (
      <>
        <div className="flex gap-s20 endpoints-container relative h-full">
          <div className="pr-s20 border-r rounded-api-component rounded-tl-none border-grey-13 w-1/2 flex flex-col gap-s12 overflow-scroll">
            <div class="h-s14 rounded-base flex items-center justify-center bg-secondary-pink-light-1 bg-opacity-10 w-max px-s2 text-secondary-pink-light-1 text-s12 font-bold font-['Inter'] tracking-tight uppercase">
              {apiObject.apiName}
            </div>
            <CustomInput variant="searchBox" className="w-full" inputClassName="w-full bg-transparent" placeholder="Search" onChange={(e) => {}} />

            <div class="flex gap-s4 items-center px-s4">
              <Node className={endpoint === "SOURCE" ? "icon-pink-1" : "icon-aqua-1"} />
              <div class={`text-lg font-bolder font-['Inter'] ${endpoint === "SOURCE" ? "text-secondary-pink-light-1" : "text-secondary-aqua-1"} `}>
                Node name
              </div>
            </div>
            <div>
              {apiObject.availableNodes?.map((node, index) => (
                <div
                  onClick={() => {
                    endpoint === "SOURCE" ? setSelectedSourceEndpoint(node.nodeId) : setSelectedDestinationEndpoint(node.nodeId);

                    paramListRef.current[node.nodeId].scrollIntoView({
                      block: "start",
                      behavior: "smooth",
                      inline: "start",
                    });
                  }}
                  onKeyDown={() => {
                    openAccordion(apiObject, index);
                    endpoint === "SOURCE" ? setSelectedSourceEndpoint(node.nodeId) : setSelectedDestinationEndpoint(node.nodeId);

                    document.getElementById(node.nodeId).scrollIntoView();
                  }}
                  key={uuidv4()}
                  className={`flex items-center gap-s8 cursor-pointer p-s4 rounded-base ${
                    (selectedTab === api1Data.apiName && selectedSourceEndpoint === node.nodeId) ||
                    (selectedTab === api2Data.apiName && selectedDestinationEndpoint === node.nodeId)
                      ? "bg-grey-13 bg-opacity-40"
                      : ""
                  } `}>
                  {node.level > 0
                    ? Array.from({ length: node.level }, (_, index) => (
                        <span key={uuidv4()} className="tab-space">
                          {"\t"}
                          {/* <Checkbox
                            icon={<UnChecked />}
                            checkedIcon={<Checked />}
                            sx={{
                              padding: 0,
                            }}
                            checked={false}
                          /> */}
                        </span>
                      ))
                    : ""}
                  {/* 
								<Tick
									className={
										endpoint === "SOURCE" ? "icon-pink" : "icon-mint-green"
									}
								/>
								*/}
                  <Checkbox
                    defaultChecked
                    icon={<UnChecked />}
                    checkedIcon={endpoint === "SOURCE" ? <Checked /> : <CheckedApi2 />}
                    sx={{
                      padding: 0,
                    }}
                    readOnly
                    checked={true}
                  />

                  <div class={` text-xs font-normal font-['Inter'] leading-3 ${"text-white"}`}>{getNodeName(node)}</div>
                </div>
              ))}
            </div>
          </div>

          {/* <div class=" border-r h-[500px] border-grey-3" /> */}
          <div className="w-1/2 pr-s20 flex flex-col gap-s12 overflow-scroll h-full">
            <div class="text-white text-lg font-bold font-['Inter'] tracking-tight">Unique identifier</div>
            <CustomInput variant="searchBox" className="w-full" inputClassName="w-full bg-transparent" placeholder="Search" onChange={(e) => {}} />
            {accordionItems(endpoint, apiObject, isMatching).map((item) => item.component)}
          </div>
        </div>
      </>
    );
  };

  const fuseOptions = {
    // isCaseSensitive: false,
    includeScore: true,
    // shouldSort: true,
    includeMatches: true,
    findAllMatches: true,
    minMatchCharLength: 1,
    // location: 0,
    threshold: 0.5,
    // distance: 100,
    //useExtendedSearch: true,
    //ignoreLocation: true,
    // ignoreFieldNorm: false,
    // fieldNormWeight: 1,
    keys: ["name", "endpoint"],
  };

  const searchEndpoints = () => {
    //const temp = api1Data.availableNodes ? [...api1Data.availableNodes] : [];
    const temp = api1Data.activeNodes ? [...api1Data.identifiers] : [];
    const fuse = new Fuse(selectedTab === "Stripe API" ? temp : api2Data.availableNodes, fuseOptions);
    const result = fuse.search("email");
    const list = [];
    result.map((item) => {
      list.push(item.item);
    });
    // setApi1Data({
    //   ...api1Data,
    //   availableNodes: list,
    // });
  };

  // const fuse = new Fuse(
  //       props.direction === "SOURCE"
  //         ? props.sourceEndpoints
  //         : props.destinationEndpoints,
  //       fuseOptions
  //     );
  //     const result = fuse.search(searchText);

  return (
    <div className="flex flex-col justify-between h-full">
      {api1Data.apiName && destinationAPIID ? (
        <STabs
          tabClassName={`p-0 w-full h-full text-gradient-grey-7`}
          getSelectedTab={getSelectedTab}
          tabStyles={{
            tabListStyle: "p-s2 w-max flex rounded-label bg-grey-22",
            activeTab: "p-s10 bg-grey-13 !rounded-label",
          }}
          tabs={[
            {
              name: api1Data.apiName ? api1Data.apiName : "API1",
              className: "mt-s20 absolute h-[calc(100%-82px)] w-[calc(100%-24px)]",
              children: identifierComponent("SOURCE", api1Data),
              textColor: "text-api-1 p-s10 uppercase",
            },
            {
              name: api2Data.apiName ? api2Data.apiName : "API2",
              className: "mt-s20 absolute h-[calc(100%-82px)] w-[calc(100%-24px)]",
              children: isMatching ? identifierComponent("DESTINATION", api2DataMatch, isMatching) : identifierComponentDestination("DESTINATION", api2Data),
              textColor: "text-api-2 p-s10 uppercase",
            },
          ]}
        />
      ) : (
        identifierComponent("SOURCE", api1Data)
      )}
    </div>
  );
}
