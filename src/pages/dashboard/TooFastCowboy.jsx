import { GeneralContext } from "@/contexts/GeneralContext";
import React, { useEffect, useState, useContext, useRef } from "react";
//import Handsign from "@assets/images/hand-removebg-preview.png";
import Handsign from "@assets/images/hand-coming-soon.svg";
import { useNavigate } from "react-router-dom";
import { Button } from "react-aria-components";

//import Test from "./test";

export default function TooFastCowboy(props) {
	const { firstName, companyName } = useContext(GeneralContext);
	const navigate = useNavigate();

	//return <Test />;
	return (
		<div className="flex flex-grow items-center justify-center">
			<div className="flex-col justify-center items-center gap-[30px] inline-flex">
				<div className="flex-col justify-center items-center gap-5 flex">
					<div className="flex-col justify-center items-center gap-2.5 flex">
						<img src={Handsign} className="h-[100px]" alt="loading" />
						<div className="text-center text-white font-bold font-['Inter'] leading-tight tracking-tight text-[20px]">
							{firstName}! We know you are keen, which we appreciate!
						</div>
						<div className="text-center text-white font-bold font-['Inter'] leading-tight tracking-tight text-[16px]">
							But this hasn't been released yet.
						</div>
						<div className="text-center text-white text-xs font-normal font-['Inter'] leading-[14px]">
							<br />
							Go to{" "}
							<Button
								onClick={() => navigate("/new-project")}
								className="underline cursor-pointer"
							>
								this link
							</Button>{" "}
							to make a new project
						</div>
					</div>
					<div className="p-2 rounded-[5px] justify-start items-center gap-[5px] inline-flex">
						<div className="w-5 h-[15px] pl-0.5 pr-[3px] justify-center items-center flex">
							<div className="w-[15px] h-[15px] relative flex-col justify-start items-start flex" />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
