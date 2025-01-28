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





function Settings(props) {
    const { validationResult, tryNewMethod, uploadResponse, setValidationResult, setUploadResponse, isLoading, setCurrentStep } = props;


    return (
        <>

        </>
    )
}



export default Settings