import React, { useState } from 'react';
import {successToast} from "@components/toasts/toasts.jsx";
import CustomLoader from "@components/CustomLoader.jsx";
import UpdatesFoundForAuthModal from "@pages/my-auths/partial/update-auth/UpdatesFoundForAuthModal.jsx";
import InfoIcon from "@assets/icons/info.svg?react";

const CheckForUpdates = () => {
    const [currentState, setCurrentState] = useState("idle");
    const [updatedFound, setUpdatedFound] = useState(false);
    const [result, setResult] = useState(null);

    const handleCheckForUpdates = () => {
        setCurrentState("checking");
        setResult(null);

        setTimeout(() => {
            // const simulatedResult = Math.random() > 0.5 ? 1 : 0;
            // if (!simulatedResult) {
            //     setResult("No new updates found.");
            // } else {
            //     setUpdatedFound(true);
            // }
            setResult("No new updates found.")
            setCurrentState("result");
        }, 2000);
    };

    const handleUpdatedAuth = () => {
        setCurrentState("idle")
        setUpdatedFound(false)
        successToast("Authentication updated!")
    }

    return (
        <div className="pb-4">
            {currentState === "idle" && (
                <span
                    className="cursor-pointer bg-grey-13 border-grey-13 text-custom-ghostWhite rounded-[10px] text-xs font-semibold py-3 px-6 w-fit"
                    onClick={handleCheckForUpdates}
                >
                    Check for updates
                </span>
            )}
            {currentState === "checking" && <CustomLoader label='Checking for updates...' />}
            {currentState === "result" && result && (
                <div className="flex items-center gap-6 text-sm font-normal text-custom-ghostWhite">
                    <InfoIcon className="w-5 h-5 icon-grey-2" />
                    {result}
                </div>
            )}

            {updatedFound && (
                <UpdatesFoundForAuthModal
                    open={updatedFound}
                    setOpen={setUpdatedFound}
                    handler={handleUpdatedAuth}
                />
            )}
        </div>
    );
};

export default CheckForUpdates;