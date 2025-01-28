import ButtonTabInRunner from "./ButtonTabInRunner";
import { RunnerContext, schedulerTabEnm } from "@contexts/RunnerContext";
import { useContext } from "react";

const RunnerSchedulerTabs = () => {
    const { schedulerTab, setSchedulerTab } = useContext(RunnerContext);
    return (
        <div className="mt-[45px] w-full h-[60px] flex justify-center flex-row border-b-[1px] border-[#55689B] pl-3 pt-5 ">
            <ButtonTabInRunner
                isActive={schedulerTab === schedulerTabEnm.TimeBased}
                title="Time based"
                onClick={() => setSchedulerTab(schedulerTabEnm.TimeBased)}
            />
            <ButtonTabInRunner
                isActive={schedulerTab === schedulerTabEnm.EventBased}
                title="Event based"
                onClick={() => setSchedulerTab(schedulerTabEnm.EventBased)}
            />
        </div>
    );
};

export default RunnerSchedulerTabs;
