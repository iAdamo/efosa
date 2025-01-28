import { WizardContext } from "@contexts/WizardContext";
import { useContext, useEffect, useState } from "react";
import { getExampleData, runExampleData } from "@axios/apiCalls";

const useNodeComponentExampleData = (exampledata, speccid, fullNode) => {
  const { setFetchedData, sourceAPIID, setExampleDataRunResult, updateExampledataOnNodeID } = useContext(WizardContext);

  const [nodeExampleData, setNodeExampleData] = useState(null);
  const [fetchedExampleData, setFetchedExampledata] = useState(null);
  const [selectedExampledataIndex, setSelectedExampledataIndex] = useState(null);
  const [isExampledataFresh, setIsExampledataFresh] = useState(false);
  const [actualExampleData, setActualExampleData] = useState(null);

  useEffect(() => {
    (async () => {
      if (selectedExampledataIndex != null && !isExampledataFresh) {
        if (fetchedExampleData != null) {
          setActualExampleData(fetchedExampleData[selectedExampledataIndex]);

          const results = await runExampleData(fullNode.id, JSON.stringify(fetchedExampleData[selectedExampledataIndex]));
          setExampleDataRunResult(results);

          setIsExampledataFresh(true);
        } else {
          setActualExampleData(exampledata[selectedExampledataIndex]);
        }
      }
    })();
  }, [selectedExampledataIndex, isExampledataFresh]);

  useEffect(() => {
    setFetchedExampledata(exampledata);
  }, [exampledata]);

  useEffect(() => {
    setFetchedExampledata(nodeExampleData);
  }, [nodeExampleData]);

  return {
    nodeExampleData,
    setNodeExampleData,
    fetchedExampleData,
    setFetchedExampledata,
    selectedExampledataIndex,
    setSelectedExampledataIndex,
    actualExampleData,
    setActualExampleData,
    isExampledataFresh,
    setIsExampledataFresh,
  };
};

export default useNodeComponentExampleData;
