




import TickIcon from "@assets/icons/tick.svg?react";

import 'react-toastify/dist/ReactToastify.css';





function Rightmenu(props) {

    const { completeStep, currentStep } = props


    return (
        <>
            <div className="bg-grey-15 rounded-lg p-2 w-[349px] h-max flex flex-col gap-1">
                <div className={`rounded-[5px] p-4 ${completeStep.step1 ? '' : "bg-sidebar-option-gradient"}  flex justify-between items-center h-11`} >
                    <div className='flex gap-1'>
                        {completeStep?.step1 && <TickIcon className={'icon-grey-7'} />}
                        <span className={`text-lg ${completeStep.step1 ? 'text-grey-13' : ''}  leading-[14px]`}>Add API</span>
                    </div>
                    <span className={`shadow-tag ${completeStep.step1 ? 'bg-gradient-grey-1 text-grey-13' : "bg-grey-13 text-custom-ghostWhite"}  py-1 px-2.5  rounded-sm`}>Step 1</span>
                </div>
                <div className={`rounded-[5px] p-4 flex justify-between items-center h-11 ${currentStep === 2 ? "bg-sidebar-option-gradient" : ""}`} >
                    <div className='flex gap-1'>
                        {completeStep?.step2 && <TickIcon className={'icon-grey-7'} />}
                        <span className={`text-lg ${currentStep === 2 ? "" : "text-grey-13"}  leading-[14px]`}>Validate API</span>
                    </div>
                    <span className={`shadow-tag py-1  px-2.5  rounded-sm ${currentStep === 2 ? "bg-grey-13 text-custom-ghostWhite" : "bg-gradient-grey-1 text-grey-13"} `}>Step 2</span>
                </div>
                <div className={`rounded-[5px] p-4 flex justify-between items-center h-11 ${currentStep === 3 ? "bg-sidebar-option-gradient" : ""}`} >
                    <div>
                        {completeStep?.step3 && <TickIcon className={'icon-grey-7'} />}
                        <span className={`text-lg  ${currentStep === 3 ? "" : "text-grey-13"} leading-[14px]`}>Settings</span>
                    </div>
                    <span className={`shadow-tag py-1 ${currentStep === 3 ? "bg-grey-13 text-custom-ghostWhite" : "bg-gradient-grey-1 text-grey-13"} px-2.5 rounded-sm`}>Step 3</span>
                </div>
            </div>
        </>
    )
}



export default Rightmenu