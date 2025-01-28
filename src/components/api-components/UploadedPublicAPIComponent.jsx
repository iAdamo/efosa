import Logo from "@assets/icons/logo.svg?react";
import ApiPlaceholder from "@assets/icons/api-placeholder.svg?react";
import SBadge from "@/components/SBadge";
import { useDrag } from "@react-aria/dnd";

export default function UploadedPublicAPIComponent({ isDraggable }) {
	const { dragProps, isDragging } = useDrag({
		getItems() {
			return [
				{
					"text/plain": JSON.stringify({
						name: "Salesforce",
					}),
				},
			];
		},
		isDisabled: !isDraggable,
	});
	return <></>;

	return (
		<div
			{...dragProps}
			data-is-dragging={isDragging}
			className={`border rounded-[5px] p-[10px] border-grey-3 w-[calc((100%-20px)/3)] h-max ${
				isDraggable ? "cursor-grab" : ""
			} h-[115px]`}
		>
			<div className="flex justify-between">
				<div className="flex  gap-[10px] w-full">
					<div className="h-10 w-10 rounded-[5px]">
						<ApiPlaceholder />
					</div>
					<div className="flex flex-col w-full">
						<div className="flex justify-between">
							<div className="flex items-center">
								<Logo className="h-4 w-4 icon-grey-5" />
								<div class="text-grey-5 text-xs font-bold font-['Inter'] ml-[3px]">
									API
								</div>
								<div class="text-white text-xs font-medium font-['Inter'] leading-[11px] ml-[8px]">
									Dribble
								</div>
							</div>
						</div>
						<div class="text-[#aeaeae] text-xs font-medium font-['Inter'] leading-[14px] mt-[6px]">
							Short description about the API, its functions etc etc etc etc
						</div>

						<div className="flex gap-[10px] bg-secondary-yellow-20 w-max mt-5 cursor-pointer">
							<SBadge
								label="Add to My APIs"
								className="!bg-secondary-yellow-20 !text-white"
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
