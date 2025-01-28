import SInput from "@/components/SInput";
import { ProjectContext } from "@/contexts/ProjectContext";
import { addAuth, postGenericCRUDWithID } from "@axios/apiCalls";
import { useContext } from "react";
import { useState } from "react";
import { toast } from "sonner";

export default function APIKey(props) {
	const { APIID, auth } = props;

	const { refreshProjectInitialData } = useContext(ProjectContext);

	return (
		<>
			<div className="w-[360px] flex-col justify-start items-start gap-[30px] inline-flex">
				<div className="self-stretch h-[83px] flex-col justify-start items-end flex">
					<div className="self-stretch h-[83px] flex-col justify-start items-start gap-[5px] flex">
						<div className="w-[345px] px-3 justify-start items-center gap-[5px] inline-flex">
							<div className="grow shrink basis-0 h-3.5 rounded-[5px] justify-start items-center gap-2.5 flex">
								<div className="justify-start items-center gap-[5px] flex">
									<div className="text-zinc-400 text-xs font-normal font-['Inter'] leading-[14px]">
										API Key name*
									</div>
								</div>
							</div>
						</div>
						<div className="self-stretch h-16 flex-col justify-start items-start gap-1 flex">
							<div className="self-stretch h-11 flex-col justify-start items-start gap-[5px] flex">
								<div className="self-stretch h-11 justify-start items-center gap-2.5 inline-flex">
									<div className="grow shrink basis-0 self-stretch bg-neutral-700 rounded-[5px] justify-start items-center gap-2.5 flex">
										<div className="grow shrink basis-0 flex-col justify-center items-start gap-[5px] inline-flex">
											<div className="self-stretch justify-start items-center gap-[5px] inline-flex">
												<div className="grow shrink basis-0 h-[11px] justify-start items-center gap-[5px] flex">
													<SInput
														type="text"
														className="h-11 border-0 text-zinc-400 text-xs font-normal font-['Inter'] leading-[11px] bg-neutral-700 rounded-[5px] w-[100%]"
														placeholder="Enter API Key name"
														autoComplete="off"
														onBlur={async (e) => {
															await postGenericCRUDWithID(
																"Authentication_API_Key",
																auth.apikey.id,
																{
																	keyName: e.target.value,
																},
															);
														}}
														defaultValue={auth.apikey.keyName}
													/>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div className="self-stretch pl-3 justify-start items-center gap-[5px] inline-flex">
								<div className="grow shrink basis-0 opacity-0 text-zinc-400 text-xs font-medium font-['Inter'] leading-none">
									Placeholder
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="self-stretch flex-col justify-start items-end flex">
					<div className="self-stretch flex-col justify-start items-start gap-[5px] flex">
						<div className="w-[345px] px-3 justify-start items-center gap-[5px] inline-flex">
							<div className="grow shrink basis-0 h-3.5 rounded-[5px] justify-start items-center gap-2.5 flex">
								<div className="justify-start items-center gap-[5px] flex">
									<div className="text-zinc-400 text-xs font-normal font-['Inter'] leading-[14px]">
										API Key value*
									</div>
								</div>
							</div>
						</div>
						<div className="self-stretch h-16 flex-col justify-start items-start gap-1 flex">
							<div className="self-stretch h-11 flex-col justify-start items-start gap-[5px] flex">
								<div className="self-stretch h-11 justify-start items-center gap-2.5 inline-flex">
									<div className="grow shrink basis-0 self-stretch bg-neutral-700 rounded-[5px] justify-start items-center gap-2.5 flex">
										<div className="grow shrink basis-0 flex-col justify-center items-start gap-[5px] inline-flex">
											<div className="self-stretch justify-start items-center gap-[5px] inline-flex">
												<div className="grow shrink basis-0 h-[11px] justify-start items-center gap-[5px] flex">
													<SInput
														type="password"
														className="h-11 text-zinc-400 border-0 text-xs font-normal font-['Inter'] leading-[11px] bg-neutral-700 rounded-[5px] w-[100%]"
														placeholder="Enter value"
														autoComplete="off"
														onBlur={async (e) => {
															await postGenericCRUDWithID(
																"Authentication_API_Key",
																auth.apikey.id,
																{
																	keyValue: e.target.value,
																},
															);
														}}
													/>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div className="self-stretch pl-3 justify-start items-center gap-[5px] inline-flex">
								<div className="grow shrink basis-0 opacity-0 text-zinc-400 text-xs font-medium font-['Inter'] leading-none">
									Placeholder
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
