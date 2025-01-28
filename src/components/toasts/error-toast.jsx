import { toast } from "sonner";
import Close from "@assets/icons/cross.svg?react";
import CircularProgress from "@components/loaders/CircularLoader";
import SProgressBar from "../SProgressBar";
import Warning from "@assets/icons/warning.svg?react";
import SButton from "@components/SButton";

export const errorToast = (message, description, onClick, showBtn = true) => {
	return toast(
		<div className="activate-specc-container-error lg:max-w-[25vw] ">
			<div className="flex items-center gap-[10px] justify-center">
				<Warning alt="warning" className="icon-error w-[24px] h-[24px]" />
				<div className="flex flex-col w-[20vw] max-w-[20vw]">
					<div class="text-white text-xs font-semibold font-['Inter'] leading-3 tracking-tight">
						{message}
					</div>
					<div class=" text-[#aeaeae] text-xs font-medium font-['Inter']">
						{description}
					</div>
				</div>
				{showBtn && (
					<SButton
						onClick={() => onClick()}
						className="bg-status-error ml-[10px]"
					>
						Action
					</SButton>
				)}

				<Close
					onClick={() => toast.dismiss()}
					alt="close"
					className="icon-error cursor-pointer h-[12px] w-[12px]"
				/>
			</div>
		</div>,
		{
			duration: 5000,
		},
	);
};
