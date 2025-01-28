import notAuthenticated from "@assets/icons/not-authenticated.svg";
import check from "@assets/icons/checkmark.svg";
import addApi from "@assets/icons/add-api.svg";
import success from "@assets/icons/success.svg";
import { useNavigate } from "react-router-dom";
export default function API(props) {
	const {
		API,
		name,
		number,
		skipMargin,
		isAuthenticated,
		authenticationType,
		projectID,
	} = props;
	const navigate = useNavigate();

	return (
		<>
			{API ? (
				<>
					<div
						className={
							"w-full h-[122px] bg-[#111111] border border-transparent rounded-[5px] p-[10px] cursor-pointer"
						}
						onClick={() => {
							navigate(`/project/${projectID}/settings`);
						}}
					>
						<div className="text-white text-xs font-bold font-['Inter']">
							API {number}
						</div>
						<div
							className={`${number === 1 ? "text-secondary-cerise" : "text-secondary-mint-green"} text-[20px] pt-[5px] pb-[5px] truncate`}
						>
							{name}
						</div>

						<div className="h-[15px] justify-end items-center gap-[15px] inline-flex pt-[30px]">
							<div className="justify-end items-center gap-1 flex">
								{!isAuthenticated ? (
									<>
										<img src={notAuthenticated} />
										<div className="w-28 h-[15px] text-[#aeaeae] text-[10px] font-normal font-['Inter'] leading-3 tracking-tight pt-[2px]">
											Not authenticated
										</div>
									</>
								) : (
									<>
										<div
											className={`p-[5px] rounded-[5px] ${number === 1 ? "bg-[#A207AC]" : "bg-[#098075]"} uppercase mr-2`}
										>
											{authenticationType}
										</div>
										<img src={success} />
										<div className="w-28 h-[15px] text-[#aeaeae] text-[10px] font-normal font-['Inter'] leading-3 tracking-tight pt-[2px]">
											Authenticated
										</div>
									</>
								)}
							</div>
						</div>
					</div>
				</>
			) : (
				<>
					<div
						className={`h-[122px] w-[245px] bg-[#3c3c3c] rounded-[10px] border border-[#555555] justify-center items-center inline-flex cursor-pointer ${
							skipMargin ? "" : "mr-[10px]"
						}`}
						onClick={() => {
							navigate(`/project/${projectID}/settings`);
						}}
					>
						<div className="justify-start items-center gap-[5px] flex">
							<img src={addApi} />
							<div className="text-[#8c8c8c] text-sm font-semibold font-['Inter'] leading-3">
								API {number}
							</div>
						</div>
					</div>
				</>
			)}
		</>
	);
}
