import cross from "@assets/icons/cross.svg";
import SButton from "@components/SButton";
import SForm from "@components/SForm";
import SInput from "@components/SInput";
import { useForm } from "react-hook-form";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createProject } from "@axios/generalApiCalls";
import { postGenericCRUD } from "@/axios/apiCalls";

export default function NewSpeccModal({ ...props }) {
	const { projectName, projectID, setProjectSpeccList, closeSpeccModal } =
		props;
	const { register, handleSubmit } = useForm({
		mode: "onChange",
	});
	const navigate = useNavigate();
	const [newSpeccName, setNewSpeccName] = useState("");

	const createClickFunction = async (data) => {
		const obj = {};
		obj.name = data.projectName;
		/*
		const createdProject = await createProject(obj);
*/

		const newSpecc = await postGenericCRUD("Speccs", {
			name: newSpeccName,
			projectID: projectID,
		});
		setProjectSpeccList((oldArray) => [...oldArray, newSpecc.data[0]]);
		closeSpeccModal();
	};

	const redirectToDashboard = () => {
		navigate("/dashboard");
	};

	return (
		<SForm onSubmit={handleSubmit(createClickFunction)}>
			<div className="new-specc-modal-container">
				<div className="new-specc-modal-header-container">
					<div class="text-white text-sm font-medium font-['Inter'] leading-none tracking-tight">
						New Specc
					</div>
					{/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
					<img
						onClick={() => props.closeSpeccModal()}
						src={cross}
						alt="cancel"
						className="icon-grey-5"
					/>
				</div>
				<div className="new-specc-modal-content-container">
					<div class="text-white text-xs font-normal font-['Inter'] leading-none tracking-tight pb-[20px]">
						Specc will be added to {projectName}
					</div>
					<div class="text-zinc-400 text-xs font-normal font-['Inter'] leading-[14px]  ml-[12px]">
						Specc Name*
					</div>
					<div class="specc-input-container py-[5px]">
						<SInput
							type="text"
							className="specc-input-container"
							placeholder="Specc name"
							onChange={(e) => setNewSpeccName(e.target.value)}
							disabled={false}
							aria-invalid={"false"}
						/>
					</div>
					<div class="text-zinc-400 text-xs font-medium font-['Inter'] leading-none ml-[12px] mt-[5px]">
						*Required
					</div>
					<div className="new-specc-modal-button-container">
						<SButton
							sType={"build"}
							type="submit"
							onClick={() => {}}
							className="w-[110px] h-[30px] px-[15px] py-2 bg-gradient-to-tr from-rose-400 to-fuchsia-600 rounded-[50px] shadow justify-center items-center gap-0.5 inline-flex"
						>
							<span className="grow shrink basis-0 text-center text-white text-xs font-semibold font-['Inter'] leading-[14px] tracking-tight">
								Create
							</span>
						</SButton>
						<SButton
							sType="button"
							onClick={() => {
								redirectToDashboard();
								props.closeSpeccModal();
							}}
							className="w-[110px] h-[30px] px-[15px] py-2 bg-neutral-700 rounded-[50px] shadow justify-center items-center gap-0.5 inline-flex"
						>
							<span className="grow shrink basis-0 text-center text-white text-xs font-semibold font-['Inter'] leading-[14px] tracking-tight">
								Cancel
							</span>
						</SButton>
					</div>
				</div>
			</div>
		</SForm>
	);
}
