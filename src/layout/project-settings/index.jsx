import CustomCollapse from "@/components/CustomCollapse";
import KeyboardDoubleArrowLeftRoundedIcon from '@mui/icons-material/KeyboardDoubleArrowLeftRounded';
import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import AnimatedOutlet from "../AnimatedOutlet";
import Sidebar from "../dashboard/Sidebar";

export default function ProjectSettingsLayout() {
	const location = useLocation();
	  const [open, setOpen] = useState(true);
	
	  const handleToggle = () => {
		setOpen(!open);
	  };
	return (
		<>
			<div className="h-screen overflow-auto flex flex-col">
				{/* <Navbar /> */}
				<div className="flex-grow flex bg-custom-blackPearl">
					<CustomCollapse
						open={open}
						handleToggle={handleToggle}
						collapsedMinSize={84}
						tooltipText={open ? "Collapse menu" : "Expand menu"}
						collapseButton={true}
						collapseButtonElement={
							<div className={`cursor-pointer absolute lg:top-7 xl:top-12 -right-3 z-[13001] rounded-full bg-grey-15 hover:bg-custom-ghostWhite h-6 w-6 flex items-center justify-center transition-all duration-250 ease-in `} onClick={handleToggle}>
								<KeyboardDoubleArrowLeftRoundedIcon style={{
									color: '#454C54',
									transform: open ? 'rotate(0deg)' : 'rotate(180deg)',
									transition: 'transform 0.3s ease, color 0.3s ease',
								}}
									className="hover:!text-[#141619]" />
							</div>
						}
					>
						<Sidebar collapsed={!open} />
					</CustomCollapse>
					{/* <div className="layout-content"> */}
					<div className="m-10 ml-8 w-full flex flex-col h-[calc(100vh-80px)] overflow-y-auto">
						<AnimatePresence mode="wait">
							<AnimatedOutlet key={location.pathname} />
						</AnimatePresence>
					</div>
				</div>
			</div>
		</>
	);
}