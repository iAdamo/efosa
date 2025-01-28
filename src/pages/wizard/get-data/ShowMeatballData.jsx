import { postGenericCRUDWithID } from "@/axios/apiCalls";
import ErrorMessage from "@/components/Alerts/ErrorMessage";
import Button from "@/components/Button";
import CustomInput from "@/components/CustomInput";
// import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
// import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CustomLoader from "@/components/CustomLoader";
import Pagination from "@/components/CustomPagination";
import { SMenuButton } from "@/components/MenuDropdown";
import NestedGrid from "@/components/NestedGrid/NestedGrid";
import SInput from "@/components/SInput";
import { ProjectContext } from "@/contexts/ProjectContext";
import { WizardContext } from "@/contexts/WizardContext";
import ApiIcon from "@assets/icons/api.svg?react";
import Filter from "@assets/icons/new-filter.svg?react";
import SettingsIcon from "@assets/icons/new-settings.svg?react";
import TextLoaders from "@components/loaders/TextLoaders";
import { cloneDeep } from "lodash";
import { useContext, useEffect, useRef, useState } from "react";
import { Header, Section } from "react-aria-components";

function ShowMeatballData({
	viewData,
	fetchedData,
	runFetchDataClick,
	module,
	setModule,
	setHovered,
	parentNode,
	isUseableRows,
	paginationEnabled = false,
	expanded,
	isLoading,
}) {

	const [loading, setLoading] = useState(false);
	const { meatballs, setMeatballs } = useContext(WizardContext);
	const { sourceAPICustomName, destinationAPICustomName } =
		useContext(ProjectContext);
	const [pageNumber, setPageNumber] = useState(1);
	const [showAllMeatballs, setShowAllMeatballs] = useState(false);
	const MeatballsLabelsRef = useRef(null);
	const meatballsRef = useRef(null);
	const [meatballsWrapperHeight, setMeatballsWrapperHeight] = useState(0);
	const [wrapperHeight, setWrapperHeight] = useState(0);

	const parentNodeMeatballs = meatballs.filter((meatball) => {
		return meatball.nodeID === parentNode.id;
	})

	useEffect(() => {
		const updateHeight = () => {
			if (MeatballsLabelsRef?.current) {
				setMeatballsWrapperHeight(MeatballsLabelsRef?.current.getBoundingClientRect().height);
			}
			if (meatballsRef?.current) {
				setWrapperHeight(meatballsRef?.current.getBoundingClientRect().height);
			}
		};
		setTimeout(updateHeight, 400);
		window.addEventListener('resize', updateHeight);
		return () => {
			window.removeEventListener('resize', updateHeight);
		};
	}, [showAllMeatballs, parentNodeMeatballs]);

	const fetchData = async () => {
		setLoading(true);
		await runFetchDataClick(paginationEnabled ? pageNumber : null);
		setLoading(false);
	};

	const fetchPreviousData = async () => {
		setLoading(true);
		const newPageNumber = pageNumber - 1;
		await runFetchDataClick(newPageNumber);
		setPageNumber(newPageNumber);
		setLoading(false);
	};

	const fetchNextData = async () => {
		setLoading(true);
		const newPageNumber = pageNumber + 1;
		await runFetchDataClick(newPageNumber);
		setPageNumber(newPageNumber);
		setLoading(false);
	}

	const loaderDiv = () => (
		<div className="flex flex-col gap-3">
			<TextLoaders count={5} containerClassName={"flex gap-2 h-[30px]"} />
			<TextLoaders count={5} containerClassName={"flex gap-2"} />
			<TextLoaders count={5} containerClassName={"flex gap-2"} />
			<TextLoaders count={5} containerClassName={"flex gap-2"} />
			<TextLoaders count={5} containerClassName={"flex gap-2"} />
		</div>
	);


	const updateLimit = async (limit) => {
		const updatedExtraInfo = await postGenericCRUDWithID(
			"Get_Data_Extra_Info",
			module.extraInfo.id,
			{ limit: limit },
		);
		setModule({ ...module, extraInfo: updatedExtraInfo.data });
	};

	const updateReverseOrder = async (reverseOrder) => {
		const updatedExtraInfo = await postGenericCRUDWithID(
			"Get_Data_Extra_Info",
			module.extraInfo.id,
			{ reverse: reverseOrder },
		);
		setModule({ ...module, extraInfo: updatedExtraInfo.data });
	};

	const updateMeatballs = (meatball, idx, removeHover) => {
		const oldMeatballs = cloneDeep(meatballs);

		const newMeatballs = oldMeatballs?.map((crMeatball) => {
			const currentMeatball = crMeatball;
			if (crMeatball?.id === meatball?.id) {
				currentMeatball.isHoverable = removeHover
			} else {
				currentMeatball.isHoverable = false;
			}
			return currentMeatball;
		})

		setMeatballs([...newMeatballs]);
	}

	return (
		<div className={`relative new-meatballs-view gap-3 h-full ${expanded ? "w-[calc(100%-336px)]" : "w-[calc(100%-50px)]"} p-0`}>
			<div className="flex justify-between items-center">
				<div className="flex gap-1.5 items-center">
					<ApiIcon className="icon-pink-1" />
					<span className="text-16 font-semibold">View Selected Data</span>
					<Button className='bg-secondary-pink-light h-4 flex items-center justify-center rounded text-secondary-pink-light-1'>
						<div className="h-3 text-base font-semibold flex items-center justify-center px-1 uppercase">{sourceAPICustomName}</div>
					</Button >
				</div>

				<div>
					<Button onClick={fetchData} className="w-max h-8 bg-primary-button-gradient rounded-containers py-0 px-3 text-lg leading-base font-semibold hover:shadow-primary-button" >
						<span>Get Data</span>
					</Button>
				</div>
			</div>
			{(fetchedData?.isUseable && fetchedData?.listOfDataObjects?.length > 0) &&
				<div className="flex items-center gap-5 justify-between">
					<div className="flex-1 max-h-10">
						<CustomInput variant="searchBox" className="w-full" inputClassName="w-full bg-transparent border border-hover-gray-1" placeholder="Search" placeholderColor={"grey-21"} />
					</div>

					<div className="h-10 flex justify-between items-center gap-4">
						{module.extraInfo && (
							<div className="h-full flex">
								<SMenuButton
									label={
										<div className="h-full flex items-center gap-1 py-2 px-3 rounded-containers border border-transparent hover:border hover:border-hover-grey-1">
											<SettingsIcon />Settings
										</div>
									}
									className="flex flex-col gap-[8px]"
								>
									<Section className="pb-[8px]">
										<Header className="p-[5px] text-grey-5">
											<div className="text-[#aeaeae] text-xs font-medium font-['Inter'] leading-3 mb-4 mt-1">
												Advanced settings
											</div>
											<div className="pl-2 mb-4 input-wrapper">
												<div className="pl-1">Add Limit</div>
												<div>
													<SInput
														defaultValue={module?.extraInfo?.limit}
														onBlur={(e) => {
															updateLimit(e.target.value);
														}}
													/>
												</div>
												<div className="text-[10px]">
													Warning: Adjusting the limit may cause unwanted results
												</div>
											</div>
											<div className="pl-2 mb-4">
												<div className="mb-1">Reverse order</div>
												<div>
													<input
														type="checkbox"
														onChange={(e) => {
															updateReverseOrder(e.target.checked);
														}}
														checked={module?.extraInfo?.reverse}
													/>
												</div>
											</div>
										</Header>
									</Section>
								</SMenuButton>
							</div>
						)}
						<div className="h-full">
							<Button className="h-full flex items-center gap-1 py-2 px-3 rounded-containers border border-transparent hover:border hover:border-hover-grey-1 ">
								<Filter />
								<span>Filter</span>
							</Button>
						</div>
					</div>
				</div>}

			{
				((fetchedData?.isUseable && fetchedData?.listOfDataObjects?.length > 0) && meatballs?.length) ?
					(
						<div ref={meatballsRef} className="flex gap-3 justify-between h-max w-full"
						>
							{
								<div className={`${showAllMeatballs ? "max-h-full" : "max-h-[32px]"} h-auto transition-all duration-300 ease-in-out flex flex-wrap overflow-hidden`}>
									<div ref={MeatballsLabelsRef} className="h-max flex flex-wrap gap-3">
										{parentNodeMeatballs?.map((meatball, idx) => (
											<div className=" flex flex-wrap items-center h-[31px] rounded p-2 bg-[#111111] bg-gradient-grey-9 hover:bg-transparent border border-main-pink-6 cursor-pointer"
											>
												<div className="h-[14px] flex gap-[2px] flex-wrap">
													<span className="font-medium">{meatball?.name.charAt(0).toUpperCase() + meatball.name.slice(1)}</span>
													<span>=</span>
													<span className="text-secondary-pink-light-1 font-semibold">{meatball?.value || meatball?.name}</span>
												</div>
											</div>
										))}
									</div>
								</div>
							}
							{meatballsWrapperHeight > 32 && <div className={`flex ${showAllMeatballs ? "items-end" : "items-center"} text-xs italic font-medium min-w-max w-max underline cursor-pointer underline-offset-4`} onClick={() => setShowAllMeatballs(!showAllMeatballs)}>
								{showAllMeatballs ? "Show less" : "View all"}
							</div>}
						</div>
					)
					:
					null
			}

			{
				!isLoading && fetchedData && !isUseableRows &&
				(


					<ErrorMessage />


				)

			}


			<div style={{ maxHeight: `calc(100% - ${((fetchedData?.isUseable && fetchedData?.listOfDataObjects?.length > 0) ? 135 : 32) + wrapperHeight}px)` }} className={`h-full flex flex-col justify-between meatball-table`}>
				{loading && loaderDiv()}
				{isLoading ?
					<div className="flex items-center h-full justify-center">
						<CustomLoader />
					</div> :
					<div className="h-full">
						{!fetchedData ? (
							<div className="h-full w-full flex items-center justify-center bg-gradient-grey-9 rounded">
								<span className="text-gradient-grey-10 text-sm italic">No data retrieved yet</span>
							</div>
						) : fetchedData.isUseable && fetchedData?.listOfDataObjects?.length > 0 ? (
							<div className="h-full flex flex-col bg-gradient-grey-9 p-2 w-full overflow-x-auto rounded">
								<NestedGrid gridData={fetchedData?.listOfDataObjects} isListOfDataObjects={true} />
							</div>
						) : !fetchedData.isUseable ? (
							<div className="h-full flex flex-col bg-gradient-grey-9 p-2 w-full overflow-x-auto rounded">
								<NestedGrid gridData={fetchedData?.frontend?.body || "<No Data>"} />
							</div>
						) : (
							<div className="h-full w-full flex items-center justify-center bg-gradient-grey-9 rounded">
								<span className="text-gradient-grey-10 text-sm italic">No data available</span>
							</div>
						)}
					</div>}

				{(fetchedData?.isUseable && fetchedData?.listOfDataObjects?.length) ?
					<div className="absolute bottom-[-12px] w-full">
						<Pagination
							pageNumber={pageNumber}
							loading={loading}
							onPrevious={fetchPreviousData}
							onNext={fetchNextData}
							onPageNumber={fetchData}
						/>
					</div> : null}
			</div>
		</div>
	);
}

export default ShowMeatballData;
