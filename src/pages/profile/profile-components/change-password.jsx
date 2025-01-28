import SForm from "@/components/SForm";
import SInput from "@/components/SInput";
import SButton from "@components/SButton";
import ArrowBack from "@assets/icons/back-arrow.svg?react";
import Eye from "@assets/icons/eye.svg?react";
import EyeCross from "@assets/icons/eye-cross.svg?react";
import { useState } from "react";

export default function ChangePassword({ backCallback, ...props }) {
	const [showPassword, setShowPassword] = useState(false);
	const [showNewPassword, setShowNewPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [passwordDetails, setPasswordDetails] = useState({
		oldPassword: "",
		newPassword: "",
		confirmPassword: "",
	});
	return (
		<SForm onSubmit={() => {}}>
			<div className=" rounded-[5px] bg-[#080808] details-input-container ">
				<div className="p-5 flex gap-5 items-center">
					<ArrowBack
						onClick={() => {
							setPasswordDetails({
								oldPassword: "",
								newPassword: "",
								confirmPassword: "",
							});
							backCallback();
						}}
						className="cursor-pointer"
					/>
					<div class="text-white text-base font-medium font-sans leading-none tracking-tight ">
						Change password
					</div>
				</div>

				<div className="border-b-[1px] border-grey-2" />
				<div className="flex">
					<div className="p-5 pb-0 flex w-full input-wrapper ">
						<div className="flex flex-col gap-1 w-full">
							<label class="text-zinc-400 text-xs font-normal font-['Inter'] leading-[14px] pl-3">
								Old password
							</label>
							<SInput
								name="firstName"
								type={showPassword ? "text" : "password"}
								required
								placeholder="*********"
								secureTextEntry={true}
								value={passwordDetails.oldPassword}
								onChange={(e) =>
									setPasswordDetails({
										...passwordDetails,
										oldPassword: e.target.value,
									})
								}
								icon={
									showPassword ? (
										<EyeCross
											onClick={() => setShowPassword(!showPassword)}
											alt="viewPass"
											className="s-icon-grey-5"
										/>
									) : (
										<Eye
											onClick={() => setShowPassword(!showPassword)}
											alt="viewPass"
											className="s-icon-grey-5"
										/>
									)
								}
							/>
						</div>
					</div>
				</div>
				<div className="flex">
					<div className="p-5 pb-0 flex w-full input-wrapper ">
						<div className="flex flex-col gap-1 w-full">
							<label class="text-zinc-400 text-xs font-normal font-['Inter'] leading-[14px] pl-3">
								New password
							</label>
							<SInput
								name="newPassword"
								type={showNewPassword ? "text" : "password"}
								required
								value={passwordDetails.newPassword}
								onChange={(e) =>
									setPasswordDetails({
										...passwordDetails,
										newPassword: e.target.value,
									})
								}
								placeholder="*********"
								icon={
									showNewPassword ? (
										<EyeCross
											onClick={() => setShowNewPassword(!showNewPassword)}
											alt="viewPass"
											className="s-icon-grey-5"
										/>
									) : (
										<Eye
											onClick={() => setShowNewPassword(!showNewPassword)}
											alt="viewPass"
											className="s-icon-grey-5"
										/>
									)
								}
							/>
						</div>
					</div>
				</div>
				<div className="flex">
					<div className="p-5 pb-0 flex w-full input-wrapper ">
						<div className="flex flex-col gap-1 w-full">
							<label class="text-zinc-400 text-xs font-normal font-['Inter'] leading-[14px] pl-3">
								Confirm password
							</label>
							<SInput
								name="confirmPassword"
								type={showConfirmPassword ? "text" : "password"}
								required
								value={passwordDetails.confirmPassword}
								onChange={(e) =>
									setPasswordDetails({
										...passwordDetails,
										confirmPassword: e.target.value,
									})
								}
								placeholder="*********"
								icon={
									showConfirmPassword ? (
										<EyeCross
											onClick={() =>
												setShowConfirmPassword(!showConfirmPassword)
											}
											alt="viewPass"
											className="s-icon-grey-5"
										/>
									) : (
										<Eye
											onClick={() =>
												setShowConfirmPassword(!showConfirmPassword)
											}
											alt="viewPass"
											className="s-icon-grey-5"
										/>
									)
								}
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
							onClick={() => {
								setPasswordDetails({
									oldPassword: "",
									newPassword: "",
									confirmPassword: "",
								});
								backCallback();
							}}
						>
							<span>Cancel</span>
						</SButton>
					</div>
				</div>
			</div>
		</SForm>
	);
}
