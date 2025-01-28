import { useMemo, useState, useContext } from "react";
import RunnerSchedulerTabs from "./RunnerSchedulerTabs";
import TimePeriodEntry from "./TimePeriodEntry";
import RunnerSchedulerQuickSetup from "./RunnerSchedulerQuickSetup";
import { updateScheduleInterval } from "@axios/apiCalls";
import { WizardContext } from "@contexts/WizardContext";

const SchedulerPage = () => {
	const [title, setTitle] = useState("");

	const { schedule, setSchedule, speccID } = useContext(WizardContext);

	const setNewInterval = async (interval) => {
		const newScheduleInterval = await updateScheduleInterval(
			schedule.id,
			interval,
		);

		if (newScheduleInterval.httpcode == 200) {
			setSchedule(newScheduleInterval.data);
		}
	};

	const [selectTime, setSelectTime] = useState({
		minute: schedule.interval,
		hour: "",
		dayMouth: "",
		mouth: "",
		dayWeek: "",
	});

	const handlerOnChangeTime = (event, key) => {
		setSelectTime((prev) => ({ ...prev, [key]: event.target.value }));
	};

	const timePeriod = useMemo(() => {
		let title = "";
		Object.keys(selectTime).forEach((key) => {
			if (!!selectTime[key].length) {
				title += !!title.length
					? `, every ${selectTime[key]} ${key}`
					: `Every ${selectTime[key]} ${key}`;
			}
		});
		if (!title.length) {
			title = "";
		}
		setTitle(title);
		return [
			{
				title: "Minute",
				value: selectTime.minute,
				onChange: (e) => handlerOnChangeTime(e, "minute"),
				description: null,
				period: "0-59",
			},
			{
				title: "Hour",
				value: selectTime.hour,
				onChange: (e) => handlerOnChangeTime(e, "hour"),
				description: null,
				period: "0-23",
			},
			{
				title: "Day",
				value: selectTime.dayMouth,
				onChange: (e) => handlerOnChangeTime(e, "day Month"),
				description: "Month",
				period: "0-31",
			},
			{
				title: "Month",
				value: selectTime.mouth,
				onChange: (e) => handlerOnChangeTime(e, "month"),
				description: null,
				period: "1-12",
			},
			{
				title: "Day ",
				value: selectTime.dayWeek,
				onChange: (e) => handlerOnChangeTime(e, "dayWeek"),
				description: "week",
				period: "1-7",
			},
		];
	}, [selectTime]);

	return (
		<div className="w-full bg-[#080808] m-4 p-3 rounded-base overflow-scroll flex flex-col justify-center items-center">
			<RunnerSchedulerTabs />
			<div className="text-[#808080] pl-[30px] pt-12 max-w-[473px]">
				<p className=" font-medium">
					Set the frequency of how often you want the integration to run, here
					is a longer text explainig this step etc etc etc
				</p>
				<div>
					<h3 className="mt-12 min-h-[130px] pb-5 text-4xl text-center font-semibold text-center">
						“{title}”
					</h3>
					<div className="flex justify-between px-5">
						{timePeriod.map((item) => (
							<TimePeriodEntry
								key={item.title + item.description}
								title={item.title}
								value={item.value}
								onChange={item.onChange}
								description={item.description}
								isActive={!!item.value.length}
								period={item.period}
							/>
						))}
					</div>
				</div>
				<div className="mt-[87px]">
					<RunnerSchedulerQuickSetup
						setSelectTime={setSelectTime}
						setNewIntervalFunc={setNewInterval}
					/>
				</div>
			</div>
		</div>
	);
};

export default SchedulerPage;
