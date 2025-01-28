import Button from "@/components/Button";
import CreateNewProjectModal from "@/pages/projects/CreateNewProjectModal";
import GreyHandIcon from "@assets/icons/grey-hand.svg?react";
import PlusIcon from "@assets/icons/plusIcon.svg?react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
	const navigate = useNavigate();
	const [open, setOpen] = useState(false);
	return (
		<div className="flex flex-grow items-center justify-center">
			<div className="flex-col justify-center items-center gap-[30px] inline-flex">
				<div className="flex-col justify-center items-center gap-[14px] flex">
					<div className="flex-col justify-center items-center flex">
						<GreyHandIcon />
						<div className="text-center text-white text-[28px] font-medium font-['Inter'] leading-8 tracking-tight mt-6">
							Welcome to Specc
						</div>
						<div className="w-full max-w-[368px] text-center text-[#A8A9AB] text-xs font-normal font-['Inter'] leading-5 mt-1">
							<span>Getting started with integrations has never been simpler! Just hit the ‘New Project’ button and let’s dive in.</span>
						</div>
					</div>

					<Button
						className="gap-2"
						variant={'primary'}
						onClick={() => {
							setOpen(true)
						}}
					>
						<PlusIcon />
						<span className="text-lg font-bold">New project</span>
					</Button>

					<CreateNewProjectModal open={open} setOpen={setOpen} />
				</div>
			</div>
		</div>
	);
}

export default Dashboard;
