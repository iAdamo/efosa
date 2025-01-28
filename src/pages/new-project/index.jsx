import React, { useState, useContext } from "react";

import { useNavigate } from "react-router-dom";
import { GeneralContext } from "@contexts/GeneralContext";
import { createProject } from "@axios/generalApiCalls";
import SButton from "@components/SButton";
import SInput from "@components/SInput";
import SModal from "@components/SModal";
import SForm from "@components/SForm";
import { useForm } from "react-hook-form";
import { errorToast } from "@/components/toasts/error-toast";

export default function NewProject(props) {
	const clickFunction = () => {};
	const navigate = useNavigate();
	const { firstName } = useContext(GeneralContext);
	const [loading, setLoading] = useState(false);

	const {
		register,
		formState: { errors },
		handleSubmit,
	} = useForm({
		mode: "onChange",
	});

	const redirectToDashboard = () => {
		navigate("/dashboard");
	};
	const createClickFunction = async (data) => {
		const obj = {};
		obj.name = data.projectName;
		setLoading(true);
		const createdProject = await createProject(obj);
		setLoading(false);

		if (createdProject.httpcode === 400) {
			return errorToast(
				"Create project failed",
				createdProject.message,
				null,
				false,
			);
		}
		if (createdProject.data[0]) {
			navigate(`/project/${createdProject.data[0].id}/settings`);
		}
	};

	const renderErrors = (errors) => {
		switch (errors?.type) {
			case "required":
				return <label className="s-error">Specc name is required</label>;
			case "maxLength":
				return (
					<label className="s-error">
						Please enter a name with less than 30 characters
					</label>
				);
			case "pattern":
				return (
					<label className="s-error">Please remove special characters</label>
				);
			default:
				return <label className="s-label">*Required</label>;
		}
	};

	return (
		<div className="flex flex-grow items-center justify-center">
			<SModal
				label={"New Project"}
				className={"w-[385px] h-[263px]"}
				onClose={redirectToDashboard}
			>
				<SForm
					onSubmit={handleSubmit(createClickFunction)}
					className={"flex flex-col gap-4"}
				>
					<div className="flex flex-col gap-[5px] input-wrapper">
						<label className="s-label">Project Name</label>
						<SInput
							type="text"
							className="text-black "
							placeholder="Enter name*"
							{...register("projectName", {
								required: true,
								maxLength: 30,
								pattern: /^[a-zA-Z0-9 ]+$/i,
							})}
							disabled={loading}
							aria-invalid={errors.projectName ? "true" : "false"}
						/>

						{renderErrors(errors.projectName)}
					</div>
					<div className="flex gap-[10px] mt-[40px] h-[30px]">
						<SButton
							className="min-w-[110px]"
							sType={"build"}
							type="submit"
							loading={loading}
						>
							<span>Create</span>
						</SButton>
						<SButton
							loading={loading}
							className={"min-w-[110px]"}
							onClick={redirectToDashboard}
						>
							<span>Cancel</span>
						</SButton>
					</div>
				</SForm>
			</SModal>
		</div>
	);
}
