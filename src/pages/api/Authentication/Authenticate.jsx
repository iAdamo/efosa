import { postGenericCRUDWithID } from "@/axios/apiCalls";
import ValidationError from "@/components/ValidationError";
import { useState } from "react";
import { toast } from "sonner";
import APIKey from "./AuthenticationTypes/APIKey";
import Basic from "./AuthenticationTypes/Basic";
import JWT from "./AuthenticationTypes/JWT";
import OAuth from "./AuthenticationTypes/OAuth";
import DropdownMenu from "./DropdownMenu";
import ValidationSuccess from "@/components/ValidationSuccess";

export default function Authenticate(props) {
	const { direction, APIID, refreshFunction, auth, setAuth } = props;
	const [dropdownOpen, setDropdownOpen] = useState(false);

	const [dropdownSelected, setDropdownSelected] = useState(auth?.authType);
	const [isOAuthError, setIsOAuthError] = useState(false)
	const [showAlertMessage, setShowAlertMessage] = useState(false)

	const [validationIssues, setValidationIssues] = useState(null);
	const [isUserAcceptedClicked, setIsUserAcceptedClicked] = useState(false);

	const changeAuthMethodClick = async (authMethod) => {
		if (authMethod !== auth.authType) {
			const updatedAuthMethod = await postGenericCRUDWithID(
				"API_Authentication",
				auth.id,
				{
					authType: authMethod,
				},
			);
			setAuth(updatedAuthMethod.data);
			setDropdownSelected(authMethod);
		}
	};

	const acceptAuthentication = async () => {
		setIsUserAcceptedClicked(false);
		try {
			setValidationIssues(null)
			const accepted = await postGenericCRUDWithID(
				"API_Authentication",
				auth.id,
				{
					isUserAccepted: true,
				},
			);
			setIsUserAcceptedClicked(true);

			setAuth(accepted.data);

			if (accepted.validation_issues) {
				setValidationIssues(accepted.validation_issues)
			}

			toast.success("Authenticated!");

		} catch (error) {
			console.error(error);
		}
	};

	return (
		<>
			<div className="bg-[#080808] p-5 rounded-[10px] gap-5 flex flex-col w-[28vw]">
				<div className="flex-col gap-5 inline-flex">
					<div className="self-stretch h-[18px] justify-start items-start gap-2.5 flex">
						<div className="pr-2.5 justify-start items-center inline-flex">
							<div className="justify-start items-top gap-[5px] flex relative">
								<div className="text-sm text-white font-bold font-['Inter'] relative">
									{auth?.authType == "OAUTH" && <>OAuth </>}
									{auth?.authType == "JWT" && <>JWT </>}
									{auth?.authType == "BASIC" && <>Basic </>}
									{auth?.authType == "APIKEY" && <>Custom API Key </>}
								</div>
							</div>

						</div>

						<div className="w-[345px] h-9 flex-col justify-start items-start gap-1 inline-flex">
							<div className="justify-start items-start inline-flex">
								<div className="text-yellow-400 text-xs font-medium font-['Inter'] leading-none tracking-tight">
									How do I authenticate this API?
								</div>
								<div className="w-5 h-[15px] p-2.5 justify-center items-center gap-2.5 flex" />
							</div>
							<div className="w-[345px] text-neutral-200 text-xs font-medium font-['Inter'] leading-none tracking-tight">
								*Authentication is required before activating integration.
							</div>
						</div>

						<div
							className="flex-grow text-yellow-400
text-xs
font-medium
font-['Inter']
leading-none
tracking-tight flex justify-end"
						>
							<div
								className="select-none cursor-pointer"
								onClick={() => {
									setDropdownOpen(!dropdownOpen);
								}}
							>
								Change
							</div>
							<div className="relative">
								{dropdownOpen && (
									<DropdownMenu
										setDropdownSelected={changeAuthMethodClick}
										setDropdownOpen={setDropdownOpen}
									/>
								)}
							</div>
						</div>

					</div>
					<div className="relative">
						{auth?.authType === "JWT" && (
							<>
								<JWT auth={auth} setAuth={setAuth} APIID={APIID} />
							</>
						)}
						{auth?.authType === "BASIC" && (
							<>
								<Basic auth={auth} setAuth={setAuth} APIID={APIID} />
							</>
						)}
						{auth?.authType === "OAUTH" && (
							<>
								<OAuth auth={auth} setAuth={setAuth} APIID={APIID} />
							</>
						)}
						{auth?.authType === "APIKEY" && (
							<>
								<APIKey auth={auth} setAuth={setAuth} APIID={APIID} />
							</>
						)}
					</div>
					<div className="flex flex-grow">
						<div
							className="cursor-pointer w-[109px] px-[15px] py-2 bg-yellow-400 rounded-[50px] shadow justify-center items-center gap-0.5 inline-flex"
							onClick={() => {
								acceptAuthentication();
							}}
							onKeyDown={() => { }}
						>
							<div className="text-zinc-800 text-xs font-semibold font-['Inter'] leading-[14px] tracking-tight">
								Authenticate
							</div>
						</div>
					</div>
				</div>
				{validationIssues && <ValidationError validationIssues={validationIssues} />}
				{isUserAcceptedClicked && auth?.authType === 'OAUTH' && !validationIssues && (
					<>
						<ValidationSuccess /></>
				)}

			</div>
		</>
	);
}
