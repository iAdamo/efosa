import notAuthenticated from "@assets/icons/not-authenticated.svg";
export default function Status(props) {
	const { status, count, color, skipMargin } = props;
	return (
		<>
			<div
				className={"w-full h-[90px] pr-5 pt-5 pb-[31px] bg-[#111111] rounded-[10px] flex-col justify-start items-end gap-2.5 inline-flex"}
			>
				<div className="self-stretch justify-start items-start gap-2.5 inline-flex">
					<div className="grow shrink basis-0 h-[17px] pr-2.5" />
					<div className="justify-start items-center gap-2 flex">
						<div
							className={`px-[5px] py-[3px] rounded-[3px] border border-[${color}] justify-center items-center gap-[5px] flex`}
						>
							<div
								className={`text-[${color}] text-[11px] font-semibold font-['Inter'] uppercase leading-3 tracking-tight`}
							>
								{status}
							</div>
						</div>
					</div>
				</div>
				<div className="self-stretch h-[29px] flex-col justify-end items-end flex">
					<div
						className={` text-center text-[${
							count > 0 ? color : "#8c8c8c"
						}] text-2xl font-normal font-['Inter']`}
					>
						{count}
					</div>
				</div>
			</div>
		</>
	);
}
