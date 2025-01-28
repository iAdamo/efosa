import CodeIcon from "@assets/icons/new-code.svg?react";
import UploadIcon from "@assets/icons/new-upload.svg?react";
import LinkIcon from "@assets/icons/new-url.svg?react";

export const uploadMethodTypes = [
    { key: "URL", value: "URL", icon: (isActive) => <LinkIcon isActive={isActive} /> },
    { key: "Upload", value: "FILE", icon: (isActive) => <UploadIcon isActive={isActive} /> },
    { key: "Code", value: "CODE", icon: (isActive) => <CodeIcon isActive={isActive} /> },
];