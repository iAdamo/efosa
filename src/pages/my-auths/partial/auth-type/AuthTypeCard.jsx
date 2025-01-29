import React from "react";
import Button from "@components/Button.jsx";
import AuthKeyIcon from "@assets/icons/auth-types/AuthKeyIcon.svg?react";
import JwtIcon from "@assets/icons/auth-types/JwtIcon.svg?react";
import GlobeIcon from "@assets/icons/auth-types/GlobeIcon.svg?react";
import LockIcon from "@assets/icons/auth-types/LockIcon.svg?react";

const getAuthType = (authenticationType) => {
  switch (authenticationType) {
    case "BASIC":
      return {
        key: "Basic",
        value: null,
        icon: (isActive) => <GlobeIcon isActive={isActive} />,
      };
    case "JWT":
      return {
        key: "JWT",
        value: null,
        icon: (isActive) => <JwtIcon isActive={isActive} />,
      };
    case "AUTH_KEY":
      return {
        key: "authKey",
        value: null,
        icon: (isActive) => <AuthKeyIcon isActive={isActive} />,
      };
    case "LOCK":
      return {
        key: "lock",
        value: null,
        icon: (isActive) => <LockIcon isActive={isActive} />,
      };
    default:
      return {
        key: "Empty",
        value: null,
        icon: (isActive) => <JwtIcon isActive={isActive} />,
      };
  }
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
