import { getExecutionDetails } from '@/axios/apiCalls'
import SDatePickerRange from '@/components/SDatePickerRange'
import useGlobalStore from '@/store/globalStore'
import errorNewIcon from '@assets/icons/error-new.svg'
import errorIcon from '@assets/icons/error.svg'
import executionIcon from "@assets/icons/execution.svg"
import leftArrow from "@assets/icons/left-arrow.svg"
import rightArrow from "@assets/icons/right-arrow.svg"
import successIcon from '@assets/icons/success.svg'
import moment from 'moment'
import { useState } from 'react'
import { Button } from 'react-aria-components'
import { useParams } from 'react-router-dom'
import TimelineChart from './TimelineChart'
import { useEffect } from 'react'

const statusMessages = {
  success: { text: "Transfer complete", colorClass: 'text-gradient-green-1', icon: successIcon },
  failed: { text: "Error in transfer", colorClass: 'text-status-error', icon: errorNewIcon },
  "not success": { text: "Transfer not successful", colorClass: 'text-status-warning', icon: errorIcon },
  "not found": { text: "Nothing found", colorClass: 'text-grey-5', icon: successIcon }
};

function ChooseExecution({ expanded, currentSpeecData, last24DateRange }) {
  const { speccID } = useParams();
  const [currentDate, setCurrentDate] = useState("")
  const [is24hDate, setIs24hDate] = useState(false)
  const [selectedDateRange, setSelectedDateRange] = useState({})
  const { startDate, endDate } = last24DateRange

  const { selectedExecutionHash, setSelectedExecutionHash, setAllExecutionDetailsData, allExecutionDetailsData } = useGlobalStore(
    (state) => ({
      selectedExecutionHash: state.selectedExecutionHash,
      setSelectedExecutionHash: state.actions.setSelectedExecutionHash,
      setAllExecutionDetailsData: state.actions.setAllExecutionDetailsData,
      allExecutionDetailsData: state.allExecutionDetailsData,
    })
  );

  useEffect(() => {
    const check24hDate = () => {
      const todayDate = moment()?.format('YYYY-MM-DD');
      const previousDate = moment()?.subtract(1, 'days')?.format('YYYY-MM-DD');

      const start = moment(selectedDateRange.formattedStartDate);
      const end = moment(selectedDateRange.formattedEndDate);

      setIs24hDate(
        (startDate === todayDate && endDate === previousDate) ||
        (selectedDateRange?.formattedStartDate === selectedDateRange?.formattedEndDate) ||
        (selectedDateRange?.formattedStartDate === previousDate && selectedDateRange?.formattedEndDate === todayDate) ||
        (end.diff(start, 'days') === 1)
      );
    }

    check24hDate()
  }, [startDate, endDate, selectedDateRange])

  const getStatusMessage = (run) => {
    switch (true) {
      case run.crashed === 1:
        return statusMessages.failed;
      case run.success === 1:
        return statusMessages.success;
      case run.isRerun === 1:
        return statusMessages['not success'];
      default:
        return statusMessages['not found'] || defaultStatus;
    }
  };

  const getFilteredData = async ({ startDate, endDate }) => {
    try {
      if (speccID && startDate && endDate) {
        const response = await getExecutionDetails({ speccID, dateRange: { "startDate": startDate, "endDate": endDate } });
        setAllExecutionDetailsData(response)
      }
    } catch (err) {
      console.error(err);
    }
  }

  const formatDate = (date) => {
    const year = date?.getFullYear();
    const month = String(date?.getMonth() + 1)?.padStart(2, '0');
    const day = String(date?.getDate())?.padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  const handleExecutionClick = (runHash) => {
    setSelectedExecutionHash(runHash);
  }

  const handleTimeLine = async (e) => {
    const start = e && new Date(e?.start);
    const end = e && new Date(e?.end);
    const formattedStart = start && formatDate(start);
    const formattedEnd = end && formatDate(end);

    setSelectedDateRange({ formattedStartDate: formattedStart, formattedEndDate: formattedEnd })

    getFilteredData({ startDate: formattedStart, endDate: formattedEnd })
  }

  const handleLeftClick = () => {
    const new_date = currentDate ? moment(currentDate).subtract(1, "days") : moment();
    setCurrentDate(new_date);
    const formattedDate = formatDate(new Date(new_date));

    getFilteredData({ startDate: formattedDate, endDate: formattedDate })
    setIs24hDate(true)
  }

  const handleRightClick = () => {
    const new_date = currentDate ? moment(currentDate).add(1, "days") : moment();
    setCurrentDate(new_date);
    const formattedDate = formatDate(new Date(new_date));

    getFilteredData({ startDate: formattedDate, endDate: formattedDate })
    setIs24hDate(true)
  }

  return (
    <>
      <div className={`meatballs-container meatballs-container-transition relative ${expanded ? "w-[100%] flex bg-black p-[20px]" : "w-[50px] pt-[20px] pr-[10px] pl-[10px]"} h-[929px]`}>
        <div className="flex gap-2 h-[17px] items-center">
          <img
            src={executionIcon}
            width={15}
            height={15}
          />
          <span className="text-[16px] font-[700]">
            Choose Execution
          </span>
        </div>

        <div className='flex flex-col gap-2.5'>
          <div className='flex flex-col'>
            <div className='flex items-center gap-1.5'>
              <span className='bg-grey-5 border rounded-full h-[15px] w-[15px] flex flex-col items-center text-black font-bold text-center'>1</span>
              <span className='font-bolder'>Select a time range</span>
            </div>
            <span className='text-[10px] mt-[5px]'>Select a range of time to see all the executions in that period.</span>
            <div className="flex items-center gap-2 border border-[#8C8C8C] rounded-md mt-5 w-[65%]">
              <span
                className="h-[32px] py-2 px-2.5 flex items-center justify-center border-r border-[#8c8c8c] cursor-pointer"
                onClick={handleLeftClick}
              >
                <img src={leftArrow} className="icon-white" />
              </span>
              <SDatePickerRange
                onChange={(e) => handleTimeLine(e)}
                currentValue={currentDate}
                setCurrentValue={setCurrentDate}
              />
              <span
                className="h-[32px] py-2 px-2.5 flex items-center justify-center border-l border-[#8c8c8c] cursor-pointer"
                onClick={handleRightClick}
              >
                <img src={rightArrow} />
              </span>
            </div>
            <div>
              {currentSpeecData?.runs?.length ? <TimelineChart is24hDate={is24hDate} selectedDateRange={selectedDateRange} /> : <p className='p-2.5'>No executions found</p>}
            </div>
          </div>

          <div className='flex flex-col'>

            <div className='mb-2.5'>
              <div className='flex items-center gap-1.5'>
                <span className='bg-grey-5 border rounded-full h-[15px] w-[15px] flex flex-col items-center text-black font-bold text-center'>2</span>
                <span className='font-bolder'>Executions</span>
              </div>
              <p className='text-[10px] mt-[5px]'>Click on an execution to view its details</p>
            </div>

            {currentSpeecData?.runs?.map((run) => {
              const { text, colorClass, icon } = getStatusMessage(run);
              const formattedEndTime = moment(run?.end).format('HH:mm')

              const isSelected = selectedExecutionHash === run?.hash

              return (
                <Button key={run?.id} onPress={() => handleExecutionClick(run.hash)} className={`flex justify-between items-center p-2.5  rounded-base  ${isSelected ? "bg-grey-3" : "bg-grey-1"}`}>
                  <span>{formattedEndTime}</span>
                  <div className='flex gap-[5px]'>
                    <div className='flex gap-[5px] items-center'>
                      {icon && <img src={icon} className={`${text === "Transfer not successful" ? `icon-orange` : ""} ${text === "Nothing found" ? `icon-grey-4` : ''}  h-3 w-3`} alt={`icon`} />}
                      <span className={`${colorClass}`}>{text}</span>
                    </div>
                  </div>
                </Button>
              );
            })}
          </div>
        </div>
      </div>
    </>
  )
}

export default ChooseExecution