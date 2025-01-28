import SSidebar from "@/components/SSidebar/SSidebar";
import Logo from "@/assets/icons/logo.svg?react";
import AIIcon from "@/assets/icons/ai-magic.svg?react";
import Settings from "@/assets/icons/dashboard/sidebar/settings.svg?react";
import SButton from "@/components/SButton";
import STabs from "@/components/STabs";
import Chat from "@/assets/icons/chat.svg?react";
import AIStar from "@/assets/icons/ai-icon.svg?react";
import Mic from "@/assets/icons/mic.svg?react";
import Send from "@/assets/icons/send.svg?react";
import SInput from "@/components/SInput";
import SAccordion from "@/components/SAccordion";
import Add from "@/assets/icons/add.svg?react";
import Message from "@/assets/icons/message.svg?react";
import MoreHorizontal from "@/assets/icons/more-horizontal.svg?react";
import { SMenuButton } from "@/components/MenuDropdown";
import { SMenuItem } from "@/components/MenuDropdown";
import Placeholder from "@assets/icons/user-placeholder.svg?react";
import Copy from "@/assets/icons/copy-icon-2.svg?react";
import ThumbsUp from "@/assets/icons/thumbs-up.svg?react";
import ThumbsDown from "@/assets/icons/thumbs-down.svg?react";
import { askAI } from "@/axios/apiCalls";
import { useState } from "react";
import SForm from "@/components/SForm";
import Loading from "@/components/loaders/Loading";
import { useEffect, useRef, useContext } from "react";
import ResizableContainer from "@/components/SResizableContainer";
import Clean from "@/assets/icons/clean.svg?react";
import ChatEmptyComponent from "@/layout/wizard/ai/emptyStates/chatEmptyComponent";
import { WizardContext } from "@/contexts/WizardContext";
import Tasks from "./Tasks";
import SSidebarNonFloating from "@/components/SSidebar/SSidebarNonFloating";
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";
import { sidebarFlyInRight } from "@/animations";

export default function AISidebar() {
	const { isAIChatOpen } = useContext(WizardContext);
	const temp = ["Authentication", "Another chat", "Sample", "Sample2"];

	const [searchText, setSearchText] = useState("");
	const [currentChat, setCurrentChat] = useState([]);
	const [actions, setActions] = useState([]);
	const [tasks, setTasks] = useState([]);
	const [isLoadingResults, setIsLoadingResults] = useState(false);
	const [isTasksOpen, setIsTasksOpen] = useState(true);

	const listRef = useRef(null);

	const handleSend = async (message) => {
		addQuestionToChat(message);
		setSearchText("");
		listRef.current?.lastElementChild?.scrollIntoView();
	};

	const addQuestionToChat = (message) => {
		const temp = [...currentChat];
		temp.push({
			isQuestion: true,
			message: message,
		});
		setCurrentChat(temp);
		askQuestion(message, temp);
	};

	const askQuestion = async (message, updatedChat) => {
		setIsLoadingResults(true);
		await askAI(message).then((response) => {
			setCurrentChat([
				...updatedChat,
				{
					isQuestion: false,
					message: response,
				},
			]);
			setIsLoadingResults(false);
		});
	};

	const chatHistory = () => {
		return (
			<div className="flex flex-col ">
				<div className="border-b border-grey-2 w-full mt-[10px]" />
				<SAccordion
					title={<span className="font-bold">Chat history</span>}
					iconClassName="h-auto"
					content={
						<div className="flex flex-col max-h-[13vh]">
							<div className="flex gap-[10px] items-center p-[10px] cursor-pointer">
								<Add className="icon-grey-5" />
								<div class="text-[#aeaeae] text-xs font-normal font-['Inter'] leading-[14px] tracking-tight">
									New chat
								</div>
							</div>
							{temp.map((item) => (
								<div
									key={item}
									className="flex justify-between p-[10px] group hover:bg-grey-1 rounded-[5px] cursor-pointer"
								>
									<div className="flex gap-[10px]">
										<Message className="icon-grey-5" />
										<div class="text-white text-[10px] font-normal font-sans leading-[14px]">
											{item}
										</div>
									</div>
									{/* <MoreHorizontal className="icon-white hidden group-hover:block" /> */}
									<SMenuButton
										label={
											<MoreHorizontal
												alt="more"
												// className="hidden group-hover:block"
											/>
										}
										className="flex flex-col gap-[8px] "
									>
										<SMenuItem onAction={() => {}} className="cursor-pointer">
											Delete chat
										</SMenuItem>
									</SMenuButton>
								</div>
							))}
							<span className="text-white text-[12px] font-light font-['Inter'] leading-none">
								{" "}
								Our AI handles the heavy lifting, automating tasks and keeping
								things running smoothly. Start Speccing and experience the magic
							</span>
						</div>
					}
				/>
			</div>
		);
	};

	const chatSection = () => {
		return (
			<>
				<div className="border-b border-grey-2 w-full mt-[10px]" />
				<div className="flex flex-col justify-between h-full overflow-hidden">
					<div className="flex justify-between py-[10px]">
						<div class="text-white text-xs font-bold font-['Inter'] leading-[11px] tracking-tight">
							Start chatting
						</div>
						<div
							onClick={() => {
								setCurrentChat([]);
							}}
							onKeyDown={() => {
								setCurrentChat([]);
							}}
							className="flex gap-[5px] items-center cursor-pointer"
						>
							<Clean className="h-4 w-5" />
							<div class="text-[#8c8c8c] text-[10px] font-medium font-['Inter'] underline leading-3">
								Clear History
							</div>
						</div>
					</div>
					<div ref={listRef} className="flex flex-col   overflow-scroll ">
						{currentChat.map((item, index) =>
							item.isQuestion
								? chatQuestionUI(item.message)
								: aiReplyUI(item.message),
						)}
					</div>
				</div>
				{inputComp()}
			</>
		);
	};

	const chatQuestionUI = (message) => {
		return (
			<div className="flex gap-[10px] py-[10px] items-center ">
				<div className="w-8 h-8 rounded-2xl border flex items-center justify-center">
					<Placeholder
						alt="placeholder"
						className="icon-grey-5 w-5 h-5 group-hover:icon-white"
					/>
				</div>
				<div class=" w-[80%] text-white text-[12px] font-normal font-['Inter']">
					{message}
				</div>
			</div>
		);
	};

	const aiReplyUI = (message) => {
		return (
			<div className="py-[10px] flex flex-col group">
				<div className="flex gap-[10px] items-center">
					<div className="w-8 h-8 rounded-2xl  flex items-center justify-center  pink-gradient">
						<Logo
							alt="placeholder"
							className="icon-white w-5 h-5 group-hover:icon-white"
						/>
					</div>
					<div class="w-[80%] text-white text-[12px] font-normal font-['Inter']">
						{message}
					</div>
				</div>
				<div className=" p-[10px] gap-2 bg-grey-1 rounded-[5px] mt-2 px-5 hidden group-hover:flex items-end">
					<Copy className="cursor-pointer" />
					<ThumbsUp className="cursor-pointer" />
					<ThumbsDown className="cursor-pointer" />
				</div>
			</div>
		);
	};

	const inputComp = () => {
		return (
			<div className="flex flex-col gap-5 pt-[10px] ">
				<SForm onSubmit={() => handleSend(searchText)}>
					<SInput
						type="text"
						className="border input-gradient"
						placeholder="Send message"
						value={searchText}
						leftIcon={<Mic className="mr-[10px] w-6" />}
						icon={
							isLoadingResults ? (
								<div className="max-h-[25px] max-w-[25px] ml-[5px] justify-center items-center">
									<Loading
										className="h-[20px] w-[20px]"
										imgClassName="h-[20px] w-[20px]"
									/>
								</div>
							) : (
								<SButton className="w-8 h-5 !px-[5px] !bg-transparent ml-[5px]">
									<Send
										className="w-6"
										onClick={() => {
											handleSend(searchText);
										}}
									/>
								</SButton>
							)
						}
						onChange={(e) => {
							setSearchText(e.target.value);
						}}
					/>
				</SForm>
				<div class=" text-center text-[#aeaeae] text-[10px] font-normal font-['Inter']">
					Specc AI can give inaccurate information, please review all responses
				</div>
			</div>
		);
	};

	const resizableSidebar = () => (
		<motion.div {...sidebarFlyInRight}>
			<ResizableContainer
				className="absolute right-0"
				maxConstraints={[
					(window.innerWidth / 12) * 3 + 20,
					window.innerHeight - 50,
				]}
				minConstraints={[
					(window.innerWidth / 12) * 2 + 10,
					window.innerHeight - 50,
				]}
				width={(window.innerWidth / 12) * 2.5 + 10}
				axis="x"
				height={window.innerHeight - 60}
			>
				<SSidebarNonFloating
					className="!overflow-y-hidden py-[10px] px-5 w-full"
					open={true}
				>
					<div className="flex justify-between items-center py-[10px]">
						<div className="flex gap-[5px] items-center">
							<Logo className="h-4 w-4" />
							<div class="text-white text-base font-bold font-['Inter'] leading-[11px] tracking-tight">
								Specc AI
							</div>
						</div>
						<Settings className="h-5 w-5 icon-white" />
					</div>

					<STabs
						tabClassName="p-0 w-full h-full"
						tabs={[
							{
								name: "Chat",
								icon: <Chat className="mr-[10px]" />,
								className: "h-full",
								tabClassName: "h-full",

								selectionColor: "purple-gradient-background",
								children: (
									<div className="flex flex-col justify-between h-[80vh] overflow-hidden pb-[6vh]">
										{currentChat.length === 0 ? (
											<ChatEmptyComponent handleSend={handleSend} listRef />
										) : (
											<>{chatSection()}</>
										)}
									</div>
								),
							},

							{
								name: "Tasks",
								icon: <AIIcon className="mr-[10px] w-5 icon-white" />,
								selectionColor: "tasks-gradient-background",

								children: (
									<div className="flex flex-col justify-between h-[80vh] overflow-hidden pb-[6vh]">
										<Tasks />
									</div>
								),
							},
						]}
					/>
				</SSidebarNonFloating>
			</ResizableContainer>
		</motion.div>
	);
	return (
		<AnimatePresence mode="wait">
			{isAIChatOpen ? resizableSidebar() : <></>}
		</AnimatePresence>
	);
}
