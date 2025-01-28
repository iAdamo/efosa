import { useContext, useEffect, useState } from "react";
import DropdownMenu from "./DropdownMenu";
import FileUpload from "./UploadTypes/FileUpload";
import CodeUpload from "./UploadTypes/CodeUpload";
import URLUpload from "./UploadTypes/URLUpload";
import warningIcon from "@assets/icons/warning.svg";
import closeIcon from "@assets/icons/close.svg";


export default function UploadBox(props) {
	const {
		direction,
		isMyAPI,
		APIID,
		myAPI,
		projectID,
		specc,
		refreshFunction,
	} = props;
	const [dropdownOpen, setDropdownOpen] = useState(false);

	const [dropdownSelected, setDropdownSelected] = useState("FILE");
	const [fileError, setFileError] = useState(null)
	const [showError, setShowError] = useState(true)

	const idToUse = APIID;

	const handleFileError = (error) => {
		setFileError(error)
		setShowError(true)
	}

	return (
		<>
			<div className="m-4">
				<div className="w-[400px] p-5 bg-neutral-900 rounded-[10px] flex-col gap-5 inline-flex">
					<div className="self-stretch h-[18px] justify-start items-start gap-2.5 flex">
						<div className="pr-2.5 justify-start items-center inline-flex">
							<div className="justify-start items-top gap-[5px] flex relative">
								<div className="text-sm text-white font-bold font-['Inter'] relative">
									{dropdownSelected == "FILE" && (
										<>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												width="24"
												height="18"
												viewBox="0 0 24 18"
												fill="none"
												className="inline"
											>
												<path
													d="M12.6116 2.45357C12.4884 2.32232 12.3196 2.25 12.1429 2.25C11.9661 2.25 11.7973 2.32232 11.6741 2.45357L8.24554 6.09643C8.00179 6.35625 8.01518 6.76071 8.27232 7.00446C8.52946 7.24821 8.93661 7.23482 9.18036 6.97768L11.5 4.51339V6.75V10.1786C11.5 10.5348 11.7866 10.8214 12.1429 10.8214C12.4991 10.8214 12.7857 10.5348 12.7857 10.1786V6.75V4.51339L15.1027 6.975C15.3464 7.23482 15.7536 7.24554 16.0107 7.00179C16.2679 6.75804 16.2812 6.35089 16.0375 6.09375L12.6089 2.45089L12.6116 2.45357ZM7.64286 12.9643C7.28661 12.9643 7 13.2509 7 13.6071C7 13.9634 7.28661 14.25 7.64286 14.25H16.6429C16.9991 14.25 17.2857 13.9634 17.2857 13.6071C17.2857 13.2509 16.9991 12.9643 16.6429 12.9643H7.64286Z"
													fill="#F6C519"
												/>
											</svg>
											Upload{" "}
										</>
									)}
									{dropdownSelected == "CODE" && (
										<>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												width="24"
												height="18"
												viewBox="0 0 24 18"
												fill="none"
												className="inline"
											>
												<path
													d="M13.5926 2.27744C13.2207 2.17024 12.8335 2.38682 12.7263 2.75872L9.92609 12.5595C9.81889 12.9314 10.0355 13.3186 10.4074 13.4258C10.7793 13.533 11.1665 13.3164 11.2737 12.9445L14.0739 3.14375C14.1811 2.77185 13.9645 2.38463 13.5926 2.27744ZM15.3559 4.90483C15.0824 5.17829 15.0824 5.62239 15.3559 5.89584L17.3095 7.85162L15.3537 9.8074C15.0802 10.0809 15.0802 10.525 15.3537 10.7984C15.6272 11.0719 16.0713 11.0719 16.3447 10.7984L18.7949 8.34822C19.0684 8.07477 19.0684 7.63067 18.7949 7.35721L16.3447 4.90702C16.0713 4.63356 15.6272 4.63356 15.3537 4.90702L15.3559 4.90483ZM8.6463 4.90483C8.37284 4.63137 7.92874 4.63137 7.65529 4.90483L5.20509 7.35502C4.93164 7.62848 4.93164 8.07258 5.20509 8.34604L7.65529 10.7962C7.92874 11.0697 8.37284 11.0697 8.6463 10.7962C8.91976 10.5228 8.91976 10.0787 8.6463 9.80521L6.69052 7.85162L8.6463 5.89584C8.91976 5.62239 8.91976 5.17829 8.6463 4.90483Z"
													fill="#F6C519"
												/>
											</svg>
											Code{" "}
										</>
									)}
									{dropdownSelected == "URL" && (
										<>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												width="24"
												height="18"
												viewBox="0 0 24 18"
												fill="none"
												className="inline"
											>
												<path
													d="M12.0008 14.55C12.2089 14.55 12.7602 14.3475 13.3395 13.1888C13.587 12.6909 13.8008 12.0862 13.9583 11.4H10.0433C10.2008 12.0862 10.4145 12.6909 10.662 13.1888C11.2414 14.3475 11.7927 14.55 12.0008 14.55ZM9.82109 10.05H14.1805C14.2255 9.61969 14.2508 9.16687 14.2508 8.7C14.2508 8.23312 14.2255 7.78031 14.1805 7.35H9.82109C9.77609 7.78031 9.75078 8.23312 9.75078 8.7C9.75078 9.16687 9.77609 9.61969 9.82109 10.05ZM10.0433 6H13.9583C13.8008 5.31375 13.587 4.70906 13.3395 4.21125C12.7602 3.0525 12.2089 2.85 12.0008 2.85C11.7927 2.85 11.2414 3.0525 10.662 4.21125C10.4145 4.70906 10.2008 5.31375 10.0433 6ZM15.5361 7.35C15.5783 7.78594 15.598 8.23875 15.598 8.7C15.598 9.16125 15.5755 9.61406 15.5361 10.05H17.6933C17.7945 9.61687 17.8508 9.16406 17.8508 8.7C17.8508 8.23594 17.7973 7.78312 17.6933 7.35H15.5389H15.5361ZM17.1898 6C16.588 4.84406 15.612 3.91594 14.4223 3.37312C14.8189 4.09312 15.1339 4.99031 15.3392 6H17.1927H17.1898ZM8.65953 6C8.86484 4.99031 9.17984 4.09594 9.57641 3.37312C8.38672 3.91594 7.41078 4.84406 6.80891 6H8.66234H8.65953ZM6.30828 7.35C6.20703 7.78312 6.15078 8.23594 6.15078 8.7C6.15078 9.16406 6.20422 9.61687 6.30828 10.05H8.46547C8.42328 9.61406 8.40359 9.16125 8.40359 8.7C8.40359 8.23875 8.42609 7.78594 8.46547 7.35H6.30828ZM14.4223 14.0269C15.612 13.4841 16.588 12.5559 17.1898 11.4H15.3392C15.1339 12.4097 14.8189 13.3041 14.4223 14.0269ZM9.57922 14.0269C9.18266 13.3069 8.86766 12.4097 8.66234 11.4H6.80891C7.41078 12.5559 8.38672 13.4841 9.57641 14.0269H9.57922ZM12.0008 15.9C10.0912 15.9 8.25987 15.1414 6.90961 13.7912C5.55935 12.4409 4.80078 10.6096 4.80078 8.7C4.80078 6.79044 5.55935 4.95909 6.90961 3.60883C8.25987 2.25857 10.0912 1.5 12.0008 1.5C13.9103 1.5 15.7417 2.25857 17.092 3.60883C18.4422 4.95909 19.2008 6.79044 19.2008 8.7C19.2008 10.6096 18.4422 12.4409 17.092 13.7912C15.7417 15.1414 13.9103 15.9 12.0008 15.9Z"
													fill="#F6C519"
												/>
											</svg>
											URL{" "}
										</>
									)}
								</div>
								<div className="w-[53px] h-[18px] text-fuchsia-500 text-sm font-bold font-['Inter']">
									API 1
								</div>
								<div className="w-[13.12px] h-[15px] relative">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="13"
										height="12"
										viewBox="0 0 13 12"
										fill="none"
									>
										<path
											d="M6.69727 1.125C7.9902 1.125 9.23017 1.63861 10.1444 2.55285C11.0587 3.46709 11.5723 4.70707 11.5723 6C11.5723 7.29293 11.0587 8.53291 10.1444 9.44715C9.23017 10.3614 7.9902 10.875 6.69727 10.875C5.40434 10.875 4.16436 10.3614 3.25012 9.44715C2.33588 8.53291 1.82227 7.29293 1.82227 6C1.82227 4.70707 2.33588 3.46709 3.25012 2.55285C4.16436 1.63861 5.40434 1.125 6.69727 1.125ZM6.69727 12C8.28856 12 9.81469 11.3679 10.9399 10.2426C12.0651 9.11742 12.6973 7.5913 12.6973 6C12.6973 4.4087 12.0651 2.88258 10.9399 1.75736C9.81469 0.632141 8.28856 0 6.69727 0C5.10597 0 3.57984 0.632141 2.45463 1.75736C1.32941 2.88258 0.697266 4.4087 0.697266 6C0.697266 7.5913 1.32941 9.11742 2.45463 10.2426C3.57984 11.3679 5.10597 12 6.69727 12ZM5.75977 7.875C5.44805 7.875 5.19727 8.12578 5.19727 8.4375C5.19727 8.74922 5.44805 9 5.75977 9H7.63477C7.94648 9 8.19727 8.74922 8.19727 8.4375C8.19727 8.12578 7.94648 7.875 7.63477 7.875H7.44727V5.8125C7.44727 5.50078 7.19648 5.25 6.88477 5.25H5.75977C5.44805 5.25 5.19727 5.50078 5.19727 5.8125C5.19727 6.12422 5.44805 6.375 5.75977 6.375H6.32227V7.875H5.75977ZM6.69727 4.5C6.89618 4.5 7.08694 4.42098 7.2276 4.28033C7.36825 4.13968 7.44727 3.94891 7.44727 3.75C7.44727 3.55109 7.36825 3.36032 7.2276 3.21967C7.08694 3.07902 6.89618 3 6.69727 3C6.49835 3 6.30759 3.07902 6.16694 3.21967C6.02628 3.36032 5.94727 3.55109 5.94727 3.75C5.94727 3.94891 6.02628 4.13968 6.16694 4.28033C6.30759 4.42098 6.49835 4.5 6.69727 4.5Z"
											fill="#AEAEAE"
										/>
									</svg>
								</div>
								<div className="w-5 h-[15px] p-2.5 justify-center items-center gap-2.5 flex" />
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
										setDropdownSelected={setDropdownSelected}
										setDropdownOpen={setDropdownOpen}
									/>
								)}
							</div>
						</div>
					</div>
					<div className="relative">
						{dropdownSelected == "FILE" && (
							<FileUpload
								direction={direction}
								isMyAPI={isMyAPI}
								myAPI={myAPI}
								projectID={projectID}
								specc={specc}
								refreshFunction={refreshFunction}
								onFileError={(error) => handleFileError(error)}
							/>
						)}
						{dropdownSelected == "CODE" && (
							<CodeUpload
								direction={direction}
								isMyAPI={isMyAPI}
								myAPI={myAPI}
								projectID={projectID}
								specc={specc}
								refreshFunction={refreshFunction}
							/>
						)}
						{dropdownSelected == "URL" && (
							<URLUpload
								direction={direction}
								isMyAPI={isMyAPI}
								myAPI={myAPI}
								projectID={projectID}
								specc={specc}
								refreshFunction={refreshFunction}
							/>
						)}
					</div>
					{showError && fileError ? <div className="bg-[#C700371A] py-[15px] border border-status-error rounded-[5px] relative">
						<div className="flex items-center">
							<div className="flex items-center">
								<img src={warningIcon} className="icon-error w-10 h-[18px]" alt="warning" />
							</div>
							<div>
								<p>{fileError?.response?.data?.message}</p>
								<p className="mt-[5px]">Validate in the API Builder</p>
							</div>
							<div className="flex gap-2.5 absolute right-4">
								<a className="bg-status-error p-[5px] rounded" href={`/builder?APIID=${idToUse}`}>
									<div className="font-semibold">
										API Builder
									</div>
								</a>
								<span className="flex items-center cursor-pointer" onClick={() => setShowError(false)}>
									<img src={closeIcon} className="icon-warning" alt="closeIcon" />
								</span>
							</div>
						</div>
					</div> : ""}
					{idToUse && (
						<div className="cursor-pointer w-[118px] h-[30px] px-[15px] py-2 bg-neutral-700 rounded-[50px] shadow justify-center items-center gap-0.5 inline-flex">
							<div className="w-5 h-3.5 relative">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="20"
									height="15"
									viewBox="0 0 20 15"
									fill="none"
								>
									<path
										d="M10.5191 1.42083L12.8159 2.2909L10.4371 3.20492L8.0583 2.2909L10.3551 1.42083C10.4078 1.40032 10.4664 1.40032 10.522 1.42083H10.5191ZM5.98418 2.7069V5.99385C5.9461 6.00557 5.90801 6.01728 5.86993 6.03193L3.05757 7.09829C2.42185 7.33851 2 7.95078 2 8.63044V12.1225C2 12.7728 2.38377 13.3617 2.9814 13.6253L5.79376 14.8616C6.21561 15.0461 6.69313 15.0461 7.11498 14.8616L10.4371 13.3997L13.7621 14.8616C14.184 15.0461 14.6615 15.0461 15.0833 14.8616L17.8957 13.6253C18.4904 13.3646 18.8771 12.7728 18.8771 12.1225V8.63044C18.8771 7.94785 18.4552 7.33851 17.8195 7.09536L15.0072 6.029C14.9691 6.01435 14.931 6.00264 14.8929 5.99092V2.7069C14.8929 2.02432 14.4711 1.41497 13.8354 1.17182L11.023 0.105464C10.648 -0.0351545 10.2349 -0.0351545 9.85997 0.105464L7.04761 1.17182C6.40603 1.41497 5.98418 2.02724 5.98418 2.7069ZM13.4838 6.16669L11.0699 7.08071V4.46756L13.4838 3.54182V6.16669ZM6.53493 7.3473L8.8317 8.21737L6.45291 9.12846L4.07412 8.21737L6.37088 7.3473C6.42361 7.32679 6.4822 7.32679 6.53786 7.3473H6.53493ZM7.08569 13.3353V10.3911L9.49963 9.46536V12.2748L7.08569 13.3353ZM14.3392 7.3473C14.392 7.32679 14.4506 7.32679 14.5062 7.3473L16.803 8.21737L14.4213 9.12846L12.0425 8.21737L14.3392 7.3473ZM17.3274 12.3363L15.054 13.3353V10.3911L17.468 9.46536V12.1225C17.468 12.2162 17.4123 12.2982 17.3274 12.3363Z"
										fill="#AEAEAE"
									/>
								</svg>
							</div>
							<a href={`/builder?APIID=${idToUse}`}>
								<div className="text-white text-xs font-semibold font-['Inter'] leading-[14px] tracking-tight">
									API Builder
								</div>
							</a>
						</div>
					)}
				</div>
			</div>
		</>
	);
}
