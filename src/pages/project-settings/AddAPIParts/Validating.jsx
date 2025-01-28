import { createUploadApi, uploadAPIFile } from '@/axios/apiCalls';
import Button from '@/components/Button';
import CustomInput from '@/components/CustomInput';
import CustomLoader from '@/components/CustomLoader';
import Toast, { showToast } from '@/components/CustomToast';
import { ProjectContext } from '@/contexts/ProjectContext';
import CloseIcon from "@assets/icons/close.svg?react";
import StarIcon from "@assets/icons/dashboard/sidebar/star-ai.svg?react";
import LayerIcon from "@assets/icons/layers.svg?react";
import CodeIcon from "@assets/icons/new-code.svg?react";
import UploadIcon from "@assets/icons/new-upload.svg?react";
import LinkIcon from "@assets/icons/new-url.svg?react";
import TickIcon from "@assets/icons/tick.svg?react";
import { Modal } from '@mui/material';
import { useContext, useEffect, useRef, useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import UploadCode from '../../api/upload/UploadCode';
import UploadFile from '../../api/upload/UploadFile';
import UploadStep from './UploadStep';
import ErrorMsg from '@/pages/api/upload/ErrorMsg';
import SuccessMsg from '@/pages/api/upload/SuccessMsg';





function Validating(props) {
    const { validationResult, tryNewMethod, uploadResponse, setValidationResult, setUploadResponse, isLoading, setCurrentStep } = props;


    return (
        <><div className="flex flex-col bg-grey-15">

            <div className="h-10 justify-start items-center gap-3 inline-flex">
                <div className="w-10 h-10 px-5 py-2.5 bg-[#f35858]/20 rounded-lg justify-center items-center gap-2.5 flex">
                    <div className="w-4 h-4 relative">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M6.8605 2.57347L1.21384 12.0001C1.09741 12.2018 1.03581 12.4303 1.03516 12.6631C1.03451 12.896 1.09483 13.1249 1.21012 13.3272C1.32541 13.5294 1.49165 13.698 1.69231 13.816C1.89296 13.9341 2.12103 13.9976 2.35384 14.0001H13.6472C13.88 13.9976 14.108 13.9341 14.3087 13.816C14.5094 13.698 14.6756 13.5294 14.7909 13.3272C14.9062 13.1249 14.9665 12.896 14.9658 12.6631C14.9652 12.4303 14.9036 12.2018 14.7872 12.0001L9.1405 2.57347C9.02165 2.37754 8.85432 2.21555 8.65463 2.10313C8.45495 1.9907 8.22966 1.93164 8.0005 1.93164C7.77135 1.93164 7.54606 1.9907 7.34637 2.10313C7.14669 2.21555 6.97935 2.37754 6.8605 2.57347Z" stroke="#F35858" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M8 6V8.66667" stroke="#F35858" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M8 11.333H8.00667" stroke="#F35858" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                    </div>
                </div>
                <div className="flex-col justify-center items-start gap-1 inline-flex">
                    <div className="text-[#f35858] text-sm font-normal font-['Inter']">We found some errors while validating your API</div>
                    <div className="text-[#a8a9ab] text-xs font-normal font-['Inter']">You can fix them yourself by using the API Builder, or trying to upload using another method</div>
                </div>
            </div>


            {(Object.keys(validationResult?.errors)).map((key, index) => {

                return <><div className="ml-[52px] flex flex-col mt-[10px] ">
                    <div className="text-[#f8f9fa] text-xs font-normal font-['Inter']">{index + 1}. {key.toUpperCase()}</div>
                    <div className="text-[#a8a9ab] text-xs font-normal font-['Inter']">{validationResult?.errors[key]}</div>
                </div></>
            })}

            <div className="mt-[24px] flex">
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
                <div className="ml-[8px] cursor-pointer" onClick={() => {
                    tryNewMethod();
                }}>
                    <div className="h-8 px-6 py-2.5 rounded-[10px] border border-[#454c54] justify-center items-center gap-2.5 inline-flex">
                        <div className="text-[#f8f9fa] text-xs font-semibold font-['Inter'] leading-[14px] tracking-tight">Try another method</div>
                    </div>
                </div>
            </div>

        </div>
        </>
    )
}



export default Validating