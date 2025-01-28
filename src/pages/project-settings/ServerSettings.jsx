import { useState } from "react";
import SInput from "../../components/SInput";
import hand from "@assets/images/hand2-coming-soon.svg";

function CustomServerSetting({ index, text, isChecked, setIsChecked }) {
	return (
		<>
			<div className="justify-start items-center gap-2.5 w-[100%]">
				<div className="text-zinc-400 text-xs font-normal font-['Inter'] leading-[14px]">
					Server {index + 1}
				</div>
				<div className="flex flex-col">
					<div>
						<SInput
							type="text"
							className="w-[100%] text-zinc-400
text-xs
font-normal
font-['Inter']
leading-[11px] bg-[#3C3C3C] rounded-[5px]"
							placeholder="Enter custom name"
						/>
					</div>
					<div className="mt-[16px] flex">
						<div className="w-[30px] h-[30px] justify-center items-center flex">
							<div className="rounded-[100px] justify-center items-center flex">
								<div className="p-2 justify-center items-center flex">
									<div
										className="w-[24px] h-[24px] rounded-[50px] border-[3px] border-[#F6C519] p-[2px] flex justify-center items-center"
										onClick={() => {
											setIsChecked(index);
										}}
									>
										{isChecked && (
											<div className="bg-[#F6C519] rounded-[50px] h-[12px] w-[12px]">
												&nbsp;
											</div>
										)}
									</div>
								</div>
							</div>
						</div>
						<div className="flex-grow">
							<SInput
								type="text"
								className="w-[100%] text-zinc-400
text-xs
font-normal
font-['Inter']
leading-[11px] bg-[#3C3C3C] rounded-[5px]"
								placeholder="Insert server URL"
							/>
						</div>
					</div>
				</div>
				<div className="justify-start items-center gap-0.5 flex">
					<div>
						<span className="text-neutral-200 text-xs font-medium font-['Inter'] leading-[14px] tracking-tight">
							{text}
						</span>
					</div>
				</div>
			</div>
		</>
	);
}

export default function ServerSettings(props) {
	const [serverSelected, setServerSelected] = useState(0);

	const servers = [
		{
			name: "",
		},
		{
			name: "",
		},
	];

	return (
		<>
			<div className="relative flex-grow flex flex-col justify-center mt-[20px] mb-[20px] z-[9999]">
				<div className="flex flex-col absolute inset-0  h-[300px] justify-center items-center">
					<div className="justify-center flex">
						<img src={hand} className=" h-[100px]" />
					</div>
					<div className="justify-center flex mt-[20px] text-[13px]">
						We are working our asses off to get you this functionality ASAP!
					</div>
				</div>
			</div>
			<div className="h-[360px] flex flex-col justify-start items-start gap-5 inline-flex mt-[30px] opacity-10 blur-[2px]">
				<div className="self-stretch text-neutral-200 text-xs font-medium font-['Inter'] leading-none tracking-tight">
					Insert, name and select which server to run your integration.{" "}
				</div>

				{servers.map((server, index) => {
					const isRadioChecked = serverSelected == index ? true : false;
					return (
						<>
							<CustomServerSetting
								index={index}
								text={server.name}
								isChecked={isRadioChecked}
								setIsChecked={setServerSelected}
							/>
						</>
					);
				})}

				<div className="p-2.5 rounded-[5px] justify-start items-center gap-[5px] inline-flex">
					<div className="w-5 h-[15px] p-2.5 justify-center items-center gap-2.5 flex">
						<div className="w-[13px] h-[15px] relative" />
					</div>
					<div className="grow shrink basis-0 self-stretch justify-start items-center gap-[5px] flex">
						<div className="text-zinc-400 text-xs font-normal font-['Inter'] leading-[14px] tracking-tight">
							Add server
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
