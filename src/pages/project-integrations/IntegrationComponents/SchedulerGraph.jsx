import info from "@assets/icons/info.svg";
import toggleOval from "@assets/icons/toggle_oval.svg";
import caretOpen from "@assets/icons/caret-open.svg";
import { BarChart, Bar, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { data, sortingOptions, speccStatus } from "../list-data";
import timer from "@assets/icons/timer.svg";

export default function SchedulerGraph({ ...props }) {
    return (
        <div className="scheduler-container">
            <div class="schedulerContentWrapper">
                <div
                    onClick={() => {
                        props.setIsOpen(true);
                    }}
                    onKeyDown={() => {
                        props.setIsOpen(true);
                    }}
                    class="schedulerHeadingWrapper"
                >
                    <div class="schedulerText">Scheduler</div>

                    <img
                        src={info}
                        alt="info"
                        className="icon-grey-5"
                        width="14px"
                        height="14px"
                    />
                </div>
                <div class="scheduler-states-wrapper">
                    <div class="scheduler-state">
                        <div class="scheduler-frequency-container">
                            <img
                                src={toggleOval}
                                alt="toggle"
                                className="icon-grey-5"
                                width="18px"
                                height="18px"
                            />

                            <div class="ml-[2px] text-zinc-400 text-sm font-medium font-['Inter']">
                                Frequency
                            </div>
                        </div>
                        <div class="scheduler-state-container">
                            <div class="scheduler-state-text">
                                Set Frequency
                            </div>

                            <img
                                src={caretOpen}
                                alt="caret"
                                className="icon-grey-5 h-3 w-3"
                                width="14px"
                                height="14px"
                            />
                        </div>
                    </div>
                    <div className="emptyImageContainer h-[130px]">
                        {props.ifFrequencySet ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    width={150}
                                    height={40}
                                    data={data}
                                    margin={0}
                                    barGap={5}
                                >
                                    <Bar
                                        dataKey="uv"
                                        //onPointerEnter={}
                                        fill="#00DF9C"
                                        barSize={10}
                                        radius={[10, 10, 10, 10]}
                                    />

                                    <Tooltip />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : props.hasProject ? (
                            <div class="w-48 text-center text-zinc-400 text-sm font-medium font-['Inter']">
                                Activate one or more Speccs to see data
                                transferred
                            </div>
                        ) : (
                            <img
                                src={timer}
                                className="icon-grey-1"
                                alt="frequency"
                                width={60}
                                height={60}
                            />
                        )}
                    </div>
                    <div class="self-stretch grow shrink basis-0 flex-col justify-start items-start gap-[5px] flex">
                        <div className="scheduler-horizontal-line" />
                        <div className="setFrequencyText">Data transferred</div>
                        <div className="setFrequencyText">
                            Please set Frequency
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
