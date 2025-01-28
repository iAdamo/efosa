import React, { useContext, useState } from 'react';
import Button from '@components/Button.jsx';
import CustomInput from '@components/CustomInput.jsx';
import CustomLoader from '@components/CustomLoader.jsx';
import 'react-toastify/dist/ReactToastify.css';
import UploadCode from '../../api/upload/UploadCode.jsx';
import UploadFile from '../../api/upload/UploadFile.jsx';
import { GeneralContext } from '@contexts/GeneralContext.jsx';
import {uploadMethodTypes} from "@pages/my-apis/upload-method/method-types.jsx";
import {UploadMethodCard} from "@pages/my-apis/upload-method/UploadMethodCard.jsx";
import ValidUpload from "@pages/project-settings/AddAPIParts/ValidUpload.jsx";

function UploadApiStep(props) {
    const { setMyAPIs, myAPIs } = useContext(GeneralContext);
    const {
        values,
        setValues,
        handleCloseClick,
        APIID,
        uploadResponse,
        selectedFile,
        setSelectedFile,
        inputRef,
        dropRef,
        jsontext,
        setJsontext,
        setCurrentStep,
        selectedMethod,
        setSelectedMethod,
        isMyApi,
        handleUpload,
        isLoading,
        isNew
    } = props

    const handleTypeClick = (type) => setSelectedMethod(type);

    let customName = null;
    for (let i = 0; i < myAPIs.length; i++) {
        if (myAPIs[i].APIID === APIID) {
            customName = myAPIs[i]?.API?.customName;
        }
    }

    const handleUploadClick = () => {
        handleUpload(values);
    };

    const handleChange = (key, value) => {
        setValues((prevValues) => ({
            ...prevValues,
            [key]: value,
        }));
    };

    return (
        <>

            <span className="font-normal text-lg leading-[18px] text-custom-ghostWhite ">Connect your API by providing a URL, uploading a file, or pasting the code. This step sets up the foundation for your integration.</span>
            <div className="flex gap-3 h-10 mt-[18px]">
                {uploadMethodTypes.map((type) => (
                    <UploadMethodCard
                        key={type.id}
                        type={type}
                        isActive={selectedMethod === type.value}
                        onClick={() => handleTypeClick(type.value)}
                    />
                ))}
            </div>
            <div className={`${selectedMethod === "Code" ? 'mt-2' : 'mt-10'} flex flex-col gap-6`}>
                {isMyApi && <CustomInput
                    onChange={(e) => handleChange('customName', e.target.value)}
                    label={"Set name for your API"}
                    variant={"primary"}
                    placeholder={"Add Custom name"}
                    value={values?.customName || ''}
                />}

                {selectedMethod === "URL" &&
                    <CustomInput
                        onChange={(e) => handleChange('url', e.target.value)}
                        label={"ADD URL"}
                        variant={"primary"}
                        placeholder={"Add URL.."}
                        value={values?.url || ''}
                    />}
                {selectedMethod === "FILE" &&
                    <UploadFile
                        selectedFile={selectedFile}
                        setSelectedFile={setSelectedFile}
                        inputRef={inputRef}
                        dropRef={dropRef}
                    />
                }
                {selectedMethod === "CODE" &&
                    <UploadCode
                        jsontext={jsontext}
                        setJsontext={setJsontext}
                        codeClassName={'h-[68px] overflow-auto'}
                    />
                }
                {uploadResponse == null && !isLoading && (
                    <Button
                        className="bg-grey-13 w-fit py-[10px] px-6 h-8 rounded-[10px]"
                        onClick={() =>  handleUpload()}
                    > {isNew ? 'Save' : 'Add'} API</Button>
                )}
            </div>

            {isLoading &&
                <div className='flex mt-6 items-center gap-6'>
                    <CustomLoader iconClassName="h-6 w-6" label='Validating your API....' />
                </div>
            }

            {!isLoading && uploadResponse != null && <ValidUpload isMyApi handleCloseClick={handleCloseClick} setCurrentStep={setCurrentStep} />}
        </>
    )
}



export default UploadApiStep