import { GeneralContext } from '@/contexts/GeneralContext';
import { getGeneratedApiData } from '@/utils/helpers';
import { createUploadApi, uploadAPIFile } from '@axios/apiCalls.js';
import Button from "@components/Button.jsx";
import { showToast } from '@components/CustomToast.jsx';
import SButton from "@components/SButton.jsx";
import RightMenuSteps from "@pages/my-apis/api-steps/RigthMenuSteps.jsx";
import UploadApiStep from "@pages/my-apis/api-steps/UploadApiStep.jsx";
import ValidatingStep from "@pages/my-apis/api-steps/ValidatingStep.jsx";
import SettingsServer from "@pages/my-apis/upload/SettingsServer.jsx";
import { useContext, useEffect, useRef, useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';

function ApiAddOrEdit({
  existedApi = {}
}) {
  const [url, setURL] = useState("");
  const [customApiName, setCustomApiName] = useState('')
  const [completeStep, setCompleteStep] = useState({ step1: false, step2: false, step3: false });
  const [currentStep, setCurrentStep] = useState(1);
  const [APIID, setAPIID] = useState(null);
  const [values, setValues] = useState({});
  const { myAPIs, setMyAPIs } = useContext(GeneralContext);

  const [validationResult, setValidationResult] = useState(null);
  const [selectedMethod, setSelectedMethod] = useState("URL");
  const inputRef = useRef(null);
  const dropRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [jsontext, setJsontext] = useState("");
  const [uploadResponse, setUploadResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [uploadApiResponse, setUploadApiResponse] = useState(null);

  const onUploadResponse = async (response) => {
    setUploadApiResponse(response)
  };

  const handleUpload = () => {
    switch (selectedMethod) {
      case "URL":
        handleURLUpload();
        break;
      case "FILE":
        handleFileUpload();
        break;
      case "CODE":
        handleCodeUpload();
        break;
    }
  };

  const handleURLUpload = async () => {
    setCompleteStep((prev) => ({ ...prev, step1: true }))
    if (values.url.length === 0) {
      return;
    }

    try {
      setIsLoading(true)
      setCurrentStep(2)
      const data = await createUploadApi(values);
      setUploadResponse(data);
      setValidationResult(data?.validation_issues);
      onUploadResponse?.(data);

      setAPIID(data?.data.APIID);
      // useMyAPI(data?.data.id, direction);


      if (data?.success) {
        setMyAPIs([...myAPIs, data?.data]);
        showToast("API added successfully", "success")
      }
      setCompleteStep((prev) => ({ ...prev, step2: true }));
      setIsLoading(false)
    } catch (error) {
      console.log(error)
      setIsLoading(false)
      if (error?.response?.data?.message) {
        setValidationResult(error?.response?.data?.message);
      }
      onUploadResponse?.(error?.response?.data);
    }
  };

  const handleFileUpload = async () => {
    console.log('aaa', selectedFile)
    setCompleteStep((prev) => ({ ...prev, step1: true }))
    const file = selectedFile;
    if (!file) {
      openFileChoseWindow();
      return;
    }
    const formData = new FormData();
    formData.append("file", file);


    try {
      setIsLoading(true)
      setCurrentStep(2)
      const data = await uploadAPIFile(formData);
      setAPIID(data?.data.APIID);
      // useMyAPI(data?.data.id, direction);
      setUploadResponse(data);
      setValidationResult(data?.validation_issues);

      setIsLoading(false)
      if (data?.success) {
        setMyAPIs([...myAPIs, data?.data]);
        showToast("API added successfully", "success")
      }
      setCompleteStep((prev) => ({ ...prev, step2: true }));
    } catch (error) {
      setIsLoading(false)
      if (error?.response?.data?.message) {
        setValidationResult(error?.response?.data?.message);
      }
      showToast("API failed", "error")
      setCompleteStep((prev) => ({ ...prev, step2: false }));
    }
  };

  const handleCodeUpload = async () => {
    setCompleteStep((prev) => ({ ...prev, step1: true }))
    if (!jsontext.length && !isExistedApi) {
      return;
    }
    let speccData = null;
    setIsLoading(true)

    speccData = {
      jsontext,
      jsonurl: "",
      jsonfile: "",
    };


    try {
      setIsLoading(true)
      setCurrentStep(2)
      const data = await createUploadApi(speccData);
      setAPIID(data?.data.APIID);
      setUploadResponse(data);
      setValidationResult(data?.validation_issues);

      if (data?.success) {
        setMyAPIs([...myAPIs, data?.data]);
        showToast("API added successfully", "success")
      }
      setCompleteStep((prev) => ({ ...prev, step2: true }));
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
      if (error?.response?.data?.message) {
        setValidationResult(error?.response?.data?.message);
      }
      showToast("API failed", "error")
    }
  };

  const handleCloseClick = () => {
    setCompleteStep((prev) => ({ ...prev, step2: true }));
    setCurrentStep(3);
    setValidationResult(null);
    setUploadResponse(null);
    setJsontext("");
    setSelectedFile(null);
    setValues({});
    setSelectedMethod('URL');
  };

  const tryNewMethod = () => {
    setCompleteStep({ step1: false, step2: false, step3: false });
    setUploadResponse(null);
    setValidationResult(null);
    setJsontext("");
    setSelectedFile(null);
    setURL("");
    setSelectedMethod('URL');
    setCurrentStep(1);
  }

  const isExistedApi = Object.keys(existedApi)?.length

  useEffect(() => {
    if (isExistedApi) {
      const generatedData = getGeneratedApiData(existedApi)
      setValues(generatedData)
      setSelectedMethod(generatedData.uploadMethod)
      {
        generatedData.uploadFilename && setSelectedFile({
          name: generatedData.uploadFilename
        })
      }

    }
  }, [isExistedApi])

  return (
    <div className="flex gap-8">
      <div className="py-[26px] pl-[26px] pr-[35px] bg-grey-15 rounded-lg w-full">
        {(currentStep === 1 || (currentStep === 2 && isLoading) || (currentStep === 2 && !isLoading && uploadResponse != null && validationResult == null)) && (
          <UploadApiStep
            values={values}
            setValues={setValues}
            handleCloseClick={handleCloseClick}
            APIID={APIID}
            selectedFile={selectedFile}
            setSelectedFile={setSelectedFile}
            inputRef={inputRef} dropRef={dropRef}
            isLoading={isLoading}
            isNew={isExistedApi}
            completeStep={completeStep} currentStep={currentStep} selectedMethod={selectedMethod}
            setSelectedMethod={setSelectedMethod} setURL={setURL} selectedFile={selectedFile}
            setSelectedFile={setSelectedFile} jsontext={jsontext} setJsontext={setJsontext}
            handleUpload={handleUpload} isLoading={isLoading} uploadResponse={uploadResponse}
            validationResult={validationResult} setCurrentStep={setCurrentStep} isMyApi />
        )}
        {currentStep === 2 && !isLoading && validationResult && <ValidatingStep
          tryNewMethod={tryNewMethod} setValidationResult={setValidationResult}
          setUploadResponse={setUploadResponse} uploadResponse={uploadResponse}
          validationResult={validationResult} isLoading={isLoading}
          setCurrentStep={setCompleteStep}
        />}
        {currentStep === 3 && <SettingsServer />}
        {currentStep !== 3 && validationResult === null ? <div className="flex flex-col gap-4 mt-14">
          <span className="font-normal text-lg leading-[18px] text-custom-ghostWhite ">
            You can either build your own API using our builder or let our AI create one for you.
          </span>

          <div className="flex gap-3">
            <SButton
              sType="button"
              onClick={() => {
              }}
              className=" px-[15px] !h-10 py-2 bg-[#141619] rounded-[50px] shadow justify-center items-center gap-0.5 inline-flex w-max"
            >
              <div
                className="flex gap-[5px] grow shrink basis-0 text-center !text-white text-xs font-semibold font-['Inter'] leading-[14px] tracking-normal items-center">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <g clip-path="url(#clip0_10521_10588)">
                    <path
                      d="M8.00065 1.3335L1.33398 4.66683L8.00065 8.00016L14.6673 4.66683L8.00065 1.3335Z"
                      stroke="#F8F9FA" stroke-width="2" stroke-linecap="round"
                      stroke-linejoin="round" />
                    <path d="M1.33398 11.3335L8.00065 14.6668L14.6673 11.3335" stroke="#F8F9FA"
                      stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M1.33398 8L8.00065 11.3333L14.6673 8" stroke="#F8F9FA" stroke-width="2"
                      stroke-linecap="round" stroke-linejoin="round" />
                  </g>
                  <defs>
                    <clipPath id="clip0_10521_10588">
                      <rect width="16" height="16" fill="white" />
                    </clipPath>
                  </defs>
                </svg>

                Create in Builder
              </div>
            </SButton>

            <SButton
              sType="button"
              onClick={() => {
              }}
              className=" px-[15px] !h-10 py-2 bg-[#141619] rounded-[50px] shadow justify-center items-center gap-0.5 inline-flex w-max"
            >
              <div
                className="flex gap-[5px] grow shrink basis-0 text-center !text-white text-xs font-semibold font-['Inter'] leading-[14px] tracking-normal items-center">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <g clip-path="url(#clip0_10521_10603)">
                    <path
                      d="M8.00065 1.33398L10.0607 5.50732L14.6673 6.18065L11.334 9.42732L12.1207 14.014L8.00065 11.8473L3.88065 14.014L4.66732 9.42732L1.33398 6.18065L5.94065 5.50732L8.00065 1.33398Z"
                      stroke="#F8F9FA" stroke-width="2" stroke-linecap="round"
                      stroke-linejoin="round" />
                  </g>
                  <defs>
                    <clipPath id="clip0_10521_10603">
                      <rect width="16" height="16" fill="white" />
                    </clipPath>
                  </defs>
                </svg>

                Generate with AI
              </div>
            </SButton>
          </div>
        </div> : validationResult === null && <Button
          className="bg-grey-13 !w-fit py-[10px] px-6 h-8 rounded-[10px] mt-6"
          onClick={() => { }}
        > Save to MyAPIs</Button>}
      </div>

      <div className="py-[26px] pl-[26px] pr-[35px] bg-grey-15 rounded-lg w-auto max-h-[200px]">
        <RightMenuSteps completeStep={completeStep} currentStep={currentStep} />
      </div>
    </div>
  )
}


export default ApiAddOrEdit