import React, { createContext, useEffect, useState, useContext } from "react";
import { WizardContext } from "./WizardContext";
import { updateTransferKey } from "@axios/apiCalls";
export const RunnerContext = createContext(null);

export const matchingResultTabEnum = {
    Matched: 0,
    InApiName: 1,
    Duplicates: 2,
};

export const tabEnum = {
    Unique: 0,
    MatchingOrHistoric: 1,
    Test: 2,
    Scheduler: 3,
};

export const matchTabEnum = {
    Setup: 0,
    Match: 1,
    Result: 2,
    Unique: 3,
};

export const schedulerTabEnm = {
    TimeBased: 0,
    EventBased: 1,
};

const RunnerContextWrapper = ({ children }) => {
    const [isRunnerOpen, setIsRunnerOpen] = useState(false);
    const [selectedPairing, setSelectedPairing] = useState(null);
    const [manuallyMatched, setManuallyMatched] = useState(null);
    const [selectedSubcategory, setSelectedSubcategory] = useState(null);

    const [selectedUnique, setSelectedUnique] = useState(null);

    const [scheduleSelected, setScheduleSelected] = useState(false);
    const [firstNode, setFirstNode] = useState(null);
    const [secondNode, setSecondNode] = useState(null);
    const [thirdNode, setThirdNode] = useState(null);
    const [firstSelectedUniqueIdentifier, setFirstSelectedUniqueIdentifier] =
        useState(null);
    const [secondSelectedUniqueIdentifier, setSecondSelectedUniqueIdentifier] =
        useState(null);
    const [thirdSelectedUniqueIdentifier, setThirdSelectedUniqueIdentifier] =
        useState(null);
    const [matchbox, setMatchbox] = useState(null);

    const [historicData, setHistoricData] = useState(null);
    const [firstMatchingData, setFirstMatchingData] = useState(null);
    const [secondMatchingData, setSecondMatchingData] = useState(null);
    const [selectedMatchingTab, setSelectedMatchingTab] = useState(
        matchingResultTabEnum.Matched
    );

    const [matches, setMatches] = useState(null);
    const [duplicates, setDuplicates] = useState(null);
    const [sourceOnly, setSourceOnly] = useState(null);

    const [shouldUpdate, setShouldUpdate] = useState(true);

    const [tableMatchedManually, setTableMatchedManually] = useState({
        title: "Manually matched",
        children: [],
    });

    const [runnerTab, setRunnerTab] = useState(tabEnum.MatchingOrHistoric);
    const [schedulerTab, setSchedulerTab] = useState(schedulerTabEnm.TimeBased);

    const [matchStep, setMatchStep] = useState(matchTabEnum.Setup);
    const [strategy, setStrategy] = useState(null);

    const [pairings, setPairings] = useState(null);

    const { activeNodes, destinationAPIID } = useContext(WizardContext);

    useEffect(() => {}, [pairings]);

    useEffect(() => {
        if (selectedPairing && pairings) {
            for (let i = 0; i < pairings.length; i++) {
                if (selectedPairing.id == pairings[i].id) {
                    setSelectedPairing(pairings[i]);
                    break;
                }
            }
        }
    }, [JSON.stringify(pairings)]);

    useEffect(() => {
        if (selectedPairing) {
            setStrategy(selectedPairing.strategy);
        }
    }, [JSON.stringify(selectedPairing)]);

    useEffect(() => {
        if (selectedPairing != null) {
            const firstNode = activeNodes.find((node) => {
                if (node.id == selectedPairing.node1) {
                    return true;
                }
                return false;
            });

            const secondNode = activeNodes.find((node) => {
                if (node.id == selectedPairing.node2) {
                    return true;
                }
                return false;
            });

            const thirdNode = activeNodes.find((node) => {
                if (
                    node.pairingID == selectedPairing.id &&
                    node.parentNode === null &&
                    node.APIID == destinationAPIID &&
                    node.isMatching === 1
                ) {
                    return true;
                }
                return false;
            });

            setFirstNode(firstNode);
            setSecondNode(secondNode);
            setThirdNode(thirdNode);
            setShouldUpdate(false);
            setManuallyMatched(selectedPairing.manuallyMatched);
            setStrategy(selectedPairing.strategy);

            setFirstSelectedUniqueIdentifier({
                nodeID: selectedPairing?.transferkey?.sourceKeyNodeID,
                keyName: selectedPairing?.transferkey?.sourceKeyName,
            });
            setSecondSelectedUniqueIdentifier({
                nodeID: selectedPairing?.transferkey?.destinationKeyNodeID,
                keyName: selectedPairing?.transferkey?.destinationKeyName,
            });
            setShouldUpdate(true);
        } else {
            setFirstNode(null);
            setSecondNode(null);
            setSecondSelectedUniqueIdentifier(null);
            setFirstSelectedUniqueIdentifier(null);
            setManuallyMatched(null);
        }
    }, [selectedPairing, activeNodes]);

    useEffect(() => {
        if (selectedPairing && shouldUpdate) {
            updateTransferKey(
                selectedPairing.transferkey.id,
                firstSelectedUniqueIdentifier,
                secondSelectedUniqueIdentifier,
                thirdSelectedUniqueIdentifier
            );
        }
    }, [
        firstSelectedUniqueIdentifier,
        secondSelectedUniqueIdentifier,
        thirdSelectedUniqueIdentifier,
    ]);

    const addManuallyInTableMatched = (tableLeft, tableRight) => {
        const tableMatchedManuallyCopy = tableMatchedManually;
        tableMatchedManuallyCopy.children.push({
            id: Date.now(),
            tableLeft,
            tableRight,
        });
        setTableMatchedManually(tableMatchedManuallyCopy);
    };

    const clearState = () => {
        setMatchStep(matchTabEnum.Setup);
        setStrategy(null);
        setSelectedPairing(null);
    };

    const removeTableRowInDuplicates = (selectLeft, selectRight) => {
        const tableInAPICopy = [...tableInAPI];
        tableInAPICopy.forEach((item, index) => {
            if (item.id === selectLeft.id) {
                tableInAPICopy[index].selectLeft = true;
            } else if (item.id === selectRight.id) {
                tableInAPICopy[index].selectRight = true;
            }
        });
        addManuallyInTableMatched(selectLeft, selectRight);
        setTableInApi(tableInAPICopy);
    };

    return (
        <RunnerContext.Provider
            value={{
                isRunnerOpen,
                setIsRunnerOpen,
                runnerTab,
                setRunnerTab,
                selectedPairing,
                setSelectedPairing,
                removeTableRowInDuplicates,
                tableMatchedManually,
                matchStep,
                setMatchStep,
                strategy,
                setStrategy,
                clearState,
                schedulerTab,
                setSchedulerTab,
                pairings,
                setPairings,
                selectedSubcategory,
                setSelectedSubcategory,
                scheduleSelected,
                setScheduleSelected,
                firstNode,
                secondNode,
                thirdNode,
                firstSelectedUniqueIdentifier,
                secondSelectedUniqueIdentifier,
                thirdSelectedUniqueIdentifier,
                setFirstSelectedUniqueIdentifier,
                setSecondSelectedUniqueIdentifier,
                setThirdSelectedUniqueIdentifier,
                historicData,
                setHistoricData,
                firstMatchingData,
                setFirstMatchingData,
                secondMatchingData,
                setSecondMatchingData,
                selectedMatchingTab,
                setSelectedMatchingTab,
                matches,
                setMatches,
                duplicates,
                setDuplicates,
                sourceOnly,
                setSourceOnly,
                manuallyMatched,
                setManuallyMatched,
                selectedUnique,
                setSelectedUnique,
            }}
        >
            {children}
        </RunnerContext.Provider>
    );
};

export default RunnerContextWrapper;
