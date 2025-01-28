import React from 'react'
import errorIcon from "@assets/icons/error-new.svg";
import SuccessMsg from '@/pages/api/upload/SuccessMsg';


function ValidationSuccess(props) {
    const { validationIssues } = props;
    return (
        <SuccessMsg message={'OAuth successful!'} />
    )
}

export default ValidationSuccess