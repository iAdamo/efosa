import React from "react";
import Button from "@components/Button.jsx";

export const UploadMethodCard = ({ type, isActive, onClick, className }) => {
    const { key: typeName = '', icon = null } = type || {}

    return (
        <Button
            className={`flex gap-[10px] items-center py-3 px-4 rounded-[60px] 
                ${isActive ? "bg-grey-13 " : "border border-grey-13"} ${className || ""}`}
            onClick={onClick}
        >
            <div className={isActive && "icon-white"}>
                {icon && typeof icon === 'function' && icon(isActive)}
            </div>
            <span
                className={`${isActive ? 'text-custom-ghostWhite' : 'text-grey-17'} font-medium text-[16px] leading-[11px]`}>
                {typeName}
            </span>
        </Button>
    )
}