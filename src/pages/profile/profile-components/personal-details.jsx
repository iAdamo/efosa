import SForm from "@/components/SForm";
import SInput from "@/components/SInput";
import SButton from "@components/SButton";
import ChangePassword from "./change-password";
import MoreHorizontal from "@/assets/icons/more-horizontal.svg?react";
import { useState, useRef } from "react";
import { SMenuButton } from "@/components/MenuDropdown";
import { SMenuItem } from "@/components/MenuDropdown";
import { useContext } from "react";
import { GeneralContext } from "@/contexts/GeneralContext";
import { alphabets } from "./profile-menu-items";
import { useEffect } from "react";
import { postGenericCRUDWithID } from "@/axios/apiCalls";
import { successToast } from "@/components/toasts/toasts";
import { get, set } from "lodash";

export default function PersonalDetails({ ...props }) {
	const { firstName, lastName, userID } = useContext(GeneralContext);
	const [showChangePassword, setShowChangePassword] = useState(false);
	const [file, setFile] = useState(null);
	const [alphabetId, setAlphabetId] = useState(0);
	const inputFile = useRef(null);

	const [userDetails, setUserDetails] = useState({
		firstName: firstName,
		lastName: lastName,
	});

	useEffect(() => {
		setAlphabetId(
			alphabets.find((item) => {
				return item.name === firstName[0];
			}).id,
		);
	}, [firstName, alphabets]);

	const saveprofile = async (e) => {
		await postGenericCRUDWithID("users", userID, userDetails).then(
			(response) => {
				successToast("Profile updated successfully");
			},
		);
	};

	const handleFileChange = (event) => {
		const file = URL.createObjectURL(event.target.files[0]);

		if (file) {
			setFile(file);
			// Handle the file upload here
		}
	};

	return !showChangePassword ? (
		<SForm
			onSubmit={(e) => {
				saveprofile(e);
			}}
		>
			<input
				type="file"
				ref={inputFile}
				style={{ display: "none" }}
				onChange={handleFileChange}
				disabled
			/>
			<div className=" rounded-[5px] bg-[#080808] details-input-container ">
				<div class="text-white text-base font-medium font-sans leading-none tracking-tight p-5">
					My Profile
				</div>
				<div className="border-b-[1px] border-grey-2" />
				<div className="p-5 pb-0 flex flex-col">
					<div className="flex gap-5 mb-4">
						<div class="text-white text-xs font-normal font-['Inter'] leading-[11px] tracking-tight">
							Profile avatar
						</div>
						<div>
							<SMenuButton
								label={<MoreHorizontal alt="more" />}
								className="flex flex-col gap-[8px]"
							>
								<SMenuItem
									onAction={() => inputFile.current.click()}
									className="cursor-pointer"
								>
									Upload image
								</SMenuItem>

								<SMenuItem className="cursor-pointer">Delete image</SMenuItem>
							</SMenuButton>
						</div>
					</div>
					<div
						className={`h-[60px] w-[60px] rounded-full flex justify-center items-center ${
							alphabetId < 5
								? "bg-secondary-mint-green"
								: alphabetId < 10
									? "bg-main-purple-1"
									: alphabetId < 15
										? "bg-main-peach-1"
										: alphabetId < 20
											? "bg-secondary-blue-light"
											: "bg-main-pink-1"
						}`}
					>
						{file === null ? (
							<div class="text-white text-[18px] font-semibold font-['Inter'] leading-[14px] tracking-tight">
								{firstName[0]}
							</div>
						) : (
							<img src={file} alt="user" />
						)}
					</div>
				</div>
				<div className="flex">
					<div className="p-5 pb-0 pr-[10px] flex w-1/2 input-wrapper ">
						<div className="flex flex-col gap-1 w-full">
							<label class="text-zinc-400 text-xs font-normal font-['Inter'] leading-[14px] pl-3">
								First Name
							</label>
							<SInput
								name="firstName"
								type="text"
								required
								placeholder="John"
								onChange={(e) =>
									setUserDetails({ ...userDetails, firstName: e.target.value })
								}
								value={userDetails.firstName}
							/>
						</div>
					</div>
					<div className="p-5 pb-0 pl-[10px] flex w-1/2 input-wrapper ">
						<div className="flex flex-col gap-1 w-full">
							<label class="text-zinc-400 text-xs font-normal font-['Inter'] leading-[14px] pl-3">
								Last Name
							</label>
							<SInput
								name="lastName"
								type="text"
								required
								placeholder="Doe"
								onChange={(e) =>
									setUserDetails({ ...userDetails, lastName: e.target.value })
								}
								value={userDetails.lastName}
							/>
						</div>
					</div>
				</div>
				<div className="flex">
					<div className="p-5 pb-0 pr-[10px] flex w-1/2 input-wrapper ">
						<div className="flex flex-col gap-1 w-full">
							<label class="text-grey-2 text-xs font-normal font-['Inter'] leading-[14px] pl-3">
								Registered email
							</label>
							<SInput
								name="email"
								type="email"
								required
								disabled
								placeholder="Johndoe@specc.com"
							/>
						</div>
					</div>
					<div className="p-5 pb-0 pl-[10px] flex w-1/2 input-wrapper ">
						<div className="flex flex-col gap-1 w-full">
							<label class="text-grey-2 text-xs font-normal font-['Inter'] leading-[14px] pl-3">
								Phone number
							</label>
							<SInput
								name="phoneNumber"
								type="text"
								required
								placeholder="9819708556"
								disabled
							/>
						</div>
					</div>
				</div>
				<div className="flex justify-between items-center p-5">
					<div className="flex  gap-5">
						<SButton
							className="min-w-[110px]"
							sType={"build"}
							type="submit"
							// loading={loading}
						>
							<span>Save</span>
						</SButton>
						<SButton
							// loading={loading}
							className={"min-w-[110px]"}
							onClick={() => {}}
						>
							<span>Cancel</span>
						</SButton>
					</div>
					<span
						onClick={() => setShowChangePassword(true)}
						onKeyDown={() => setShowChangePassword(true)}
						className="text-main-pink-1 underline text-center text-base font-semibold font-sans cursor-pointer "
					>
						Change password?
					</span>
				</div>
			</div>
		</SForm>
	) : (
		<ChangePassword backCallback={setShowChangePassword} />
	);
}
