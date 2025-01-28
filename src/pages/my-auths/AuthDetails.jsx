import {useNavigate, useParams} from "react-router-dom"
import SBreadcrumbs from "@components/SBreadcrumbs.jsx";
import {ChevronLeftIcon} from "@heroicons/react/solid";
import Button from "@components/Button.jsx";
import EditIcon from "@assets/icons/Edit.svg?react";
import CopyIcon from "@assets/icons/copy-icon-2.svg?react";
import React, {useContext, useState} from "react";
import {AuthInfo} from "./partial/AuthInfo.jsx";
import moment from "moment/moment.js";
import {AuthTypeCard} from "@pages/my-auths/partial/auth-type/AuthTypeCard.jsx";
import {authTypes} from "@pages/my-auths/partial/auth-type/auth-types.jsx";
import {SCheckbox} from "@components/SCheckbox.jsx";
import CheckForUpdates from "@pages/my-auths/partial/update-auth/CheckForUpdates.jsx";
import EditAuth from "@pages/my-auths/partial/update-auth/EditAuth.jsx";
import EditAuthModal from "@pages/my-auths/partial/update-auth/EditAuthModal.jsx";
import {GeneralContext} from "@contexts/GeneralContext.jsx";
import {errorToast, successToast} from "@components/toasts/toasts.jsx";
import {deleteMyAuth} from "@axios/apiCalls.js";
import DeleteAuthModal from "@pages/my-auths/partial/update-auth/DeleteAuthModal.jsx";

const AuthDetails = () => {
    const {authId} = useParams();
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);

    const [allowEdit, setAllowEdit] = useState(false)
    const [copied, setCopied] = useState(false)

    const { setAuths, auths } = useContext(GeneralContext);

    const navigate = useNavigate();
    const auth = auths?.find(auth => auth.id === +authId);
    const {api_authentication = {}} = auth || {}
    const type = authTypes.find((type) => type.value === api_authentication?.authType)

    const formattedTime = moment(auth?.created_at).format("DD-MM-YY");

    const copyLink = () => {
        setCopied(true)
        setTimeout(() => {
            setCopied(false)
        }, 500)
    }

    const showDeleteAuth = () => {
        setOpenEditModal(false)
        setOpenDeleteModal(true)
    }

    const handleDelete = async () => {
        await deleteMyAuth(auth.id)
            .then(() => {
                successToast(`‘${auth?.name}’ auth delete`)
                setAuths(auths.filter(item => item.id !== auth.id))
                navigate("/my-auths")
                setOpenDeleteModal(false);
            })
            .catch(() => {
                errorToast("Delete auth failed")
            })
    };

    return auth && (
        <div className="w-full h-screen flex flex-col gap-10 pl-8 p-10">
            <SBreadcrumbs customLabel={auth?.name}/>
            <div className="w-full flex flex-col">
                <div className="cursor-pointer w-min inline-flex items-center gap-2.5 relative flex-[0_0_auto]"
                     onClick={() => navigate(`/my-auths`)}>
                    <ChevronLeftIcon className="relative w-4 h-4"/>
                    <div
                        className="relative cursor-pointer w-fit [font-family:'Inter',Helvetica] font-medium text-[#dee2e6] text-xs tracking-[0] leading-3 whitespace-nowrap"
                    >
                        Back
                    </div>
                </div>

                <div
                    className="mt-8 flex items-center gap-10 pt-0 pb-5 px-0 relative self-stretch w-full flex-[0_0_auto] rounded-[0px_0px_8px_8px] border-b [border-bottom-style:solid] border-[#454c5466]">
                    <div className="flex items-center justify-between relative flex-1 grow">
                        <div className="inline-flex items-center gap-12 relative flex-[0_0_auto]">
                            <div className="inline-flex items-center gap-3 relative flex-[0_0_auto]">
                                <div
                                    className="relative w-fit [font-family:'Inter',Helvetica] font-medium text-[#f8f9fa] text-[28px] tracking-[0] leading-[normal]">
                                    {auth?.name}
                                </div>
                            </div>
                            <AuthInfo label="Created on" value={formattedTime}/>
                            <AuthInfo label="Used in" value={`${12} Speccs`}/>
                            <AuthInfo label="Assigned to" value={`Client name`} isLast/>
                        </div>

                        <div className="inline-flex items-center gap-5 relative flex-[0_0_auto]">
                            <div className="inline-flex items-center gap-6 relative flex-[0_0_auto]">
                                <div className="inline-flex items-end gap-[7px] relative flex-[0_0_auto]">
                                    <Button
                                        onClick={() => setOpenEditModal(true)}
                                        className='flex gap-1.5 items-center group'
                                    >
                                        <span className='text-grey-16 group-hover:text-grey-18'> Edit </span>
                                        <EditIcon className='text-grey-16 group-hover:text-grey-18'/>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {!allowEdit ? <div className="flex flex-col w-1/2 gap-3 py-7">
                    <div
                        className="py-4 px-6 bg-grey-15 rounded-lg group"
                    >
                        <div className="flex items-center justify-between w-full">
                            <div className="w-24">
                                <AuthTypeCard className="w-32" isActive type={type}/>
                            </div>

                            <div className="flex items-center gap-4">
                                <Button
                                    onClick={() => setAllowEdit(!allowEdit)}
                                    className="flex items-center gap-1.5"
                                >
                                    <span className="text-grey-16">Edit Auth</span>
                                    <EditIcon className="text-grey-16"/>
                                </Button>

                                <Button
                                    variant="text"
                                    onClick={() => copyLink()}
                                    className="flex items-center gap-1.5"
                                >
                                    <span className="text-grey-16">{copied ? 'Duplicated!' : 'Duplicate'}</span>
                                    <CopyIcon className="text-grey-16"/>
                                </Button>
                            </div>
                        </div>
                    </div>

                    {openEditModal && <EditAuthModal
                        open={openEditModal}
                        setOpen={setOpenEditModal}
                        auth={auth}
                        handleDelete={showDeleteAuth}
                    />}

                    {openDeleteModal && <DeleteAuthModal
                        setOpen={setOpenDeleteModal}
                        open={openDeleteModal}
                        handleDelete={handleDelete}
                    />}

                    <div className="flex flex-col gap-8 py-4 px-6 bg-grey-15 rounded-lg">
                        <SCheckbox isSelected className="s-checkbox-pink-6">
                            <span className="label-large flex gap-x-1">
                                <span className="text-custom-ghostWhite">Baseencode</span>
                            </span>
                        </SCheckbox>
                        <div className="flex flex-col gap-6">
                            <div
                                className="flex justify-between items-center py-2"
                            >
                                <div className="flex justify-between items-center w-full">
                                    <div className="flex flex-col items-start gap-3">
                                        <span className='text-xs font-medium text-grey-17'>URL</span>
                                        <span
                                            className="text-base font-normal text-[#F8F9FA] truncate">www.Stripe.com </span>
                                    </div>
                                </div>
                                <span className="rounded-sm	bg-[#343A40] text-white p-3">
                                GET
                            </span>
                            </div>

                            <div
                                className="flex justify-between items-center py-2"
                            >
                                <div className="flex justify-between items-center w-full">
                                    <div className="flex flex-col items-start gap-3">
                                        <span className='text-xs font-medium text-grey-17'>Client ID</span>
                                        <span
                                            className="text-base font-normal text-[#F8F9FA] truncate">Client ID</span>
                                    </div>
                                </div>
                                <span className="rounded-sm	bg-[#343A40] text-white p-3">
                                Body
                            </span>
                            </div>

                            <div
                                className="flex justify-between items-center py-2"
                            >
                                <div className="flex justify-between items-center w-full">
                                    <div className="flex flex-col items-start gap-3">
                                        <span className='text-xs font-medium text-grey-17'>Client Secret</span>
                                        <span
                                            className="text-base font-normal text-[#F8F9FA] truncate">Client secret </span>
                                    </div>
                                </div>
                                <span className="rounded-sm	bg-[#343A40] text-white p-3">
                                Body
                            </span>
                            </div>
                        </div>
                        <CheckForUpdates />
                    </div>
                </div> : <EditAuth auth={auth} />}
            </div>
        </div>
    )
}

export default AuthDetails;