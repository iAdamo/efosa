import React, { useContext, useEffect, useState } from "react";
import SetupCard from "./MatchOrHistoricSetupCard";
import RunnerResultTabs from "./RunnerResultTabs";
import { MatchContext } from "@contexts/MatchContext";
import { RunnerContext, matchTabEnum } from "@contexts/RunnerContext";
import {
    updateSpeccStrategy,
} from "@axios/apiCalls";
import { WizardContext } from "@contexts/WizardContext";

const setupCardEnum = {
    Match: "MATCHING",
    Transfer: "HISTORIC",
    Create: "CAWG",
};

export const matchingResultTabEnum = {
    Matched: 0,
    InApiName: 1,
    Duplicates: 2,
};

const Setup = () => {
    const [selectedResultTab, setSelectedResultTab] = useState(
        matchingResultTabEnum.Duplicates
    );

    const { speccID, strategy, setStrategy } = useContext(WizardContext);

    const {
        setIsMatchMode,
        setSourceMatchEndpoint,
        setDestinationMatchEndpoint,
    } = useContext(MatchContext);
    const { setIsRunnerOpen, matchStep, setMatchStep } =
        useContext(RunnerContext);

    const updateStrategy = async (newStrategy) => {
        const updatedSpeccStrategyResponse = await updateSpeccStrategy(
            speccID,
            newStrategy
        );
        if (updatedSpeccStrategyResponse.httpcode == 200) {
            setStrategy(updatedSpeccStrategyResponse.data.strategy);
        }
    };

    return (
        <div className="w-full h-full flex flex-col">
            <div className="flex align-end">
                {strategy !== null &&
                    strategy >= 0 &&
                    strategy === setupCardEnum.Match && (
                        <>
                            <button
                                className={`px-2 py-4 ${
                                    matchStep === matchTabEnum.Match
                                        ? "text-[#55689B]"
                                        : "text-[#808080]"
                                } relative font-bold`}
                                onClick={() => {
                                    setMatchStep(matchTabEnum.Match);
                                    if (strategy === setupCardEnum.Match) {
                                        setIsMatchMode(true);
                                        setSourceMatchEndpoint("/asset");
                                        setDestinationMatchEndpoint("/asset");
                                        setIsRunnerOpen(false);
                                    }
                                }}
                            >
                                MATCH
                                {matchStep === matchTabEnum.Match && (
                                    <div className="h-[4px] bg-[#55689B] absolute bottom-[-2.5px] left-0 rounded-md w-full" />
                                )}
                            </button>

                            <button
                                className={`px-2 py-4 ${
                                    matchStep === matchTabEnum.Match
                                        ? "text-[#55689B]"
                                        : "text-[#808080]"
                                } relative font-bold`}
                                onClick={() => {
                                    setMatchStep(matchTabEnum.Unique);
                                }}
                            >
                                Unique identifier
                                {matchStep === matchTabEnum.Unique && (
                                    <div className="h-[4px] bg-[#55689B] absolute bottom-[-2.5px] left-0 rounded-md w-full" />
                                )}
                            </button>
                        </>
                    )}

                {strategy !== null && strategy >= 0 && (
                    <button
                        className={`px-2 py-4 ${
                            matchStep === matchTabEnum.Result
                                ? "text-[#55689B]"
                                : "text-[#808080]"
                        } relative font-bold`}
                        onClick={() => setMatchStep(matchTabEnum.Result)}
                    >
                        RESULT
                        {matchStep === matchTabEnum.Result && (
                            <div className="h-[4px] bg-[#55689B] absolute bottom-[-2.5px] left-0 rounded-md w-full" />
                        )}
                    </button>
                )}
            </div>
            {matchStep === matchTabEnum.Result && strategy === 0 && (
                <>
                    <RunnerResultTabs
                        selectedResultTab={selectedResultTab}
                        onClick={setSelectedResultTab}
                    />
                </>
            )}
            <div className="grow">
                <div className="px-16 py-7 flex flex-row justify-between">
                    <SetupCard
                        active={strategy === setupCardEnum.Match}
                        onClick={() => {
                            updateStrategy("MATCHING");
                        }}
                        title="MATCH"
                    />
                    <SetupCard
                        active={strategy === setupCardEnum.Transfer}
                        onClick={() => {
                            updateStrategy("HISTORIC");
                        }}
                        title="TRANSFER HISTORIC"
                    />
                    <SetupCard
                        active={strategy === setupCardEnum.Create}
                        onClick={() => {
                            updateStrategy("CAWG");
                        }}
                        title="CREATE AS WE GO"
                    />
                </div>
            </div>
        </div>
    );
};

export default Setup;
