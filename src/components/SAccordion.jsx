import React, { useEffect, useRef, useState } from "react";
import Add from "@assets/icons/add.svg?react";
import Minus from "@assets/icons/minus.svg?react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "react-aria-components";

const SAccordion = ({
	title,
	content,
	open,
	index,
	toggleAccordion,
	accordionClassname = "",
	titleClassname = "",
	contentClassname = "",
	contentWrapperClassname = "",
	utils,
	reverseIcon = false,
	openIcon,
	closeIcon,
	iconClassName = "",
	hidePlus,
	buttonClassname = "",
	isHoverable,
	isTest,
	openClassName,
	startIcon = "",
}) => {
	const [accOpen, setAccOpen] = useState(open ? open : false);

	useEffect(() => {
		open !== undefined && setAccOpen(open);
	}, [open]);

	const toggleAccordionHandler = () => {
		if (toggleAccordion && index !== undefined) {
			toggleAccordion(index);
		} else {
			setAccOpen((prev) => !prev);
		}
	};

	return (
		<div
			key={index}
			className={`accordion-item ${accordionClassname} ${isHoverable ? (isTest ? "bg-[#00EFD91A]" : "bg-[#D32DCA1A]") : ""}`}
		>
			<div
				className={`cursor-pointer ${accOpen ? openClassName : titleClassname}  ${titleClassname ? titleClassname : "title-div"} ${reverseIcon ? "flex-row-reverse" : "flex-row"
					} justify-between items-center`}
				onClick={toggleAccordionHandler}
			>
				<div className={`flex items-center gap-[5px]`}>
					{startIcon && startIcon}

					{title && <Button
						className={`cursor-pointer ${buttonClassname}`}
						onClick={toggleAccordionHandler}
					>
						{title}
					</Button>}
				</div>
				{(utils || content) && (
					<div
						className={`flex gap-2 w-[30px] h-[30px] ${iconClassName} flex-shrink-0`}
					>
						{utils}
						{content && !hidePlus && (
							<>
								<Button
									className="icon-interactive cursor-pointer"
									onPress={toggleAccordionHandler}
								>
									<AnimatePresence initial={false} mode="wait">
										<motion.div
											key={accOpen ? "minus" : "plus"}
											animate={{
												zIndex: 1,
												rotate: 0,
												transition: {
													type: "tween",
													duration: 0.15,
													ease: "circOut",
												},
											}}
											exit={{
												zIndex: 0,
												rotate: accOpen ? -90 : 90,
												transition: {
													type: "tween",
													duration: 0.15,
													ease: "circIn",
												},
											}}
										>
											{accOpen ? (
												closeIcon ? (
													closeIcon
												) : (
													<Minus className="s-icon-grey-4" />
												)
											) : openIcon ? (
												openIcon
											) : (
												<Add className="s-icon-grey-4" />
											)}
										</motion.div>
									</AnimatePresence>
								</Button>
							</>
						)}
					</div>
				)}
			</div>

			<AnimatePresence mode="wait">
				{accOpen && (
					<motion.div
						initial={{
							height: 0,
						}}
						animate={{
							height: "auto",
						}}
						exit={{
							height: 0,
						}}
						className={`${contentWrapperClassname} overflow-hidden`}
					>
						<div className={`${contentClassname}`}>
							{content}
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};

export default SAccordion;
