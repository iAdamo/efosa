import React, {useContext, useMemo, useState} from "react";
import {useNavigate, useParams} from "react-router-dom"
import SBreadcrumbs from "@components/SBreadcrumbs.jsx";
import {GeneralContext} from "@contexts/GeneralContext.jsx";
import {ChevronLeftIcon} from "@heroicons/react/solid";
import moment from "moment/moment.js";
import Button from "@components/Button.jsx";
import EditIcon from "@assets/icons/Edit.svg?react";
import EditClientModal from "@pages/clients/partial/EditClientModla.jsx";
import DeleteConfirmationModal from "@pages/clients/partial/DeleteConfirmationModal.jsx";
import {deleteClient} from "@axios/generalApiCalls.js";
import {errorToast, successToast} from "@components/toasts/toasts.jsx";
import AvatarCard from "@pages/clients/partial/AvatarCard.jsx";
import ProjectAuthManagement from "@pages/clients/partial/tabs/index.jsx";
import ExecutionKPIs from "@pages/clients/partial/results-charts/ExecutionKPIs.jsx";
import ExecutionOverview from "@pages/clients/partial/results-charts/ExecutionOverview.jsx";
import ProjectsAuthsResult from "@pages/clients/partial/results-charts/ProjectsAuthsResult.jsx";
import InsightsResult from "@pages/clients/partial/results-charts/InsightsResult.jsx";

const ClientDetails = () => {
    const {clientId} = useParams();
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const {clients, setClients} = useContext(GeneralContext);

    const navigate = useNavigate();
    const client = clients?.find(cl => cl.id === +clientId);

    const showDeleteConfirmation = () => {
        setOpenEditModal(false);
        setOpenDeleteModal(true)
    }

    const handleDelete = async () => {
        await deleteClient(client.id)
            .then(() => {
                successToast(`‘${client?.name}’ client deleted`)
                setClients(clients.filter(item => item.id !== client.id))
                setOpenDeleteModal(false);
                navigate(`/clients`);
            })
            .catch(() => {
                errorToast("Delete client failed")
            })
    };

    const formattedTime = useMemo(() => {
        return moment(client?.created_at).format("DD-MM-YYYY")
    }, [client])

    return client && (
        <div className="w-full h-screen flex flex-col gap-10 pl-8 p-10">
            <SBreadcrumbs customLabel={client?.name}/>
            <div className="w-full flex flex-col">
                <div className="cursor-pointer w-min inline-flex items-center gap-2.5 relative flex-[0_0_auto]"
                     onClick={() => navigate(`/clients`)}>
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
                        <div className="inline-flex items-center gap-10 relative flex-[0_0_auto]">
                            <div className="inline-flex items-center gap-3 relative flex-[0_0_auto]">
                                <AvatarCard name={client?.name} image={client?.logo_url}/>

                                <div
                                    className="relative w-fit [font-family:'Inter',Helvetica] font-medium text-[#f8f9fa] text-[28px] tracking-[0] leading-[normal]">
                                    {client?.name}
                                </div>
                            </div>

                            <div className="inline-flex items-center gap-6 relative flex-[0_0_auto]">
                                <div className="inline-flex items-center gap-1 p-1 relative flex-[0_0_auto] rounded-sm">
                                    <div
                                        className="relative w-fit mt-[-1.00px] [font-family:'Inter',Helvetica] font-normal text-[#6f6c78] text-xs tracking-[0.24px] leading-[14px] whitespace-nowrap">
                                        Created on {formattedTime}
                                    </div>
                                </div>

                                <div className="inline-flex items-center gap-1 p-1 relative flex-[0_0_auto] rounded-sm">
                                    <div
                                        className="relative w-fit mt-[-1.00px] [font-family:'Inter',Helvetica] font-normal text-[#f8f9fa] text-xs tracking-[0.24px] leading-[14px] whitespace-nowrap overflow-hidden text-ellipsis [display:-webkit-box] [-webkit-line-clamp:1] [-webkit-box-orient:vertical]">
                                        {client?.email}
                                    </div>
                                </div>
                            </div>
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

                <div className="grid grid-cols-1 md:grid-cols-6 gap-4 w-full mt-7">
                    <ProjectsAuthsResult client={client}/>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 col-span-5 md:col-span-5">
                        <ExecutionKPIs />
                        <ExecutionOverview />
                        <InsightsResult />
                    </div>
                </div>
            </div>

            {openEditModal &&
                <EditClientModal
                    toHomeOnchange={false}
                    open={openEditModal}
                    setOpen={setOpenEditModal}
                    client={client}
                    handleDelete={showDeleteConfirmation}
                />}
            {openDeleteModal &&
                <DeleteConfirmationModal
                    open={openDeleteModal}
                    setOpen={setOpenDeleteModal}
                    handler={handleDelete}
                />}

            <ProjectAuthManagement/>
        </div>
    )
}

export default ClientDetails;