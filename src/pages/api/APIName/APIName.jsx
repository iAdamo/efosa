import { ProjectContext } from "@contexts/ProjectContext";
import {
	createUploadApi,
	getGenericCRUDWithID,
	updateAPICustomName,
	uploadAPIFile,
} from "@axios/apiCalls";
import { useContext, useRef, useState } from "react";
import SInput from "../../../components/SInput";
import SButton from "@/components/SButton";
import { useEffect } from "react";

export default function APIName(props) {
	const { direction, isMyAPI, APIID, myAPI, customName } = props;

	const [newName, setNewName] = useState(customName);

	const updateProjectName = async () => {
		if (newName.length == 0) {
			return;
		}

		const APICall = await updateAPICustomName(APIID, newName);
	};

	useEffect(() => {
		setNewName(customName);
	}, [APIID]);

	return (
		<>
			<div className="bg-[#080808] p-5 rounded-[10px] gap-5 flex flex-col w-[28vw] mb-5">
				<div className="self-stretch h-[17px] flex-col justify-start items-start gap-2.5 flex">
					<div className="self-stretch pr-2.5 justify-start items-center inline-flex">
						<div className="justify-start items-center gap-[5px] flex">
							<div className="text-[#f5c519] text-lg font-bold font-['Inter']">
								My APIs
							</div>
							<div className="text-white text-lg font-bold font-['Inter']">
								Name
							</div>
							<div className="w-5 h-[15px] p-2.5 justify-center items-center gap-2.5 flex" />
						</div>
					</div>
				</div>
				<div className="w-[345px]">
					<span className="text-neutral-200 text-xs font-medium font-['Inter'] leading-none tracking-tight">
						Set custom name for your personal{" "}
					</span>
					<span className="text-yellow-400 text-xs font-medium font-['Inter'] leading-none tracking-tight">
						API collection
					</span>
				</div>
				<div className="self-stretch flex-col justify-start items-end flex">
					<div className="self-stretch flex-col justify-start items-start gap-[5px] flex">
						<div className="w-[345px] px-3 justify-start items-center gap-[5px] inline-flex">
							<div className="grow shrink basis-0 h-3.5 rounded-[5px] justify-start items-center gap-2.5 flex">
								<div className="justify-start items-center gap-[5px] flex">
									<div className="text-zinc-400 text-xs font-normal font-['Inter'] leading-[14px]">
										Name
									</div>
								</div>
							</div>
						</div>
						<div className="self-stretch flex-col justify-start items-start gap-1 flex">
							<div className="self-stretch h-10 flex-col justify-start items-start gap-[5px] flex">
								<div className="self-stretch justify-start items-center gap-2.5 inline-flex">
									<div className="grow shrink basis-0 self-stretch bg-neutral-700 rounded-[5px] justify-start items-center gap-2.5 flex">
										<div className="grow shrink basis-0 flex-col justify-center items-start gap-[5px] inline-flex">
											<div className="self-stretch justify-start items-center gap-[5px] inline-flex">
												<SInput
													type="text"
													className="text-white text-xs font-normal font-['Inter'] leading-[11px] bg-neutral-700 rounded-[5px] w-[100%]"
													onChange={(e) => {
														setNewName(e.target.value);
													}}
													placeholder={"Name"}
													value={newName}
													defaultValue={newName}
												/>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<SButton
					sType="button"
					onClick={() => {
						updateProjectName();
					}}
					className="px-[15px] w-max h-full py-2 bg-secondary-yellow rounded-[50px] shadow justify-center items-center gap-0.5 inline-flex"
				>
					<span className="grow shrink basis-0 text-center !text-black text-xs font-semibold font-['Inter'] leading-[14px] tracking-normal">
						Save name
					</span>
				</SButton>
			</div>
		</>
	);
}
