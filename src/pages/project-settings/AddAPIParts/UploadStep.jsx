import { createUploadApi, postGenericCRUD, postGenericCRUDWithID, uploadAPIFile } from '@/axios/apiCalls';
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
import ValidUpload from './ValidUpload';
import { GeneralContext } from '@/contexts/GeneralContext';





function UploadStep(props) {

    const { setMyAPIs, myAPIs } = useContext(GeneralContext);
    const { handleCloseClick, direction, APIID, completeStep, validationResult, uploadResponse, selectedFile, setSelectedFile, inputRef, dropRef, jsontext, setJsontext, currentStep, setCurrentStep, selectedMethod, setSelectedMethod, setURL, setCustomApiName, isMyApi, handleUpload, isLoading } = props

    let customName = null;
    for (let i = 0; i < myAPIs.length; i++) {
        if (myAPIs[i].APIID === APIID) {
            customName = myAPIs[i]?.API?.customName;
        }
    }


    return (
        <>

            <span className="font-normal text-lg leading-[18px] text-custom-ghostWhite ">Connect your API by providing a URL, uploading a file, or pasting the code. This step sets up the foundation for your integration.</span>
            <div className="flex gap-3 h-10 mt-[18px]">
                <Button
                    onClick={() => setSelectedMethod("URL")}
                    className={`${selectedMethod === "URL" ? "bg-grey-13 " : "border border-grey-13"} flex gap-[10px] items-center py-3 px-4 rounded-[60px]`}>
                    <LinkIcon className={`${selectedMethod === "URL" ? 'icon-white' : "icon-grey-7"}`} />
                    <span className={`${selectedMethod === "URL" ? 'text-custom-ghostWhite' : 'text-grey-17'} font-medium text-[16px] leading-[11px]`}>URL</span>
                </Button>
                <Button
                    onClick={() => setSelectedMethod("File")}
                    className={`${selectedMethod === "File" ? "bg-grey-13 " : "border border-grey-13"} flex gap-[10px] items-center text-custom-ghostWhite py-3 px-4 rounded-[60px]`} >
                    <UploadIcon className={`${selectedMethod === "File" && 'icon-white'}`} />
                    <span className={`${selectedMethod === "File" ? 'text-custom-ghostWhite' : 'text-grey-17'}  font-medium text-[16px] leading-[11px]`}>Upload</span>
                </Button>
                <Button
                    onClick={() => setSelectedMethod("Code")}
                    className={`${selectedMethod === "Code" ? "bg-grey-13 " : "border border-grey-13"} flex gap-[10px] items-center text-custom-ghostWhite py-3 px-4 rounded-[60px]`}>
                    <CodeIcon className={`${selectedMethod === "Code" && 'icon-white'}`} />
                    <span className={`${selectedMethod === "Code" ? 'text-custom-ghostWhite' : 'text-grey-17'} font-medium text-[16px] leading-[11px]`} >Code</span>
                </Button>
            </div>
            <div className={`${selectedMethod === "Code" ? 'mt-2' : 'mt-10'} flex flex-col gap-6`}>
                {isMyApi && <CustomInput
                    onChange={(e) => {
                        setCustomApiName(e.target.value);
                        setSelectedMethod("URL")
                    }}
                    label={"Set name for your API"}
                    variant={"primary"}
                    placeholder={"Add Custom name"}
                />}

                {selectedMethod === "URL" &&
                    <CustomInput
                        onChange={(e) => {
                            setURL(e.target.value);
                            setSelectedMethod("URL")
                        }}
                        label={"ADD URL"}
                        variant={"primary"}
                        placeholder={"Add URL.."}
                    />}
                {selectedMethod === "File" &&
                    <UploadFile
                        selectedFile={selectedFile}
                        setSelectedFile={setSelectedFile}
                        inputRef={inputRef}
                        dropRef={dropRef}
                    />
                }
                {selectedMethod === "Code" &&
                    <UploadCode
                        jsontext={jsontext}
                        setJsontext={setJsontext}
                        codeClassName={'h-[68px] overflow-auto'}
                    />
                }
                {uploadResponse == null && !isLoading && (
                    <Button
                        className="bg-grey-13 w-fit py-[10px] px-6 h-8 rounded-[10px]"
                        onClick={() => {
                            handleUpload();
                        }}
                    > Add API</Button>
                )}
            </div>

            {isLoading &&
                <div className='flex mt-6 items-center gap-6'>
                    <CustomLoader iconClassName="h-6 w-6" label='Validating your API....' />
                </div>
            }

            {!isLoading && uploadResponse != null && (
                <>
                    <div className="mt-[24px]">
                        <CustomInput
                            onBlur={async (e) => {
                                postGenericCRUDWithID('API', APIID, { customName: e.target.value });
                                setMyAPIs((prev) => {
                                    const temp = [...prev];
                                    for (let i = 0; i < temp.length; i++) {
                                        if (temp[i].APIID === APIID) {
                                            temp[i].API.customName = e.target.value;
                                        }
                                    }
                                    return temp;
                                });
                            }}
                            label={"SET NAME FOR YOUR API"}
                            variant={"primary"}
                            placeholder={"Add name"}
                            defaultValue={customName}
                        />
                    </div>
                    <ValidUpload handleCloseClick={handleCloseClick} setCurrentStep={setCurrentStep} />
                </>
            )}

        </>
    )
}



export default UploadStep