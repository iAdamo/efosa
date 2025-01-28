import { successToast } from "@/components/toasts/toasts";
import AddFile from "@assets/icons/add-file.svg?react";
import UploadFileIcon from "@assets/icons/upload-file.svg?react";
import { useState } from "react";
import { useRef } from "react";
import { DropZone } from "react-aria-components";
import AddGradient from "@assets/icons/add-circular-gradient.svg?react";
import Delete from "@assets/icons/delete.svg?react";
import FileGradient from "@assets/icons/file-gradient.svg?react";
import { FileTrigger } from "react-aria-components";
import { Button } from "react-aria-components";

export default function UploadFile({ ...props }) {
	const inputRef = useRef(null);
	const [isDropping, setIsDropping] = useState(false);
	const [selectedFile, setSelectedFile] = useState(null);

	const openFileChoseWindow = () => {
		inputRef.current.click();
	};

	if (selectedFile) {
		return (
			<div className="flex flex-col gap-[10px] pb-5 pt-[30px]">
				<div className="flex justify-between items-center">
					<div className="flex gap-[6px]">
						<FileGradient className="h-4 w-4" />
						<div class="text-[#ed6a7d] text-lg font-medium font-['Inter'] underline cursor-pointer">
							{selectedFile.name}
						</div>
					</div>
					<Delete
						onClick={() => {
							setSelectedFile(null);
						}}
						className="icon-pink h-4 w-4 cursor-pointer"
					/>
				</div>
			</div>
		);
	}
	return (
		<DropZone
			onDrop={(e) => {
				setIsDropping(false);
				successToast("File uploaded successfully");
				const files = e.items.filter((file) => file.kind === "file");
				if (files.length > 0) {
					setSelectedFile(files[0]);
				}
			}}
			onDropEnter={() => {
				setIsDropping(true);
			}}
			onDropExit={(e) => {
				setIsDropping(false);
			}}
		>
			<div
				className={`${
					isDropping ? "dashed-gradient-border" : ""
				} flex flex-col justify-start items-center border border-dashed border-grey-3 w-full p-[10px] py-5 rounded-[10px] gap-[10px] mt-[20px] h-[17vh]`}
			>
				{!isDropping ? (
					<>
						{/* <input ref={inputRef} type="file" className="hidden" /> */}
						<div className="flex gap-[10px] items-center">
							<AddFile className="h-4 w-4" />
							<div class="text-neutral-200 text-lg font-medium font-['Inter'] leading-3">
								Drag and drop
							</div>
						</div>
						<div class="text-[#aeaeae] text-base font-normal font-['Inter'] leading-3">
							or
						</div>
						<FileTrigger
							onSelect={(e) => {
								const files = Array.from(e);
								setSelectedFile(files[0]);
							}}
						>
							<Button>
								<div
									onClick={() => openFileChoseWindow()}
									onKeyDown={() => openFileChoseWindow()}
									className="flex gap-[6px] py-2 px-[10px] bg-grey-3 rounded-[50px] cursor-pointer"
								>
									<UploadFileIcon />
									<div class="text-neutral-200 text-base font-semibold font-['Inter'] leading-[14px] tracking-tight">
										Upload
									</div>
								</div>
							</Button>
						</FileTrigger>
					</>
				) : (
					<div className="flex flex-col justify-center h-full">
						<AddGradient className="h-8 w-8" />
					</div>
				)}
			</div>
		</DropZone>
	);
}
