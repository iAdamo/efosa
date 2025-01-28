import { useContext } from "react";
import { matchingResultTabEnum } from "./Setup";
import { RunnerContext } from "@contexts/RunnerContext";

const RunnerResultTabs = ({ onClick, selectedResultTab }) => {
    const { setSelectedMatchingTab, selectedMatchingTab } =
        useContext(RunnerContext);

    return (
        <div className="flex items-center gap-2 text-sm">
            <div className="flex flex-col mt-6 rounded text-sm font-semibold">
                <button
                    onClick={() =>
                        setSelectedMatchingTab(matchingResultTabEnum.Matched)
                    }
                    type="button"
                    className={`flex ml-6 pt-1 pb-1 items-center justify-center px-3 rounded-[20px] mb-3 ${
                        selectedMatchingTab === matchingResultTabEnum.Matched
                            ? "text-white bg-[#55689B]"
                            : "bg-[#EDEDED]"
                    }`}
                >
                    Matched (1760)
                </button>
                <button
                    onClick={() =>
                        setSelectedMatchingTab(matchingResultTabEnum.InApiName)
                    }
                    type="button"
                    className={`flex ml-6 pt-1 pb-1 items-center justify-center px-3 rounded-[20px] mb-3 ${
                        selectedMatchingTab === matchingResultTabEnum.InApiName
                            ? "text-white bg-[#55689B]"
                            : "bg-[#EDEDED]"
                    }`}
                >
                    In APIname123 only (234)
                </button>
                <button
                    onClick={() =>
                        setSelectedMatchingTab(matchingResultTabEnum.Duplicates)
                    }
                    type="button"
                    className={`flex ml-6 pt-1 pb-1 items-center justify-center px-3 rounded-[20px] mb-3 ${
                        selectedMatchingTab === matchingResultTabEnum.Duplicates
                            ? "text-white bg-[#55689B]"
                            : "bg-[#EDEDED]"
                    }`}
                >
                    Duplicates (654)
                </button>
            </div>
        </div>
    );
};

export default RunnerResultTabs;
