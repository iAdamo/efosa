import SDatePickerRange from "@/components/SDatePickerRange";
import notAuthenticated from "@assets/icons/not-authenticated.svg";
import warning from "@assets/icons/warning-yellow.svg";
import success from "@assets/icons/success.svg";
import { Bar, BarChart, ResponsiveContainer } from "recharts";
import { data, sortingOptions, speccStatus } from "../list-data";
import {
	endOfMonth,
	startOfMonth,
	today,
	getLocalTimeZone,
	parseDate,
} from "@internationalized/date";
import { useEffect } from "react";
import { fetchExecutionSummary } from "@/axios/apiCalls";
import { useState } from "react";
export default function ExecutionStats(props) {
	const now = today(getLocalTimeZone());
	const { projectID } = props;

	const [executionSummary, setExecutionSummary] = useState(null);
	const defaultStart = now.subtract({ months: 1 });
	const defaultEnd = now.subtract({ months: 2 });

	const updateExecutionSummary = async (event) => {
		const start = event?.start ?? defaultStart;
		const end = event?.end ?? defaultEnd;

		const executionSummary = await fetchExecutionSummary(
			"all",
			"speccs",
			{
				start: start,
				end: end,
			},
			projectID,
		);
		setExecutionSummary(executionSummary);
	};

	return (
		<>
			<div className="flex-grow h-[220px] relative bg-[#111111] rounded-[5px] flex pl-[22px] pt-[15px] pb-[27px]">
				<div className="flex flex-col pt-[15px]">
					<div>
						<ExecutionStat
							number={
								executionSummary != null
									? executionSummary?.runStatistics.errors
									: 0
							}
							text={"Errors"}
							icon={notAuthenticated}
							color={"#FF3737"}
						/>
					</div>
					<div className="flex mt-[50px]">
						<ExecutionStat
							number={
								executionSummary != null
									? executionSummary?.runStatistics.warnings
									: 0
							}
							text={"Warnings"}
							icon={warning}
							color={"#FF9A33"}
						/>
						<ExecutionStat
							number={
								executionSummary != null
									? executionSummary?.runStatistics.success
									: 0
							}
							text={"Success"}
							icon={success}
							color={"#00DF9C"}
						/>
					</div>
				</div>
				<div className="flex-grow flex">
					<div className="flex-grow text-center flex flex-col">
						<div>
							<SDatePickerRange
								onChange={(e) => updateExecutionSummary(e)}
								defaultValue={{
									start: now,
									end: now,
								}}
							/>
						</div>
						<div className="flex-grow pt-[50px] items-center pr-[50px]">
							<ResponsiveContainer width="100%" height="100%">
								<BarChart
									width={"100%"}
									height={"100%"}
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
								</BarChart>
							</ResponsiveContainer>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

function ExecutionStat(props) {
	const { number, text, icon, color } = props;
	return (
		<>
			<div className="w-[140px] h-[65px] flex flex-col">
				<div
					className={`text-[40px] h-[40px] ${
						number > 0 ? "text-[" + color + "]" : "text-[#8c8c8c]"
					}
text-[40px]
font-normal
font-['Inter']`}
				>
					{number}
				</div>
				<div className="align-baseline">
					<img className="inline pb-[5px] pr-[5px] pl-[5px]" src={icon} />{" "}
					{text}
				</div>
			</div>
		</>
	);
}
