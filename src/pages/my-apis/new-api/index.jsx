import React from "react";
import SBreadcrumbs from "@components/SBreadcrumbs.jsx";
import ApiAddOrEdit from "../ApiAddOrEdit";

export default function AddApi() {
        return (
        <div className="w-full h-screen flex flex-col gap-4 pl-8 p-10">
            <SBreadcrumbs/>
            <span className={`text-[28px] font-medium leading-8 text-custom-ghostWhite`}>
                Add API
            </span>
            <ApiAddOrEdit />
        </div>
    );
}
