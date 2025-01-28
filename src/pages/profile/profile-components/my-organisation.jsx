import Delete from "@assets/icons/delete.svg?react";
import More from "@assets/icons/more-vertical.svg?react";
import Download from "@assets/icons/download.svg?react";
import AddGradient from "@assets/icons/add-gradient.svg?react";
import { v4 as uuidv4 } from "uuid";
import SDialog from "@/components/SDialog";
import AddAnotherUser from "./add-another-user";
import { useState } from "react";
import SAccordion from "@/components/SAccordion";

export default function MyOrganisation({ ...props }) {
	const temp = [1, 2, 3, 4, 5];
	const temp2 = [1, 2];
	const [addUserDialogIsOpen, setAddUserDialogIsOpen] = useState(false);
	return (
		<>
			<SDialog
				closeCallback={() => setAddUserDialogIsOpen(false)}
				isOpen={addUserDialogIsOpen}
			>
				<AddAnotherUser closeCallback={() => setAddUserDialogIsOpen(false)} />
			</SDialog>
			<div className=" rounded-[5px] bg-[#080808] details-input-container ">
				<div className="p-5 flex gap-5 items-center">
					<div class="text-white text-base font-medium font-sans leading-none tracking-tight ">
						My Organisation
					</div>
				</div>

				<div className="border-b-[1px] border-grey-2" />
				{/* <SForm onSubmit={() => {}}>
          <div className="flex">
            <div className="p-5 pb-0 flex w-full input-wrapper ">
              <div className="flex flex-col gap-1 w-3/4">
                <label class="text-zinc-400 text-xs font-normal font-['Inter'] leading-[14px] pl-3">
                  Company name
                </label>
                <SInput
                  name="firstName"
                  type="text"
                  required
                  placeholder="Specc"
                />
              </div>
            </div>
          </div>
        </SForm>
        <div className="flex justify-between items-center  p-5">
          <div className="flex  gap-5">
            <SButton
              className="min-w-[110px]"
              //sType={"build"}
              type="submit"
              // loading={loading}
            >
              <span>Save</span>
            </SButton>
          </div>
        </div> */}
				<div className="border-b-[1px] border-grey-2" />
				<SAccordion
					title={
						<div class="text-white text-xs font-bold font-['Inter'] leading-[11px] p-5">
							List of users
						</div>
					}
					content={
						<>
							<div className="flex flex-col p-5 gap-[10px] pt-0 ">
								{temp.map((item) => (
									<div
										key={uuidv4()}
										className="p-5 flex user-info-row justify-between items-center "
									>
										<div className="flex gap-10">
											<div className="flex flex-col gap-2 items-start">
												<div class="text-center text-base font-normal font-sans text-grey-5">
													First name
												</div>
												<div class=" text-white text-base font-medium font-sans">
													Isha
												</div>
											</div>
											<div className="flex flex-col gap-2 items-start">
												<div class="text-center text-base font-normal font-sans text-grey-5">
													Last name
												</div>
												<div class=" text-white text-base font-medium font-sans">
													Sahasrabudhe
												</div>
											</div>
											<div className="flex flex-col gap-2 items-start">
												<div class="text-center text-base font-normal font-sans text-grey-5">
													Email
												</div>
												<div class=" text-white text-base font-medium font-sans">
													isha@specc.com
												</div>
											</div>
											<div className="flex flex-col gap-2 items-start">
												<div class="text-center text-base font-normal font-sans text-grey-5">
													Phone number
												</div>
												<div class=" text-white text-base font-medium font-sans">
													12345656
												</div>
											</div>
											<div className="flex flex-col gap-2 items-start">
												<div class="text-center text-base font-normal font-sans text-grey-5">
													Actice
												</div>
												<div class=" text-status-success text-base font-medium font-sans">
													12345656
												</div>
											</div>
										</div>
										<div className="flex gap-5">
											<Delete className="s-icon-error h-4 w-4" />
											<More className="s-icon-grey-5" />
										</div>
									</div>
								))}
							</div>
							<div
								onClick={() => setAddUserDialogIsOpen(true)}
								onKeyDown={() => setAddUserDialogIsOpen(true)}
								className="flex gap-2 p-5 items-center cursor-pointer"
							>
								<AddGradient />
								<span className="add-another-text">Add another user</span>
							</div>
						</>
					}
				/>

				<div className="border-b-[1px] border-grey-2 mb-[0px]" />
				<SAccordion
					title={
						<div className="p-5 flex gap-5 items-center">
							<div class="text-white text-base font-medium font-sans leading-none tracking-tight ">
								Agreements
							</div>
						</div>
					}
					content={
						<div className="flex flex-col p-5 gap-[10px] pt-0">
							{temp2.map(() => (
								<div
									key={uuidv4()}
									className="p-5 flex user-info-row justify-between items-center "
								>
									<div className="flex gap-20">
										<div className="flex flex-col gap-2 items-start">
											<div class="text-center text-base font-normal font-sans text-grey-5">
												Agreement
											</div>
											<a
												href="https://www.google.com/"
												target="_blank"
												rel="noopener noreferrer"
											>
												<div class=" text-base font-medium font-sans text-secondary-blue-light underline">
													Terms of service Agreement
												</div>
											</a>
										</div>
										<div className="flex flex-col gap-2 items-start">
											<div class="text-center text-base font-normal font-sans text-grey-5">
												Signed by
											</div>
											<div class=" text-white text-base font-medium font-sans">
												Isha Sahasrabudhe
											</div>
										</div>
										<div className="flex flex-col gap-2 items-start">
											<div class="text-center text-base font-normal font-sans text-grey-5">
												Signed on
											</div>
											<div class=" text-white text-base font-medium font-sans">
												18.07.2024 11:30:00 AM
											</div>
										</div>
									</div>
									<div className="flex gap-5">
										<Download className="s-icon-grey-5" />
									</div>
								</div>
							))}
						</div>
					}
				/>
			</div>
		</>
	);
}
