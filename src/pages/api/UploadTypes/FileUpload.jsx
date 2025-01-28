import { uploadAPIFile } from "@axios/apiCalls";
import { useRef, useState } from "react";
import { toast } from "sonner";

export default function FileUpload(props) {
	const { direction, isMyAPI, myAPI, projectID, refreshFunction, onFileError } = props;
	const [selectedFile, setSelectedFile] = useState(null);
	const fileElement = useRef(null);

	const handleFileChange = async (event) => {
		setSelectedFile(event.target.files[0]);
		const file = event.target.files[0];

		if (!file) {
			openFileChoseWindow();
			return;
		}
		//setIsLoading(true);

		const formData = new FormData();
		formData.append("file", file);

		if (isMyAPI) {
			formData.append("myAPIID", myAPI.id);
		} else {
			formData.append("projectID", projectID);
			formData.append("direction", direction);
		}

		try {
			const { data } = await uploadAPIFile(formData);
		
			if (data) {
			  toast.success("API uploaded successfully.");
			  refreshFunction();
			}
		  } catch (error) {
			onFileError(error)
		  }
	};

	const openFileChoseWindow = () => {
		fileElement.current.click();
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
									File*
								</div>
							</div>
						</div>
					</div>
					<div className="self-stretch h-16 flex-col justify-start items-start gap-1 flex">
						<div
							className="self-stretch flex-col justify-start items-start gap-[5px] flex cursor-pointer"
							onClick={openFileChoseWindow}
						>
							<div className="self-stretch justify-start items-center gap-2.5 inline-flex">
								<div className="grow shrink basis-0 self-stretch px-3 py-2.5 bg-neutral-700 rounded-[5px] justify-start items-center gap-2.5 flex">
									<div className="grow shrink basis-0 flex-col justify-center items-start gap-[5px] inline-flex">
										<div className="self-stretch justify-between items-center inline-flex">
											<div className="justify-between items-center flex">
												<div className="text-zinc-400 text-xs font-normal font-['Inter'] leading-[11px]">
													{selectedFile?.name || "Browse files..."}
												</div>
												<div className="w-6 h-6 relative" />
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className="self-stretch pl-3 justify-start items-center gap-[5px] inline-flex mt-2">
							<div className="grow shrink basis-0 text-zinc-400 text-xs font-medium font-['Inter'] leading-none">
								*Required
							</div>
						</div>
					</div>
				</div>
				<input
					type="file"
					onChange={handleFileChange}
					ref={fileElement}
					className="hidden"
				/>
			</div>
		</>
	);
}
