import SButton from "@components/SButton";
import { SCheckbox, SCheckboxGroup } from "@components/SCheckbox";
import SForm from "@components/SForm";
import SRadio from "@components/SRadio";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import hand from "@assets/images/hand2-coming-soon.svg";

export default function DataSettings(props) {
	const {
		register,
		watch,
		formState: { errors },
		handleSubmit,
		control,
	} = useForm();

	useEffect(() => {
		const subscription = watch(handleSubmit(createClickFunction));
		return () => subscription.unsubscribe();
	}, [handleSubmit, watch]);

	const createClickFunction = async (data) => {
		console.log(data);
	};

	/*
	return (
		<>
			<div className="flex flex-col justify-center mt-[20px] mb-[20px]">
				<div className="flex flex-col">
					<div className="justify-center flex">
						<img src={hand} className=" h-[100px]" />
					</div>
					<div className="justify-center flex mt-[20px] text-[13px]">
						We are working our asses off to get you this functionality ASAP!
					</div>
				</div>
			</div>
		</>
	);
	*/

	return (
		<>
			<div className="relative flex-grow flex flex-col justify-center mt-[20px] mb-[20px] z-[9999]">
				<div className="flex flex-col absolute inset-0  h-[300px] justify-center items-center">
					<div className="justify-center flex">
						<img src={hand} className=" h-[100px]" />
					</div>
					<div className="justify-center flex mt-[20px] text-[13px]">
						We are working our asses off to get you this functionality ASAP!
					</div>
				</div>
			</div>
			<SForm className={"flex flex-col gap-y-[20px] opacity-10 blur-[2px]"}>
				<div className="flex flex-col">
					<span className="label-large label-bold py-[20px]">
						Select Action Method:
					</span>
					<Controller
						name="action"
						control={control}
						render={({ field: { name, value, onChange, onBlur, ref } }) => (
							<SCheckboxGroup
								name={name}
								onChange={onChange}
								onBlur={onBlur}
								ref={ref}
							>
								<SCheckbox value="get_data">
									<span className="label-large flex gap-x-1">
										<span className="label-bold">Get</span>
										data*
									</span>
								</SCheckbox>
								<SCheckbox
									value="post_data"
									defaultSelected={true}
									isDisabled
									checked={true}
								>
									<span className="label-large flex gap-x-1">
										<span className="label-bold">Post</span>
										data*
									</span>
								</SCheckbox>
								<SCheckbox value="put_data">
									<span className="label-large flex gap-x-1">
										<span className="label-bold">PUT </span>
										data
									</span>
								</SCheckbox>
								<SCheckbox value="delete_data">
									<span className="label-large flex gap-x-1">
										<span className="label-bold">DELETE</span>
										data
									</span>
								</SCheckbox>
							</SCheckboxGroup>
						)}
					/>
				</div>
				<div className="flex flex-col gap-y-[20px]">
					<span className="label-large label-bold py-[20px]">
						Select Data Direction
					</span>
					<SRadio
						options={[
							{
								label: (
									<span className="label-large flex gap-x-1">
										From
										<span className="label-bold whitespace-nowrap">API 1</span>
										to
										<span className="label-bold whitespace-nowrap">API 2</span>
									</span>
								),
								value: "api_1_api_2",
								defaultChecked: true,
							},
							{
								label: (
									<span className="label-large flex gap-x-1">
										From
										<span className="label-bold whitespace-nowrap">API 2</span>
										to
										<span className="label-bold whitespace-nowrap">API 1</span>
									</span>
								),
								value: "api_2_api_1",
							},
							{
								label: (
									<span className="label-large flex gap-x-1">
										To-way integration
									</span>
								),
								value: "two_way",
							},
						]}
						name="dataDirection"
						register={register}
					/>
				</div>
			</SForm>
		</>
	);
}
