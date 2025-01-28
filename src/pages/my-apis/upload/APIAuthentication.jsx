import { useState } from "react";
import Info from "@assets/icons/info.svg?react";
import OpenLink from "@assets/icons/open-link.svg?react";
import SInput from "@/components/SInput";
import { Checkbox } from "react-aria-components";
import Tick from "@assets/icons/tick.svg?react";

export default function APIAuthentication() {
	const [canAuthenticate, setCanAuthenticate] = useState(true);
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [skip, setSkip] = useState(false);

	return (
		<div className="bg-[#080808] p-5 rounded-[10px] gap-5 flex flex-col w-[28vw]">
			<div className="flex justify-between">
				<div className="flex gap-[5px] items-center">
					<div class="text-[#f5c519] text-lg font-bold font-['Inter']">
						Authenticate
					</div>
					<div class="text-white text-lg font-bold font-['Inter']">
						{canAuthenticate ? "Basic" : " Pending upload"}
					</div>
					<Info className="icon-grey-5 ml-[3px]" />
				</div>
				<div
					class={`${
						canAuthenticate ? "text-custom-yellow" : "text-[#3c3c3c]"
					} text-xs font-medium font-['Inter'] leading-none tracking-normal `}
				>
					Change
				</div>
			</div>
			{!canAuthenticate ? (
				<>
					<div class=" text-neutral-200 text-xs font-medium font-['Inter'] leading-none tracking-normal">
						Insert API code to enable authentication
					</div>
					<SButton
						sType="button"
						onClick={() => {}}
						className="px-[15px] w-max h-full my-5 bg-grey-9 rounded-[50px] shadow justify-center items-center gap-0.5 inline-flex"
					>
						<div class="text-center text-[#8c8c8c] text-xs font-semibold font-['Inter'] leading-[14px] tracking-normal">
							Authenticate
						</div>
					</SButton>
				</>
			) : (
				<div className="flex flex-col gap-5 authenticate-wrapper">
					<div className="flex flex-col gap-[6px]">
						<div className="flex gap-2">
							<div class="text-[#f5c519] text-xs font-medium font-['Inter'] leading-none tracking-normal">
								How do I authenticate this API?
							</div>
							<OpenLink className="icon-yellow-2" />
						</div>
						<div class="text-neutral-200 text-xs font-medium font-['Inter'] leading-none tracking-normal">
							*Authentication is required before activating integration.
						</div>
					</div>
					<div className="flex flex-col gap-1">
						<div class="text-[#aeaeae] text-xs font-normal font-['Inter'] leading-[14px]">
							Username*
						</div>
						<SInput
							type="text"
							className="modal-header input "
							placeholder="Enter username*"
							value={username}
							onChange={(e) => {
								setUsername(e.target.value);
							}}
						/>
					</div>
					<div className="flex flex-col gap-1">
						<div class="text-[#aeaeae] text-xs font-normal font-['Inter'] leading-[14px]">
							Password*
						</div>
						<SInput
							type="text"
							className="modal-header input "
							placeholder="Enter password*"
							value={password}
							onChange={(e) => {
								setPassword(e.target.value);
							}}
						/>
					</div>
				</div>
			)}
			<div className="flex gap-[10px] items-center">
				<Checkbox
					onChange={() => setSkip(!skip)}
					className="w-4 h-4 rounded-[2px] border border-custom-yellow flex items-center justify-center"
				>
					{skip && <Tick className="w-[14px] h-[14px] icon-yellow-2" />}
				</Checkbox>
				<div class="text-neutral-200 text-xs font-medium font-['Inter'] leading-[14px] tracking-normal">
					Skip. I will cross that bridge later!
				</div>
			</div>
		</div>
	);
}
