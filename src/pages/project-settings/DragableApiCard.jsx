import React, { useEffect } from "react";
import favIcon from "@assets/icons/fav.svg";
import apiIcon from "@assets/icons/api.svg";
import warningIcon from "@assets/icons/warning.svg";
import uploadIcon from "@assets/icons/upload.svg";
import { useDrag } from "@react-aria/dnd";
import SBadge from "@components/SBadge";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { Button } from "react-aria-components";
import { ProjectContext } from "@contexts/ProjectContext";
import { useContext } from "react";

function DragableApiCard({ myAPI }) {
	const navigate = useNavigate();
	const { projectID } = useContext(ProjectContext);
	const { dragProps, isDragging } = useDrag({
		getItems() {
			return [
				{
					"text/plain": JSON.stringify({
						myAPI,
					}),
				},
			];
		},
	});

	return (
		<div {...dragProps} className="api-container" data-is-dragging={isDragging}>
			<div className="flex flex-col gap-[5px]">
				<div className="header flex justify-between">
					<div className="flex items-center gap-[10px]">
						<img src={apiIcon} alt="api" className="icon-yellow" />
						<span className="label label-highlight">API</span>
						<span className="label capitalize">{myAPI.API?.customName}</span>
					</div>
					<div className="flex items-center gap-[10px]">
						<Button
							className="label label-highlight"
							onPress={() => {
								navigate(`/project/${projectID}/myapi/${myAPI.id}`);
							}}
						>
							Edit
						</Button>
						<img
							className="h-[20px] w-[20px] icon-grey-5 z-10"
							src={favIcon}
							alt="favourite"
						/>
					</div>
				</div>
				<span className="label">
					Last updated {moment(myAPI.updated_at).format("DD-MM-YYYY HH:MM")}
				</span>
			</div>
			<div className="flex gap-[10px]">
				<SBadge label={"VIPPS"} />
				<SBadge label={"BASIC"} />
			</div>
			<div className="flex gap-[10px]">
				<div className="flex gap-1">
					<img src={uploadIcon} className="icon-pink" alt="upload" />
				</div>
				<div className="flex gap-1">
					<img src={warningIcon} className="icon-pink" alt="warning" />
					<span className="label">1</span>
				</div>
				<div className="flex gap-1">
					<img src={apiIcon} className="icon-pink" alt="api" />
					<span className="label">0</span>
				</div>
			</div>
		</div>
	);
}

export default DragableApiCard;
