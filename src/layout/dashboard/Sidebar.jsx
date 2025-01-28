import { sidebarFlyIn } from "@/animations";
import Button from "@/components/Button";
import SidebarItem from "@/components/SidebarItem";
import SubSidebarLinks from "@/components/SubSidebarLinks";
import { GeneralContext } from "@/contexts/GeneralContext";
import ChevronBottomIcon from "@/Icons/ChevronBottomIcon";
import ProfileIcon from "@assets/icons/dashboard/sidebar/profile-icon.svg?react";
import UserIcon from "@assets/icons/dashboard/sidebar/user.svg?react";
import SettingsIcon from "@assets/icons/new-settings.svg?react";
import SignOutIcon from "@assets/icons/sign-out.svg?react";
import MenuCard from "@components/MenuCard";
import SAccordion from "@components/SAccordion";
import { Popover } from "@mui/material";
import { motion } from "framer-motion";
import Cookies from "js-cookie";
import { useContext, useState } from "react";
import { Group } from "react-aria-components";
import { useNavigate } from "react-router-dom";
import { MenuCardData, SidebarOptions } from "./constants";
import Navbar from "./Navbar";

export default function Sidebar({ collapsed = false }) {
	const navigate = useNavigate();
	const { projects, firstName, lastName } = useContext(GeneralContext);
	const [anchorEl, setAnchorEl] = useState(null);
	const open = Boolean(anchorEl);
	const id = open ? 'simple-popover' : undefined;

	const handleClose = () => {
		setAnchorEl(null);
	};

	return (
		<motion.aside {...sidebarFlyIn} className={`z-dialog-overlay h-screen bg-landing-sidebar-gradient p-3 lg:p-5 xl:p-10 xl:px-0 lg:px-0 flex flex-col ${collapsed ? 'lg:w-[64px] xl:w-[84px] items-center' : 'w-[285px]'} transition-[width] ease-in-out duration-300 border-r rounded-lg border-gradient-grey-1 relative`}>
			<Navbar />
			<div className="lg:pl-5 lg:pr-3 xl:pl-10 xl:pr-7 flex flex-col gap-10 flex-1 overflow-y-auto h-max mt-10">
				{!collapsed && <div className={"flex justify-start gap-1.5 mr-[17px] min-h-16 max-h-16"}>
					{MenuCardData.length && MenuCardData.map((item, index) => {
						return (
							<MenuCard
								key={item.label}
								label={item.label}
								className={`bg-hover-grey-1 ${item.bgColor}`}
								Logo={item.Logo}
								onPress={() => {
									navigate(item.navigatePath);
								}}
							/>
						)
					})
					}
				</div>}
				<div className="flex flex-col gap-1">
					{SidebarOptions?.map((item, index) => {
						return (
							item?.label === "Projects" || item?.label === "My APIs" ?
								<>{collapsed ? <></> : <SAccordion
									key={index}
									title={collapsed ? null : <span className="text-lg font-normal">{item?.label}</span>}
									open={false}
									titleClassname="px-1 py-3 flex justify-between items-center"
									openClassName="bg-sidebar-option-gradient rounded-[5px] border border-grey-12 px-2 p-4"
									iconClassName="h-full"
									startIcon={item.StartIcon}
									openIcon={<ChevronBottomIcon />}
									closeIcon={<ChevronBottomIcon rotation={180} />}
									content={
										<Group className={"flex flex-col gap-1 border-l border-grey-13 ml-3 mt-4 mb-3"}>
											<SubSidebarLinks to={item.to} label={"All"} />
											{item?.label === "Projects" && projects?.slice(0, 3).map((project, index) => {
												return (
													<>
														<SubSidebarLinks
															to={"/project/" + project.id + "/integrations"}
															label={project.name}
														/>
													</>
												);
											})}
											{item?.label === "My APIs" && <SubSidebarLinks
												to={"/my-apis/upload"}
												label={"Add My APIs..."}
											/>}
										</Group>
									}
								/>}</> :
								<SidebarItem
									Image={item.icon}
									to={item.to}
									label={collapsed ? null : item.label}
								/>
						)
					})}
				</div>
			</div>
			<div className="w-full flex items-center">
				<Button aria-describedby={id} onClick={(e) => {
					setAnchorEl(e.currentTarget)
				}} className="w-full flex justify-center gap-3 items-center ">
					<div className="rounded-full overflow-hidden">
						<ProfileIcon className="h-7" />
					</div>
					{!collapsed && <div className="py-3">
						<div className="text-lg font-medium leading-3">{firstName} {lastName}</div>
						<div className="text-sm font-normal mt-[3px] text-grey-11 text-left">My account</div>
					</div>}
				</Button>
				<Popover
					id={id}
					open={open}
					anchorEl={anchorEl}
					onClose={handleClose}
					anchorOrigin={{
						vertical: 'top',
						horizontal: 'center',
					}}
					transformOrigin={{
						vertical: 'bottom',
						horizontal: 'center',
					}}
					slotProps={{
						paper: {
							sx: {
								background: 'transparent',
								color: "#F8F9FA",
								width: '230px',
							}
						}
					}}
				>
					<div className="p-2 border border-gradient-grey-1 rounded-lg w-full max-w-[230px] left-0 bg-[#282a31]">
						<div onClick={() => navigate("/profile")} className="cursor-pointer h-10 flex gap-1.5 rounded-lg text-lg font-normal items-center px-2 justify-start">
							<UserIcon className="h-7" /> Account
						</div>
						<div className="cursor-pointer h-10 flex gap-1.5 rounded-lg text-lg font-normal border-b border-gradient-grey-1 items-center px-2 justify-start">
							<SettingsIcon />Settings
						</div>
						<div onClick={() => {
							Cookies.remove("token", { path: "/" });
							navigate("/login");
						}} className="cursor-pointer h-10 flex gap-1.5 rounded-lg text-lg font-normal items-center px-2 justify-start">
							<SignOutIcon className="icon-gray-1 stroke-white" />Sign out
						</div>
					</div>
				</Popover>
			</div>
		</motion.aside >
	);
}
