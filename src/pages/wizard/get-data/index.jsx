import { useContext, useEffect, useState } from "react";

import { WizardContext } from "@contexts/WizardContext";

import { fetchDestinationData, fetchSourceData } from "@/axios/matchAPICalls";
import { DIRECTION } from "@/constants";
import useGlobalStore from "@/store/globalStore";
import { ELEMENTS } from "@/store/uiSlice";
import { getModule, runModule } from "@axios/apiCalls";
import { useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import GetData from "./GetData";
import ShowMeatballData from "./ShowMeatballData";

const navigation = "MEATBALLS";

const selector = (s) => ({
  activeNodes: s.activeNodes,
  getFilteredMatchActiveNodes: s.getFilteredMatchActiveNodes,
  getFilteredSourceActiveNodes: s.getFilteredSourceActiveNodes,
  getFilteredDesitantionActiveNodes: s.getFilteredDesitantionActiveNodes,
  activeModal: s.UI.ELEMENTS.MODAL,
  meatballs: s.meatballs,
  activeModules: s.activeModules,
  speccID: s.speccId,
  setModuleResults: s.moduleResults.setModuleResults,
  updateExampleDataRows: s.updateExampleDataRows,
});

export default function GetDataPage(props) {
  const [showPage, setShowPage] = useState(false);
  const [pageError, setPageError] = useState(null);
  const [module, setModule] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    activeNodes,
    getFilteredDesitantionActiveNodes,
    getFilteredSourceActiveNodes,
    getFilteredMatchActiveNodes,
    activeModal,
    activeModules,
    speccID,
    meatballs,
    setModuleResults,
    updateExampleDataRows,
  } = useGlobalStore(useShallow(selector));

  const { getAndSetOKStatuses } = useContext(WizardContext);
  const [expandedMeatballs, setExpandedMeatballs] = useState(true);
  const [hovered, setHovered] = useState(false);

  const direction = useMemo(() => {
    return activeModal === ELEMENTS.MODAL.RUN.GET_DATA || activeModal === ELEMENTS.MODAL.MATCH.GET_DATA_SOURCE ? DIRECTION.SOURCE : DIRECTION.DESTINATION;
  }, [activeModal]);

  const isMatching = useMemo(() => {
    return activeModal === ELEMENTS.MODAL.MATCH.GET_DATA_DESTINATION || activeModal === ELEMENTS.MODAL.MATCH.GET_DATA_SOURCE;
  }, [activeModal]);

  const parentNode = useMemo(() => {
    return isMatching
      ? direction === DIRECTION.SOURCE
        ? getFilteredSourceActiveNodes(activeNodes)?.[0]
        : getFilteredMatchActiveNodes(activeNodes)?.[0]
      : direction === DIRECTION.SOURCE
        ? getFilteredSourceActiveNodes(activeNodes)?.[0]
        : getFilteredDesitantionActiveNodes(activeNodes)?.[0];
  }, [isMatching, direction, activeNodes, getFilteredMatchActiveNodes, getFilteredSourceActiveNodes, getFilteredDesitantionActiveNodes]);

  useMemo(() => {
    if (!parentNode) {
      setShowPage(false);
      setPageError("No parent node!");
    }
  }, [parentNode]);

  useEffect(() => {
    let module = null;
    for (let i = 0; i < activeModules.length; i++) {
      if (activeModules[i].config.navigationName == navigation) {
        module = activeModules[i];
        break;
      }
    }

    if (!module) {
      setShowPage(false);
      setPageError("No module");
      return;
    } else {
      setModule(module);
    }

    setShowPage(true);
    setPageError(null);
  }, [activeModules]);

  const allMeatballs = meatballs.filter((meatball) => {
    if (meatball?.nodeID == parentNode?.id) {
      return true;
    }
    return false;
  });

  const [moduleResponse, setModuleResponse] = useState(null);

  const [viewData, setViewData] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedIndexForSearch, setSelectedIndexForSearch] = useState(0);
  const [searchString, setSearchString] = useState("");

  useEffect(() => {
    if (moduleResponse) {
      setViewData(true);
      setSearchResults([]);
      setSelectedIndexForSearch(0);
      setSearchString("");
    } else {
      setViewData(false);
      setSearchResults([]);
      setSelectedIndexForSearch(0);
      setSearchString("");
    }
  }, [JSON.stringify(moduleResponse)]);

  const runFetchDataClick = async (pageNumber = null) => {
    setIsLoading(true);
    setModuleResponse(null);
    let moduleResponseAnswer = null;

    try {
      if (isMatching) {
        const data = direction === DIRECTION.SOURCE ? await fetchSourceData({ speccID }) : await fetchDestinationData({ speccID });
        if (data?.body) {
          moduleResponseAnswer = {
            isUseable: true,
            listOfDataObjects: data.body.map((row) => ({ datarow: row })),
          };
        }
      } else {
        moduleResponseAnswer = await runModule(speccID, module.id, { pageNumber });
        setModuleResults(module.name, moduleResponseAnswer);
        if (moduleResponseAnswer?.listOfDataObjects) {
          console.log("moduleResponseAnswer", moduleResponseAnswer);
          updateExampleDataRows(moduleResponseAnswer.listOfDataObjects);
        }
      }
      console.log("moduleResponseAnswer", moduleResponseAnswer);
      setModuleResponse(moduleResponseAnswer);
      //Do not await this
      getAndSetOKStatuses(false, ["GET_DATA"]);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
      return moduleResponseAnswer;
    }
  };

  useEffect(() => {
    (async () => {
      const moduleResponseAnswer = await getModule(speccID, module.id);

      if (!("found" in moduleResponseAnswer)) {
        setModuleResponse(moduleResponseAnswer);
      }
    })();
  }, []);

  const updateExpansion = (compToUpdate) => {
    if (compToUpdate === "meatballs") {
      setExpandedMeatballs(!expandedMeatballs);
    }
  };
  const returnDiv = () => (
    <div className="h-full">
      <div className="get-data !p-0">
        {/* <Expandable
				expanded={expandedMeatballs}
				setExpansion={updateExpansion}
				toExpand={"meatballs"}
				hovered={hovered}
				expandedClassName="max-w-[322px]"
			> */}
        <GetData node={parentNode} meatballs={allMeatballs} expanded={expandedMeatballs} />
        {/* </Expandable> */}
        <ShowMeatballData
          parentNode={parentNode}
          module={module}
          setModule={setModule}
          viewData={viewData}
          fetchedData={moduleResponse}
          setViewData={setViewData}
          searchString={searchString}
          setSearchString={setSearchString}
          selectedIndexForSearch={selectedIndexForSearch}
          setSelectedIndexForSearch={setSelectedIndexForSearch}
          searchResults={searchResults}
          setSearchResults={setSearchResults}
          isUseableRows={moduleResponse?.isUseable || null}
          runFetchDataClick={runFetchDataClick}
          hovered={hovered}
          setHovered={setHovered}
          paginationEnabled={Boolean(meatballs.find((mb) => mb.isPagination))}
          expanded={expandedMeatballs}
          isLoading={isLoading}
        />
      </div>
    </div>
  );

  return <>{showPage ? returnDiv() : <p>{pageError}</p>}</>;
}
