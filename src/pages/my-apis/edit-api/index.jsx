import React, { useContext } from "react";
import SBreadcrumbs from "@components/SBreadcrumbs.jsx";
import { useParams } from "react-router-dom";
import { GeneralContext } from "@/contexts/GeneralContext";
import ApiAddOrEdit from "../ApiAddOrEdit";

export default function EditApi() {

    const { myAPIs } = useContext(GeneralContext);
    const params = useParams()

    const { apiId } = params;

    const existedApi = myAPIs.find(api => api.id === +apiId) || {}

    const { API: {
        name = ''
    } } = existedApi || {};
    
    return (
        <div className="w-full h-screen flex flex-col gap-4 pl-8 p-10">
            <SBreadcrumbs customLabel={name}/>
            <span className={`text-[28px] font-medium leading-8 text-custom-ghostWhite`}>
                Edit API
            </span>
            {existedApi?.id && <ApiAddOrEdit existedApi={existedApi} />}
        </div>
    );
}
