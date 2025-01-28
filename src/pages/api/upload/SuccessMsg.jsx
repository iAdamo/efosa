import SButton from "@/components/SButton";
import Success from "@assets/icons/success.svg?react";
import Close from "@assets/icons/cross.svg?react";

export default function SuccessMsg({ message, description, onClick }) {
	return (
		<div className="activate-specc-container-success p-[15px] lg:max-w-[25vw]">
			<div className="flex items-center gap-[10px] justify-center">
				<Success alt="warning" className="icon-success h-5 w-12" />
				<div className="flex flex-col w-[20vw] max-w-[20vw]">
					<div class="text-white text-xs font-semibold font-['Inter'] leading-3 tracking-normal">
						{message}
					</div>
				</div>

				<Close
					onClick={() => toast.dismiss()}
					alt="close"
					className="icon-success cursor-pointer h-5 w-5"
				/>
			</div>
		</div>
	);
}
