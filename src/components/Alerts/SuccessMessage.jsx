import closeIcon from "@assets/icons/close.svg";
import successIcon from "@assets/icons/success.svg";
import { memo } from "react";
import { useState } from 'react';

const SuccessMessage = ({ sourceAPICustomName = "", destinationAPICustomName = "", showMsg, setShowMsg }) => {

    return (
        showMsg && (
            <div className="container-transition w-[100%] mt-3 h-fit p-[15px] flex justify-between bg-[#005C40CC] border border-[#00DF9C] rounded-lg mb-3">
                <div className="flex items-start gap-[10px] text-[12px] ">
                    <img src={successIcon} />
                    <div className="w-full max-w-[400px] flex flex-col gap-2 flex-wrap">
                        <span>
                            Data was successfully transferred from {sourceAPICustomName} to{" "}
                            {destinationAPICustomName}
                        </span>
                    </div>
                </div>

                <span
                    className="flex items-start cursor-pointer"
                    onClick={() => setShowMsg(!showMsg)}
                >
                    <img src={closeIcon} />
                </span>
            </div>
        )
    );
};

export default memo(SuccessMessage);
