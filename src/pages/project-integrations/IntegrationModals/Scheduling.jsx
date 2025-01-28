import React, { useEffect, useState, useContext, useRef } from "react";
import cross from "@assets/icons/cross.svg";
import toggleOval from "@assets/icons/toggle_oval.svg";
import SButton from "@components/SButton";
import SForm from "@components/SForm";
import SFormSelect from "@components/SFormSelect";
import SCalendar from "@components/SCalendar";
import calendar from "@assets/icons/calendar.svg";
import { useForm } from "react-hook-form";
import {
	strategy,
	repeat,
	endOptions,
	days,
	hoursOptions,
	minutesOptions,
	hoursOfDay,
	months,
	noOfMinutes,
	noOfWeeks,
	noOfDays,
	dayOfWeek,
	weekDays,
	noOfHours,
} from "../list-data";
import moment from "moment";
import SRadioGroup from "@components/SRadioGroup";
import { Radio } from "react-aria-components";
import { postGenericCRUDWithID } from "@/axios/apiCalls";
import { WizardContext } from "@/contexts/WizardContext";
import { every } from "lodash";

export default function SchedulingModal(props) {
	const { schedulerRef } = props;

	console.log('Schedulerref');
	console.log(schedulerRef);
	const [calendarIsOpen, setCalendarIsOpen] = useState(false);
	const [endCalendarIsOpen, setEndCalendarIsOpen] = useState(false);
	const [currentEveryList, setCurrentEveryList] = useState([]);
	const [formState, setFormState] = useState(null);
	const [resultText, setResultText] = useState("");
	const [reset, setReset] = useState(false);
	const { register, watch, handleSubmit } = useForm({
		mode: "onChange",
	});

	const { schedule, setSchedule } = useContext(WizardContext);


	const multipliers = {
		Minutely: 60,
		Hourly: 3600,
		Daily: 86400,
		Weekly: 604800,
		Monthly: 2419200,
		Yearly: 29030400,
	};

	const [result, setResult] = useState({
		strategy: strategy[0],
		start: new Date(),
		repeat: repeat[0],
		every: {
			when: null,
			on: {
				weekDay: null,
				dateOfMonth: {
					isSelected: false,
					selectedDay: noOfDays[0],
				},
				dayOfMonth: {
					isSelected: false,
					dayOfWeek: dayOfWeek[0],
					weekDay: weekDays[0],
				},
			},
			before: null,
			after: null,
		},
		end: new Date(),
		endWhen: endOptions[0],
	});

	const updateSchedule = async () => {
		const interval = result.every.selected * multipliers[result.repeat];

		const newSchedule = await postGenericCRUDWithID("Schedule", schedule.id, {
			interval: interval,
			repeat: result.repeat,
			every: result.every.selected,
		});

		setSchedule(newSchedule.data);

		props.getIsOpen(false);
	};

	//improve this logic

	useEffect(() => {
		let temp = "";
		let repeatText = "";
		switch (result.repeat) {
			case "Minutely":
				repeatText = `${result.every.selected} ${result.every.selected > 1 ? "Minutes" : "Minute"
					}`;
				break;
			case "Hourly":
				repeatText = `${result.every.selected} ${result.every.selected === 1 ? "Hour" : "Hours"
					}`;
				break;
			case "Daily":
				repeatText = `${result.every.selected} ${result.every.selected === 1 ? "Day" : "Days"
					}`;
				break;
			case "Weekly":
				repeatText = ` 
          ${result.every.selected === 1
						? "Once a week"
						: `${result.every.selected} Weeks`
					}
        `;
				break;
			case "Monthly":
				repeatText = `${result.every.selected === 1
					? "month"
					: `${result.every.selected} Months`
					}`;
				break;
			case "Yearly":
				repeatText = `year in ${result.every.selected}`;
				break;
			default:
				repeatText = "";
		}
		if (result.strategy === "Time based") {
			temp = `Occurs every ${repeatText.toLowerCase()} starting ${moment(
				result.start,
			).format("dddd, DD MMMM YYYY")}`;
		} else {
			temp = "Event URL";
		}
		setResultText(temp);
	}, [result]);

	useEffect(() => {
		const subscription = watch(handleSubmit(createClickFunction));
		return () => subscription.unsubscribe();
	}, [handleSubmit, watch]);

	const createClickFunction = async (data) => {
		setFormState(data);
	};

	useEffect(() => {
		setCurrentEveryList(getFrequencyOptions());
	}, [result.repeat]);

	const getFrequencyOptions = () => {
		let list = [];
		switch (result.repeat) {
			case "Minutely":
				list = noOfMinutes;
				result.every.selected = noOfMinutes[0];
				break;
			case "Hourly":
				list = noOfHours;
				result.every.selected = noOfHours[0];
				break;
			case "Daily":
				list = noOfDays;
				result.every.selected = noOfDays[0];
				break;
			case "Weekly":
				list = noOfWeeks;
				result.every.selected = noOfWeeks[0];
				break;
			case "Monthly":
				list = noOfWeeks;
				result.every.selected = noOfWeeks[0];
				break;
			default:
				list = [...months];
				result.every.selected = months[0];
		}

		return list;
	};


	const getEndDateValue = (value) => {
		setResult((prev) => ({
			...prev,
			end: value,
		}));

		//setEndDateValue(value);
	};

	useEffect(() => {
		setCalendarIsOpen(false);
	}, [result.start]);

	useEffect(() => {
		setEndCalendarIsOpen(false);
	}, [result.end]);

	const getRepeatValue = (value) => {
		setResult((prev) => ({
			...prev,
			repeat: value,
		}));
		//setRepeatValue(value);
	};

	const getStrategyValue = (value) => {
		setResult((prev) => ({
			...prev,
			strategy: value,
		}));
		//setStrategyValue(value);
	};

	const getEndValue = (value) => {
		setResult((prev) => ({
			...prev,
			endWhen: value,
		}));
		//setEndValue(value);
	};

	const getEveryValue = (value) => {
		setResult((prev) => ({
			...prev,
			every: {
				...prev.every,
				selected: value,
			},
		}));

		//setEveryValue(value);
	};

	const getDateOfWeekValue = (value) => {
		setResult((prev) => ({
			...prev,
			every: {
				...prev.every,
				on: {
					...prev.every.on,
					dateOfMonth: value,
				},
			},
		}));
		//setDayOfWeekValue(value);
	};



	const getSelectedDay = (value) => {
		setResult((prev) => ({
			...prev,
			every: {
				...prev.every,
				on: {
					...prev.every.on,
					weekDay: value,
				},
			},
		}));
	};

	const getBeforeValue = (value) => {
		setResult((prev) => ({
			...prev,
			every: {
				...prev.every,
				before: value,
			},
		}));
		//setBeforeValue(value);
	};

	const getAfterValue = (value) => {
		setResult((prev) => ({
			...prev,
			every: {
				...prev.every,
				after: value,
			},
		}));
		//setAfterValue(value);
	};

	const getMonthOnValue = (value) => {
		setResult((prev) => ({
			...prev,
			every: {
				...prev.every,
				on: {
					...prev.every.on,
					dateOfMonth: {
						isSelected: true,
						selectedDay: value,
					},
				},
			},
		}));
	};

	const getDayOfWeekValue = (value) => {
		setResult((prev) => ({
			...prev,
			every: {
				...prev.every,
				on: {
					...prev.every.on,
					dayOfMonth: {
						isSelected: true,
						weekDay: value,
					},
				},
			},
		}));
	};

	const getWeekDayValue = (value) => {
		setResult((prev) => ({
			...prev,
			every: {
				...prev.every,
				on: {
					...prev.every.on,
					dayOfMonth: {
						isSelected: true,
						dayOfWeek: value,
					},
				},
			},
		}));
	};



	const getDateOfMonthComponent = (value) => {
		return (
			<div className="flex gap-[20px] items-center ">
				{/* <input
          type="radio"
          name={value}
          value={value}
          onChange={(val) => {
            selectMonthOption(value);
          }}
          className="monthly-frequency-radio h-[10px] w-[10px] bg-blue-600"
          checked={result.every.on.dateOfMonth.isSelected === true}
        /> */}
				<div className={"flex items-center justify-between  gap-[20px] z-[12]"}>
					<SFormSelect
						options={noOfDays}
						getValue={getMonthOnValue}
						buttonClassName="!gap-[30px]"
					/>
				</div>
				<div className=" gap-[10px]">
					<div class="text-white text-sm font-medium font-['Inter']">day</div>
				</div>
			</div>
		);
	};

	const getDayOfWeek = (value) => {
		return (
			<div className="flex gap-[2 0px]  items-center  gap-[20px]">
				{/* <input
          type="radio"
          name={value}
          value={value}
          onChange={(val) => {
            selectMonthOption(value);
          }}
          className="monthly-frequency-radio h-[10px] w-[10px]"
          checked={result.every.on.dayOfMonth.isSelected === true}
        /> */}

				<div className={"flex items-center justify-between  z-[11]"}>
					<SFormSelect
						options={dayOfWeek}
						getValue={getDayOfWeekValue}
						buttonClassName="!gap-[30px]"
					/>
				</div>
				<div className={"flex items-center justify-between  z-[11]"}>
					<SFormSelect
						options={weekDays}
						getValue={getWeekDayValue}
						buttonClassName="!gap-[30px]"
					/>
				</div>
			</div>
		);
	};

	const clearSchedule = () => {
		const temp = {
			strategy: strategy[0],
			start: new Date(),
			repeat: repeat[0],
			every: {
				when: null,
				on: {
					weekDay: null,
					dateOfMonth: {
						isSelected: false,
						selectedDay: noOfDays[0],
					},
					dayOfMonth: {
						isSelected: false,
						dayOfWeek: dayOfWeek[0],
						weekDay: weekDays[0],
					},
				},
				before: null,
				after: null,
			},
			end: new Date(),
			endWhen: endOptions[0],
		};
		setResult(temp);
		setReset(true);
	};

	console.log('Scjediu');
	console.log(result);

	return (
		<div className="flex flex-col  bg-[#080808] rounded-[5px] border border-neutral-700 " ref={schedulerRef}>
			<div className="flex justify-between p-[20px] border-b border-neutral-700">
				<div class="text-white font-medium font-['Inter'] leading-none tracking-tight">
					Scheduler
				</div>
				<img
					onClick={() => props.getIsOpen(false)}
					onKeyDown={() => props.getIsOpen(false)}
					src={cross}
					className="icon-grey-5 cursor-pointer"
					alt="cross"
					height="14px"
					width="14px"
				/>
			</div>
			{/* <div class="pt-[20px] pl-[20px] text-neutral-200 text-xs font-medium font-['Inter'] leading-none tracking-tight">
        Selected schedule will overwrite project schedule
      </div> */}
			<SForm onSubmit={handleSubmit(createClickFunction)} className="p-[20px]">
				<table className=" border-separate scheduler-table">
					<tbody>
						<tr className=" pb-[0px]">
							<td className="labelTd">
								<div class="text-zinc-400  font-medium font-['Inter']">
									Strategy
								</div>
							</td>
							<td className="flex items-center gap-[40px] w-[130px] z-[16]">
								<SFormSelect
									name="strategy"
									register={register}
									getValue={getStrategyValue}
									options={strategy}
									buttonClassName="!gap-[30px]"
								/>
							</td>
						</tr>
						{result.strategy === "Time based" ? (
							<>
								{/* 
								<tr className=" pb-[0px]">
									<td className="labelTd">
										<div class="text-zinc-400  font-medium font-['Inter']">
											Start
										</div>
									</td>
									<td className="flex items-start gap-[40px] w-[130px]">
										<div className="date-dropdown gap-[10px]">
											<span className="text-white  font-medium font-['Inter']">
												
												{moment(result.start).format("MM-DD-YYYY")}
											</span>
											<img
												onClick={() => setCalendarIsOpen(!calendarIsOpen)}
												onKeyDown={() => setCalendarIsOpen(!calendarIsOpen)}
												src={calendar}
												className="icon-grey-5"
												alt="caret"
												height="16px"
												width="16px"
											/>
											{calendarIsOpen && (
												<div className="date-picker">
													<SCalendar
														getDateFromCalendar={getStartDateValue}
														dateValue={result.start}
													/>
												</div>
											)}
										</div>
									</td>
								</tr>
                */}
								<tr className=" pb-[0px]">
									<td className="labelTd">
										<div class="text-zinc-400  font-medium font-['Inter']">
											Repeat
										</div>
									</td>
									<td className="flex items-center gap-[40px]  z-[14]">
										<SFormSelect
											name="repeat"
											getValue={getRepeatValue}
											options={repeat}
											buttonClassName="!gap-[30px]"
											register={register}
											reset={reset}
											selectedValue={schedule.repeat}
										/>
									</td>
								</tr>
								<tr className=" pb-[0px]">
									<td className="labelTd">
										<div class="text-zinc-400  font-medium font-['Inter']">
											Every
										</div>
									</td>
									{/* <td className="flex items-center gap-[40px] w-[130px]"> */}
									<td>
										<div
											className={"flex  gap-[20px] justify-start items-center "}
										>
											<div className={"flex  items-center gap-[20px]  z-[13]"}>
												<SFormSelect
													name="every"
													options={currentEveryList}
													getValue={getEveryValue}
													buttonClassName="!gap-[30px]"
													register={register}
													selectedValue={schedule.every}
												/>
											</div>
											<div className=" gap-[10px]">
												<div class="text-white  font-medium font-['Inter']">
													{result.repeat === "Minutely"
														? "minutes(s)"
														: result.repeat === "Hourly"
															? "hours(s)"
															: result.repeat === "Weekly" ||
																result.repeat === "Monthly"
																? "weeks(s)"
																: result.repeat === "Daily"
																	? "days(s)"
																	: ""}
												</div>
											</div>
										</div>
									</td>
								</tr>
								{(result.repeat === "Weekly" ||
									result.repeat === "Monthly" ||
									result.repeat === "Yearly") && (
										<tr className=" pb-[0px]">
											<td className="labelTd">
												<div class="text-zinc-400  font-medium font-['Inter']">
													On
												</div>
											</td>
											<td className="flex items-center gap-[40px] w-[50px] z-[12]">
												{result.repeat === "Weekly" && (
													<div className="flex gap-[5px]">
														{days.map((day, index) => (
															<div
																key={day}
																onClick={() => getSelectedDay(index)}
																onKeyDown={() => getSelectedDay(index)}
																class={`cursor-pointer w-[30px] h-[30px] rounded-[50px]  justify-center items-center inline-flex ${result.every.on.weekDay === index
																	? "bg-fuchsia-500"
																	: "bg-transparent border border-zinc-400"
																	}`}
															>
																<div class="w-[30px] h-[30px] rounded-[50px] justify-center items-center gap-2.5 flex">
																	<div
																		class={` text-base font-semibold font-['Inter'] leading-[14px] tracking-tight ${result.every.on.weekDay === index
																			? "text-white"
																			: "text-zinc-400"
																			}`}
																	>
																		{day}
																	</div>
																</div>
															</div>
														))}
													</div>
												)}
												{(result.repeat === "Monthly" ||
													result.repeat === "Yearly") && (
														<SRadioGroup
															defaultValue="date-of-month"
															getValue={getMonthOnValue}
														>
															<Radio value="date-of-month">
																{getDateOfMonthComponent}
															</Radio>
															<Radio value="day-of-month">{getDayOfWeek}</Radio>
														</SRadioGroup>
													)}
											</td>
										</tr>
									)}

								{result.repeat !== "Minutely" && result.repeat !== "Hourly" && (
									<tr className=" pb-[0px]">
										<td className="labelTd">
											<div class="text-zinc-400  font-medium font-['Inter']">
												When
											</div>
										</td>
										<td className="flex items-center gap-[40px] w-[130px] z-[11]">
											<div
												className={`flex gap-[40px] justify-between items-center  gap-[20px]
                                                                }`}
											>
												<div
													className={
														"flex items-center justify-between   z-[10]"
													}
												>
													<SFormSelect
														name="hours"
														options={hoursOptions}
														getValue={getDateOfWeekValue}
														buttonClassName="!gap-[30px]"
														register={register}
													/>
												</div>
												<div
													className={
														"flex items-center justify-between   z-[9]"
													}
												>
													<SFormSelect
														name="minutes"
														options={minutesOptions}
														getValue={getWeekDayValue}
														buttonClassName="!gap-[30px]"
														register={register}
													/>
												</div>
											</div>
										</td>
									</tr>
								)}

								<tr className=" pb-[0px]">
									<td className="labelTd">
										<div class="text-zinc-400  font-medium font-['Inter']">
											End
										</div>
									</td>
									{/* <td className="flex items-center gap-[40px] w-[130px]"> */}
									<td>
										<div className="flex gap-[20px] justify-start items-center">
											<div className="flex items-center gap-[20px]  z-[8]">
												<SFormSelect
													name="endDate"
													options={endOptions}
													getValue={getEndValue}
													buttonClassName="!gap-[30px]"
													register={register}
													className="w-[20%]"
												/>
											</div>
											<div className="date-end-dropdown gap-[10px]">
												<span className="text-white  font-medium font-['Inter']">
													{/* {moment(endDateValue).format(
                                                "MM-DD-YYYY"
                                            )} */}
													{moment(result.end).format("MM-DD-YYYY")}
												</span>
												<img
													onClick={() =>
														setEndCalendarIsOpen(!endCalendarIsOpen)
													}
													onKeyDown={() =>
														setEndCalendarIsOpen(!endCalendarIsOpen)
													}
													src={calendar}
													className="icon-grey-5"
													alt="caret"
													height="16px"
													width="16px"
												/>
												{endCalendarIsOpen && (
													<div className="date-end-picker">
														<SCalendar
															getDateFromCalendar={getEndDateValue}
															dateValue={result.end}
														/>
													</div>
												)}
											</div>
										</div>
									</td>
								</tr>
								{(result.repeat === "Minutely" ||
									result.repeat === "Hourly") && (
										<tr className=" pb-[0px]">
											<td className="labelTd">
												<div class="text-zinc-400  font-medium font-['Inter']">
													Before
												</div>
											</td>
											<td className="flex items-center gap-[40px] w-[130px] z-[7]">
												<SFormSelect
													name="before"
													getValue={getBeforeValue}
													options={hoursOfDay}
													buttonClassName="!gap-[30px]"
													register={register}
												/>
											</td>
										</tr>
									)}
								{(result.repeat === "Minutely" ||
									result.repeat === "Hourly") && (
										<tr className=" pb-[0px]">
											<td className="labelTd">
												<div class="text-zinc-400  font-medium font-['Inter']">
													After
												</div>
											</td>
											<td className="flex items-center gap-[40px] w-[130px] z-[6]">
												<SFormSelect
													name="after"
													getValue={getAfterValue}
													options={hoursOfDay}
													buttonClassName="!gap-[30px]"
													register={register}
												/>
											</td>
										</tr>
									)}
								<div class="text-zinc-400 text-xs font-medium font-['Inter'] mt-5">
									{resultText}
								</div>
								<div
									onClick={() => clearSchedule()}
									onKeyDown={() => clearSchedule()}
									class=" text-main-pink-1 text-xs font-medium font-['Inter'] pb-[10px] cursor-pointer"
								>
									Revert to Project Schedule
								</div>
							</>
						) : (
							<>
								<tr className=" pb-[0px] pt-[10px]">
									<td className="labelTd">
										<div class="text-zinc-400  font-medium font-['Inter']">
											Event URL
										</div>
									</td>
									<td className="flex items-center gap-[40px]  z-[14]">
										<div class="text-zinc-400  font-medium font-['Inter']">
											Please generate URL
										</div>
									</td>
								</tr>
								<div className="flex gap-[8px] my-[40px] cursor-pointer ">
									<img
										src={toggleOval}
										alt="toggle-oval"
										className="icon-pink h-[14px] w-[14px]"
									/>
									<div class="text-fuchsia-500 text-xs font-medium font-['Inter']">
										Generate new URL
									</div>
								</div>
							</>
						)}
					</tbody>
				</table>

				<div className="flex gap-[10px] justify-end pt-3">
					<SButton
						sType="button"
						onClick={() => props.getIsOpen(false)}
						className="w-[110px] h-[30px] px-[15px] py-2 bg-neutral-700 rounded-[50px] shadow justify-center items-center gap-0.5 inline-flex"
					>
						<span className="grow shrink basis-0 text-center text-white text-xs font-semibold font-['Inter'] leading-[14px] tracking-tight">
							Cancel
						</span>
					</SButton>
					<SButton
						sType="submit"
						onClick={() => {
							updateSchedule();
						}}
						className="w-[110px] h-[30px] px-[15px] py-2 bg-gradient-to-tr from-rose-400 to-fuchsia-600 rounded-[50px] shadow justify-center items-center gap-0.5 inline-flex"
					>
						<span className="grow shrink basis-0 text-center text-white text-xs font-semibold font-['Inter'] leading-[14px] tracking-tight">
							Save
						</span>
					</SButton>
				</div>
			</SForm>
		</div>
	);
}
