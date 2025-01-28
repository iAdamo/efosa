import 'react-toastify/dist/ReactToastify.css';
import WarningIcon from "@assets/icons/warning-default.svg?react"

function ValidatingStep(props) {
    const { validationResult, tryNewMethod } = props;

    return (
        <div className="flex flex-col justify-between w-full h-full bg-grey-15">

            <div className="h-10 justify-start items-center gap-3 inline-flex">
                <div className="w-10 h-10 px-5 py-2.5 bg-[#f35858]/20 rounded-lg justify-center items-center gap-2.5 flex">
                    <div className="relative">
                        <WarningIcon className="icon-error w-4 h-4"/>
                    </div>
                </div>
                <div className="flex-col justify-center items-start gap-1 inline-flex">
                    <div className="text-[#f35858] text-sm font-normal font-['Inter']">We found some errors while validating your API</div>
                    <div className="text-[#a8a9ab] text-xs font-normal font-['Inter']">You can fix them yourself by using the API Builder, or trying to upload using another method</div>
                </div>
            </div>

            {validationResult?.errors ? Object.keys(validationResult.errors).map((key, index) => (
                <div key={index} className="ml-[52px] flex flex-col mt-[10px]">
                    <div className="text-[#f8f9fa] text-xs font-normal font-['Inter']">{index + 1}. {key.toUpperCase()}</div>
                    <div className="text-[#a8a9ab] text-xs font-normal font-['Inter']">{validationResult.errors[key]}</div>
                </div>
            )) : <span className="ml-[52px] text-grey-17 text-xs font-normal">{`${validationResult}`}</span>}

            <div className="mt-6 flex">
                <div className="h-8 px-6 py-2.5 bg-[#454c54] rounded-[10px] border border-[#454c54] justify-center items-center gap-2.5 inline-flex cursor-pointer">
                    <div className="w-4 h-4 relative">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <g clip-path="url(#clip0_10521_10289)">
                                <path d="M8.00065 1.33301L1.33398 4.66634L8.00065 7.99967L14.6673 4.66634L8.00065 1.33301Z" stroke="#F8F9FA" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M1.33398 11.333L8.00065 14.6663L14.6673 11.333" stroke="#F8F9FA" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M1.33398 8L8.00065 11.3333L14.6673 8" stroke="#F8F9FA" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            </g>
                            <defs>
                                <clipPath id="clip0_10521_10289">
                                    <rect width="16" height="16" fill="white" />
                                </clipPath>
                            </defs>
                        </svg>
                    </div>
                    <div className="text-[#f8f9fa] text-xs font-semibold font-['Inter'] leading-[14px] tracking-tight">Fix in API builder</div>
                </div>
                <div
                    className="ml-[8px] cursor-pointer"
                    onClick={() => tryNewMethod()}
                >
                    <div className="h-8 px-6 py-2.5 rounded-[10px] border border-[#454c54] justify-center items-center gap-2.5 inline-flex">
                        <div className="text-[#f8f9fa] text-xs font-semibold font-['Inter'] leading-[14px] tracking-tight">Try another method</div>
                    </div>
                </div>
            </div>
        </div>
    )
}



export default ValidatingStep