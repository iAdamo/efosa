import Button from "@/components/Button";
import { CustomSelect } from "@/components/CustomSelect";
import SBreadcrumbs from "@/components/SBreadcrumbs";
import { GeneralContext } from "@/contexts/GeneralContext";
import RepeatIcon from "@assets/icons/repeatIcon.svg?react";
import { ProjectContext } from "@contexts/ProjectContext";
import { Popover } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AddApiModal from "./AddApiModal";
import DataDirection from "./DataDirection";
import NoOptionsContent from "./NoOptionsContent";
import { createUploadApi } from "@/axios/apiCalls";
import CustomLoader from "@/components/CustomLoader";

export default function ProjectSettings() {
	const navigate = useNavigate();
	const {
		projectID,
		sourceAPI,
		destinationAPI,
		refreshProjectInitialData
	} = useContext(ProjectContext);
	const { myAPIs } = useContext(GeneralContext);
	const [API1Value, setAPI1Value] = useState(sourceAPI ? { label: sourceAPI?.name, id: sourceAPI?.id } : null);
	const [API2Value, setAPI2Value] = useState(destinationAPI ? { label: destinationAPI?.name, id: destinationAPI?.id } : null);
	const [direction, setDirection] = useState("source");
	const [anchorEl, setAnchorEl] = useState(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [uploadApiResponse, setUploadApiResponse] = useState(null);

	const optionsSourceApiData = [
		...(myAPIs?.map(({ API, id }) => ({ label: API?.customName || "No name", id })) || []),
		...(sourceAPI?.id ? [{ label: sourceAPI?.name || "No name", id: sourceAPI?.id }] : []),

	];

	const optionsDestinationApiData = [
		...(myAPIs?.map(({ API, id }) => ({ label: API?.name || "No name", id })) || []),
		...(destinationAPI?.id ? [{ label: destinationAPI?.name || "No name", id: destinationAPI?.id }] : []),
	];

	const useMyAPI = async (myAPIID, direction) => {

		if (!myAPIID) return;

		const speccData = {
			myAPIID: myAPIID,
			direction,
			projectID: projectID
		};

		const data = await createUploadApi(speccData);
		refreshProjectInitialData();

	}

	//Reverse order of both arrays
	optionsSourceApiData.reverse();
	optionsDestinationApiData.reverse();

	const handleClose = () => {
		setAnchorEl(null);
	};

	const open = Boolean(anchorEl);
	const id = open ? 'simple-popover' : undefined;
	const MuiInputBaseStyles = {
		padding: '6px 11px !important',
	};

	const handleUploadResponse = async (response) => {
		setUploadApiResponse(response)
		if (response?.success) {
			await refreshProjectInitialData();
		}
	};

	useEffect(() => {
		if (sourceAPI && sourceAPI?.id === uploadApiResponse?.data) {
			setAPI1Value((prev) => ({ ...prev, label: sourceAPI?.name, id: sourceAPI?.id }))
		}
		if (destinationAPI && destinationAPI?.id === uploadApiResponse?.data) {
			setAPI2Value((prev) => ({ ...prev, label: destinationAPI?.name, id: destinationAPI?.id }))
		}
	}, [sourceAPI, destinationAPI])

	let isAPICalling = false;
	const handleAPIChange = async (value, direction) => {

		if (isAPICalling) return;
		setIsLoading(true);

		isAPICalling = true;

		try {
			if (direction === "SOURCE") {
				setAPI1Value(value);
			} else {
				setAPI2Value(value);
			}

			await createUploadApi({
				isMyAPIUpload: true,
				myAPIID: value?.id,
				projectID,
				direction,
			});

			await refreshProjectInitialData();
		} catch (error) {
			console.error(error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="w-full flex flex-col gap-[26px]">
			<SBreadcrumbs speccID={null} projectID={projectID} />

			<div className="flex items-center gap-[102px]">
				<div className="flex flex-col flex-1 gap-2">
					<span className="font-medium text-[28px] leading-larger text-custom-ghostWhite">Select APIs</span>
					<span className="font-normal text-base text-grey-17">
						Choose API 1 and API 2 from your library to start building your integration. Connect and configure for seamless data flow.
					</span>
				</div>
				<div>
					<Button
						onClick={() => navigate(`/project/${projectID}/settings/authenticate-apis`)}
						variant={(API1Value || API2Value) && !isLoading ? "primary" : undefined}
						disabled={!API1Value && !API2Value}
						loading={isLoading}
						disableClassName="border border-grey-13 py-3 px-9 rounded-[10px] text-grey-13 font-medium text-xs leading-[14px]"
					>
						{isLoading ? <CustomLoader /> : "Authenticate APIs"}
					</Button>
				</div>
			</div>

			<div className="flex gap-4 relative">
				<div className="w-full py-[42px] px-14 bg-grey-15 rounded-lg">
					<CustomSelect
						options={optionsSourceApiData}
						value={API1Value}
						onChange={(value) => handleAPIChange(value, "SOURCE")}
						addable
						placeholder="Search API 1.."
						muiInputBaseStyles={MuiInputBaseStyles}
						noOptionsText={
							<NoOptionsContent
								addApiClick={() => {
									setIsModalOpen(true)
									setDirection("source")
								}}
							/>
						}
						textFieldStyles={{
							"& .Mui-focused": {
								border: "2px solid #E9C2F0 !important",
							},
						}}
						inputStyles={API1Value ? { background: "#454C54", border: "transparent" } : ""}
					/></div>
				<div className="w-full py-[42px] px-14 bg-grey-15 rounded-lg p-0.5">
					<CustomSelect
						options={optionsDestinationApiData}
						value={API2Value}
						onChange={(value) => handleAPIChange(value, "DESTINATION")}
						addable
						placeholder="Search API 2.."
						muiInputBaseStyles={MuiInputBaseStyles}
						noOptionsText={
							<NoOptionsContent
								addApiClick={() => {
									setIsModalOpen(true)
									setDirection("destination")
								}}
							/>
						}
						textFieldStyles={{
							"& .Mui-focused": {
								border: "2px solid #8BDEE4 !important",
							},
						}}
						inputStyles={API2Value ? { background: "#454C54", border: "transparent" } : ""}

					/>
				</div>

				<Button
					onClick={(e) => {
						setAnchorEl(e.currentTarget)
					}}
					aria-describedby={id}
					className={`w-[60px] h-[60px] group rounded-full flex items-center justify-center absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 bg-grey-15 border-custom-blackPearl
						hover:bg-source-gradient
						hover:border-[0px]
						hover:border-custom-blackPearl
						hover:p-0.5
						${open ? "bg-source-gradient border-custom-blackPearl p-0.5 border-0" : "bg-grey-15 border-[6px] border-custom-blackPearl"}
						`}
				>
					<div className={`
						group-hover:bg-grey-13
						group-hover:rounded-full
						group-hover:flex
						group-hover:h-full
						group-hover:w-full
						group-hover:items-center
						group-hover:justify-center
						${open ? " bg-grey-13 rounded-full flex h-full w-full items-center justify-center" : ""}
						`}>
						<RepeatIcon className={`icon-grey79 h-5 w-6`} />
					</div>
				</Button>

				<Popover
					id={id}
					open={open}
					anchorEl={anchorEl}
					onClose={handleClose}
					anchorOrigin={{
						vertical: 'bottom',
						horizontal: 'center',
					}}
					transformOrigin={{
						vertical: 'top',
						horizontal: 'center',
					}}
					slotProps={{
						paper: {
							sx: {
								background: '#141619',
								marginTop: '22px',
								color: "#F8F9FA"
							}
						}
					}}
				>
					<DataDirection />
				</Popover>
			</div>
			<AddApiModal
				isModalOpen={isModalOpen}
				setIsModalOpen={setIsModalOpen}
				direction={direction}
				onUploadResponse={handleUploadResponse}
			/>
		</div>
	);
}
