import { fetchExecutionsModule, getExecutionDetails, getExecutionsModuleById } from '@/axios/apiCalls';
import Loading from '@/components/loaders/Loading';
import ViewListIcon from '@/Icons/ViewListIcon';
import Expandable from '@/pages/wizard/get-data/Expandable';
import GroupData from '@/pages/wizard/group-data';
import TransferPage from '@/pages/wizard/transfer';
import Wizard from '@/pages/wizard/transformation/Wizard';
import useGlobalStore from '@/store/globalStore';
import apiIcon from "@assets/icons/api.svg";
import bellIcon from "@assets/icons/bell.svg";
import executionIcon from "@assets/icons/execution.svg";
import GroupIcon from "@assets/icons/group.svg";
import straightbackIcon from "@assets/icons/straight-back-arrow.svg";
import VisualIcon from "@assets/icons/visual-view.svg";
import MultiplyIcon from "@assets/icons/yellow-multiply.svg";
import moment from 'moment';
import { useEffect, useState } from 'react';
import { Button } from 'react-aria-components';
import { useParams } from 'react-router-dom';
import SpeccsTable from '../components/SpeccsTable';
import ChooseExecution from './ChooseExecution';
import ExecutionDetailsGetData from './ExecutionDetailsGetData';

const columns = [
    { label: "Specc", accessor: "specc_name", sortable: true },
    { label: "Project", accessor: "project_name", sortable: false },
    { label: "API 1 Endpoint", accessor: "api_1", sortable: false },
    { label: "API 2 Endpoint", accessor: "api_2", sortable: false },
    { label: "Status", accessor: "isLive", sortable: false },
    { label: "Last Run", accessor: "last_run", sortable: true },
    { label: "Execution", accessor: "execute", sortable: true },
];

const selector = (state) => ({
    selectedExecutionHash: state.selectedExecutionHash,
});

function ExecutionSummaryDetails() {
    const { selectedExecutionHash } = useGlobalStore(selector);
    const [expandedExecution, setExpandedExecution] = useState(true)
    const [expandedGetData, setExpandedGetData] = useState(true)
    const [activeTab, setActiveTab] = useState(null);
    const [loading, setLoading] = useState(true)
    const [isLoading, setIsLoading] = useState(false)
    const { allExecutionDetailsData, setAllExecutionDetailsData, setTransformationModuleData } = useGlobalStore(
        (state) => ({
            allExecutionDetailsData: state.allExecutionDetailsData,
            setAllExecutionDetailsData: state.actions.setAllExecutionDetailsData,
            setTransformationModuleData: state.actions.setTransformationModuleData,
        })
    );
    const [speccTableData, setSpeccTableData] = useState(null)
    const [currentSpeecData, setCurrentSpeecData] = useState(null)
    const [executionModuleResults, setExecutionModuleResults] = useState(null)
    const [getDataModuleResponse, setGetDataModuleResponse] = useState(null)
    const [transferListModuleResponse, setTransferListModuleResponse] = useState(null)
    const [groupModuleResponse, setGroupModuleResponse] = useState({ dataFromDetails: null, resultsFromDetails: null })
    const [last24DateRange, setLast24DateRange] = useState({})

    const { speccID } = useParams();

    useEffect(() => {
        const todayDate = moment()?.format('YYYY-MM-DD');
        const previousDate = moment()?.subtract(1, 'days')?.format('YYYY-MM-DD');
        setLast24DateRange({ "startDate": previousDate, "endDate": todayDate })

        const fetchExecutionDetails = async () => {
            try {
                if (speccID && todayDate && previousDate) {
                    const response = await getExecutionDetails({ speccID, dateRange: { "startDate": previousDate, "endDate": todayDate } });
                    setAllExecutionDetailsData(response)
                    setLoading(false);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchExecutionDetails();
    }, []);

    useEffect(() => {
        speccTable()
    }, [allExecutionDetailsData])

    useEffect(() => {
        const getExecutionModuleData = async () => {

            try {
                if (selectedExecutionHash) {
                    setIsLoading(true)
                    setTransformationModuleData(null)
                    const response = await fetchExecutionsModule({ selectedExecutionHash });
                    setExecutionModuleResults(response)
                    setIsLoading(false)
                }
            } catch (err) {
                console.error(err);
                setIsLoading(false)
            } finally {
                setIsLoading(false);
            }
        };

        getExecutionModuleData();

    }, [selectedExecutionHash])


    useEffect(() => {
        renderModule()
    }, [executionModuleResults, selectedExecutionHash])

    const renderModule = async () => {

        let groupModuleID = null;
        let getDataModuleID = null;
        let transformationModuleID = null;
        let transferModuleID = null;

        executionModuleResults?.moduleResults?.forEach((item) => {
            switch (item.moduleConfig.name) {
                case "GROUPDATA":
                    groupModuleID = item.moduleID
                case "GETDATA":
                    getDataModuleID = item.moduleID;
                    break;
                case "TRANSFORMATION":
                    transformationModuleID = item.moduleID;
                    break;
                case "TRANSFER":
                    transferModuleID = item.moduleID;
                    break;
            }
        })

        try {
            if (getDataModuleID) {
                const getDataResponse = await getExecutionsModuleById({ selectedExecutionHash, moduleId: getDataModuleID })
                setGetDataModuleResponse(getDataResponse)
            }
        } catch (error) {
            console.error(error)
        }

        try {
            if (transferModuleID) {
                const transferResponse = await getExecutionsModuleById({ selectedExecutionHash, moduleId: transferModuleID })
                if (transferResponse) {
                    const getParsedData = JSON.parse(transferResponse?.output?.JSON || "{}")
                    setTransferListModuleResponse(getParsedData)
                }
            }
        } catch (error) {
            console.error(error)
        }

        try {
            if (groupModuleID) {
                const groupResponse = await getExecutionsModuleById({ selectedExecutionHash, moduleId: groupModuleID })
                if (groupResponse) {
                    const getInputParsedData = JSON.parse(groupResponse?.input?.JSON)
                    const getOutputParsedData = JSON.parse(groupResponse?.output?.JSON)
                    setGroupModuleResponse({ dataFromDetails: getInputParsedData, resultsFromDetails: getOutputParsedData })
                }
            }
        } catch (error) {
            console.error(error)
        }


        try {
            if (transformationModuleID) {
                const transformationResponse = await getExecutionsModuleById({ selectedExecutionHash, moduleId: transformationModuleID })
                if (transformationResponse) {
                    const getParsedData = JSON.parse(transformationResponse?.input?.JSON || "{}")
                    setTransformationModuleData(getParsedData)
                }
            }
        } catch (error) {
            console.error(error)
        }
    }

    const speccTable = () => {

        const getSpeecTableData = allExecutionDetailsData?.projects?.map((project) => {
            const currentSpecc = project?.speccs?.find((speccItem) => speccItem?.id === Number(speccID))

            setCurrentSpeecData(currentSpecc);

            const latestRun = moment(currentSpecc?.lastRun).format("DD-MM-YYYY");

            return {
                specc_name: currentSpecc?.name,
                project_name: project?.name,
                api_1: project?.sourceAPIName,
                api_2: project?.destinationAPIName,
                isLive: currentSpecc?.started ? true : false,
                last_run: latestRun ? latestRun : "--",
                execute: {
                    success: currentSpecc?.runStatistics?.success,
                    err: currentSpecc?.runStatistics?.errors,
                    warning: currentSpecc?.runStatistics?.warnings,
                },
            }
        })

        if (getSpeecTableData?.length > 0) {
            setSpeccTableData(getSpeecTableData)
        }
    }

    const updateExpansion = (compToUpdate) => {
        if (compToUpdate === "execution") {
            setExpandedExecution(!expandedExecution);
        }

        if (compToUpdate === "detailsGetdata") {
            setExpandedGetData(!expandedGetData);
        }
    };

    const handleToggle = (tabName) => {
        setActiveTab((prevTab) => (prevTab === tabName ? null : tabName));
    };

    const renderButton = (moduleName, icon, label, tabName, handleClick, isDisabledCondition, imgClassName, colorCode) => {
        const isModulePresent = executionModuleResults?.moduleResults?.some(moduleItem => moduleItem?.moduleConfig?.name === moduleName);
        const isDisabled = isDisabledCondition ? !executionModuleResults?.moduleResults?.some(isDisabledCondition) : false;
        const isActive = activeTab === tabName;

        return isModulePresent ? (
            <Button
                onClick={() => handleClick(tabName)}
                isDisabled={isDisabled}
                className={`flex gap-1 items-center ${isDisabled ? 'text-grey-4' : isActive ? `border-b border-[${colorCode}]` : ''}`}
            >
                <img src={icon} className={`${isDisabled ? 'icon-grey-4' : `${imgClassName} h-[11px]`}`} alt={`${label}Icon`} />
                <span className={`font-normal ${!isDisabled ? `text-[${colorCode}]` : ""} `}>{label}</span>
            </Button>
        ) : null;
    };

    return (
        <>
            {loading ? <Loading /> : <div className='w-full flex flex-col gap-2.5 px-2.5'>
                <div className='flex gap-[5px] pt-2 justify-between border-t border-[#3B3B3B]'>
                    <div className='flex items-center gap-[5px] p-2'>
                        <div>
                            <img className="" src={straightbackIcon} />
                        </div>
                        <span className='font-bold'>Back to Overview</span>
                    </div>
                    <div
                        className="relative w-[20px] h-[20px] cursor-pointer"
                    >
                        <span>
                            <img src={bellIcon} />
                        </span>

                        <span className="absolute top-0 right-0 w-[5px] h-[5px] rounded-[50%] p-1 bg-[#FF3737]"></span>
                    </div>
                </div>
                <div>
                    <div className='max-w-full'>
                        <SpeccsTable columns={columns} rows={speccTableData} isTab />
                    </div>
                </div>
                <div className='flex overflow-x-auto h-full'>

                    <Expandable expandedClassName='min-w-[430px] h-max' expanded={expandedExecution} setExpansion={updateExpansion} toExpand={"execution"} hovered={true} isTest={true} collapseSrc={executionIcon}>
                        <ChooseExecution currentSpeecData={currentSpeecData} expanded={expandedExecution} last24DateRange={last24DateRange} />
                    </Expandable>

                    <div className='w-[100%] mt-2.5 h-full'>
                        {isLoading ? <Loading /> : executionModuleResults?.moduleResults?.some(moduleItem => moduleItem?.moduleConfig?.name !== "GETDATA") && <div className='bg-black p-2.5 border-none border border-[#00EFD9] rounded-lg flex justify-between'>
                            <div className='font-bold flex items-center'><span>Execution journey</span></div>
                            <div className='flex  gap-[30px]'>

                                {/* Group Button */}
                                {renderButton(
                                    "GROUPDATA",
                                    GroupIcon,
                                    "Group",
                                    "group",
                                    handleToggle,
                                    item => item?.moduleConfig?.name === "GROUPDATA" && item?.isRun,
                                    'icon-yellow',
                                    "#F6C519"
                                )}

                                {/* Transform Button */}
                                {renderButton(
                                    "TRANSFORMATION",
                                    MultiplyIcon,
                                    "Transform",
                                    "transform",
                                    handleToggle,
                                    item => item?.moduleConfig?.name === "TRANSFORMATION" && item?.isRun,
                                    null,
                                    "#F6C519"
                                )}

                                {/* Transfer Button */}
                                {renderButton(
                                    "TRANSFER",
                                    MultiplyIcon,
                                    "Transfer",
                                    "transfer",
                                    handleToggle,
                                    item => item?.moduleConfig?.name === "TRANSFER" && item?.isRun,
                                    "icon-mint-green",
                                    "#00EFD9"
                                )}

                            </div>
                            <div className='flex gap-4 items-center'>
                                <img src={VisualIcon} className='h-7 w-[34px]' alt="VisualIcon" />
                                <ViewListIcon />
                            </div>
                        </div>}
                        <div className='flex min-h-[calc(100%-48px)]'>

                            {executionModuleResults?.moduleResults?.map((moduleItem) => {
                                return moduleItem?.moduleConfig?.name === "GETDATA" && executionModuleResults?.moduleResults?.some(moduleItem => moduleItem?.moduleConfig?.name === "GETDATA") ? <Expandable key={moduleItem?.id} expandedClassName='w-[430px] min-w-[430px] h-max' expanded={expandedGetData} setExpansion={updateExpansion} toExpand={"detailsGetdata"} hovered={true} isTest={true} collapseSrc={apiIcon} imgCollapesClassName={'icon-pink'} collapseBordercolor={'border-[#D32DCA]'}>
                                    <ExecutionDetailsGetData getDataModuleResponse={getDataModuleResponse} expanded={expandedGetData} />
                                </Expandable> : ""
                            })}

                            <div className='min-w-[1300px]'>
                                {
                                    activeTab === 'group' && executionModuleResults?.moduleResults?.some(moduleItem => moduleItem?.moduleConfig?.name === "GROUPDATA") &&
                                    <GroupData groupModuleResponse={groupModuleResponse} renderFromDetails={true} />
                                }
                                {
                                    activeTab === 'transform' && executionModuleResults?.moduleResults?.some(moduleItem => moduleItem?.moduleConfig?.name === "TRANSFORMATION" && moduleItem?.isRun) &&
                                    <div className='h-full'>
                                        <Wizard type={'executionSummary'} />
                                    </div>
                                }
                                {
                                    activeTab === 'transfer' && executionModuleResults?.moduleResults?.some(moduleItem => moduleItem?.moduleConfig?.name === "TRANSFER" && moduleItem?.isRun) &&
                                    <TransferPage renderFromDetails={true} transferListModuleResponse={transferListModuleResponse} />
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>}
        </>
    )
}

export default ExecutionSummaryDetails