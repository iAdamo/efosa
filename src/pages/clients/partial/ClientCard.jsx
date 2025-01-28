import {useContext, useState} from "react";
import Button from '@/components/Button';
import EditIcon from "@assets/icons/Edit.svg?react";
import moment from 'moment';
import AvatarCard from "@pages/clients/partial/AvatarCard.jsx";
import {Link, useNavigate} from "react-router-dom";
import EditClientModal from "@pages/clients/partial/EditClientModla.jsx";
import DeleteConfirmationModal from "@pages/clients/partial/DeleteConfirmationModal.jsx";
import {deleteClient} from "@axios/generalApiCalls.js";
import {errorToast, successToast} from "@components/toasts/toasts.jsx";
import {GeneralContext} from "@contexts/GeneralContext.jsx";

const ClientInfo = ({ label, value, isLast }) => (
    <div
        className={`flex flex-col-reverse items-start gap-2 w-[182px] h-[32px] box-border ${
            !isLast ? 'border-r border-[#454c54]' : ''
        }`}
    >
    <span className="text-sm font-normal text-white max-w-[95px] md:max-w-[160px] truncate">
      {value}
    </span>
        <span className="text-sm font-normal text-[#706D79]">{label}</span>
    </div>
);

function ClientCard({client}) {
    const formattedTime = moment(client?.created_at).format("DD-MM-YYYY");
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const { clients, setClients } = useContext(GeneralContext);
    const navigate = useNavigate();

    const handleDelete = async () => {
        await deleteClient(client.id)
            .then(() => {
                setClients(clients.filter(item => item.id !== client.id))
                navigate(`/clients`);
                setOpenDeleteModal(false);
                successToast(`‘${client.name}’ client deleted`, 'top-center')
            })
            .catch(() => {
                errorToast("Delete client failed")
            })
    };

    const showDeleteConfirmation = () => {
        setOpenEditModal(false);
        setOpenDeleteModal(true)
    }

    return (
        <div
            className='p-4 bg-grey-15 rounded-lg cursor-pointer group hover:bg-project-card-gradient hover:backdrop-blur'>
            <div className='flex flex-col gap-5'>
                <div className='flex justify-between'>
                    <div className="flex gap-5 items-center justify-between">
                        <AvatarCard name={client?.name} image={client?.logo_url}/>
                        <div className="flex flex-col items-start gap-3">
                            <span className='text-custom-ghostWhite font-normal text-lg leading-[14px]'>
                               {client?.name}
                            </span>

                            <div className="flex items-center gap-6">
                                <ClientInfo label="Contact info" value={client?.email}/>
                                <ClientInfo label="Created on" value={formattedTime}/>
                                <ClientInfo label="Projects" value={client.projects_count}/>
                                <ClientInfo label="Saved Auths" value={client.auths_count} isLast/>
                            </div>
                        </div>
                    </div>

                    <div className='flex items-center gap-5'>
                        <Button
                            onClick={() => setOpenEditModal(true)}
                            className='flex gap-1.5 items-center group'
                        >
                            <span className='text-grey-16 group-hover:text-grey-18'> Edit </span>
                            <EditIcon className='text-grey-16 group-hover:text-grey-18'/>
                        </Button>
                        <Link to={`/clients/${client?.id}`}
                              className='py-2.5 px-[35px] border border-grey-13 rounded-[10px] hover:bg-gradient-pink-4 hover:border-main-pink-5'
                        >
                            Open
                        </Link>
                    </div>
                </div>
            </div>
            {openEditModal && <EditClientModal
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
        </div>
    )
}

export default ClientCard