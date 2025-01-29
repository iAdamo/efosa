import React from "react";
import Button from "@components/Button.jsx";

export const AuthTypeCard = ({ type, isActive, onClick, className }) => {
    const { key: typeName = '', icon = null } = type || {}

    return (
        <Button
            className={`flex font-medium text-xs
                ${isActive ? 'bg-grey-13 text-white border-transparent' : 'text-grey-17 border-gray-600 border-opacity-40'} ${className || ""}`}
            onClick={onClick}
        >
            <div className={isActive && "icon-pink-1"}>
                {icon && typeof icon === 'function' && icon(isActive)}
            </div>
        </Button>
    );
}