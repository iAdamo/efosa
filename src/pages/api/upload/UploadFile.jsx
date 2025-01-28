import AddGradient from "@assets/icons/add-circular-gradient.svg?react";
import FileIcon from "@assets/icons/new-file.svg?react";
import UploadFileIcon from "@assets/icons/new-upload.svg?react";
import CustomButton from "@components/Button";
import { useRef, useState } from "react";
import { Button, DropZone, FileTrigger } from "react-aria-components";

export default function UploadFile(props) {
	const { selectedFile, setSelectedFile, UploadClassName: uploadClassName = "" } = props;
	const inputRef = useRef(null);
	const [isDropping, setIsDropping] = useState(false);

	const openFileChoseWindow = () => {
		inputRef.current.click();
	};

	if (selectedFile) {
		return (
			<div className={`flex flex-col mb-2`}>
				<div className="text-grey-17 mb-3 font-medium">UPLOAD FILE</div>
				<div className="flex justify-between items-center">
					<div className="flex gap-3 items-center">
						<FileIcon className="h-4 w-4" />
						<div class="text-lg font-medium font-['Inter'] cursor-pointer">
							{selectedFile.name}
						</div>
					</div>
					<CustomButton
						onClick={() => {
							setSelectedFile(null);
						}}
						className="p-0 underline text-custom-ghostWhite">
						Delete
					</CustomButton>
				</div>
			</div>
		);
	}
	return (
		<DropZone
			onDrop={async (e) => {
				setIsDropping(false);

				const files = e.items.filter((file) => file.kind === "file");
				if (files.length > 0) {
					setSelectedFile(await files[0].getFile());
				}
			}}
			onDropEnter={() => {
				setIsDropping(true);
			}}
			onDropExit={(e) => {
				setIsDropping(false);
			}}
		>
			<div className="text-grey-17 mb-2 font-medium">UPLOAD FILE</div>
			<div
				className={`${isDropping ? "dashed-gradient-border" : ""
					} flex items-center justify-center border border-dashed border-gradient-grey-4 w-full p-[5px] py-2.5 rounded-[10px] gap-[10px] bg-gradient-grey-8 hover:bg-gradient-grey-4 hover:cursor-pointer hover:border-custom-ghostWhite ${uploadClassName}`}
			>
				{!isDropping ? (
					<>
						<FileTrigger
							onSelect={(e) => {
								if (!e) return;
								const files = Array.from(e);
								const filenames = files.map((file) => file.name);

								setSelectedFile(filenames);
							}}
						>
							<Button>
								<div
									onClick={() => openFileChoseWindow()}
									onKeyDown={() => openFileChoseWindow()}
									className="flex  cursor-pointer"
								>
									<UploadFileIcon className={'icon-white h-6 w-6'} />
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
