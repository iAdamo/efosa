import React, { useContext, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import SBreadcrumbs from "@components/SBreadcrumbs.jsx";
import { GeneralContext } from "@contexts/GeneralContext.jsx";
import { ChevronLeftIcon } from "@heroicons/react/solid";
import Button from "@components/Button.jsx";
import AvatarCard from "@pages/clients/partial/AvatarCard.jsx";
import CustomInput from "@components/CustomInput.jsx";
import { useForm } from "react-hook-form";
import SettingsServer from "@pages/my-apis/upload/SettingsServer.jsx";
import { AuthTypeCard } from "@pages/my-auths/partial/auth-type/AuthTypeCard.jsx";
import { uploadMethodTypes } from "@pages/my-apis/upload-method/method-types.jsx";
import { UploadMethodCard } from "@pages/my-apis/upload-method/UploadMethodCard.jsx";

const ApiDetails = () => {
    const { myAPIs } = useContext(GeneralContext);

    const { apiId } = useParams();
    const [alignment, setAlignment] = useState({
        "url": "sandbox",
        "clientId": "",
        "clientSecret": ""
    });

    const navigate = useNavigate();
    const apiInfo = myAPIs?.find(api => api.id === +apiId);
    const { API = {}, updated_at = '' } = apiInfo
    const { name = '', customName = '', id = '',
        uploadMethod,
        uploadFilename,
        uploadUrl, description = 'Short description about the API, its functions etc etc etc etc this can be a longer description depending on the type of API, if longer than 3 lines, hide under a read more', logo_url = '' } = API;
    const type = uploadMethodTypes.find((type) => type.value === uploadMethod)

    const handleChange = (event, newAlignment, name) => {
        return newAlignment ?? alignment?.[name];
    }

    return API && (
        <div className="w-full h-screen flex flex-col gap-4 pl-8 p-10">
            <SBreadcrumbs customLabel={name} />
            <div className="w-full flex flex-col">
                <div className="cursor-pointer w-min inline-flex items-center gap-2.5 relative flex-[0_0_auto]"
                    onClick={() => navigate(`/my-apis`)}>
                    <ChevronLeftIcon className="relative w-4 h-4" />
                    <div
                        className="relative cursor-pointer w-fit [font-family:'Inter',Helvetica] font-medium text-[#dee2e6] text-xs tracking-[0] leading-3 whitespace-nowrap"
                    >
                        Back to MyAPIs
                    </div>
                </div>

                <div
                    className="mt-8 flex items-center gap-10 pt-0 px-0 relative self-stretch w-full flex-[0_0_auto] rounded-[0px_0px_8px_8px]">
                    <div className="flex items-center justify-between relative flex-1 grow">
                        <div className="inline-flex items-center gap-10 relative flex-[0_0_auto]">
                            <div className="inline-flex items-center gap-3 relative flex-[0_0_auto]">
                                <AvatarCard name={name} image={logo_url} classN="!rounded h-16 min-h-16 min-w-16 w-16" />
                                <div
                                    className="relative w-fit [font-family:'Inter',Helvetica] font-medium text-[#f8f9fa] text-[28px] tracking-[0] leading-[normal]">
                                    {name}
                                </div>
                            </div>


                        </div>

                        <div className="inline-flex items-center gap-5 relative flex-[0_0_auto]">
                            <div className="inline-flex items-center gap-6 relative flex-[0_0_auto]">
                                <div className="inline-flex items-end gap-[7px] relative flex-[0_0_auto]">
                                    <Button
                                        variant={'addAuth'}
                                        onClick={() => navigate(`/my-apis/${apiId}/edit`)}
                                        className='flex gap-1.5 items-center group'
                                    >
                                        <span className='!bg-[#454C54] text-white '> Edit API </span>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col w-full gap-4 py-4">
                <div
                    className="p-6 bg-grey-15 rounded-lg group"
                >
                    <div className="flex flex-col gap-6 w-1/2">
                        <span
                            className="font-semibold text-[20px] text-[#F8F9FA]">
                            Upload information
                        </span>

                        <UploadMethodCard isActive className="!px-4 !py-3 !text-white w-fit" type={type} />

                        <CustomInput
                            variant="primary"
                            label={"API NAMe"}
                            defaultValue={name}
                            inputClassName="border-none !p-0 font-normal text-[16px] leading-11 text-custom-ghostWhite"
                            readOnly
                        />

                        {uploadMethod === "URL" && (
                            <CustomInput
                                label={"API URL"}
                                variant={"primary"}
                                defaultValue={uploadUrl}
                                inputClassName="border-none !p-0 font-normal text-[16px] leading-11 text-custom-ghostWhite"
                                readOnly
                            />
                        )}

                        {uploadMethod === "FILE" && (
                            <CustomInput
                                label={"File"}
                                variant={"primary"}
                                defaultValue={uploadFilename}
                                inputClassName="border-none !p-0 font-normal text-[16px] leading-11 text-custom-ghostWhite"
                                readOnly
                            />
                        )}

                        {uploadMethod === "Code" && (
                            <CustomInput
                                variant="primary"
                                label={"API Code"}
                                value={uploadUrl}
                                placeholder="Enter the API code"
                            />
                        )}
                    </div>
                </div>

                <div className="flex flex-col gap-8 p-6 bg-grey-15 rounded-lg">
                    <div className="flex flex-col gap-6 w-1/2">
                        <span
                            className="font-semibold text-[20px] text-[#F8F9FA]">
                            Settings
                        </span>
                        <SettingsServer />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ApiDetails;