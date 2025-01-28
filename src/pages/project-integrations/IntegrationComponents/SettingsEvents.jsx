import React, { useEffect, useState, useContext, useRef } from "react";
import addRounded from "@assets/icons/add-rounded.svg";
import success from "@assets/icons/success.svg";
import SButton from "@components/SButton";
import rerun from "@assets/icons/rerun.svg";
import eye from "@assets/icons/eye.svg";
import aiIcon from "@assets/icons/ai-icon.svg";
import calendarcheck from "@assets/icons/calendar-check.svg";
import Variables from "../Variables";

export default function SettingsEvents({ ...props }) {
	const [selectedTab, setSelectedTab] = useState("Settings");
	const temp = [1, 2, 3, 4, 5];

	const getSettingsComponent = (type, hasData) => {
		switch (type) {
			case "Settings":
				if (hasData === true) {
					return (
						<div className="settings-wrapper">
							{temp.map((item, index) => (
								<div key={temp} className="relative group">
									<div className="event-container">
										<div className="event-header-container">
											<img
												src={success}
												alt="url"
												className="icon-success"
												height="20px"
												width="20px"
											/>
											<div className="header-text-container">
												<div className="header-text">Voll IL Gutter 2019</div>
												<div className="transfer-status">TransferComplete</div>
											</div>
										</div>
										<div className="event-details-wrapper">
											<div className="event-detail-container">
												<div className="event-detail">
													<div className="event-details-header">
														Node name populated he...
													</div>
													<div className="event-details-value">Node API 1</div>
												</div>
												<div className="event-detail">
													<div className="event-details-header">
														Today at 18:45
													</div>
													<div className="event-details-value">Transferred</div>
												</div>
											</div>
											<div className="event-detail-container">
												<div className="event-detail">
													<div className="event-details-header">
														Node name populated Node name populated
													</div>
													<div class="text-cyan-400 text-xs font-medium font-['Inter'] leading-3">
														Node API 2
													</div>
												</div>
												<div className="event-detail">
													<div className="event-details-header">
														Today at 18:50
													</div>
													<div className="event-details-value">
														Next Scheduled
													</div>
												</div>
											</div>
										</div>
									</div>
									<div className="group-hover:flex event-container-hover">
										<div className="bg-[#080808] settings-hover-button-container">
											<div className="button-wrapper">
												<SButton
													sType="button"
													onClick={() => {}}
													className="p-[5px] hover:bg-[#005C4080] rounded-[3px] justify-center items-center gap-[5px] inline-flex"
												>
													<div className="flex">
														<img
															src={rerun}
															alt="rerun"
															className="icon-white"
														/>
														<span className="text-white text-xs font-semibold font-['Inter'] leading-3 tracking-tight">
															Rerun
														</span>
													</div>
												</SButton>
												<div className="hover:bg-[#005C4080] p-[5px] flex gap-[5px] items-center cursor-pointer">
													<img src={eye} alt="ai" className="icon-white" />
													<div class="text-white text-xs font-semibold font-['Inter'] leading-3 tracking-tight">
														Data
													</div>
												</div>
												<div className="hover:bg-[#005C4080] p-[5px] flex gap-[5px] items-center cursor-pointer">
													<img src={aiIcon} alt="ai" className="icon-white" />
													<div class="text-white text-xs font-semibold font-['Inter'] leading-3 tracking-tight">
														AI{" "}
													</div>
												</div>
												<SButton
													sType="button"
													onClick={() => {}}
													className="p-[5px] hover:bg-[#005C4080] rounded-[3px] justify-center items-center gap-2.5 inline-flex"
												>
													<span className="text-white text-xs font-semibold font-['Inter'] leading-3 tracking-tight">
														Open
													</span>
												</SButton>
											</div>
										</div>
									</div>
								</div>
							))}
						</div>
					);
				}
				return (
					<div className="settings-wrapper flex justify-center">
						<div className="flex items-center justify-center gap-[5px] w-[100%] h-[100%]">
							<img src={addRounded} alt="add" className="icon-grey-5" />
							<div class="text-neutral-400 text-sm font-semibold font-['Inter'] leading-3">
								Settings
							</div>
						</div>
					</div>
				);

			case "Events":
				return (
					<div className="settings-wrapper flex justify-center">
						<div class=" flex-col justify-center items-center gap-5 inline-flex">
							<div class="w-20 h-[91.43px] flex-col justify-center items-center flex">
								<img
									src={calendarcheck}
									className="icon-grey-5"
									alt="calendarcheck"
								/>
							</div>
							<div class="w-[177px] flex-col justify-start items-center gap-[5px] flex">
								<div class="text-center text-neutral-400 text-sm font-medium font-['Inter']">
									Create and activate Specc
									<br />
									to view events
								</div>
							</div>
						</div>
					</div>
				);

			case "Variables":
				return (
					<div className="settings-wrapper">
						<div className="flex items-center justify-center gap-[5px] w-[100%] h-[100%]">
							<Variables />
						</div>
					</div>
				);

			default:
				return (
					<div className="settings-wrapper">
						{" "}
						<div className="color-[white]">Nothing</div>
					</div>
				);
		}
	};
	return (
		<div className="  p-[20px] settings-details-container">
			<div class="text-white text-sm font-bold font-['Inter'] settings-header">
				Settings and Events
			</div>
			<div class="self-stretch h-8 bg-zinc-800 rounded-[5px] shadow justify-start items-center inline-flex setting-tabs-container">
				<div
					onClick={() => setSelectedTab("Settings")}
					onKeyDown={() => setSelectedTab("Settings")}
					class={`settings-tab-container ${
						selectedTab === "Settings" ? "bg-neutral-600" : ""
					} `}
				>
					<div
						class={` scheduler-tab-text ${
							selectedTab === "Settings" ? "text-white" : "text-zinc-400"
						}`}
					>
						Settings
					</div>
				</div>
				<div class="w-px h-8 relative bg-neutral-600" />
				<div
					onClick={() => setSelectedTab("Variables")}
					onKeyDown={() => setSelectedTab("Variables")}
					class={`settings-tab-container ${
						selectedTab === "Variables" ? "bg-neutral-600" : ""
					} `}
				>
					<div
						class={` scheduler-tab-text ${
							selectedTab === "Variables" ? "text-white" : "text-zinc-400"
						}`}
					>
						Variables
					</div>
				</div>
				<div class="w-px h-8 relative bg-neutral-600" />
				<div
					onClick={() => setSelectedTab("Events")}
					onKeyDown={() => setSelectedTab("Events")}
					class={`settings-tab-container ${
						selectedTab === "Events" ? "bg-neutral-600" : ""
					} `}
				>
					<div
						class={` scheduler-tab-text ${
							selectedTab === "Events" ? "text-white" : "text-zinc-400"
						}`}
					>
						Events
					</div>
				</div>
			</div>
			{getSettingsComponent(selectedTab, true)}
		</div>
	);
}
