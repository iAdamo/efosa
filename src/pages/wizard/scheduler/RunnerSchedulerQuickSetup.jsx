import { useMemo, useState } from "react";

const RunnerSchedulerQuickSetup = ({ setSelectTime, setNewIntervalFunc }) => {
	const [activeQuickSetup, setActiveQuickSetup] = useState("");
	const [isShowButtons, setIsShowButtons] = useState(true);

	const handlerButtonClick = (item) => {
		const isActive = activeQuickSetup === item.title;
		setActiveQuickSetup(isActive ? "" : item.title);
		setSelectTime((prev) => ({
			...prev,
			[item.parentKey]: isActive ? "" : item.value,
		}));
	};

	const quickSetupButtons = useMemo(
		() => [
			{ title: "Every 5 minute", parentKey: "minute", value: "5" },
			{ title: "Every 30 minute", parentKey: "minute", value: "30" },
			{ title: "Every 60 minute", parentKey: "hour", value: "1" },
			{
				title: "first day of every month",
				parentKey: "dayMouth",
				value: "1",
			},
			{ title: "15th every month", parentKey: "dayMouth", value: "15" },
			{
				title: "last day of every month",
				parentKey: "dayMouth",
				value: "30",
			},
		],
		[],
	);
	return (
		<div className="text-[#55689B]">
			<div>
				<button
					onClick={() => setIsShowButtons(!isShowButtons)}
					type="button"
					className="flex items-center gap-2 font-semibold text-sm mb-5"
				>
					Quick Setup
					<div className={`${isShowButtons ? "rotate-180" : ""}`}>v</div>
				</button>
			</div>
			<div className="flex gap-2.5 flex-wrap">
				{isShowButtons &&
					quickSetupButtons.map((item) => (
						<button
							className={`border border-[#55689B] text-xs mb-2 font-medium rounded-md h-[18px] px-1.5 ${
								activeQuickSetup === item.title ? "bg-[#ECF6FF]" : ""
							}`}
							onClick={() => {
								handlerButtonClick(item);
								setNewIntervalFunc(5);
							}}
						>
							{item.title}
						</button>
					))}
			</div>
		</div>
	);
};

export default RunnerSchedulerQuickSetup;
