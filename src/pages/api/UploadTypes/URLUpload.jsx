import { createUploadApi } from "@axios/apiCalls";
import { useRef, useState } from "react";
import SInput from "../../../components/SInput";
import { toast } from "sonner";

export default function URLUpload(props) {
	const { direction, isMyAPI, myAPI, projectID, refreshFunction } = props;
	const [selectedFile, setSelectedFile] = useState(null);
	const fileElement = useRef(null);

	const storeSpeccUrl = async (url) => {
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
			<div className="self-stretch h-[83px] flex-col justify-start items-end flex">
				<div className="self-stretch h-[83px] flex-col justify-start items-start gap-[5px] flex">
					<div className="w-[360px] h-[79px] flex-col justify-start items-end inline-flex">
						<div className="self-stretch h-[79px] flex-col justify-start items-start gap-[5px] flex">
							<div className="w-[345px] px-3 justify-start items-center gap-[5px] inline-flex mt-2">
								<div className="grow shrink basis-0 h-3.5 rounded-[5px] justify-start items-center gap-2.5 flex">
									<div className="justify-start items-center gap-[5px] flex">
										<div className="text-zinc-400 text-xs font-normal font-['Inter'] leading-[14px]">
											URL*
										</div>
									</div>
								</div>
							</div>
							<div className="self-stretch flex-col justify-start items-start gap-1 flex">
								<div className="self-stretch h-10 flex-col justify-start items-start gap-[5px] flex">
									<div className="self-stretch justify-start items-center gap-2.5 inline-flex">
										<div className="grow shrink basis-0 self-stretch bg-neutral-700 rounded-[5px] justify-start items-center gap-2.5 flex">
											<SInput
												type="text"
												className="text-white text-xs font-normal font-['Inter'] leading-[11px] bg-neutral-700 rounded-[5px] w-[100%]"
												onBlur={(e) => {
													storeSpeccUrl(e.target.value);
												}}
											/>
										</div>
									</div>
								</div>
								<div className="self-stretch pl-3 justify-start items-center gap-[5px] inline-flex">
									<div className="grow shrink basis-0 text-zinc-400 text-xs font-medium font-['Inter'] leading-none">
										*Required
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
