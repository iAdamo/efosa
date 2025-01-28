import { useState } from "react";
import SRadioGroup from "@/components/SRadioGroup";
import { Radio } from "react-aria-components";
import CustomInput from "@components/CustomInput.jsx";
import ToggleButtonGroupCustom from "@components/CustomToggleButtonGroup.jsx";
import Button from "@components/Button.jsx";
import PlusSquareIcon from '@assets/icons/plus-square.svg?react';
import UploadIcon from "@assets/icons/upload-rounded.svg?react";
import RemoveIcon from "@assets/icons/remove-icon.svg?react";

export default function SettingsServer() {
	const [selectedFileName, setSelectedFileName] = useState('');

	const [temp, setTemp] = useState([
		{
			label: "Server 1",
			name: "server1",
			url: "",
			isSelected: true,
		},
	]);

	const [alignment, setAlignment] = useState({
		"key": "sandbox",
	});

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
		const filteredTemp = temp.filter((item) => item.name !== value);
		const updatedTemp = filteredTemp.map((item, index) => ({
			...item,
			label: `Server ${index + 1}`,
		}));
		setTemp(updatedTemp);
	};

	const addServer = (event) => {
		event.preventDefault()
		setTemp([
			...temp,
			{
				label: `Server ${temp.length + 1}`,
				name: `server${temp.length + 1}`,
				url: "",
				isSelected: false,
			},
		]);
	};

	return (
		<div className="flex flex-col gap-5 server-container">
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
						<div className="flex flex-col gap-3">
							<CustomInput
								label={item.label}
								endLabel={<span onClick={() => removeServer(item.name)}><RemoveIcon/></span>}
								variant="primary"
								placeholder="Custom server name here.."
								onChange={(e) => {
									updateName(index, e.target.value);
								}}
								suffix={
									<ToggleButtonGroupCustom
										alignment={alignment?.["key"]}
										options={[
											{id: 1, value: "sandbox", label: "Sandbox"},
											{id: 2, value: "production", label: "Production"},
										]}
										buttonStyles={{height: "32px"}}
									/>
								}
							/>
							<div className="flex w-full gap-3 items-start">
								<Radio value={temp[index].name}/>
								<CustomInput
									variant="primary"
									label="Server URL"
									className="w-full"
									placeholder="Add server URL"
									onChange={(e) => updateUrl(index, e.target.value)}
								/>
							</div>
						</div>
					</div>
				))}
			</SRadioGroup>
			<Button
				onClick={addServer}
				className="flex gap-2 items-center underline underline-offset-4 leading-26"
			>
				<PlusSquareIcon/>
				Add server
			</Button>

			<div className="relative h-max">
				<div className="flex justify-between mb-2 text-grey-17"><p
					className="font-medium leading-11 h-max">UPLOAD LOGO (OPTIONAL)</p>
				</div>
				<div
					className="w-full h-24 cursor-pointer hover:bg-[#f0f0f014] bg-[#C1BFC414] border-dashed border-2 border-[#C1BFC414] rounded-lg flex flex-col justify-center items-center"
					onClick={() => document.getElementById('clientLogoRef')?.click()}
				>
					<UploadIcon/>
					<div className="w-full text-sm text-center mt-1">
						{selectedFileName}
					</div>
				</div>
				<input
					id="clientLogoRef"
					className="hidden"
					type="file"
					name="logo"
					accept="image/png, image/PNG, image/jpg, image/JPG, image/jpeg, image/JPEG"
					onInput={(event) => {
						setSelectedFileName(event.target.files?.[0]?.name ?? '')
					}}
				/>
			</div>
		</div>
	);
}
