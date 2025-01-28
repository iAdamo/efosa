import { addAuth, postGenericCRUDWithID } from "@axios/apiCalls";
import { useState } from "react";
import SInput from "../../../../../components/SInput";
import { toast } from "sonner";
import { ProjectContext } from "@/contexts/ProjectContext";
import { useContext } from "react";
import { SCheckbox } from "@/components/SCheckbox";
import { CheckboxGroup } from "react-aria-components";
import { v4 as uuidv4 } from "uuid";
import { useEffect } from "react";

export default function TopInputs(props) {
	const { APIID, auth, setAuth, isOAuthError, showAlertMessage } = props;

	const [selected, setSelected] = useState(
		auth.oauth.shouldBeSentAsBasic ? ["isBasicAuth"] : [],
	);


	const updateIfShouldBeSentAsBasic = async (event) => {
		const shouldBeSentAsBasic = selected.includes("isBasicAuth");

		await postGenericCRUDWithID("Authentication_OAuth", auth.oauth.id, {
			shouldBeSentAsBasic: !shouldBeSentAsBasic,
		});

		setAuth((prev) => ({
			...prev,
			oauth: {
				...prev.oauth,
				shouldBeSentAsBasic: !shouldBeSentAsBasic,
			},
		}));
		setSelected(!shouldBeSentAsBasic ? ["isBasicAuth"] : []);
	};

	const [isEditingUsername, setIsEditingUsername] = useState(false);
	const [isEditingPassword, setIsEditingPassword] = useState(false);

	const [newClientIDFieldName, setNewClientIDFieldName] = useState(
		auth.oauth.clientIDFieldName,
	);

	const [newClientSecretFieldName, setNewClientSecretFieldName] = useState(
		auth.oauth.clientSecretFieldName,
	);

	return (
		<>
			<div className="self-stretch flex-col justify-start items-end flex">
				<div className="self-stretch flex-col justify-start items-start gap-[5px] flex">
					<div className="flex flex-grow w-[100%] pr-4">
						<div className="grow shrink basis-0 h-3.5 rounded-[5px] justify-start items-center gap-2.5 flex">
							<div className="justify-start items-center gap-[5px] flex">
								<div className="text-zinc-400 text-xs font-normal font-['Inter'] leading-[14px]">
									URL
								</div>
							</div>
						</div>
					</div>

					<div className="self-stretch h-16 flex-col justify-start items-start gap-1 flex">
						{/* URL input */}
						<div className={`self-stretch ${showAlertMessage ? isOAuthError ? 'border-2 rounded-[5px] border-status-error' : 'border-2 rounded-[5px] border-[#00DF9C]' : ""}  flex-col justify-start items-start gap-[5px] flex`}>
							<div className="self-stretch justify-start items-center gap-2.5 inline-flex">
								<div className="grow shrink basis-0 self-stretch bg-neutral-700 rounded-[5px] justify-start items-center gap-2.5 flex ">
									<SInput
										type="text"
										className="border-0 text-zinc-400 w-[100%] text-xs font-normal font-['Inter'] leading-[11px] bg-neutral-700 rounded-[5px]"
										onBlur={async (e) => {
											await postGenericCRUDWithID(
												"Authentication_OAuth",
												auth.oauth.id,
												{
													tokenURL: e.target.value,
												},
											);
										}}
										defaultValue={auth.oauth.tokenURL}
									/>
									<div
										className="flex pr-2 cursor-pointer"
										onClick={async (e) => {
											await postGenericCRUDWithID(
												"Authentication_OAuth",
												auth.oauth.id,
												{
													postOrGet:
														auth.oauth.postOrGet === "POST" ? "GET" : "POST",
												},
											);
											setAuth((prev) => ({
												...prev,
												oauth: {
													...prev.oauth,
													postOrGet:
														prev.oauth.postOrGet === "POST" ? "GET" : "POST",
												},
											}));
										}}
										onKeyDown={() => { }}
									>
										<div className="justify-start items-center gap-[5px] flex pr-1">
											<div className="text-yellow-400 text-xs font-normal font-['Inter'] leading-[14px]">
												{auth.oauth.postOrGet.charAt(0) +
													auth.oauth.postOrGet.substring(1).toLowerCase()}
											</div>
										</div>
										<div className="w-5 h-[15px] relative">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												width="20"
												height="16"
												viewBox="0 0 20 16"
												fill="none"
											>
												<path
													d="M6.08929 5.90446C6.80714 4.21696 8.48125 3.03571 10.4286 3.03571C11.492 3.03571 12.5125 3.45893 13.2652 4.21161L14.6634 5.60714H13.2143C12.858 5.60714 12.5714 5.89375 12.5714 6.25C12.5714 6.60625 12.858 6.89286 13.2143 6.89286H16.2143C16.5705 6.89286 16.8571 6.60625 16.8571 6.25V3.25C16.8571 2.89375 16.5705 2.60714 16.2143 2.60714C15.858 2.60714 15.5714 2.89375 15.5714 3.25V4.69911L14.1759 3.30089C13.1821 2.30714 11.8348 1.75 10.4286 1.75C7.94821 1.75 5.81875 3.25536 4.90536 5.40089C4.76607 5.72768 4.91875 6.10536 5.24554 6.24464C5.57232 6.38393 5.95 6.23125 6.08929 5.90446ZM15.9464 10.1098C16.0857 9.78304 15.9357 9.40536 15.6089 9.26607C15.2821 9.12679 14.9045 9.27679 14.7652 9.60357C14.0446 11.2884 12.3732 12.4643 10.4286 12.4643C9.36518 12.4643 8.34464 12.0411 7.59196 11.2884L6.19375 9.89286H7.64286C7.99911 9.89286 8.28571 9.60625 8.28571 9.25C8.28571 8.89375 7.99911 8.60714 7.64286 8.60714H4.64286C4.28661 8.60714 4 8.89375 4 9.25V12.25C4 12.6062 4.28661 12.8929 4.64286 12.8929C4.99911 12.8929 5.28571 12.6062 5.28571 12.25V10.8009L6.68125 12.1964C7.675 13.1929 9.02232 13.75 10.4286 13.75C12.9062 13.75 15.0304 12.25 15.9464 10.1098Z"
													fill="#AEAEAE"
												/>
											</svg>
										</div>
									</div>
								</div>
							</div>
						</div>
						{showAlertMessage && <p className={`${isOAuthError ? 'text-status-error' : 'text-[#00DF9C]'}  text-xs pl-3`}>*{isOAuthError ? 'Please review warning' : 'Validated'}</p>}
					</div>
				</div>
				<div className="self-stretch flex-col justify-start items-start gap-[5px] flex">
					<div className="flex flex-grow w-[100%] pr-4">
						<div className="grow shrink basis-0 h-3.5 rounded-[5px] justify-start items-center gap-2.5 flex">
							<div className="justify-start items-center gap-[5px] flex">
								<div className="text-zinc-400 text-xs font-normal font-['Inter'] leading-[14px]">
									Client ID ({auth.oauth.clientIDFieldName})
								</div>
							</div>
						</div>
						<div className="pl-2.5 rounded-[5px] justify-start items-center gap-2.5 flex">
							<div className="justify-start items-center gap-[5px] flex">
								{isEditingUsername ? (
									<>
										<div
											className="text-stone-300 text-xs font-normal font-['Inter'] leading-[14px] cursor-pointer"
											onClick={async (e) => {
												const newUsernameFieldName = postGenericCRUDWithID(
													"Authentication_OAuth",
													auth.oauth.id,
													{
														clientIDFieldName: newClientIDFieldName,
													},
												);
												setAuth((prev) => ({
													...prev,
													oauth: {
														...prev.oauth,
														clientIDFieldName: newClientIDFieldName,
													},
												}));

												setIsEditingUsername(false);
											}}
											onKeyDown={() => { }}
										>
											Save
										</div>
									</>
								) : (
									<>
										<div
											className="text-stone-300 text-xs font-normal font-['Inter'] leading-[14px] cursor-pointer"
											onClick={() => {
												setIsEditingUsername(true);
											}}
											onKeyDown={() => { }}
										>
											Edit
										</div>
									</>
								)}
							</div>
						</div>
					</div>

					<div className="self-stretch h-16 flex-col justify-start items-start gap-1 flex">
						{/* Client ID */}
						<div className={`self-stretch flex-col justify-start items-start gap-[5px] flex ${showAlertMessage ? isOAuthError ? 'border-2 rounded-[5px] border-status-error' : 'border-2 rounded-[5px] border-[#00DF9C]' : ""}`}>
							<div className="self-stretch justify-start items-center gap-2.5 inline-flex ">
								<div className="grow shrink basis-0 self-stretch bg-neutral-700 rounded-[5px] justify-start items-center gap-2.5 flex">
									{isEditingUsername ? (
										<>
											<SInput
												type="text"
												className="h-11  border-0 text-zinc-400 w-[100%] text-xs font-normal font-['Inter'] leading-[11px] bg-neutral-700 rounded-[5px]"
												onChange={(e) => {
													setNewClientIDFieldName(e.target.value);
												}}
												defaultValue={auth.oauth.clientIDFieldName}
												key={"clientIDFieldName"}
											/>
										</>
									) : (
										<>
											<SInput
												type="text"
												className="h-11  border-0 text-zinc-400 w-[100%] text-xs font-normal font-['Inter'] leading-[11px] bg-neutral-700 rounded-[5px]"
												onBlur={async (e) => {
													await postGenericCRUDWithID(
														"Authentication_OAuth",
														auth.oauth.id,
														{
															clientID: e.target.value,
														},
													);
												}}
												defaultValue={auth.oauth.clientID}
											/>

											<div
												className="flex pr-2 cursor-pointer"
												onClick={async (e) => {
													await postGenericCRUDWithID(
														"Authentication_OAuth",
														auth.oauth.id,
														{
															clientIDPlacement:
																auth.oauth.clientIDPlacement === "HEADER"
																	? "BODY"
																	: "HEADER",
														},
													);

													setAuth((prev) => ({
														...prev,
														oauth: {
															...prev.oauth,
															clientIDPlacement:
																prev.oauth.clientIDPlacement === "HEADER"
																	? "BODY"
																	: "HEADER",
														},
													}));
												}}
												onKeyDown={() => { }}
											>
												<div className="justify-start items-center gap-[5px] flex pr-1">
													<div className="text-yellow-400 text-xs font-normal font-['Inter'] leading-[14px]">
														{auth.oauth.clientIDPlacement.charAt(0) +
															auth.oauth.clientIDPlacement
																.substring(1)
																.toLowerCase()}
													</div>
												</div>
												<div className="w-5 h-[15px] relative">
													<svg
														xmlns="http://www.w3.org/2000/svg"
														width="20"
														height="16"
														viewBox="0 0 20 16"
														fill="none"
													>
														<path
															d="M6.08929 5.90446C6.80714 4.21696 8.48125 3.03571 10.4286 3.03571C11.492 3.03571 12.5125 3.45893 13.2652 4.21161L14.6634 5.60714H13.2143C12.858 5.60714 12.5714 5.89375 12.5714 6.25C12.5714 6.60625 12.858 6.89286 13.2143 6.89286H16.2143C16.5705 6.89286 16.8571 6.60625 16.8571 6.25V3.25C16.8571 2.89375 16.5705 2.60714 16.2143 2.60714C15.858 2.60714 15.5714 2.89375 15.5714 3.25V4.69911L14.1759 3.30089C13.1821 2.30714 11.8348 1.75 10.4286 1.75C7.94821 1.75 5.81875 3.25536 4.90536 5.40089C4.76607 5.72768 4.91875 6.10536 5.24554 6.24464C5.57232 6.38393 5.95 6.23125 6.08929 5.90446ZM15.9464 10.1098C16.0857 9.78304 15.9357 9.40536 15.6089 9.26607C15.2821 9.12679 14.9045 9.27679 14.7652 9.60357C14.0446 11.2884 12.3732 12.4643 10.4286 12.4643C9.36518 12.4643 8.34464 12.0411 7.59196 11.2884L6.19375 9.89286H7.64286C7.99911 9.89286 8.28571 9.60625 8.28571 9.25C8.28571 8.89375 7.99911 8.60714 7.64286 8.60714H4.64286C4.28661 8.60714 4 8.89375 4 9.25V12.25C4 12.6062 4.28661 12.8929 4.64286 12.8929C4.99911 12.8929 5.28571 12.6062 5.28571 12.25V10.8009L6.68125 12.1964C7.675 13.1929 9.02232 13.75 10.4286 13.75C12.9062 13.75 15.0304 12.25 15.9464 10.1098Z"
															fill="#AEAEAE"
														/>
													</svg>
												</div>
											</div>
										</>
									)}
								</div>
							</div>
						</div>
						{showAlertMessage && <p className={`${isOAuthError ? 'text-status-error' : 'text-[#00DF9C]'}  text-xs pl-3`}>*{isOAuthError ? 'Please review warning' : 'Validated'}</p>}
					</div>
				</div>
				<div className="self-stretch flex-col justify-start items-start gap-[5px] flex">
					<div className="flex flex-grow w-[100%] pr-4">
						<div className="grow shrink basis-0 h-3.5 rounded-[5px] justify-start items-center gap-2.5 flex">
							<div className="justify-start items-center gap-[5px] flex">
								<div className="text-zinc-400 text-xs font-normal font-['Inter'] leading-[14px]">
									Client Secret ({auth.oauth.clientSecretFieldName})
								</div>
							</div>
						</div>
						<div className="pl-2.5 rounded-[5px] justify-start items-center gap-2.5 flex">
							<div className="justify-start items-center gap-[5px] flex">
								{isEditingPassword ? (
									<>
										<div
											className="text-stone-300 text-xs font-normal font-['Inter'] leading-[14px] cursor-pointer"
											onClick={async (e) => {
												const newPasswordFieldName = postGenericCRUDWithID(
													"Authentication_OAuth",
													auth.oauth.id,
													{
														clientSecretFieldName: newClientSecretFieldName,
													},
												);
												setAuth((prev) => ({
													...prev,
													oauth: {
														...prev.oauth,
														clientSecretFieldName: newClientSecretFieldName,
													},
												}));

												setIsEditingPassword(false);
											}}
											onKeyDown={() => { }}
										>
											Save
										</div>
									</>
								) : (
									<>
										<div
											className="text-stone-300 text-xs font-normal font-['Inter'] leading-[14px] cursor-pointer"
											onClick={() => {
												setIsEditingPassword(true);
											}}
											onKeyDown={() => { }}
										>
											Edit
										</div>
									</>
								)}
							</div>
						</div>
					</div>

					<div className="self-stretch h-16 flex-col justify-start items-start gap-1 flex ">
						{/* Client Secret */}
						<div className={`self-stretch flex-col justify-start items-start gap-[5px] flex ${showAlertMessage ? isOAuthError ? 'border-2 rounded-[5px] border-status-error' : 'border-2 rounded-[5px] border-[#00DF9C]' : ""}`}>
							<div className="self-stretch justify-start items-center gap-2.5 inline-flex">
								<div className="grow shrink basis-0 self-stretch bg-neutral-700 rounded-[5px] justify-start items-center gap-2.5 flex">
									{isEditingPassword ? (
										<>
											<SInput
												type="text"
												className="h-11  border-0 text-zinc-400 w-[100%] text-xs font-normal font-['Inter'] leading-[11px] bg-neutral-700 rounded-[5px]"
												onChange={(e) => {
													setNewClientSecretFieldName(e.target.value);
												}}
												defaultValue={auth.oauth.clientSecretFieldName}
												key={"clientSecretFieldName"}
											/>
										</>
									) : (
										<>
											<SInput
												type="text"
												className="h-11  border-0 text-zinc-400 w-[100%] text-xs font-normal font-['Inter'] leading-[11px] bg-neutral-700 rounded-[5px]"
												onBlur={async (e) => {
													await postGenericCRUDWithID(
														"Authentication_OAuth",
														auth.oauth.id,
														{
															clientSecret: e.target.value,
														},
													);
												}}
											/>

											<div
												className="flex pr-2 cursor-pointer"
												onClick={async (e) => {
													await postGenericCRUDWithID(
														"Authentication_OAuth",
														auth.oauth.id,
														{
															secretPlacement:
																auth.oauth.secretPlacement === "HEADER"
																	? "BODY"
																	: "HEADER",
														},
													);

													setAuth((prev) => ({
														...prev,
														oauth: {
															...prev.oauth,
															secretPlacement:
																prev.oauth.secretPlacement === "HEADER"
																	? "BODY"
																	: "HEADER",
														},
													}));
												}}
												onKeyDown={() => { }}
											>
												<div className="justify-start items-center gap-[5px] flex pr-1">
													<div className="text-yellow-400 text-xs font-normal font-['Inter'] leading-[14px]">
														{auth.oauth.secretPlacement.charAt(0) +
															auth.oauth.secretPlacement
																.substring(1)
																.toLowerCase()}
													</div>
												</div>
												<div className="w-5 h-[15px] relative">
													<svg
														xmlns="http://www.w3.org/2000/svg"
														width="20"
														height="16"
														viewBox="0 0 20 16"
														fill="none"
													>
														<path
															d="M6.08929 5.90446C6.80714 4.21696 8.48125 3.03571 10.4286 3.03571C11.492 3.03571 12.5125 3.45893 13.2652 4.21161L14.6634 5.60714H13.2143C12.858 5.60714 12.5714 5.89375 12.5714 6.25C12.5714 6.60625 12.858 6.89286 13.2143 6.89286H16.2143C16.5705 6.89286 16.8571 6.60625 16.8571 6.25V3.25C16.8571 2.89375 16.5705 2.60714 16.2143 2.60714C15.858 2.60714 15.5714 2.89375 15.5714 3.25V4.69911L14.1759 3.30089C13.1821 2.30714 11.8348 1.75 10.4286 1.75C7.94821 1.75 5.81875 3.25536 4.90536 5.40089C4.76607 5.72768 4.91875 6.10536 5.24554 6.24464C5.57232 6.38393 5.95 6.23125 6.08929 5.90446ZM15.9464 10.1098C16.0857 9.78304 15.9357 9.40536 15.6089 9.26607C15.2821 9.12679 14.9045 9.27679 14.7652 9.60357C14.0446 11.2884 12.3732 12.4643 10.4286 12.4643C9.36518 12.4643 8.34464 12.0411 7.59196 11.2884L6.19375 9.89286H7.64286C7.99911 9.89286 8.28571 9.60625 8.28571 9.25C8.28571 8.89375 7.99911 8.60714 7.64286 8.60714H4.64286C4.28661 8.60714 4 8.89375 4 9.25V12.25C4 12.6062 4.28661 12.8929 4.64286 12.8929C4.99911 12.8929 5.28571 12.6062 5.28571 12.25V10.8009L6.68125 12.1964C7.675 13.1929 9.02232 13.75 10.4286 13.75C12.9062 13.75 15.0304 12.25 15.9464 10.1098Z"
															fill="#AEAEAE"
														/>
													</svg>
												</div>
											</div>
										</>
									)}
								</div>
							</div>
						</div>
						{showAlertMessage && <p className={`${isOAuthError ? 'text-status-error' : 'text-[#00DF9C]'}  text-xs pl-3`}>*{isOAuthError ? 'Please review warning' : 'Validated'}</p>}
					</div>
				</div>
				{auth.oauth.clientIDPlacement === "HEADER" &&
					auth.oauth.secretPlacement === "HEADER" && (
						<>
							<div className="flex">
								<div className="mr-2">Send as Basic Authentication?</div>
								<div>
									<CheckboxGroup
										value={selected}
										onChange={updateIfShouldBeSentAsBasic}
									>
										<SCheckbox value="isBasicAuth" />
									</CheckboxGroup>
								</div>
							</div>
						</>
					)}
			</div>
		</>
	);
}
