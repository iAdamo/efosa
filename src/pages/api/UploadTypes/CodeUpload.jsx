import { GeneralContext } from "@contexts/GeneralContext";
import { ProjectContext } from "@contexts/ProjectContext";
import { createUploadApi, uploadAPIFile } from "@axios/apiCalls";
import { useContext, useRef, useState } from "react";
import { toast } from "sonner";

export default function CodeUpload(props) {
	const { direction, isMyAPI, myAPI, projectID, refreshFunction } = props;
	const [selectedFile, setSelectedFile] = useState(null);
	const fileElement = useRef(null);

	const storeSpeccAPI = async (event) => {
		const jsontext = event.target.value;
		if (jsontext.length == 0) {
			return;
		}

		let speccData = null;

		if (isMyAPI) {
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

		const { data } = await createUploadApi(speccData);

		if (data) {
			toast.success("API uploaded successfully.");

			refreshFunction();
		} else {
			toast.error("Could not upload API. Contact SPECC Admin.");
		}
	};

	return (
		<>
			<div className="w-[345px] text-neutral-200 text-xs font-medium font-['Inter'] leading-none tracking-tight">
				Upload the API of your choice. The API will be available in My APIs
				after upload.
			</div>
			<div className="self-stretch flex-col justify-start items-end flex">
				<div className="self-stretch flex-col justify-start items-start gap-[5px] flex">
					<div className="w-[345px] px-3 justify-start items-center gap-[5px] inline-flex mt-2">
						<div className="grow shrink basis-0 h-3.5 rounded-[5px] justify-start items-center gap-2.5 flex">
							<div className="justify-start items-center gap-[5px] flex">
								<div className="text-zinc-400 text-xs font-normal font-['Inter'] leading-[14px]">
									Insert Code*
								</div>
							</div>
						</div>
					</div>
					<div className="self-stretch flex-col justify-start items-start gap-1 flex">
						<div className="w-[360px] bg-neutral-700 rounded-[5px] justify-start items-start gap-2.5 flex">
							<textarea
								className="min-h-[276px] flex-grow rounded-[5px] bg-neutral-700 text-white text-zinc-400 text-xs font-medium font-['FiraCode'] leading-none"
								onBlur={(e) => {
									storeSpeccAPI(e);
								}}
							></textarea>
						</div>
						<div className="self-stretch pl-3 justify-start items-center gap-[5px] inline-flex mt-2">
							<div className="grow shrink basis-0 text-zinc-400 text-xs font-medium font-['Inter'] leading-none">
								*Required
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
