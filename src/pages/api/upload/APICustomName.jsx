import SButton from "@/components/SButton";
import SInput from "@/components/SInput";
import Info from "@assets/icons/info.svg?react";
import { useState } from "react";

export default function APICustomName() {
	const [name, setName] = useState("");

	const handleSave = () => {};

	return (
		<div className="bg-[#080808] p-5 rounded-[10px] gap-5 flex flex-col w-[28vw] mb-5">
			<div className="flex gap-[5px] items-center">
				<div class="text-[#f5c519] text-lg font-bold font-['Inter']">
					My APIs
				</div>
				<div class="text-white text-lg font-bold font-['Inter']">Name</div>
				<Info className="icon-grey-5 ml-[3px]" />
			</div>
			<div className="flex gap-[5px]">
				<span className="text-neutral-200 text-xs font-medium font-['Inter'] leading-none tracking-tight">
					Set custom name for your personal{" "}
				</span>
				<span className="text-[#f5c519] text-xs font-medium font-['Inter'] leading-none tracking-tight">
					API collection
				</span>
			</div>
			<div className="flex flex-col gap-[5px]">
				<div class="text-[#aeaeae] text-xs font-normal font-['Inter'] leading-[14px] mx-3">
					Name
				</div>
				<SInput
					type="text"
					className="modal-headerinput "
					placeholder="Search"
					value={name}
					onChange={(e) => {
						setName(e.target.value);
					}}
				/>
			</div>
			<SButton
				sType="button"
				onClick={() => {
					handleSave();
				}}
				className="px-[15px] w-max h-full py-2 bg-secondary-yellow rounded-[50px] shadow justify-center items-center gap-0.5 inline-flex"
			>
				<span className="grow shrink basis-0 text-center !text-black text-xs font-semibold font-['Inter'] leading-[14px] tracking-normal">
					Save to My APIs
				</span>
			</SButton>
		</div>
	);
}
