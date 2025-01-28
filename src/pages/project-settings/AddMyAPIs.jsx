import SPopover from "@components/SPopover";
import { useNavigate } from "react-router-dom";
import React, { useContext } from "react";
import { Popover } from "@headlessui/react";
import addIcon from "@assets/icons/add.svg";
import favIcon from "@assets/icons/fav.svg";
import apiIcon from "@assets/icons/api.svg";
import DragableApiCard from "./DragableApiCard";
import { ProjectContext } from "@contexts/ProjectContext";
import addRounded from "@assets/icons/add-rounded.svg";
import library from "@assets/icons/library.svg";
import magic from "@assets/icons/magic.svg";
import code from "@assets/icons/code.svg";
import url from "@assets/icons/url.svg";
import { GeneralContext } from "@contexts/GeneralContext";
import { postGenericCRUD } from "@axios/apiCalls";
import { Button } from "react-aria-components";
import { useAnimate } from "framer-motion";
import { useEffect } from "react";
import { stagger } from "framer-motion";

export default function AddMyAPIs() {
	const { projectID } = useContext(ProjectContext);
	const { myAPIs, setMyAPIs } = useContext(GeneralContext);

	const navigate = useNavigate();
	const [scope, animate] = useAnimate();

	useEffect(() => {
		if (!scope.current) {
			return;
		}
		animate(
			".api-container",
			{ opacity: [0, 1], x: [-40, 0] },
			{ delay: stagger(0.1) },
		);
	}, [myAPIs]);

	const navigateAddAPI = async (type) => {
		let firstEmpty = null;

		for (let i = 0; i < myAPIs.length; i++) {
			if (myAPIs[i].APIID == null) {
				firstEmpty = myAPIs[i];
				break;
			}
		}

		if (firstEmpty == null) {
			const createdMyAPI = await postGenericCRUD("MyAPIs", {});

			const newMyAPIs = [];
			for (let i = 0; i < myAPIs.length; i++) {
				newMyAPIs.push(myAPIs[i]);
			}
			newMyAPIs.push(createdMyAPI.data[0]);
			setMyAPIs(newMyAPIs);

			navigate(
				`/project/${projectID}/myapi/${createdMyAPI.data[0].id}?type=${type}`,
			);
		} else {
			navigate(`/project/${projectID}/myapi/${firstEmpty.id}?type=${type}`);
		}
	};

	const AddAPIOptions = () => {
		return (
			<ul className="add-api-options">
				<li>
					<Popover.Button>
						<div className="flex gap-2 items-center">
							<img src={magic} className="icon-grey-5" />
							<span className="label">AI</span>
						</div>
					</Popover.Button>
				</li>
				<li>
					<Popover.Button
						onClick={() => {
							navigateAddAPI("upload");
						}}
					>
						<span>Upload</span>
					</Popover.Button>
				</li>
				<li>
					<Popover.Button
						onClick={() => {
							navigateAddAPI("url");
						}}
					>
						<div className="flex gap-2 items-center">
							<img src={url} className="icon-grey-5" alt="url" />
							<span className="label">URL</span>
						</div>
					</Popover.Button>
				</li>
				<li>
					<Popover.Button
						onClick={() => {
							navigateAddAPI("code");
						}}
					>
						<div className="flex gap-2 items-center">
							<img src={code} className="icon-grey-5" />
							<span className="label">Code</span>
						</div>
					</Popover.Button>
				</li>
				<li>
					<Popover.Button>
						<div className="flex gap-2 items-center">
							<img src={library} className="icon-grey-5" />
							<span className="label">Specc Library</span>
						</div>
					</Popover.Button>
				</li>
			</ul>
		);
	};

	const AddAPIButtonContainer = () => {
		return (
			<Button
				onPress={(e) => {
					e.stopPropagation();
				}}
				className="add-apis"
			>
				<SPopover content={<AddAPIOptions />}>
					<div className="flex justify-center items-center gap-[5px]">
						<img src={addRounded} />
						<span className="add-span">Add new API</span>
					</div>
				</SPopover>
			</Button>
		);
	};

	const AddApiList = () => {
		return (
			<div className="my-apis s-form-container h-full">
				<div className="flex justify-between items-center mb-[20px]">
					<div className="flex items-center">
						<img
							src={apiIcon}
							alt="api"
							className="icon-yellow mr-1 icon-large"
						/>
						<span className="label label-bold label-highlight">My APIs</span>
					</div>
					<div className="flex gap-2 items-center">
						<div className="icon-interactive">
							<img className="icon-grey-5" src={favIcon} alt="favourite" />
						</div>
						<SPopover
							className={"flex justify-center items-center"}
							content={<AddAPIOptions />}
						>
							<div className="icon-interactive">
								<img className="icon-grey-5" src={addIcon} alt="add" />
							</div>
						</SPopover>
					</div>
				</div>
				<span className="label mb-[20px] flex">
					Drag and drop card into API 1 and API 2.
				</span>
				<ul ref={scope} className="flex flex-col gap-[10px]">
					{myAPIs.map((api) => {
						return <DragableApiCard myAPI={api} />;
					})}
				</ul>
			</div>
		);
	};
	return <>{myAPIs.length > 0 ? <AddApiList /> : <AddAPIButtonContainer />}</>;
}
