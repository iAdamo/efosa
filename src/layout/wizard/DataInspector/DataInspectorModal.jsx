import { WizardContext } from "@contexts/WizardContext";
import {
    deleteOperationNodeApi,
    getInspectorData,
    getMeatballsForEndpoint,
    getSearchNodeEndpoints,
    setNodeForON,
} from "@axios/apiCalls";
import { useMemo, useState, useContext, useEffect } from "react";
import ShowData from "./ShowData";
import SDialog from "@/components/SDialog";
import { Button } from "react-aria-components";
import SButton from "@/components/SButton";
import SInput from "@/components/SInput";
import useGlobalStore from "@/store/globalStore";
import { ELEMENTS } from "@/store/uiSlice";

const DataInspectorModal = (props) => {
    const { showDataInspector } = props;

    const { speccID, project } =
        useContext(WizardContext);

    const { removeModal } = useGlobalStore((s) => ({
        removeModal: s.UI.removeModal
    }));

    const [selectedAPI, setSelectedAPI] = useState(null);

    const [endpoints, setEndpoints] = useState(null);

    const [selectedEndpoint, setSelectedEndpoint] = useState(null);

    const [fetchedMeatballs, setFetchedMeatballs] = useState(null);

    const [fetchedData, setFetchedData] = useState(null);

    const [viewData, setViewData] = useState(false);

    const selectEndpointClick = async (endpoint) => {
        setSelectedEndpoint(endpoint);
        const meatballs = await getMeatballsForEndpoint(
            project.id,
            selectedAPI,
            endpoint
        );

        setFetchedMeatballs(meatballs);
    };

    useEffect(() => {
        (async () => {
            if (selectedAPI) {
                const allEndpointsResponse = await getSearchNodeEndpoints(
                    speccID,
                    selectedAPI
                );

                if (Array.isArray(allEndpointsResponse)) {
                    setEndpoints(allEndpointsResponse);
                }
            }
        })();
    }, [selectedAPI]);

    const updateMeatballValue = (index, value) => {
        const allMeatballs = [];
        for (let i = 0; i < fetchedMeatballs.length; i++) {
            if (i == index) {
                if (fetchedMeatballs[i].type == "boolean") {
                    if (value == "-1") {
                        delete fetchedMeatballs[i].value;
                    } else {
                        fetchedMeatballs[i].value = value == 1 ? true : false;
                    }
                } else {
                    if (value.length == 0) {
                        delete fetchedMeatballs[i].value;
                    } else {
                        fetchedMeatballs[i].value = value;
                    }
                }
            }

            allMeatballs.push(fetchedMeatballs[i]);
        }

        setFetchedMeatballs(allMeatballs);
    };

    const fetchDataClick = async () => {
        const data = await getInspectorData(
            project.id,
            selectedAPI,
            selectedEndpoint,
            fetchedMeatballs
        );

        setFetchedData(data);
        setViewData(true);
    };

    const [searchString, setSearchString] = useState("");

    let isLarge = false;
    if (viewData) {
        isLarge = true;
    }

    const [searchResults, setSearchResults] = useState([]);

    const [selectedIndexForSearch, setSelectedIndexForSearch] = useState(0);
    const [dataSearchString, setDataSearchString] = useState("");

    return (
        <SDialog
            isOpen={showDataInspector}
            closeCallback={() => removeModal()}
        >
            <div className="h-[80vh] w-[80vh] p-5 overflow-y-scroll">
                <ShowData
                    viewData={viewData}
                    fetchedData={fetchedData}
                    setViewData={setViewData}
                    searchString={dataSearchString}
                    setSearchString={setDataSearchString}
                    selectedIndexForSearch={selectedIndexForSearch}
                    setSelectedIndexForSearch={setSelectedIndexForSearch}
                    searchResults={searchResults}
                    setSearchResults={setSearchResults}
                />

                {fetchedMeatballs != null && !viewData && (
                    <>
                        <SButton
                            onClick={() => {
                                setFetchedMeatballs(null);
                                setDataSearchString("");
                                setSelectedIndexForSearch(0);
                                setSearchResults([]);
                                setFetchedData(null);
                            }}
                        >
                            Back
                        </SButton>
                        {fetchedData != null && (
                            <SButton
                                onClick={() => {
                                    setViewData(true);
                                }}
                            >
                                View data
                            </SButton>
                        )}
                        <div className="text-center">
                            URL: {selectedEndpoint}
                        </div>

                        <div className="overflow-auto">
                            {fetchedMeatballs.map((meatball, index) => {
                                return (
                                    <>
                                        <div className="border border-[#000000] p-2 my-1">
                                            <div className="flex flex-col gap-2">
                                                <div>
                                                    Name: <b>{meatball.name}</b>{" "}
                                                    {meatball?.required &&
                                                        meatball.required ===
                                                        true && (
                                                            <>
                                                                <span className="text-[#ff0000]">
                                                                    *
                                                                </span>
                                                            </>
                                                        )}
                                                </div>
                                                {meatball?.description && (
                                                    <>
                                                        <div>
                                                            Description:{" "}
                                                            {
                                                                meatball.description
                                                            }
                                                        </div>
                                                    </>
                                                )}

                                                {meatball?.type && (
                                                    <>
                                                        <div>
                                                            Type:{" "}
                                                            {meatball.type}
                                                        </div>
                                                    </>
                                                )}
                                                {meatball?.in && (
                                                    <>
                                                        <div>
                                                            In: {meatball.in}
                                                        </div>
                                                    </>
                                                )}
                                                {meatball.type == "boolean" && (
                                                    <>
                                                        <select
                                                            onChange={(e) => {
                                                                updateMeatballValue(
                                                                    index,
                                                                    e.target
                                                                        .value
                                                                );
                                                            }}
                                                        >
                                                            <option value="-1">
                                                                Not set
                                                            </option>
                                                            <option value="1">
                                                                true
                                                            </option>
                                                            <option value="0">
                                                                false
                                                            </option>
                                                        </select>
                                                    </>
                                                )}
                                                {meatball.type != "boolean" && (
                                                    <>
                                                        <SInput
                                                            type="text"
                                                            onChange={(e) => {
                                                                updateMeatballValue(
                                                                    index,
                                                                    e.target
                                                                        .value
                                                                );
                                                            }}
                                                        />
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </>
                                );
                            })}
                        </div>
                        <div className="text-center">
                            <SButton
                                className="border mt-3 p-4 bg-[#ffffff] border-[#000000]"
                                onClick={() => {
                                    fetchDataClick();
                                }}
                            >
                                Get data
                            </SButton>
                        </div>
                    </>
                )}
                {selectedAPI != null &&
                    !viewData &&
                    endpoints != null &&
                    fetchedMeatballs == null && (
                        <>
                            <SButton
                                onClick={() => {
                                    setSearchString("");
                                    setSelectedAPI(null);
                                    setEndpoints(null);
                                    setFetchedMeatballs(null);

                                    setDataSearchString("");
                                    setSelectedIndexForSearch(0);
                                    setSearchResults([]);
                                    setFetchedData(null);
                                }}
                            >
                                Back
                            </SButton>
                            <div className="flex flex-col text-center">
                                <div>Search</div>
                                <div>
                                    <SInput
                                        className="mt-6"
                                        type="text"
                                        onChange={(e) => {
                                            setSearchString(
                                                e.target.value.trim()
                                            );
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="overflow-auto">
                                <div className="text-center mt-6">
                                    <div className="">
                                        <div className="h-[100%] flex flex-col">
                                            {endpoints.map((endpoint, idx) => {
                                                let include = true;

                                                if (searchString.length > 0) {
                                                    if (
                                                        !endpoint.includes(
                                                            searchString
                                                        )
                                                    ) {
                                                        include = false;
                                                    }
                                                }
                                                if (!include) {
                                                    return <></>;
                                                }
                                                return (
                                                    <Button
                                                        key={`endpoint-${idx}`}
                                                        className="display-block h-max-content border p-2 border-[#000000] text-[18px] hover:bg-[#aaaaaa] text-left hover:cursor-pointer rounded"
                                                        onClick={() => {
                                                            selectEndpointClick(
                                                                endpoint
                                                            );
                                                        }}
                                                    >
                                                        {endpoint}
                                                    </Button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                {selectedAPI != null && endpoints == null && !viewData && (
                    <>
                        <div className="flex flex-col">
                            <div className="flex-grow text-center text-[20px]">
                                <p>Fetching endpoints...</p>
                            </div>
                        </div>
                    </>
                )}
                {selectedAPI == null && !viewData && (
                    <>
                        <div className="flex flex-col">
                            <div className="flex-grow text-center text-[20px]">
                                <p>Select API</p>
                            </div>
                            <div className="flex gap-2 justify-center text-center mt-12">
                                <SButton
                                    sType={"build"}
                                    className={"w-[200px]"}
                                    onClick={() => {
                                        setSelectedAPI("SOURCE");
                                    }}
                                >
                                    <span>Source</span>
                                </SButton>
                                <SButton
                                    sType={"build"}
                                    className={"w-[200px]"}
                                    onClick={() => {
                                        setSelectedAPI("DESTINATION");
                                    }}
                                >
                                    <span>Destination</span>
                                </SButton>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </SDialog>
    );
};

export default DataInspectorModal;
