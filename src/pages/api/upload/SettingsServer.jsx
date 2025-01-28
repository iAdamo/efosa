import SRadioGroup from "@/components/SRadioGroup";
import { Radio } from "react-aria-components";
import Add from "@assets/icons/add.svg?react";
import { useState } from "react";
import SInput from "@/components/SInput";
import Globe from "@assets/icons/globe.svg?react";

export default function SettingsServer() {
	const [temp, setTemp] = useState([
		{
			name: "server1",
			url: "",
			isSelected: true,
		},
	]);

	const updateName = (index, value) => {
		const newTemp = [...temp];
		newTemp[index].name = value;
		setTemp(newTemp);
	};

	const updateUrl = (index, value) => {
		const newTemp = [...temp];
		newTemp[index].url = value;
		setTemp(newTemp);
	};

	const changeSelected = (value) => {
		const newTemp = [...temp];
		const index = temp.findIndex((item) => item.name === value);
		newTemp[index].isSelected = !newTemp[index].isSelected;
		setTemp(newTemp);
	};

	const removeServer = (value) => {
		setTemp(temp.filter((item) => item.name !== value));
	};

	return (
		<div className="flex flex-col gap-5 server-container">
			<div class="text-neutral-200 text-xs font-medium font-['Inter'] leading-none tracking-tight">
				Insert, name and select which server to run your integration.{" "}
			</div>
			<SRadioGroup
				defaultValue="server1"
				getValue={(value) => {
					changeSelected(value);
				}}
			>
				{temp.map((item, index) => (
					<div
						key={`server${index.toString()}`}
						className="flex flex-col gap-5 mr-2"
					>
						<div className="flex flex-col gap-[5px]">
							<div className="flex justify-between">
								<div class="text-[#aeaeae] text-xs font-normal font-['Inter'] leading-[14px]">
									Server {index + 1}
								</div>
								<div
									onClick={() => removeServer(item.name)}
									onKeyDown={() => removeServer(item.name)}
									class="text-[#cacaca] text-xs font-normal font-['Inter'] leading-[14px] cursor-pointer"
								>
									Remove
								</div>
							</div>
							<SInput
								type="text"
								className="modal-header input "
								placeholder="Enter custom name"
								onChange={(e) => {
									updateName(index, e.target.value);
								}}
							/>
							<div className="flex w-full">
								<Radio value={temp[index].name} />
								<SInput
									type="text"
									className="modal-header input w-full "
									placeholder="Insert server URL"
									onChange={(e) => {
										updateUrl(index, e.target.value);
									}}
									icon={<Globe className="icon-grey-5" />}
								/>
							</div>
						</div>
					</div>
				))}
			</SRadioGroup>
			<div
				onClick={() =>
					setTemp([
						...temp,
						{
							name: "",
							url: "",
							isSelected: false,
						},
					])
				}
				onKeyDown={() =>
					setTemp([
						...temp,
						{
							name: "",
							url: "",
							isSelected: false,
						},
					])
				}
				className="flex gap-2 p-[10px] items-center cursor-pointer"
			>
				<Add className="icon-grey-5" />
				<div class="text-[#aeaeae] text-xs font-normal font-['Inter'] leading-[14px] tracking-tight">
					Add server
				</div>
			</div>
		</div>
	);
}
