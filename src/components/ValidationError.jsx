import React from 'react'
import errorIcon from "@assets/icons/error-new.svg";

function ValidationError(props) {
    const { validationIssues } = props;
    return (
        <div className="bg-neutral-900 rounded-[5px] w-[400px] h-1/2">
            <div className="flex gap-[5px] p-2.5 border-b border-grey-3">
                <img src={errorIcon} className="h-3.5 w-3.5" alt="errorIcon" />
                <span className="font-medium text-lg">Auth validation</span>
            </div>
            <div className="p-2.5 flex flex-col gap-2.5">
                <span className="text-base text-[#AEAEAE]">Please solve these errors to Authenticate API.</span>

                {validationIssues?.errors?.OAuthErrors.map((error, index) => {

                    return <>
                        <div key={index} className="flex gap-[5px] p-2.5 bg-[#C700371A] border border-status-error rounded-[5px]">
                            <div>
                                <img className="h-2.5 w-2.5" src={errorIcon} alt="errorIcon" />
                            </div>
                            <div>
                                <p className="text-status-error font-medium leading-3">{error?.error}</p>
                                <p className="text-sm mt-[5px]">{error?.description}</p>
                            </div>
                        </div>
                    </>
                })}




            </div>
        </div>
    )
}

export default ValidationError