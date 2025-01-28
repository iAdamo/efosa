import AddApiIcon from "@assets/icons/add-api.svg?react";
import EmptyHandUp from "@assets/icons/empty-hand-up.svg?react";
import CirclePlay from "@assets/icons/circle-play-solid.svg?react";
import EmptyApiHand from "@assets/icons/api-builder-empty-hand.svg?react";
import ApiCubes from "@assets/icons/api-cubes.svg?react";

export default function ProjectSettingsEmptyComponent() {
	return (
		<div className="flex w-full h-full">
			<div className="flex gap-8 items-center justify-center w-full h-full">
				<div className="flex flex-col gap-10 items-center ">
					<div className="border-2 hover:border-solid group hover:bg-secondary-yellow-20 border-grey-5 border-dashed hover:border-custom-yellow p-[10px] rounded-[10px] w-full h-[14vh] flex items-center justify-center">
						<div className="flex gap-[5px] items-center">
							<ApiCubes className="w-5 h-5 icon-white group-hover:icon-yellow-2" />
							<div class="text-[#aeaeae] text-[16px] font-semibold font-['Inter'] leading-3 group-hover:text-custom-yellow">
								Build new API
							</div>
						</div>
					</div>
					<div className="flex gap-[24px]">
						<EmptyApiHand className="w-20 h-21" />
						<div className="flex flex-col gap-[10px] items-center">
							<div class="text-center text-white text-[16px] font-bold font-['Inter'] leading-tight tracking-tight group-hover:text-custom-yellow">
								Build your own
							</div>
							<div class="w-[263px] h-[66px] text-center text-white text-xs font-normal font-['Inter'] leading-[14px]">
								Your API library is feeling lonely! Upload an API to start
								building your own collection of digital awesomeness, or have
								look in our public library
							</div>
							<div className="flex gap-2 p-2 pt-0">
								<CirclePlay />
								<div class="text-[#2f9bff] text-xs font-semibold font-['Inter'] leading-3">
									Watch tutorial
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="flex flex-col gap-10 items-center">
					<div className="border-2 hover:border-solid group hover:bg-secondary-yellow-20 border-grey-5 border-dashed hover:border-custom-yellow p-[10px] rounded-[10px] w-full h-[14vh] flex items-center justify-center">
						<div className="flex gap-[5px] items-center">
							<AddApiIcon className="w-5 h-5 icon-white group-hover:icon-yellow-2" />
							<div class="text-[#aeaeae] text-lg font-semibold font-['Inter'] leading-3 group-hover:text-custom-yellow">
								Add new API
							</div>
						</div>
					</div>
					<div className="flex gap-[24px]">
						<EmptyHandUp className="w-20 h-21" />
						<div className="flex flex-col gap-[10px] items-center">
							<div class="text-center text-white text-[16px] font-bold font-['Inter'] leading-tight tracking-tight group-hover:text-custom-yellow">
								No APIs uploaded yet!
							</div>
							<div class="w-[263px] h-[66px] text-center text-white text-xs font-normal font-['Inter'] leading-[14px]">
								Your API library is feeling lonely! Upload an API to start
								building your own collection of digital awesomeness, or have
								look in our public library
							</div>
							<div className="flex gap-2 p-2 pt-0">
								<CirclePlay />
								<div class="text-[#2f9bff] text-xs font-semibold font-['Inter'] leading-3">
									Watch tutorial
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
