import SButton from "@/components/SButton";
import Warning from "@assets/icons/warning.svg?react";
import Close from "@assets/icons/cross.svg?react";

export default function ErrorMsg({ objectOfErrors, onClick }) {
	return (
		<div className="activate-specc-container-error p-[15px] lg:max-w-[25vw]">
			<div className="flex items-center gap-[10px] justify-center">
				<Warning alt="warning" className="icon-error h-6 w-14" />
				<div className="flex flex-col w-[20vw] max-w-[20vw]">
					{Object.keys(objectOfErrors).map((key, index) => {
						return (
							<>
								<div key={key} className={`${index !== 0 ? "pb-2" : ""}`}>
									<div
										key={key}
										className="text-white text-xs font-semibold font-['Inter'] leading-3 tracking-tight"
									>
										{key.toUpperCase()}
									</div>
									<div className="text-[#aeaeae] text-xs font-medium font-['Inter']">
										{objectOfErrors[key]}
									</div>
								</div>
							</>
						);
					})}
				</div>
				<SButton
					onClick={() => onClick()}
					className="bg-status-error ml-[10px]"
				>
					<div class="text-white text-xs font-semibold font-['Inter'] leading-3 tracking-tight">
						API Builder
					</div>
				</SButton>
				<Close
					onClick={() => toast.dismiss()}
					alt="close"
					className="icon-error cursor-pointer h-5 w-5"
				/>
			</div>
		</div>
	);
}
