import AllIcon from "@assets/icons/dashboard/sidebar/all.svg?react";
import AuthKeyIcon from "@assets/icons/dashboard/sidebar/authKeyIcon.svg?react";
import SummaryIcon from "@assets/icons/dashboard/sidebar/barChart.svg?react";
import ClientUserIcon from "@assets/icons/dashboard/sidebar/ClientUsers.svg?react";
import FolderIcon from "@assets/icons/dashboard/sidebar/folder.svg?react";
import SideBarHome from "@assets/icons/dashboard/sidebar/SideBarHome.svg?react";
import AiIcon from "@assets/icons/dashboard/sidebar/star-ai.svg?react";
import TemplatesImage from "@assets/icons/dashboard/sidebar/template-landing.svg?react";
import ZapIcon from "@assets/icons/dashboard/sidebar/zap.svg?react";
import MyAPIs from "@assets/icons/myapis.svg?react";


export const MenuCardData = [
    {
        bgColor: "hover:bg-purple-menu-gradient",
        label: "Templates",
        Logo: TemplatesImage,
        navigatePath: "/coming-soon",
    },
    {
        bgColor: "hover:bg-pink-menu-gradient",
        label: "AI",
        Logo: AiIcon,
        navigatePath: "",
    },
    {
        bgColor: "hover:bg-blue-menu-gradient",
        label: "My APIs",
        Logo: TemplatesImage,
        navigatePath: "/my-apis",
    },
]

export const SidebarOptions = [
    {
        label: "Dashboard",
        to: "/dashboard",
        icon: <SideBarHome />,
    },
    {
        label: "Execution Summary",
        to: "/execution-summary",
        icon: <SummaryIcon />,
    },
    {
        label: "Clients",
        to: "/clients",
        icon: <ClientUserIcon />,
    },
    {
        label: "My Auths",
        to: "/my-auths",
        icon: <AuthKeyIcon />,
    },
    {
        label: "Projects",
        to: "/projects",
        icon: <AllIcon />,
        StartIcon: <FolderIcon />,
    },
    {
        label: "My APIs",
        to: "/my-apis",
        icon: <MyAPIs />,
        StartIcon: <ZapIcon />,
    },
];