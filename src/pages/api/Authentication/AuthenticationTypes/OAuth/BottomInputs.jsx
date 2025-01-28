import {
	addAuth,
	postGenericCRUD,
	postGenericCRUDWithID,
} from "@axios/apiCalls";
import { useState } from "react";
import SInput from "../../../../../components/SInput";
import { toast } from "sonner";
import { ProjectContext } from "@/contexts/ProjectContext";
import { useContext } from "react";
import CustomRow from "./CustomRow";

export default function BottomInputs(props) {
	const { APIID, auth, setAuth } = props;

	return (
		<>
			{auth.oauth.customRows.map((customRow, index) => {
				return (
					<CustomRow
						key={customRow.id}
						index={index}
						customRow={customRow}
						auth={auth}
						setAuth={setAuth}
					/>
				);
			})}

			<div className="h-10 flex-grow w-[100%] p-2.5 bg-zinc-800 rounded-[5px] justify-start items-center gap-[5px] inline-flex">
				<div className="w-5 h-[15px] p-2.5 justify-center items-center gap-2.5 flex">
					<div className="w-[13px] h-[15px] relative">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="14"
							height="16"
							viewBox="0 0 14 16"
							fill="none"
						>
							<g clip-path="url(#clip0_1458_14832)">
								<path
									d="M7.69699 2.60938C7.69699 2.21973 7.3865 1.90625 7.00056 1.90625C6.61462 1.90625 6.30413 2.21973 6.30413 2.60938V7.29688H1.66127C1.27533 7.29688 0.964844 7.61035 0.964844 8C0.964844 8.38965 1.27533 8.70312 1.66127 8.70312H6.30413V13.3906C6.30413 13.7803 6.61462 14.0938 7.00056 14.0938C7.3865 14.0938 7.69699 13.7803 7.69699 13.3906V8.70312H12.3398C12.7258 8.70312 13.0363 8.38965 13.0363 8C13.0363 7.61035 12.7258 7.29688 12.3398 7.29688H7.69699V2.60938Z"
									fill="white"
								/>
							</g>
							<defs>
								<clipPath id="clip0_1458_14832">
									<rect
										width="13"
										height="15"
										fill="white"
										transform="translate(0.5 0.5)"
									/>
								</clipPath>
							</defs>
						</svg>
					</div>
				</div>
				<div
					className="grow shrink basis-0 self-stretch justify-start items-center gap-[5px] flex cursor-pointer"
					onClick={async () => {
						const newCustomRow = await postGenericCRUD(
							"Authentication_OAuth_Custom",
							{
								authenticationOAuthID: auth.oauth.id,
							},
						);
						setAuth({
							...auth,
							oauth: {
								...auth.oauth,
								customRows: [...auth.oauth.customRows, newCustomRow.data[0]],
							},
						});
					}}
					onKeyDown={() => {}}
				>
					<div className="text-white text-xs font-normal font-['Inter'] leading-[14px]">
						Add row
					</div>
				</div>
			</div>
		</>
	);
}
