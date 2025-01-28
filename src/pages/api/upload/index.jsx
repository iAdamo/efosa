import Upload from "@assets/icons/upload.svg?react";
import Info from "@assets/icons/info.svg?react";
import STabs from "@/components/STabs";
import File from "@assets/icons/file.svg?react";
import Code from "@assets/icons/code.svg?react";
import Globe from "@assets/icons/globe.svg?react";
import Server from "@assets/icons/server.svg?react";
import URLUpload from "./URLUpload";
import SButton from "@/components/SButton";
import UploadFile from "./UploadFile";
import { useRef } from "react";
import UploadCode from "./UploadCode";
import SAccordion from "@/components/SAccordion";
import { useState } from "react";
import APIAuthentication from "./APIAuthentication";
import SettingsServer from "./SettingsServer";
import AlternateMethods from "./AlternateMethods";
import APICustomName from "./APICustomName";
import ErrorMsg from "./ErrorMsg";
import SuccessMsg from "./SuccessMsg";
import SBreadcrumbs from "@/components/SBreadcrumbs";
import { createUploadApi, postGenericCRUDWithID, uploadAPIFile, validateAPI } from "@/axios/apiCalls";
import { GeneralContext } from "@/contexts/GeneralContext";
import { useContext } from "react";
import APIName from "../APIName/APIName";
import Authentication from "../Authentication/Authentication";
import { ProjectContext } from "@/contexts/ProjectContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function UploadAPI(props) {
	const {
		API,
		isMyAPI,
		myAPI,
		projectID,
		direction,
		auth,
		setAuth,
		refreshFunction,
	} = props;
	const inputRef = useRef(null);
	const dropRef = useRef(null);
	const { refreshGeneralInitialData, myAPIs, setMyAPIs } =
		useContext(GeneralContext);

	const { availableSNC } = useContext(ProjectContext);
	const [selectedMethod, setSelectedMethod] = useState("URL");
	const [url, setURL] = useState("");
	const [selectedFile, setSelectedFile] = useState(null);
	const [jsontext, setJsontext] = useState("");
	const [uploadResponse, setUploadResponse] = useState(null);
	const [validationResult, setValidationResult] = useState(null);
	const navigate = useNavigate();

	const handleUpload = () => {
		switch (selectedMethod) {
			case "URL":
				handleURLUpload();
				break;
			case "File":
				handleFileUpload();
				break;
			case "Code":
				handleCodeUpload();
				break;
		}
	};

	const goToBuilder = () => {
		if (API) {
			navigate("/builder?APIID=" + API.id);
		}
	};

	useEffect(() => {
		(async () => {
			if (API) {
				const validations = await validateAPI(API.id);
				setValidationResult(validations);
			}
		})();
	}, [API]);

	const handleURLUpload = async () => {
		if (url.length === 0) {
			return;
		}

		let speccData = null;
		if (isMyAPI) {
			speccData = {
				myAPIID: myAPI.id,
				url: url,
			};
		} else {
			speccData = {
				projectID: projectID,
				url: url,
				direction,
			};
		}

		const data = await createUploadApi(speccData);
		setUploadResponse(data);
		setValidationResult(data?.validation_issues);

		if (data) {
			refreshFunction();
		}
	};
	const handleFileUpload = async () => {
		const file = selectedFile;
		if (!file) {
			openFileChoseWindow();
			return;
		}
		//setIsLoading(true);

		const formData = new FormData();
		formData.append("file", file);

		if (isMyAPI) {
			formData.append("isMyAPI", true);
			if (myAPI) {
				formData.append("myAPIID", myAPI.id);
			}
		} else {
			formData.append("projectID", projectID);
			formData.append("direction", direction);
		}

		//setIsLoading(true);
		const data = await uploadAPIFile(formData);
		setUploadResponse(data);
		setValidationResult(data?.validation_issues);
		if (data.myAPI) {
		}

		if (data) {
			refreshFunction();
		}
	};
	const handleCodeUpload = async () => {
		if (jsontext.length == 0) {
			return;
		}

		let speccData = null;

		if (myAPI) {
			speccData = {
				myAPIID: myAPI.id,
				jsontext,
				jsonurl: "",
				jsonfile: "",
				direction,
			};
		} else {
			speccData = {
				projectID: projectID,
				jsontext,
				jsonurl: "",
				jsonfile: "",
				direction,
			};
		}

		const data = await createUploadApi(speccData);
		setUploadResponse(data);
		setValidationResult(data?.validation_issues);

		if (data) {
			refreshFunction();
		}
	};


	const updateSubscription = async (SNCID) => {
		const speccData = {
			projectID: projectID,
			SNCSubscribeID: SNCID,
			jsonurl: "",
			jsonfile: "",
			direction,
		};
		if (SNCID !== "Select SNC") {
			const data = await createUploadApi(speccData);
			console.log(data);
		}
	};

	return (
		<div className="flex flex-col pt-[10px] pl-5 w-full">
			<SBreadcrumbs speccID={null} projectID={projectID} />
			<div className="w-full h-[1px] bg-grey-10 mt-[10px]" />
			<div className="flex gap-5 p-5 pl-0 h-full overflow-scroll no-scrollbar w-full justify-start ">
				<div className=" flex flex-col h-fit upload-wrapper gap-5 w-[28vw]">
					<div className="flex flex-col gap-5">
						<div className="bg-[#080808] p-5 rounded-[10px] gap-5 flex flex-col w-[28vw]">
							<div className="flex gap-[5px] items-center">
								<Upload className="icon-yellow-2" />
								<div class="text-[#f5c519] text-lg font-bold font-['Inter']">
									Upload
								</div>
								<div class="text-white text-lg font-bold font-['Inter']">
									API
								</div>
								<Info className="icon-grey-5" />
							</div>
							<div class=" text-neutral-200 text-xs font-medium font-['Inter'] leading-none tracking-normal">
								Choose a method and upload the API of your choice. The API will
								be available in My APIs after upload.
							</div>

							<div>Select SNC
								<select className="text-black" onChange={(e) => {
									updateSubscription(e.target.value);
								}}><option>Select SNC</option>
									{availableSNC?.map((item) => {
										return <><option value={item.id}>{item.id}</option></>
									})}
								</select></div>
							<STabs
								getSelectedTab={(tab) => {
									setSelectedMethod(tab);
								}}
								tabs={[
									{
										icon: <Globe className="icon-white" />,
										name: "URL",
										children: <URLUpload url={url} setURL={setURL} />,
									},
									{
										icon: <File className="icon-white mr-1" />,
										name: "File",
										children: (
											<UploadFile
												selectedFile={selectedFile}
												setSelectedFile={setSelectedFile}
												inputRef={inputRef}
												dropRef={dropRef}
											/>
										),
									},
									{
										icon: <Code className="icon-white mr-1" />,
										name: "Code",
										children: (
											<UploadCode
												jsontext={jsontext}
												setJsontext={setJsontext}
											/>
										),
									},
								]}
							/>
							{uploadResponse?.success &&
								!validationResult?.validation_issues && <SuccessMsg message={'Uploaded successfully'} />}
							{validationResult?.validation_issues &&
								Object.keys(validationResult?.validation_issues?.errors)
									.length > 0 && (
									<ErrorMsg
										objectOfErrors={validationResult?.validation_issues?.errors}
										onClick={() => {
											navigate("/builder?APIID=" + API.id);
										}}
									/>
								)}
							{/*
							<ErrorMsg />
							<SuccessMsg />
							 */}
							<div className="flex">
								<SButton
									sType="button"
									onClick={() => {
										handleUpload();
									}}
									className="px-[15px] w-max h-full py-2 bg-secondary-yellow rounded-[50px] shadow justify-center items-center gap-0.5 inline-flex"
								>
									<span className="grow shrink basis-0 text-center !text-black text-xs font-semibold font-['Inter'] leading-[14px] tracking-normal">
										Upload and validate
									</span>
								</SButton>
								{API && (

									<SButton
										sType="button"
										onClick={() => {
											goToBuilder();
										}}
										className="ml-4 px-[15px] w-max h-full py-2 bg-secondary-yellow rounded-[50px] shadow justify-center items-center gap-0.5 inline-flex"
									>
										<span className="grow shrink basis-0 text-center !text-black text-xs font-semibold font-['Inter'] leading-[14px] tracking-normal">
											API Builder
										</span>
									</SButton>
								)}
							</div>


						</div>

					</div>
					{API && (
						<APIName
							APIID={API?.id}
							direction={direction}
							isMyAPI={myAPI == null ? false : true}
							defaultValue={API?.customName}
							customName={API?.customName}
						/>
					)}
				</div>
				<div className="flex flex-col gap-5 h-fit w-[28vw]">
					{API && (
						<Authentication
							APIID={API.id}
							isMyAPI={!!myAPI}
							direction={null}
							myAPI={myAPI}
							auth={auth}
							setAuth={setAuth}
						/>
					)}
					{API && (
						<SAccordion
							title={
								<div className="flex gap-[5px] items-center">
									<Server className="icon-yellow-2" />
									<div class="text-[#f5c519] text-lg font-bold font-['Inter']">
										Settings
									</div>
									<div class="text-white text-lg font-bold font-['Inter']">
										Servers
									</div>
									<Info className="icon-grey-5" />
								</div>
							}
							content={<SettingsServer />}
							open={true}
							titleClassname="flex justify-between items-center"
							accordionClassname="bg-[#080808] p-5 rounded-[10px] gap-5 flex flex-col w-[28vw]"
						/>
					)}

					{!API && (
						<SAccordion
							title={
								<div className="flex gap-[5px] items-center">
									<div class="text-[#f5c519] text-lg font-bold font-['Inter']">
										Upload
									</div>
									<div class="text-white text-lg font-bold font-['Inter']">
										Alternate methods
									</div>
									<Info className="icon-grey-5 ml-[3px]" />
								</div>
							}
							content={<AlternateMethods />}
							open={true}
							titleClassname="flex justify-between items-center"
							accordionClassname="bg-[#080808] p-5 rounded-[10px] gap-5 flex flex-col w-[28vw]"
						/>
					)}
				</div>
			</div>
		</div>
	);
}
