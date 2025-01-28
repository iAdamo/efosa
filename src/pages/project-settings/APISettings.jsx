import { SCheckbox } from "@/components/SCheckbox";
import Info from "@assets/icons/info.svg?react";
import Settings from "@assets/icons/settings.svg?react";
import SSelectDropdown, { DropdownItem } from "@/components/SSelectDropdown";
import RightArrow from "@assets/icons/right-arrow.svg?react";
import TwoWayArrow from "@assets/icons/two-way-arrow.svg?react";
import { v4 as uuidv4 } from "uuid";

export default function APISettings() {
	return (
		<div className="rounded-[5px] bg-grey-1 py-[10px] flex settings-wrapper">
			<div className="lg:w-[18vw] xl:w-[14vw] border-r px-[10px] border-r-grey-2 flex flex-col source-settings-wrapper">
				<div>
					<span className="text-[#d32dca] text-xs font-normal font-['Inter'] leading-[14px]">
						API 1
					</span>
					{"  "}
					<span className="text-[#aeaeae] text-xs font-normal font-['Inter'] leading-[14px]">
						Actions
					</span>
				</div>
				<div className="flex items-center justify-between ">
					<div className="flex items-center">
						<SCheckbox isSelected={true} value="put_data">
							<div>
								<span className="text-neutral-200 text-xs font-bold font-['Inter'] leading-[14px] tracking-tight">
									GET{" "}
								</span>
								<span className="text-neutral-200 text-xs font-medium font-['Inter'] leading-[14px] tracking-tight">
									data1*
								</span>
							</div>
						</SCheckbox>
					</div>
					<Info className="icon-grey-5 ml-[10px]" />
				</div>
				<div className="flex items-center justify-between ">
					<SCheckbox value="put_data">
						<div>
							<span className="text-neutral-200 text-xs font-bold font-['Inter'] leading-[14px] tracking-tight">
								UPDATE{" "}
							</span>
							<span className="text-neutral-200 text-xs font-medium font-['Inter'] leading-[14px] tracking-tight">
								data1*
							</span>
						</div>
					</SCheckbox>
					<Info className="icon-grey-5 ml-[10px]" />
				</div>
			</div>
			<div className="lg:w-[19vw] xl:w-[17vw] border-r px-[10px] border-r-grey-2 flex flex-col">
				<div className="text-[#aeaeae] text-xs font-normal font-['Inter'] leading-[14px]">
					Data direction
				</div>
				<div className="flex items-end justify-between mt-[5px]">
					<SSelectDropdown
						defaultValue={
							<div
								key={uuidv4()}
								className="flex gap-2 cursor-pointer items-center"
							>
								<RightArrow className="s-icon-grey-5" alt="tick" />

								<div>
									<span className="text-white text-xs font-medium font-['Inter'] leading-4">
										From{" "}
									</span>
									<span className="text-[#d32dca] text-xs font-medium font-['Inter'] leading-4">
										API 1
									</span>
									<span className="text-white text-xs font-medium font-['Inter'] leading-4">
										{" "}
										to{" "}
									</span>
									<span className="text-[#00efd9] text-xs font-medium font-['Inter'] leading-4">
										API 2
									</span>
								</div>
							</div>
						}
						onChange={(val) => {}}
					>
						<DropdownItem
							item={
								<div
									key={uuidv4()}
									className="flex gap-2 cursor-pointer items-center"
								>
									<RightArrow className="s-icon-grey-5" alt="tick" />

									<div>
										<span className="text-white text-xs font-medium font-['Inter'] leading-4">
											From{" "}
										</span>
										<span className="text-[#d32dca] text-xs font-medium font-['Inter'] leading-4">
											API 1
										</span>
										<span className="text-white text-xs font-medium font-['Inter'] leading-4">
											{" "}
											to{" "}
										</span>
										<span className="text-[#00efd9] text-xs font-medium font-['Inter'] leading-4">
											API 2
										</span>
									</div>
								</div>
							}
						/>
						<DropdownItem
							item={
								<div key={uuidv4()} className="flex gap-2 cursor-pointer">
									<TwoWayArrow className="s-icon-grey-5" alt="tick" />

									<div class="text-white text-xs font-medium font-['Inter'] leading-4 ">
										Two-way integration
									</div>
								</div>
							}
						/>
					</SSelectDropdown>
				</div>
			</div>
			<div className="lg:w-[18vw] xl:w-[14vw] px-[10px]  flex flex-col destination-settings-wrapper">
				<div>
					<span className="text-secondary-mint-green text-xs font-normal font-['Inter'] leading-[14px]">
						API 2
					</span>
					{"  "}
					<span className="text-[#aeaeae] text-xs font-normal font-['Inter'] leading-[14px]">
						Actions
					</span>
				</div>
				<div className="flex items-center justify-between">
					<SCheckbox isSelected={true} value="put_data">
						<div>
							<span className="text-neutral-200 text-xs font-bold font-['Inter'] leading-[14px] tracking-tight">
								POST{" "}
							</span>
							<span className="text-neutral-200 text-xs font-medium font-['Inter'] leading-[14px] tracking-tight">
								data1*
							</span>
						</div>
					</SCheckbox>
					<Info className="icon-grey-5 ml-[10px]" />
				</div>
				<div className="flex items-center justify-between">
					<SCheckbox value="put_data">
						<div>
							<span className="text-neutral-200 text-xs font-bold font-['Inter'] leading-[14px] tracking-tight">
								GET{" "}
							</span>
							<span className="text-neutral-200 text-xs font-medium font-['Inter'] leading-[14px] tracking-tight">
								data1*
							</span>
						</div>
					</SCheckbox>
					<Info className="icon-grey-5 ml-[10px]" />
				</div>
				<div className="flex items-center justify-between">
					<SCheckbox value="put_data">
						<div>
							<span className="text-neutral-200 text-xs font-bold font-['Inter'] leading-[14px] tracking-tight">
								UPDATE{" "}
							</span>
							<span className="text-neutral-200 text-xs font-medium font-['Inter'] leading-[14px] tracking-tight">
								data1*
							</span>
						</div>
					</SCheckbox>
					<Info className="icon-grey-5 ml-[10px]" />
				</div>
			</div>
		</div>
	);
}
