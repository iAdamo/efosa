import React, { useContext, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDrop } from "@react-aria/dnd";
import { ProjectContext } from "@contexts/ProjectContext";
import APIDetails from "./APIDetails";
import APIDetailsLoader from "./APIDetailsLoader";
import addRounded from "@assets/icons/add-rounded.svg";
import { createUploadApi } from "@axios/apiCalls";
import AddRounded from "@assets/icons/add-rounded.svg?react";
import Logo from "@assets/icons/logo.svg?react";
import FillStar from "@assets/icons/fill-star.svg?react";
import SBadge from "@/components/SBadge";
import Globe from "@assets/icons/globe.svg?react";
import Warning from "@assets/icons/warning.svg?react";

const APIDropAndAdd = ({
	name,
	onClick,
	direction,
	APIID,
	isAuthenticated,
	authenticationType,
	number,
}) => {
	const { specc, projectID, refreshProjectInitialData } =
		useContext(ProjectContext);

	const ref = useRef(null);
	const [loading, setLoading] = useState(false);
	const { dropProps, isDropTarget } = useDrop({
		ref,
		async onDrop(e) {
			try {
				setLoading(true);
				const items = await Promise.all(e.items);
				const data = JSON.parse(await items[0].getText("text/plain"));
				const { myAPI } = data;

				const obj = {};
				if (direction == "SOURCE") {
					obj.sourceAPIID = myAPI.APIID;
				} else {
					obj.destinationAPIID = myAPI.APIID;
				}

				const createdAPI = await createUploadApi({
					speccID: specc.id,
					isMyAPIUpload: true,
					myAPIID: myAPI.id,
					projectID: projectID,
					direction: direction,
				});

				await refreshProjectInitialData();
				setLoading(false);
			} catch (err) {
				setLoading(false);
			}
		},
	});

	const DropDiv = () => (
		<div className="text-div flex items-center">
			<img src={addRounded} alt="add" />
			<span className="label-large label-bold">{name}</span>
		</div>
	);

	return (
		<>
			{!loading ? (
				<div
					{...dropProps}
					ref={ref}
					onClick={() => {
						if (!APIID) onClick();
					}}
				>
					<div className="add-drop-api" data-is-drop-target={isDropTarget}>
						{APIID ? (
							<APIDetails
								APIID={APIID}
								direction={direction}
								isAuthenticated={isAuthenticated}
								authenticationType={authenticationType}
								number={number}
							/>
						) : (
							<DropDiv />
						)}
					</div>
				</div>
			) : (
				<APIDetailsLoader />
			)}
		</>
	);
};

function AddAPI({ hasAPI, API, direction }) {
	const navigate = useNavigate();
	const {
		sourceAPIID,
		destinationAPIID,
		isSourceAuthenticated,
		isDestinationAuthenticated,
		sourceAuthenticationType,
		destinationAuthenticationType,
		refreshProjectInitialData,
		projectID,
	} = useContext(ProjectContext);

	const navigateAddAPI = (obj) => {
		navigate(obj);
	};
	const ref = useRef(null);

	const { dropProps, isDropTarget } = useDrop({
		ref,
		async onDrop(e) {
			const items = await Promise.all(
				e.items
					.filter(
						(item) => item.kind === "text" && item.types.has("text/plain"),
					)
					.map((item) => item.getText("text/plain")),
			);
			const data = JSON.parse(items[0]);

			const uploadedAPI = await createUploadApi({
				projectID: projectID,
				isMyAPIUpload: true,
				myAPIID: data.id,
				direction: direction,
			});
			refreshProjectInitialData();
		},
	});

	const color =
		direction === "SOURCE" ? "secondary-cerise" : "secondary-mint-green";

	return (
		<div
			{...dropProps}
			ref={ref}
			data-is-drop-target={isDropTarget}
			onClick={() => {
				navigateAddAPI("./api/" + direction.toLowerCase());
			}}
			className={` cursor-pointer select-none ${
				hasAPI
					? `bg-[#080808] ${
							direction === "SOURCE"
								? "border-secondary-cerise"
								: "border-secondary-mint-green"
						} `
					: `bg-grey-2 border-grey-3 hover:bg-[#080808] ${
							direction === "SOURCE"
								? "hover:border-secondary-cerise"
								: "hover:border-secondary-mint-green"
						}`
			} group border h-[115px]  p-[10px] flex items-center rounded-[5px] justify-center ${
				direction === "SOURCE"
					? "hover:border-secondary-cerise"
					: "hover:border-secondary-mint-green"
			} hover:bg-[#080808] `}
		>
			{hasAPI ? (
				<div className="h-full w-full ">
					<div className="flex justify-between">
						<div className="flex  gap-[10px] w-full">
							{/* <div className="h-10 w-10 rounded-[5px]">
													<ApiPlaceholder />
												</div> */}
							<div className="flex flex-col gap-[10px] w-full">
								<div className="flex justify-between">
									<div className="flex items-center">
										<Logo
											className={`h-4 w-4 ${
												direction === "SOURCE"
													? "icon-cerise"
													: "icon-mint-green"
											}`}
										/>
										<div
											class={`text-[${color}] text-xs font-bold font-['Inter'] ml-[3px]`}
										>
											API
										</div>
										<div class="text-white text-xs font-medium font-['Inter'] leading-[11px] ml-[8px]">
											{API.customName ? API.customName : API.name}
										</div>
									</div>
									<div className="flex gap-[10px] items-center">
										<div
											class={`${
												direction === "SOURCE"
													? "text-secondary-cerise"
													: "text-secondary-mint-green"
											} text-xs font-medium font-['Inter'] leading-none tracking-normal cursor-pointer`}
										>
											Edit
										</div>
										<div
											class={`${
												direction === "SOURCE"
													? "text-secondary-cerise"
													: "text-secondary-mint-green"
											} text-xs font-medium font-['Inter'] leading-none tracking-normal cursor-pointer`}
										>
											Remove
										</div>
										<FillStar className="icon-grey-5" />
									</div>
								</div>
								<div class="text-[#aeaeae] text-xs font-medium font-['Inter'] leading-[11px]">
									Last updated {API.updatedTime}
								</div>
								<div className="flex gap-[10px] flex-wrap">
									<div className="flex gap-[10px] w-max">
										<SBadge
											label={API.name.toUpperCase()}
											className={`${
												direction === "SOURCE"
													? "!bg-secondary-cerise30"
													: "!bg-secondary-mint-green-50"
											} !text-white`}
										/>
									</div>
									<div className="flex gap-[10px] w-max">
										{API.auth.authType && (
											<SBadge
												label={API.auth.authType.toUpperCase()}
												className={`
                        
                        ${
													direction === "SOURCE"
														? "!bg-secondary-cerise30"
														: "!bg-secondary-mint-green-50"
												} !text-white`}
											/>
										)}
									</div>
								</div>
								<div className="flex gap-[15px]">
									<Globe
										className={`${
											direction === "SOURCE" ? "icon-cerise" : "icon-mint-green"
										}`}
									/>
									<div className="flex gap-1 items-center ">
										<Warning
											className={`${
												direction === "SOURCE"
													? "icon-cerise"
													: "icon-mint-green"
											}`}
										/>
										<div class="text-white text-xs font-medium font-['Inter'] leading-[11px]">
											1
										</div>
									</div>
									<div className="flex gap-1 items-center">
										<Logo
											className={`${
												direction === "SOURCE"
													? "icon-cerise"
													: "icon-mint-green"
											} h-4 w-4`}
										/>
										<div class="text-white text-xs font-medium font-['Inter'] leading-[11px]">
											1
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			) : (
				<div className="flex gap-[5px] items-center justify-center">
					<AddRounded className="icon-grey-5 group-hover:icon-cerise" />
					<div
						class={`text-[#8c8c8c] text-lg font-semibold font-['Inter'] leading-3 ${
							direction === "SOURCE"
								? "group-hover:text-secondary-cerise"
								: "group-hover:text-secondary-mint-green"
						}`}
					>
						{direction === "SOURCE" ? "Add API 1" : "Add API 2"}
					</div>
				</div>
			)}
		</div>
	);
}

export default AddAPI;
