import noIntegration from "@assets/icons/no-integration.svg";
import start from "@assets/icons/start.svg";
import stop from "@assets/icons/stop.svg";
import trash from "@assets/icons/trash.svg";
import { fetchProjectErrors } from "@axios/projectApiCalls";
import SButton from "@components/SButton";
import SDialog from "@components/SDialog";
import SForm from "@components/SForm";
import SFormSelect from "@components/SFormSelect";
import SFormSelectStatus from "@components/SFormSelectStatus";
import ProjectWrapper, { ProjectContext } from "@contexts/ProjectContext";
import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { sortingOptions, speccStatus } from "./list-data";

import {
	copySpeccWithID,
	deleteGenericCRUDWithID,
	getGenericCRUDWithID,
	startSpecc,
	stopSpecc,
} from "@axios/apiCalls";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import CopySpeccModal from "./IntegrationModals/CopySpecc";
import DeleteSpeccModal from "./IntegrationModals/DeleteSpecc";
import NewSpeccModal from "./IntegrationModals/NewSpecc";
import SchedulingModal from "./IntegrationModals/Scheduling";
import ExecutionStats from "./Right/ExecutionStats";
import API from "./Top/API";
import Status from "./Top/Status";

const Wrapper = (props) => {
	const {
		projectSpeccs,
		projectID,
		destinationAPICustomName,
		sourceAPICustomName,
		sourceAPI,
		destinationAPI,
		projectName,
		isSourceAuthenticated,
		isDestinationAuthenticated,
		sourceAuthenticationType,
		destinationAuthenticationType,
	} = useContext(ProjectContext);

	const [errorResults, setErrorResults] = useState(null);

	const [selectedDate, setSelectedDate] = useState(null);
	const [selectedTab, setSelectedTab] = useState("Settings");
	const [loading, setLoading] = useState(false);
	const [hasData, setHasData] = useState(true);
	const [isOpen, setIsOpen] = useState(false);
	const [speccDialigIsOpen, setSpeccDialogIsOpen] = useState(false);
	const [speccModalType, setSpeccModalType] = useState("new");
	const navigate = useNavigate();
	const [liveSpeccCount, setLiveSpeccCount] = useState(0);
	const [stoppedSpeccCount, setStoppedSpeccCount] = useState(0);
	const [statusFilterValue, setStatusFilterValue] = useState([]);
	const [projectSpeccList, setProjectSpeccList] = useState([]);
	const [sortByValue, setSortByValue] = useState();
	const [searchValue, setSearchValue] = useState("");
	const [selectedSpecc, setSelectedSpecc] = useState(null);
	const [hoveredIndex, setHoveredIndex] = useState(null);

	useEffect(() => {
		(async () => {
			const errorRes = await fetchProjectErrors(projectID, selectedDate);
			setErrorResults(errorRes);
		})();
	}, [selectedDate, projectID]);

	const updateSpeccsList = (speccs) => {
		setProjectSpeccList(speccs);
	};

	const getStatusCount = () => {
		let stopCount = 0;
		let liveCount = 0;
		if (projectSpeccs && projectSpeccs.length > 0) {
			projectSpeccs.map((specc) => {
				if (specc.started === 1) {
					liveCount++;
				} else {
					stopCount++;
				}
			});
		}
		setLiveSpeccCount(liveCount);
		setStoppedSpeccCount(stopCount);
	};

	const getIsOpen = (value) => {
		setIsOpen(value);
	};

	useEffect(() => {
		setProjectSpeccList([...projectSpeccs]);
		getStatusCount();
	}, [projectSpeccs]);

	const getStatusFilters = (value) => {
		setStatusFilterValue(
			value.sort((a, b) => {
				if (a.toLowerCase() < b.toLowerCase()) return -1;
				if (a.toLowerCase() > b.toLowerCase()) return 1;
				return 0;
			}),
		);
	};

	const getSerchValue = (value) => {
		setSearchValue(value);
	};

	useEffect(() => {
		if (projectSpeccs.length > 0 && searchValue.length > 0) {
			let list = [];
			const temp = [...projectSpeccs];
			list = temp.filter((specc) => {
				return specc.name.toLowerCase().includes(searchValue.toLowerCase());
			});
			setProjectSpeccList([...list]);
		} else {
			setProjectSpeccList([...projectSpeccs]);
		}
	}, [searchValue, projectSpeccs]);

	useEffect(() => {
		if (projectSpeccs.length > 0 && sortByValue !== undefined) {
			let list = [];
			const temp = [...projectSpeccs];
			switch (sortByValue) {
				case "Specc Name":
					list = temp.sort((a, b) => {
						if (a.name < b.name) {
							return -1;
						}
						if (a.name > b.name) return 1;
						return 0;
					});
					break;
				case "Status":
					list = temp.sort((a, b) => {
						if (a.started > b.started) return -1;
						if (a.started < b.started) return 1;
						return 0;
					});
					break;
			}

			setProjectSpeccList([...list]);
		} else {
			setProjectSpeccList([]);
		}
	}, [sortByValue, projectSpeccs]);

	const getSortByValue = (value) => {
		setSortByValue(value);
	};

	useEffect(() => {
		if (projectSpeccs.length > 0 && statusFilterValue.length > 0) {
			let list = [];
			// setStatusFilterValue(
			//     statusFilterValue.sort(function (a, b) {
			//         if (a.toLowerCase() < b.toLowerCase()) return -1;
			//         if (a.toLowerCase() > b.toLowerCase()) return 1;
			//         return 0;
			//     })
			// );
			statusFilterValue.map((status) => {
				const temp = [...projectSpeccs];
				switch (status) {
					case "LIVE":
						list = [...list, ...temp.filter((specc) => specc.started === 1)];
						break;
					case "STOPPED":
						list = [...list, ...temp.filter((specc) => specc.started === 0)];

						break;
					default:
						list = [];
				}
			});
			setProjectSpeccList([...list]);
		} else {
			setProjectSpeccList([]);
		}
	}, [statusFilterValue, projectSpeccs]);

	const {
		register,
		formState: { errors },
		handleSubmit,
	} = useForm({
		mode: "onChange",
	});

	const closeSpeccModal = () => {
		setSpeccDialogIsOpen(false);
	};

	const getLastTransfered = (date) => {
		const dateTime = date; // Example ISO date string

		// Format the time
		const formattedTime = moment(dateTime).format("HH:mm");

		// Check if the date is today, yesterday, or another day
		const isToday = moment(dateTime).isSame(new Date(), "day");
		const isYesterday = moment(dateTime).isSame(
			moment().subtract(1, "days"),
			"day",
		);

		let dayString;
		if (isToday) {
			dayString = "Today";
		} else if (isYesterday) {
			dayString = "Yesterday";
		} else {
			dayString = moment(dateTime).format("YYYY-MM-DD");
		}

		return ` ${dayString} ${formattedTime}`;
	};

	const deleteSpecc = async () => {
		setLoading(true);
		await deleteGenericCRUDWithID("Speccs", selectedSpecc.id).then((res) => {
			updateSpeccsList(
				projectSpeccList.filter((specc) => specc.id !== selectedSpecc.id),
			);
			setLoading(false);
			toast.success("Specc deleted successfully!");
		});

		closeSpeccModal();
	};

	const copySpecc = async (name) => {
		setLoading(true);
		const copied = await copySpeccWithID(selectedSpecc.id, name);
		if (copied.newSpeccID) {
			const newList = await getGenericCRUDWithID("Speccs", copied.newSpeccID);
			setProjectSpeccList([...projectSpeccList, newList.data[0]]);
			toast.success("Specc copied successfully!");
			setLoading(false);
		}

		closeSpeccModal();
	};

	return (
		<React.Fragment>
			<SDialog isOpen={isOpen}>
				<SchedulingModal getIsOpen={getIsOpen} />
			</SDialog>
			<SDialog isOpen={speccDialigIsOpen}>
				{speccModalType === "new" ? (
					<NewSpeccModal
						closeSpeccModal={closeSpeccModal}
						projectName={projectName}
						projectID={projectID}
						setProjectSpeccList={setProjectSpeccList}
					/>
				) : speccModalType === "copy" ? (
					<CopySpeccModal
						closeSpeccModal={closeSpeccModal}
						copySpecc={(value) => copySpecc(value)}
						loading={loading}
					/>
				) : (
					<DeleteSpeccModal
						closeSpeccModal={closeSpeccModal}
						deleteSpecc={deleteSpecc}
						loading={loading}
						selectedSpecc={selectedSpecc}
					/>
				)}
			</SDialog>
			<div className="flex main-container gap-[10px]">
				<div className="flex justify-between">
					<div class="heading-container font-['inter'] text-[18px] pl-[11px]">
						{projectName}
					</div>
				</div>

				<div className="flex font-['Inter'] gap-[10px]">
					<div className="flex flex-col gap-[10px]">
						<div className="flex gap-[10px]">
							<API
								API={sourceAPI}
								name={sourceAPICustomName}
								number={1}
								isAuthenticated={isSourceAuthenticated}
								authenticationType={sourceAuthenticationType}
								projectID={projectID}
							/>
							<API
								API={destinationAPI}
								name={destinationAPICustomName}
								number={2}
								skipMargin={true}
								isAuthenticated={isDestinationAuthenticated}
								authenticationType={destinationAuthenticationType}
								projectID={projectID}
							/>
						</div>
						<div className="flex gap-[10px]">
							<Status
								status="stopped"
								count={stoppedSpeccCount}
								color="#ff3737"
							/>
							<Status status="live" count={liveSpeccCount} color="#00df9c" />
							<Status status="paused" count={0} color="#ff9a33" />
							<Status
								status="draft"
								count={0}
								color="#ea35fa"
								skipMargin={true}
							/>
						</div>
					</div>
					<div className="flex flex-grow">
						<ExecutionStats projectID={projectID} />
					</div>
				</div>
				<div className="bg-[#080808] rounded-[5px] p-[12px] min-h-[600px] flex flex-col">
					<div class="speccsText">Speccs</div>
					<SForm>
						<div class="filltersContainer">
							<SButton
								sType="button"
								onClick={() => {
									setSpeccModalType("new");
									setSpeccDialogIsOpen(true);
								}}
								className="h-[30px] px-[15px] py-2 bg-gradient-to-tr from-rose-400 to-fuchsia-600 rounded-[50px] shadow justify-center items-center gap-0.5 inline-flex"
							>
								<span className="grow shrink basis-0 text-center text-white text-xs font-semibold font-['Inter'] leading-[14px] tracking-tight">
									New specc
								</span>
							</SButton>

							<div class="filter-column-container status-dropdown cursor-pointer">
								<SFormSelectStatus
									options={speccStatus}
									getValue={getStatusFilters}
									buttonClassName={` ${
										projectSpeccList && projectSpeccList.length > 0
											? "sortBtn"
											: "sortBtnDisabled"
									} !text-[12px]`}
									className="w-[100%]"
									isFirstOptionSelected={false}
									arrowIcon="icon-pink"
									activeStyles={`${
										statusFilterValue.length < 0
											? "sortBtnActive"
											: "sortBtnActiveFilters"
									}`}
									inActiveStyles="sortBtn"
								/>
							</div>

							<div class="filter-column-container sort-dropdwon cursor-pointer">
								<SFormSelect
									name="sortby"
									register={register}
									label="Sort by"
									options={sortingOptions}
									getValue={getSortByValue}
									buttonClassName={` ${
										projectSpeccList && projectSpeccList.length > 0
											? "sortBtn"
											: "sortBtnDisabled"
									} w-[100%] !text-[12px]`}
									className="w-[100%]"
									arrowIcon="icon-pink"
									disableFirstSelection={true}
									activeStyles={`${
										sortByValue === ""
											? "sortBtnActive"
											: "sortBtnActiveFilters"
									}`}
									inActiveStyles="sortBtn"
								/>
							</div>
							<div
								class={`${
									projectSpeccs && projectSpeccs.length > 0
										? "filter-column-container"
										: "filter-column-disabled-container"
								} cursor-pointer`}
							>
								<div
									class={`${
										projectSpeccs && projectSpeccs.length > 0
											? "filter-svg-container"
											: "filter-svg-disabled-container"
									}`}
								>
									<img src={stop} alt="stop" className="icon-grey-5" />
								</div>
								<div class="filter-column-text">Stop all</div>
							</div>
							<div
								class={`${
									projectSpeccs && projectSpeccs.length > 0
										? "filter-column-container"
										: "filter-column-disabled-container"
								} cursor-pointer`}
							>
								<div class="filter-svg-container">
									<img src={start} alt="start" className="icon-grey-5" />
								</div>
								<div class="filter-column-text">Start all</div>
							</div>
						</div>
					</SForm>
					{projectSpeccList && projectSpeccList.length > 0 ? (
						<div className="specc-table-wrapper">
							<table className="flex flex-col rounded-base w-[100%]">
								<tr className="px-[15px] py-[25px] grid grid-flow-col grid-cols-7 rounded-tl-[5px] rounded-tr-[5px] text-white text-xs font-bold font-['Inter'] leading-3 tracking-tight border border-grey-2 hover:border-custom-pink hover:bg-custom-pink/10">
									<td className="rounded-tl-[5px]  text-white text-xs font-bold font-['Inter'] leading-3 tracking-tight">
										Specc name
									</td>
									<td className=" text-white text-xs font-bold font-['Inter'] leading-3 tracking-tight">
										Node API 1
									</td>
									<td className=" text-white text-xs font-bold font-['Inter'] leading-3 tracking-tight">
										Node API 2
									</td>
									<td className=" text-white text-xs font-bold font-['Inter'] leading-3 tracking-tight">
										Status
									</td>
									<td className="   text-white text-xs font-bold font-['Inter'] leading-3 tracking-tight">
										Last run
									</td>
									<td className="   text-white text-xs font-bold font-['Inter'] leading-3 tracking-tight">
										Schedule
									</td>
									<td className="  rounded-tr-[5px] text-white text-xs font-bold font-['Inter'] leading-3 tracking-tight">
										Executions
									</td>
								</tr>

								{projectSpeccList.map((item, index) => {
									return (
										<>
											<tr
												key={`item${item.name}`}
												className={`px-[15px] py-[16px] grid grid-flow-col grid-cols-7 text-white text-xs font-bold font-['Inter'] leading-3 tracking-tight border border-grey-2 hover:border-custom-pink hover:bg-custom-pink/10 items-center last:rounded-b-base`}
												onMouseEnter={() => {
													setHoveredIndex(index);
												}}
												onMouseLeave={() => {
													setHoveredIndex(null);
												}}
											>
												<td
													className={`specc-td-hover bg-opacity-50 rounded-tl-[5px]  text-white text-xs font-normal font-['Inter'] leading-3 tracking-tight`}
												>
													{item.name}
												</td>
												<td
													className={` text-white text-xs font-normal font-['Inter'] leading-3 tracking-tight`}
												>
													{item.sourceParentNode?.name}
												</td>
												<td
													className={` text-white text-xs font-normal font-['Inter'] leading-3 tracking-tight`}
												>
													{item.destinationParentNode?.name}
												</td>
												<td
													className={` text-white text-xs font-normal font-['Inter'] leading-3 tracking-tight`}
												>
													<div className=" px-[5px] py-[3px] items-left flex">
														{item.started === 1 ? (
															<div
																className={`text-[#00df9c]  rounded-[3px]   px-[5px] py-[3px] text-[11px] font-semibold font-['Inter'] uppercase leading-3 tracking-tight`}
															>
																Live
															</div>
														) : (
															<div
																className={`text-[#ff3737]  rounded-[3px]   px-[5px] py-[3px] text-[11px] font-semibold font-['Inter'] uppercase leading-3 tracking-tight`}
															>
																Stopped
															</div>
														)}
													</div>
												</td>
												<td
													className={`text-white text-xs font-normal font-['Inter'] leading-3 tracking-tight`}
												>
													{item.lastRun ? item.lastRun.start : "Never"}
												</td>
												{hoveredIndex !== index ? (
													<>
														<td className="text-white text-xs font-normal font-['Inter'] leading-3 tracking-tight">
															Schedule
														</td>
														<td className="rounded-tr-[5px] text-white text-xs font-normal font-['Inter'] leading-3 tracking-tight">
															Executions
														</td>
													</>
												) : (
													<>
														<td
															className={`w-full grid grid-flow-row items-center justify-end col-span-2 rounded-tr-[5px] text-white text-xs font-normal font-['Inter'] leading-3 tracking-tight h-min`}
														>
															<div className="flex justify-between w-full gap-3">
																<div
																	className="hover:bg-[#D32DCA80] cursor-pointer flex justify-center"
																	onClick={async () => {
																		const res = await startSpecc(item.id);
																		if (res.success) {
																			setProjectSpeccList(
																				projectSpeccList.map((specc) => {
																					if (specc.id === item.id) {
																						specc.started = 1;
																					}
																					return specc;
																				}),
																			);
																		} else {
																		}
																	}}
																	onKeyDown={() => {}}
																	onKeyUp={() => {}}
																>
																	<img
																		src={start}
																		alt="start"
																		className="icon-white"
																	/>
																</div>
																<div
																	onClick={async () => {
																		await stopSpecc(item.id);
																		setProjectSpeccList(
																			projectSpeccList.map((specc) => {
																				if (specc.id === item.id) {
																					specc.started = 0;
																				}
																				return specc;
																			}),
																		);
																	}}
																	onKeyDown={() => {}}
																	onKeyUp={() => {}}
																	className="hover:bg-[#D32DCA80] p-[5px] cursor-pointer flex justify-center"
																>
																	<img
																		src={stop}
																		alt="stop"
																		className="icon-white"
																	/>
																</div>

																<div
																	onClick={() => {
																		setSelectedSpecc(item);
																		setSpeccModalType("delete");
																		setSpeccDialogIsOpen(true);
																	}}
																	onKeyDown={() => {
																		setSelectedSpecc(item);
																		setSpeccModalType("delete");
																		setSpeccDialogIsOpen(true);
																	}}
																	className="hover:bg-[#D32DCA80] p-[5px] cursor-pointer flex justify-center"
																>
																	<img
																		src={trash}
																		alt="delete"
																		className="icon-white"
																	/>
																</div>

																<SButton
																	sType="button"
																	onClick={() => {
																		navigate(
																			`/specc/${item.id}/transformation`,
																		);
																	}}
																	className=" p-[5px] bg-[#D32DCA80] rounded-[3px] justify-center items-center gap-2.5 inline-flex"
																>
																	<span className="text-white text-xs font-semibold font-['Inter'] leading-3 tracking-tight">
																		Open
																	</span>
																</SButton>
															</div>
														</td>
													</>
												)}
											</tr>
										</>
									);
								})}
							</table>
						</div>
					) : (
						<div class="flex-col flex-grow justify-center items-center gap-5 flex">
							<div class="flex-col justify-center items-center gap-2.5 flex">
								<img
									src={noIntegration}
									alt="no integration"
									width="50px"
									height="50px"
								/>

								<div class="text-center text-white text-base font-bold font-['Inter'] leading-tight tracking-tight">
									No Speccs yet!
								</div>
								<div class="text-center text-white text-xs font-normal font-['Inter'] leading-[14px]">
									Create a new integration from scratch or use <br />
									AI or a template to get started.
								</div>
							</div>
							<div class="p-2 rounded-[5px] justify-start items-center gap-[5px] inline-flex">
								<div class="h-[15px] pl-0.5 pr-[3px] justify-center items-center flex">
									<div class="h-[15px] relative flex-col justify-start items-start flex" />
								</div>
								<SButton
									sType="button"
									onClick={() => {
										setSpeccModalType("new");
										setSpeccDialogIsOpen(true);
									}}
									className="h-[30px] px-[15px] py-2 bg-gradient-to-tr from-rose-400 to-fuchsia-600 rounded-[50px] shadow justify-center items-center gap-0.5 inline-flex"
								>
									<span className="grow shrink basis-0 text-center text-white text-xs font-semibold font-['Inter'] leading-[14px] tracking-tight">
										New specc
									</span>
								</SButton>
							</div>
						</div>
					)}
				</div>
			</div>
		</React.Fragment>
	);
};

export default function ProjectIntegrations(props) {
	return (
		<ProjectWrapper {...props}>
			<Wrapper />
		</ProjectWrapper>
	);
}
