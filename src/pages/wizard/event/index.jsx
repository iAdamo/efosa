import ErrorMessage from "@/components/Alerts/ErrorMessage";
import SuccessMessage from "@/components/Alerts/SuccessMessage";
import NestedGrid from "@/components/NestedGrid/NestedGrid";
import { DataContext } from "@/contexts/DataContext";
import { ProjectContext } from "@/contexts/ProjectContext";
import apiIcon from "@assets/icons/api.svg";
import infoIcon from "@assets/icons/info.svg";
import { getModuleInput, runModule } from "@axios/apiCalls";
import TextLoaders from "@components/loaders/TextLoaders";
import SSearch from "@components/SSearch";
import { WizardContext } from "@contexts/WizardContext";
import { cloneDeep } from "lodash";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Expandable from "../get-data/Expandable";
import GetData from "../get-data/GetData";

const navigation = "EVENT";
export default function TransferPage() {
	const {
		meatballs,
		speccID,
		activeModules,
		setMeatballs,
		getAndSetOKStatuses,
	} = useContext(WizardContext);
	const { control, setValue, handleSubmit } = useForm();
	const [moduleInputResponse, setModuleInputResponse] = useState(null);
	const [responseData, setResponseData] = useState(null);
	const [loading, setLoading] = useState(false);
	const [transferExpanded, setTransferExpanded] = useState(true);
	const [responseExpanded, setResponseExpanded] = useState(false);
	const [currentDataAction, setCurrentDataAction] = useState([]);
	const [lastExpanded, setLastExpanded] = useState([]);
	const [expandedMeatballs, setExpandedMeatballs] = useState(true);
	const [parentNode, setParentNode] = useState(null);
	const { destinationActiveNodesFiltered } = useContext(DataContext);
	const [hovered, setHovered] = useState(false);
	const [showMsg, setShowMsg] = useState(true);
	const [errors, setErrors] = useState([]);
	const { sourceAPICustomName, destinationAPICustomName } =
		useContext(ProjectContext);

	let module = null;

	const parentNodeMeatballs = meatballs.filter((meatball) => {
		return meatball.nodeID === parentNode?.id;
	});
	useEffect(() => {
		let parentNode = null;
		for (let i = 0; i < destinationActiveNodesFiltered.length; i++) {
			if (
				destinationActiveNodesFiltered[i].parentNode == null &&
				!destinationActiveNodesFiltered[i].isPostResponse
			) {
				parentNode = destinationActiveNodesFiltered[i];
				break;
			}
		}
		if (!parentNode) {
			return;
		} else {
			setParentNode(parentNode);
		}
	}, []);

	for (let i = 0; i < activeModules.length; i++) {
		if (activeModules[i].config.name === navigation) {
			module = activeModules[i];
			break;
		}
	}

	if (!module) {
		return <>No module!</>;
	}

	const collapseLastExpanded = () => {
		const latestExpandedComp = cloneDeep(
			lastExpanded[lastExpanded?.length > 1 ? lastExpanded?.length - 2 : 0],
		);
		if (latestExpandedComp === "transform") {
			setTransferExpanded(false);
		}

		if (latestExpandedComp === "response") {
			setResponseExpanded(false);
		}

		if (latestExpandedComp === "meatballs") setExpandedMeatballs(false);
	};

	useEffect(() => {
		const allExpanded = [];
		if (transferExpanded) allExpanded.push(true);

		if (responseExpanded) allExpanded.push(true);

		if (expandedMeatballs) allExpanded.push(true);

		if (allExpanded?.length > 2) collapseLastExpanded();
	}, [transferExpanded, responseExpanded, expandedMeatballs]);

	useEffect(() => {
		(async () => {
			try {
				setLoading(true);

				const moduleResponseInputAnswer = await getModuleInput(
					speccID,
					module.id,
				);


				if (!("found" in moduleResponseInputAnswer)) {
					setModuleInputResponse(moduleResponseInputAnswer);
				}
				setLoading(false);
			} catch (err) {
				console.error(err);
				setLoading(false);
			}
		})();
	}, []);

	const loaderDiv = () => (
		<div className="flex flex-col gap-3 px-3 h-[100%] w-[100%] mt-3">
			<TextLoaders count={5} containerClassName={"flex gap-2 h-[30px]"} />
			<TextLoaders count={5} containerClassName={"flex gap-2"} />
			<TextLoaders count={5} containerClassName={"flex gap-2"} />
			<TextLoaders count={5} containerClassName={"flex gap-2"} />
			<TextLoaders count={5} containerClassName={"flex gap-2"} />
		</div>
	);
	const getData = async () => {
		try {
			setLoading(true);
			const moduleResponseAnswer = await runModule(
				speccID,
				module.id,
				currentDataAction,
			);

			if (!moduleResponseAnswer?.isUseable) {
				const errors =
					moduleResponseAnswer?.listOfDataObjects[0]?.response?.body;
				setErrors(errors);
				throw new Error();
			}

			if (moduleResponseAnswer?.listOfDataObjects[currentDataAction[0]]) {
				let userData =
					moduleResponseAnswer?.listOfDataObjects[currentDataAction[0]];
				userData = {
					...userData,
					datarow: {
						...userData?.datarow,
						...userData?.response?.body?.value,
					},
				};
				setShowMsg(true);
				setExpandedMeatballs(false);
				setResponseExpanded(true);
				setLastExpanded([...lastExpanded, "response"]);
				setResponseData([userData]);
			}

			setLoading(false);
		} catch (err) {
			console.error(err);
			setShowMsg(true);
			setResponseExpanded(true);
			setLastExpanded([...lastExpanded, "response"]);
			setExpandedMeatballs(false);
			setResponseData({
				error: "Invalid payload",
			});
			setErrors(err?.message || "Something went wrong");
			setLoading(false);
		}
	};

	const updateMeatballs = (meatball, idx, removeHover) => {
		const oldMeatballs = cloneDeep(meatballs);

		const newMeatballs = oldMeatballs?.map((crMeatball) => {
			const currentMeatball = crMeatball;
			if (crMeatball?.id === meatball?.id) {
				currentMeatball.isHoverable = removeHover;
			} else {
				currentMeatball.isHoverable = false;
			}
			return currentMeatball;
		});

		setMeatballs([...newMeatballs]);
	};

	const Header = ({ showBtn }) => {
		return (
			<div
				className={`w-[100%] flex flex-col ${showBtn ? "pt-4 pl-4 pr-4 pb-2" : "pb-5"} gap-7`}
			>
				<div className="flex gap-2 items-center">
					<img
						src={apiIcon}
						className={`${showBtn ? "icon-mint-green" : responseData?.error ? "icon-red" : "icon-mint-green"}`}
						width={15}
						height={15}
					/>

					<span className="text-[16px] font-[700] flex gap-2 items-center">
						Create event
						<img src={infoIcon} className="icon-grey-5 cursor-pointer" />
					</span>
				</div>

				<div className="flex justify-between">
					<SSearch isTest={true} />
					{showBtn ? (
						<button className="transfer-btn default:non">Create event</button>
					) : null}
				</div>
			</div>
		);
	};

	const renderTable = (data) => {

		const listOfDataObjects = [];
		console.log('Module input response');
		console.log(moduleInputResponse);
		if (moduleInputResponse?.isUseable) {
			moduleInputResponse?.listOfDataObjects.forEach((data) => {
				const newObj = {};
				console.log(data);
				if (data?.source) {
					newObj.source = data?.source[0].datarow;
				}
				if (data?.destination) {
					newObj.destination = data?.destination.datarow;
				}
				listOfDataObjects.push(newObj);
			});
		}


		console.log('List of data objects');
		console.log(listOfDataObjects);


		return (
			<form className="event-subpage" onSubmit={handleSubmit(getData)}>
				<Header showBtn={true} />

				{loading ? (
					loaderDiv()
				) : (
					<>
						{moduleInputResponse?.listOfDataObjects?.length > 0 ? (
							<div className="overflow-y-scroll w-[100%] p-3">
								<div
									className="w-fit get-data-label flex"
									onMouseOver={() => setHovered(true)}
									onMouseOut={() => setHovered(false)}
								>
									{parentNodeMeatballs?.map((meatball, idx) => (
										<div
											className=" flex flex-wrap h-[34px] rounded p-[10px] bg-[#111111] hover:bg-[#00EFD91A] border border-[#00EFD9] cursor-pointer"
											onMouseOver={() => {
												updateMeatballs(meatball, idx, true);
											}}
											onMouseOut={() => {
												updateMeatballs(meatball, idx, false);
											}}
										>
											<div className=" h-[14px] flex gap-[2px] flexwrap">
												<span>{meatball?.name} </span>
												<span>=</span>
												<span className="text-[#00EFD9] font-[600] ">
													{meatball?.name || ""}
												</span>
											</div>
										</div>
									))}
								</div>
								<NestedGrid
									gridData={listOfDataObjects}
									isCheckbox={true}
									setAction={setCurrentDataAction}
									currentChecked={currentDataAction}
									isTest={true}
								/>
							</div>
						) : (
							<span className="flex justify-center">No data</span>
						)}
					</>
				)}
			</form>
		);
	};

	const updateExpansion = (compToUpdate) => {
		if (compToUpdate === "transform") {
			if (!transferExpanded) {
				setLastExpanded((prev) => [...prev, compToUpdate]);
			}
			setTransferExpanded(!transferExpanded);
		}

		if (compToUpdate === "response") {
			if (!responseExpanded) {
				setLastExpanded((prev) => [...prev, compToUpdate]);
			}
			setResponseExpanded(!responseExpanded);
		}

		if (compToUpdate === "meatballs") {
			if (!expandedMeatballs) {
				setLastExpanded((prev) => [...prev, compToUpdate]);
			}
			setExpandedMeatballs(!expandedMeatballs);
		}
	};


	const ShowMessage = ({ type }) => {
		return type === "success" && showMsg ? (
			<SuccessMessage showMsg={showMsg} setShowMsg={setShowMsg} sourceAPICustomName={sourceAPICustomName} destinationAPICustomName={destinationAPICustomName} />
		) : type === "error" ? (
			<ErrorMessage errors={errors} />
		) : null;
	};


	return (
		<div className={`container-transition flex w-[100%] pl-2 h-[100%] gap-2`}>


			<Expandable
				expanded={transferExpanded}
				setExpansion={updateExpansion}
				toExpand={"transform"}
				isTest={true}
			>
				<div className={`w-[100%] h-[100%]`}>{renderTable()}</div>
			</Expandable>
			{responseData ? (
				<>
					<Expandable
						expanded={responseExpanded}
						setExpansion={updateExpansion}
						toExpand={"response"}
						isTest={true}
					>
						<div className={`transfer-view w-[100%] h-[100%]`}>
							<div className="flex flex-col">
								<Header />
								<ShowMessage type={responseData?.error ? "error" : "success"} />

								<NestedGrid gridData={responseData[currentDataAction]?.response?.body ? responseData[currentDataAction]?.response?.body : responseData} isTest={true} />

							</div>
						</div>
					</Expandable>
				</>
			) : null}
		</div>
	);
}
