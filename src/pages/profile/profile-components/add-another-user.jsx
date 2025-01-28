import SForm from "@/components/SForm";
import SInput from "@/components/SInput";
import SButton from "@components/SButton";
import Close from "@assets/icons/cross.svg?react";

export default function AddAnotherUser({ closeCallback, ...props }) {
	return (
		<SForm onSubmit={() => {}}>
			<div className=" rounded-[5px] bg-[#080808] w-[35vw] another-user-container ">
				<div className="flex p-5 justify-between">
					<div class="text-white text-base font-medium font-sans leading-none tracking-tight ">
						Add another user
					</div>
					<div
						onClick={() => closeCallback?.()}
						onKeyDown={() => closeCallback?.()}
						className="p-[5px]"
					>
						<Close className="icon-grey-5 cursor-pointer " />
					</div>
				</div>

				<div className="border-b-[1px] border-grey-2 mb-[20px]" />
				<div className="flex">
					<div className="p-5 pb-0 flex w-1/2 input-wrapper ">
						<div className="flex flex-col gap-1 w-full">
							<label class="text-zinc-400 text-xs font-normal font-['Inter'] leading-[14px] pl-3">
								First Name
							</label>
							<SInput
								name="firstName"
								type="text"
								required
								placeholder="John"
							/>
						</div>
					</div>
					<div className="p-5 pb-0 flex w-1/2 input-wrapper ">
						<div className="flex flex-col gap-1 w-full">
							<label class="text-zinc-400 text-xs font-normal font-['Inter'] leading-[14px] pl-3">
								Last Name
							</label>
							<SInput name="lastName" type="text" required placeholder="Doe" />
						</div>
					</div>
				</div>
				<div className="flex">
					<div className="p-5 pb-0 flex w-1/2 input-wrapper ">
						<div className="flex flex-col gap-1 w-full">
							<label class="text-zinc-400 text-xs font-normal font-['Inter'] leading-[14px] pl-3">
								Registered email
							</label>
							<SInput
								name="email"
								type="email"
								required
								placeholder="Johndoe@specc.com"
							/>
						</div>
					</div>
					<div className="p-5 pb-0 flex w-1/2 input-wrapper ">
						<div className="flex flex-col gap-1 w-full">
							<label class="text-zinc-400 text-xs font-normal font-['Inter'] leading-[14px] pl-3">
								Phone number
							</label>
							<SInput
								name="phoneNumber"
								type="text"
								required
								placeholder="9819708556"
							/>
						</div>
					</div>
				</div>
				<div className="flex justify-between items-center mt-[20px] p-5">
					<div className="flex  gap-5">
						<SButton
							className="min-w-[110px]"
							sType={"build"}
							type="submit"
							// loading={loading}
						>
							<span>Add user</span>
						</SButton>
						<SButton
							// loading={loading}
							className={"min-w-[110px]"}
							onClick={() => {}}
						>
							<span>Cancel</span>
						</SButton>
					</div>
				</div>
			</div>
		</SForm>
	);
}
