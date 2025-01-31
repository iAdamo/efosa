import React from "react";
import Button from "@components/Button.jsx";
import JwtIcon from "@assets/icons/auth-types/JwtIcon.svg?react";
import { authTypes } from "./auth-types.jsx";

const getAuthType = (authenticationType) => {
  const type = authTypes.find(auth => auth.value === authenticationType);
  return type || {
    key: "Empty",
    value: null,
    icon: (isActive) => <JwtIcon isActive={isActive} />,
  };
};

export const AuthTypeCard = ({ authenticationType, isActive, onClick, className }) => {
  const type = getAuthType(authenticationType);

  return (
    <Button
      className={`flex font-medium text-xs
        ${isActive ? 'bg-grey-13 text-white border-transparent' : 'text-grey-17 border-gray-600 border-opacity-40'} ${className || ""}`}
      onClick={onClick}
    >
      <div className={isActive && "icon-pink-1"}>
        {type.icon && typeof type.icon === 'function' && type.icon(isActive)}
      </div>
    </Button>
  );
};
