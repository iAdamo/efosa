import JwtIcon from "@assets/icons/auth-types/JwtIcon.svg?react";
import AuthKeyIcon from "@assets/icons/auth-types/AuthKeyIcon.svg?react";
import GlobeIcon from "@assets/icons/auth-types/GlobeIcon.svg?react";
import LockIcon from "@assets/icons/auth-types/LockIcon.svg?react";

export const authTypes = [
    { key: "API Key", value: "APIKEY", icon: (isActive) => <AuthKeyIcon isActive={isActive} /> },
    { key: "JWT", value: "JWT", icon: (isActive) => <JwtIcon isActive={isActive} /> },
    { key: "OAuth", value: "OAUTH", icon: (isActive) => <GlobeIcon isActive={isActive} /> },
    { key: "Basic", value: "BASIC", icon: (isActive) => <LockIcon isActive={isActive} /> }
];