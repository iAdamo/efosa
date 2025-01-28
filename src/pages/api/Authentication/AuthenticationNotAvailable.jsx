export default function AuthenticationNotAvailable(props) {
	return (
		<>
			<div className="bg-[#080808] p-5 rounded-[10px] gap-5 flex flex-col w-[28vw]">
				<div className="self-stretch justify-start items-start gap-2.5 inline-flex">
					<div className="grow shrink basis-0 h-[17px] pr-2.5 justify-start items-center flex">
						<div className="justify-start items-center gap-[5px] flex">
							<div className="text-yellow-400 text-sm font-bold font-['Inter']">
								Authenticate
							</div>
							<div className="text-white text-sm font-bold font-['Inter']">
								Pending upload
							</div>
							<div className="w-5 h-[15px] p-2.5 justify-center items-center gap-2.5 flex" />
						</div>
					</div>
					<div className="text-neutral-700 text-xs font-medium font-['Inter'] leading-none tracking-tight">
						Change
					</div>
				</div>
				<div className="flex-col justify-start items-start gap-1 flex">
					<div className="w-[345px] text-neutral-200 text-xs font-medium font-['Inter'] leading-none tracking-tight">
						Insert API code to enable authentication
					</div>
				</div>
				<div className="self-stretch h-[82px] py-5 flex-col justify-center items-start flex">
					<div className="py-1.5 justify-start items-center gap-2.5 inline-flex">
						<div className="px-[15px] py-2 bg-neutral-700 rounded-[50px] justify-center items-center gap-0.5 flex">
							<div className="grow shrink basis-0 text-center text-neutral-400 text-xs font-semibold font-['Inter'] leading-[14px] tracking-tight">
								Authenticate
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
