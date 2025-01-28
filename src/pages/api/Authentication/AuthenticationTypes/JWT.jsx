import { addAuth, postGenericCRUDWithID } from "@axios/apiCalls";
import { useState } from "react";
import SInput from "../../../../components/SInput";
import { toast } from "sonner";
import { ProjectContext } from "@/contexts/ProjectContext";
import { useContext } from "react";

export default function JWT(props) {
	const [JWT, setJWT] = useState("");

	const { APIID, auth } = props;

	return (
		<>
			<div className="w-[360px] flex-col justify-start items-end inline-flex">
				<div className="self-stretch flex-col justify-start items-start gap-[5px] flex">
					<div className="w-[345px] px-3 justify-start items-center gap-[5px] inline-flex">
						<div className="grow shrink basis-0 h-3.5 rounded-[5px] justify-start items-center gap-2.5 flex">
							<div className="justify-start items-center gap-[5px] flex">
								<div className="text-zinc-400 text-xs font-normal font-['Inter'] leading-[14px]">
									Token*
								</div>
							</div>
						</div>
					</div>
					<div className="self-stretch h-16 flex-col justify-start items-start gap-1 flex">
						<div className="self-stretch h-11 flex-col justify-start items-start gap-[5px] flex">
							<SInput
								type="text"
								className="text-zinc-400 text-xs font-normal font-['Inter'] leading-[11px] bg-neutral-700 rounded-[5px] w-[100%]"
								placeholder="Insert JWT token*"
								onBlur={async (e) => {
									await postGenericCRUDWithID(
										"Authentication_JWT",
										auth.jwt.id,
										{
											secret: e.target.value,
										},
									);
								}}
							/>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
