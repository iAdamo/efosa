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

export default function UploadAPI() {
	const inputRef = useRef(null);
	const dropRef = useRef(null);
	const [selectedMethod, setSelectedMethod] = useState("URL");

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

	const handleURLUpload = () => { };
	const handleFileUpload = () => { };
	const handleCodeUpload = () => { };

	return (
		<div className="flex flex-col pt-[10px] pl-5 w-full">
			<SBreadcrumbs speccID={null} projectID={null} />
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
							<STabs
								getSelectedTab={(tab) => {
									setSelectedMethod(tab);
								}}
								tabs={[
									{
										icon: <Globe className="icon-white" />,
										name: "URL",
										children: <URLUpload />,
									},
									{
										icon: <File className="icon-white mr-1" />,
										name: "File",
										children: (
											<UploadFile inputRef={inputRef} dropRef={dropRef} />
										),
									},
									{
										icon: <Code className="icon-white mr-1" />,
										name: "Code",
										children: <UploadCode />,
									},
								]}
							/>
							<ErrorMsg />
							<SuccessMsg />
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
						</div>
					</div>
					<APICustomName />
				</div>
				<div className="flex flex-col gap-5 h-fit w-[28vw]">
					<APIAuthentication />
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
				</div>
			</div>
		</div>
	);
}
