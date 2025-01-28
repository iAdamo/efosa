import { deleteGenericCRUDWithID, getAPIDetails } from "@axios/apiCalls";
import React, { useEffect, useState } from "react";
import APIDetailsLoader from "./APIDetailsLoader";
import { useNavigate, useParams } from "react-router-dom";
import favIcon from "@assets/icons/fav.svg";
import apiIcon from "@assets/icons/api.svg";
import warningIcon from "@assets/icons/warning.svg";
import uploadIcon from "@assets/icons/upload.svg";
import moment from "moment";
import SBadge from "@components/SBadge";
import { motion } from "framer-motion";
import { routeAnim } from "@/animations";
import { ProjectContext } from "@/contexts/ProjectContext";
import { useContext } from "react";
import notAuthenticated from "@assets/icons/not-authenticated.svg";
import success from "@assets/icons/success.svg";

function APIDetails({
	APIID,
	direction,
	isAuthenticated,
	authenticationType,
	number,
}) {
	const { urlProjectID } = useParams();
	const [apiDetails, setApiDetails] = useState(null);
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();
	const navigateAddAPI = (obj) => {
		navigate(obj);
	};

	const { refreshProjectInitialData } = useContext(ProjectContext);

	useEffect(() => {
		(async () => {
			try {
				!loading && setLoading(true);
				const { data } = await getAPIDetails(APIID);
				setApiDetails(data[0]);
				setLoading(false);
			} catch (err) {
				setLoading(false);
			}
		})();
	}, [APIID]);
	const editAPIPage = () => {
		navigateAddAPI({
			pathname: `/project/${urlProjectID}/settings/api/${direction}`,
		});
	};
	const removeAPI = async (APIID) => {
		await deleteGenericCRUDWithID("API", APIID);
		refreshProjectInitialData();
	};
	return loading ? (
		<APIDetailsLoader />
	) : (
		<motion.div
			{...routeAnim}
			className="api-container api-container-dark cursor-default"
		>
			<div className="flex flex-col gap-[5px]">
				<div className="header flex justify-between">
					<div className="flex items-center gap-[10px]">
						<img
							src={apiIcon}
							alt="api"
							className={number === 1 ? "icon-pink" : "icon-mint-green"}
						/>
						<span
							className={`label ${number === 1 ? "label-pink" : "label-mint-green"}`}
						>
							API
						</span>
						<span className="label capitalize">{apiDetails.customName}</span>
					</div>
					<div className="flex items-center gap-[10px]">
						<button
							className={`label ${number === 1 ? "label-pink" : "label-mint-green"}`}
							onClick={editAPIPage}
						>
							Edit
						</button>
						<button
							className={`label ${number === 1 ? "label-pink" : "label-mint-green"}`}
							onClick={() => {
								removeAPI(APIID);
							}}
						>
							Remove
						</button>
						<img
							className="icon-grey-5 z-10 h-[20px] w-[20px]"
							src={favIcon}
							alt="favourite"
						/>
					</div>
				</div>
				<span className="label">
					Last updated{" "}
					{moment(apiDetails["updated_at"]).format("DD-MM-YYYY HH:MM")}
				</span>
			</div>
			<div className="flex gap-[10px] mb-[21	px]">
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
		</motion.div>
	);
}

export default APIDetails;
