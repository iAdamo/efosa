import { toast } from "sonner";
import Close from "@assets/icons/cross.svg?react";
import CircularProgress from "@components/loaders/CircularLoader";
import SProgressBar from "../SProgressBar";
import { errorToast } from "./error-toast";
import Warning from "@assets/icons/warning.svg?react";

export const promiseToast = (message, description, promise) => {
	return toast.promise(promise, {
		loading: (
			<div className="activate-specc-container p-5">
				<div className="flex flex-col gap-2">
					<div className="flex justify-between">
						<div class="text-[#aeaeae] text-lg font-medium font-['Inter']">
							{message}
						</div>
						<Close
							onClick={() => toast.dismiss()}
							alt="close"
							className="icon-grey-5 self-start cursor-pointer"
						/>
					</div>
					<div className="flex gap-[10px] items-center">
						<CircularProgress imgClassName="w-5 h-5" />
						<div class="w-[313px] text-[#aeaeae] text-xs font-medium font-['Inter']">
							{description}
						</div>
					</div>
					<SProgressBar value={60} />
				</div>
			</div>
		),
		success: () => {
			return "Success";
		},
		error: (errors) => {
			return (
				<>
					<Warning alt="warning" className="icon-error" /> Please complete
					mandatory steps to activate
				</>
			);
			/*
			return errorToast(
				"Activating Specc",
				"Please complete mandatory steps to activate",
				() => {
					console.log("dismiss toast");
				},
			);
			*/
		},
	});
};
