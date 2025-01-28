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
import SuccessMsg from '@/pages/api/upload/SuccessMsg';

function ValidUpload(props) {
    const { handleCloseClick, setCurrentStep, isMyApi = false } = props;

    return (
        <>

            <div className="h-10 justify-start items-center gap-3 inline-flex mt-[24px]">
                <div className="w-10 h-10 py-2.5 bg-[#85f996]/20 rounded-lg justify-center items-center gap-2.5 flex">
                    <div className="w-4 h-4 relative">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <g clip-path="url(#clip0_10521_10378)">
                                <path d="M14.6673 7.38625V7.99958C14.6665 9.4372 14.201 10.836 13.3402 11.9875C12.4794 13.1389 11.2695 13.9812 9.89089 14.3889C8.51227 14.7965 7.03882 14.7475 5.6903 14.2493C4.34177 13.7511 3.19042 12.8303 2.40796 11.6243C1.6255 10.4183 1.25385 8.99163 1.34844 7.55713C1.44303 6.12263 1.99879 4.75714 2.93284 3.6643C3.86689 2.57146 5.12917 1.80984 6.53144 1.49301C7.93371 1.17619 9.40083 1.32114 10.714 1.90625" stroke="#85F996" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M14.6667 2.66699L8 9.34033L6 7.34033" stroke="#85F996" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            </g>
                            <defs>
                                <clipPath id="clip0_10521_10378">
                                    <rect width="16" height="16" fill="white" />
                                </clipPath>
                            </defs>
                        </svg>

                    </div>
                </div>
                <div className="flex-col justify-center items-start gap-1 inline-flex">
                    <div className="text-[#85f996] text-sm font-medium font-['Inter']">API Validated</div>
                    <div className="text-[#a8a9ab] text-xs font-normal font-['Inter']">Validation successful!</div>
                </div>
            </div>
            <div className="">
                <Button
                    className="bg-grey-13 py-[10px] px-6 h-8 rounded-[10px] mt-6"
                    onClick={() => {
                        handleCloseClick();
                    }}
                > {isMyApi ? "Add Settings" : "Close"}</Button>
            </div>
        </>
    )
}



export default ValidUpload