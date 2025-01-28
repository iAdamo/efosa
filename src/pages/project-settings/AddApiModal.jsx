import { createUploadApi, uploadAPIFile } from "@/axios/apiCalls";
import Toast, { showToast } from "@/components/CustomToast";
import { GeneralContext } from "@/contexts/GeneralContext";
import { ProjectContext } from "@/contexts/ProjectContext";
import CloseIcon from "@assets/icons/close.svg?react";
import { Modal } from "@mui/material";
import { useContext, useEffect, useRef, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import Rightmenu from "./AddAPIParts/Rightmenu";
import UploadStep from "./AddAPIParts/UploadStep";
import Validating from "./AddAPIParts/Validating";

function AddApiModal({ isModalOpen, setIsModalOpen, isMyAPI = false, myAPI, direction = "source", onUploadResponse }) {
  const [url, setURL] = useState("");
  const [completeStep, setCompleteStep] = useState({ step1: false, step2: false, step3: false });
  const [currentStep, setCurrentStep] = useState(1);

  const { projectID, refreshProjectInitialData } = useContext(ProjectContext);
  const { myAPIs, setMyAPIs } = useContext(GeneralContext);

  const [APIID, setAPIID] = useState(null);

  const [validationResult, setValidationResult] = useState(null);
  const [selectedMethod, setSelectedMethod] = useState("URL");
  const inputRef = useRef(null);
  const dropRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [jsontext, setJsontext] = useState("");
  const [uploadResponse, setUploadResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (direction === "destination") {
      setCompleteStep({ step1: false, step2: false, step3: false });
      setCurrentStep(1);
    }
  }, [direction]);

  const addToMyAPIs = (data) => {
    setMyAPIs((prev) => [...prev, data]);
  };

  const useMyAPI = async (myAPIID, direction) => {
    if (!myAPIID) return;

    const speccData = {
      myAPIID: myAPIID,
      direction: direction.toUpperCase(),
      projectID: projectID,
    };

    const data = await createUploadApi(speccData);
    refreshProjectInitialData();
  };

  const handleUpload = () => {
    switch (selectedMethod) {
      case "URL":
        handleURLUpload();
        break;
      case "File":
        handleFileUpload();
        break;
      case "Code":
        handleCodeUpload();
        break;
    }
  };

  const handleURLUpload = async () => {
    setCompleteStep((prev) => ({ ...prev, step1: true }));
    if (url.length === 0) {
      return;
    }

    let speccData = null;

    speccData = {
      url: url,
    };

    try {
      setIsLoading(true);
      setCurrentStep(2);
      const data = await createUploadApi(speccData);
      setUploadResponse(data);
      setValidationResult(data?.validation_issues);
      onUploadResponse?.(data);

      setAPIID(data?.data.APIID);
      useMyAPI(data?.data.id, direction);

      if (data?.success) {
        addToMyAPIs(data?.data);
        showToast("API added successfully", "success");
      }
      setCompleteStep((prev) => ({ ...prev, step2: true }));
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      onUploadResponse?.(error?.response?.data);
    }
  };

  const handleFileUpload = async () => {
    setCompleteStep((prev) => ({ ...prev, step1: true }));
    const file = selectedFile;
    if (!file) {
      openFileChoseWindow();
      return;
    }
    const formData = new FormData();
    formData.append("file", file);

    try {
      setIsLoading(true);
      setCurrentStep(2);
      const data = await uploadAPIFile(formData);
      setAPIID(data?.data.APIID);
      useMyAPI(data?.data.id, direction);
      setUploadResponse(data);
      setValidationResult(data?.validation_issues);

      setIsLoading(false);
      if (data?.success) {
        addToMyAPIs(data?.data);
        showToast("API added successfully", "success");
      }
      setCompleteStep((prev) => ({ ...prev, step2: true }));
    } catch (error) {
      setIsLoading(false);
      showToast("API failed", "error");
      setCompleteStep((prev) => ({ ...prev, step2: false }));
    }
  };

  const handleCodeUpload = async () => {
    setCompleteStep((prev) => ({ ...prev, step1: true }));
    setIsLoading(true);
    if (jsontext.length == 0) {
      return;
    }

    let speccData = null;

    speccData = {
      jsontext,
      jsonurl: "",
      jsonfile: "",
    };

    try {
      setIsLoading(true);
      setCurrentStep(2);
      const data = await createUploadApi(speccData);
      setAPIID(data?.data.APIID);
      useMyAPI(data?.data.id, direction);
      setUploadResponse(data);
      setValidationResult(data?.validation_issues);

      if (data?.success) {
        addToMyAPIs(data?.data);
        showToast("API added successfully", "success");
      }
      setCompleteStep((prev) => ({ ...prev, step2: true }));
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      showToast("API failed", "error");
    }
  };

  const handleCloseClick = () => {
    setCompleteStep({ step1: false, step2: false, step3: false });
    setCurrentStep(1);
    setValidationResult(null);
    setUploadResponse(null);
    setJsontext("");
    setSelectedFile(null);
    setURL("");
    setSelectedMethod("URL");
    setIsModalOpen(false);
  };

  const tryNewMethod = () => {
    setCompleteStep({ step1: false, step2: false, step3: false });
    setUploadResponse(null);
    setValidationResult(null);
    setJsontext("");
    setSelectedFile(null);
    setURL("");
    setSelectedMethod("URL");
    setCurrentStep(1);
  };

  return (
    <>
      <Toast />
      <Modal open={isModalOpen} onClose={() => handleCloseClick()} className="backdrop-blur-[15px]">
        <div
          className={`w-[60%] bg-modal-bg-gradient shadow-modal max-w-[1229px] max-h-[700px] min-w-[900px] py-10 px-6 rounded-lg absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border border-gradient-grey-3`}>
          <div className="w-full flex items-center gap-3">
            <span id="modal-title" className={`text-[28px] h-[34px] font-medium leading-8 text-custom-ghostWhite flex-1`}>
              Add API
            </span>
            <button onClick={handleCloseClick}>
              <CloseIcon className="icon-white w-6 h-6 p-[6px] s-icon-grey-4" />
            </button>
          </div>

          <div className="flex gap-4 mt-[34px]">
            <div className="py-[26px] pl-[26px] pr-[35px] bg-grey-15 rounded-lg w-[816px] max-h-[500px]">
              {(currentStep === 1 ||
                (currentStep === 2 && isLoading) ||
                (currentStep === 2 && !isLoading && uploadResponse != null && validationResult == null)) && (
                <UploadStep
                  handleCloseClick={handleCloseClick}
                  direction={direction}
                  APIID={APIID}
                  selectedFile={selectedFile}
                  setSelectedFile={setSelectedFile}
                  setJsontext={setJsontext}
                  inputRef={inputRef}
                  dropRef={dropRef}
                  jsontext={jsontext}
                  isLoading={isLoading}
                  completeStep={completeStep}
                  currentStep={currentStep}
                  selectedMethod={selectedMethod}
                  setSelectedMethod={setSelectedMethod}
                  setURL={setURL}
                  selectedFile={selectedFile}
                  setSelectedFile={setSelectedFile}
                  jsontext={jsontext}
                  setJsontext={setJsontext}
                  handleUpload={handleUpload}
                  isLoading={isLoading}
                  uploadResponse={uploadResponse}
                  validationResult={validationResult}
                  setCurrentStep={setCurrentStep}
                />
              )}

              {currentStep === 2 && !isLoading && validationResult != null && (
                <>
                  <Validating
                    tryNewMethod={tryNewMethod}
                    setValidationResult={setValidationResult}
                    setUploadResponse={setUploadResponse}
                    uploadResponse={uploadResponse}
                    validationResult={validationResult}
                    isLoading={isLoading}
                    setCurrentStep={setCompleteStep}
                  />
                </>
              )}
            </div>
            <Rightmenu completeStep={completeStep} currentStep={currentStep} />
          </div>
        </div>
      </Modal>
    </>
  );
}

export default AddApiModal;
