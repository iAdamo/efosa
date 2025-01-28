import SButton from "@/components/SButton";
import ApiCubes from "@assets/icons/api-cubes.svg?react";
import Magic from "@assets/icons/magic.svg?react";

export default function AlternateMethods() {
	return (
		<div className="flex flex-col gap-5">
			<div class="w-[345px] text-neutral-200 text-xs font-medium font-['Inter'] leading-none tracking-tight">
				You may also choose to Build an API or generate using AI
			</div>
			<div className="flex gap-[15px]">
				<SButton
					sType="button"
					onClick={() => {}}
					className="px-[15px] gap-[5px] w-max h-full bg-grey-9 rounded-[50px] shadow justify-center items-center flex"
				>
					<ApiCubes className="icon-grey-5" />
					<div class="text-white text-base font-semibold font-['Inter'] leading-[14px] tracking-tight">
						API Builder
					</div>
				</SButton>
				<SButton
					sType={"build"}
					className="gap-[5px] flex items-center ai-btn "
					onClick={() => {}}
				>
					<Magic className="h-[16px] w-fit icon-white" />
					<div class="text-white text-xs font-semibold font-['Inter'] leading-[14px] tracking-tight">
						Generate
					</div>
				</SButton>
			</div>
		</div>
	);
}
