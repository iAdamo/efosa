import Logo from "@assets/icons/logo.svg?react";
import Delete from "@assets/icons/delete.svg?react";
import Copy from "@assets/icons/copy.svg?react";
import ApiPlaceholder from "@assets/icons/api-placeholder.svg?react";
import SBadge from "@/components/SBadge";
import { useDrag } from "@react-aria/dnd";
import { useNavigate } from "react-router-dom";
import { deleteGenericCRUDWithID } from "@/axios/apiCalls";

export default function UploadedAPIComponent({
	isDraggable,
	myAPI,
	deleteMyAPI,
}) {
	const navigate = useNavigate();
	const { dragProps, isDragging } = useDrag({
		getItems() {
			return [
				{
					"text/plain": JSON.stringify({
						name: myAPI.API.customName,
						id: myAPI.id,
					}),
				},
			];
		},
		isDisabled: !isDraggable,
	});

	let APIName = myAPI.API?.name.toUpperCase();
	//If custom name is more than 20 characters, truncate and add ellipsis
	if (APIName?.length > 20) {
		APIName = APIName.substring(0, 20) + "...";
	}

	return (
		<div
			{...dragProps}
			data-is-dragging={isDragging}
			className={`border rounded-[5px] p-[10px] border-grey-3 md:w-[calc((100%-25px)/2)] 
      xl:w-[calc((100%-30px)/3)] pb-6 h-max ${
				isDraggable ? "cursor-grab" : ""
			} h-[115px] pt-4`}
		>
			<div className="flex justify-between">
				<div className="flex  gap-[0px] w-full">
					{/*
					<div className="h-10 w-10 rounded-[5px]">
						
						<ApiPlaceholder />
						 
					</div>
					*/}
					<div className="flex flex-col gap-[10px] w-full">
						<div className="flex justify-between">
							<div className="flex items-center">
								<Logo className="h-4 w-4 icon-yellow-2" />
								<div class="text-[#f5c519] text-xs font-bold font-['Inter'] ml-[3px]">
									API
								</div>
								<div class="text-white text-xs font-medium font-['Inter'] leading-[11px] ml-[8px]">
									{myAPI?.API?.customName
										? myAPI?.API?.customName
										: myAPI?.API?.name}
								</div>
							</div>
							<div className="flex gap-[5px] items-center">
								<div
									class="text-[#f5c519] text-xs font-medium font-['Inter'] leading-none tracking-normal cursor-pointer"
									onClick={() => {
										navigate("/builder?APIID=" + myAPI.API.id);
									}}
								>
									Edit
								</div>
								<Delete
									onClick={async () => {
										await deleteMyAPI(myAPI.id);
									}}
									className="h-4 w-4 icon-grey-5 cursor-pointer"
								/>
								{/*
								<Copy className="h-4 w-4 icon-grey-5 cursor-pointer" />
								 */}
							</div>
						</div>
						<div class="text-[#aeaeae] text-xs font-medium font-['Inter'] leading-[11px]">
							Last updated {myAPI.updatedTime}
						</div>
						<div className="flex gap-[10px] flex-wrap">
							<div className="flex gap-[10px] bg-secondary-yellow-20 w-max">
								<SBadge
									label={APIName}
									className="!bg-secondary-yellow-20 !text-white"
								/>
							</div>
							{/*
							<div className="flex gap-[10px] bg-secondary-yellow-20 w-max">
								<SBadge
									label="JWT"
									className="!bg-secondary-yellow-20 !text-white"
								/>
							</div>
							 */}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
