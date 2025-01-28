import {useContext, useState} from "react";
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import {AuthTypeCard} from "@pages/my-auths/partial/auth-type/AuthTypeCard.jsx";
import {authTypes} from "@pages/my-auths/partial/auth-type/auth-types.jsx";
import Button from '@/components/Button';
import EditIcon from "@assets/icons/Edit.svg?react";
import {AuthInfo} from "./AuthInfo.jsx";
import EditAuthModal from "@pages/my-auths/partial/update-auth/EditAuthModal.jsx";
import DeleteAuthModal from "@pages/my-auths/partial/update-auth/DeleteAuthModal.jsx";
import {errorToast, successToast} from "@components/toasts/toasts.jsx";
import {GeneralContext} from "@contexts/GeneralContext.jsx";
import {deleteClient} from "@axios/generalApiCalls.js";
import {deleteMyAuth} from "@axios/apiCalls.js";

function AuthCard ({ auth }) {
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const { clients, setAuths, auths } = useContext(GeneralContext);

    const navigate = useNavigate();
    const formattedTime = moment(auth?.created_at).format("DD-MM-YY");
    const {api_authentication = {}} = auth
    const type = authTypes.find((type) => type.value === api_authentication?.authType)

    const showDeleteAuth = () => {
        setOpenEditModal(false);
        setOpenDeleteModal(true)
    }

    const assignedClient = clients.find(client => client?.id === auth?.client_id) || {}

    const handleDelete = async () => {
        await deleteMyAuth(auth.id)
            .then(() => {
                successToast(`‘${auth?.name}’ auth deleted`)
                setAuths(auths.filter(item => item.id !== auth.id))
                setOpenDeleteModal(false);
            })
            .catch(() => {
                errorToast("Delete auth failed")
            })
    };

    return (
        <div className='p-4 bg-grey-15 rounded-lg cursor-pointer group hover:bg-project-card-gradient hover:backdrop-blur'>
            <div className="flex items-center justify-between w-full">
                <div className="flex flex-col items-start gap-3">
                    <div className="flex items-center gap-5">
                         <span className='text-custom-ghostWhite font-normal w-[150px] text-lg leading-[14px]'>
                           {auth?.name ?? "-"}
                        </span>
                        <div className="w-[100px]">
                            <AuthTypeCard className="!px-3 !py-1 !text-white" type={type}/>
                        </div>
                        <AuthInfo label="Created on" value={formattedTime}/>
                        <AuthInfo label="Used in" value={`${0} Speccs`}/>
                        <AuthInfo label="Assigned to" value={assignedClient?.name || ""} isLast/>
                    </div>
                </div>

                <div className='flex items-center gap-5'>
                    <Button
                        className='flex gap-1.5 items-center group'
                        onClick={() => setOpenEditModal(true)}
                    >
                        <span className='text-grey-16 group-hover:text-grey-18'>Edit</span>
                        <EditIcon className='text-grey-16 group-hover:text-grey-18'/>
                    </Button>
                    <Button
                        className='py-2.5 px-[35px] border border-grey-13 rounded-[10px] hover:bg-gradient-pink-4 hover:border-main-pink-5'
                        onClick={() => {
                            navigate(`/my-auths/${auth?.id}`);
                        }}
                    >View details</Button>
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
        </div>
    )
}

export default AuthCard