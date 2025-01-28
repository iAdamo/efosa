import { useContext, useState } from "react";
import Button from "@/components/Button";
import AvatarCard from "../clients/partial/AvatarCard";
import EditIcon from "@assets/icons/Edit.svg?react";
import CopyIcon from "@assets/icons/copy-icon-2.svg?react";
import TrashIcon from "@assets/icons/vector.svg?react";
import { Link, useNavigate } from "react-router-dom";
import moment from "moment";
import DeleteAuthModal from "@pages/my-apis/partial/DeleteAuthModal.jsx";
import { errorToast, successToast } from "@components/toasts/toasts.jsx";
import { deleteMyApi } from "@axios/apiCalls.js";
import { AuthTypeCard } from "@pages/my-auths/partial/auth-type/AuthTypeCard.jsx";
import { authTypes } from "@pages/my-auths/partial/auth-type/auth-types.jsx";
import JwtIcon from "@assets/icons/auth-types/JwtIcon.svg?react";
import { GeneralContext } from "@contexts/GeneralContext.jsx";

const ApiCard = ({
    card,
    isPublic = false
}) => {
    const { myAPIs, setMyAPIs } = useContext(GeneralContext);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const { API = {}, updated_at = '' } = card || {};
    const { name = '', customName = '', id = '', authenticationType = '', description = 'Short description about the API, its functions etc etc etc etc this can be a longer description depending on the type of API, if longer than 3 lines, hide under a read more', logo_url = '' } = API || {};
    const formattedTime = moment(updated_at).format("DD-MM-YYYY");
    const type = authTypes.find((type) => type.value === authenticationType)
    const [isAdded, setIsAdded] = useState(myAPIs.some(api => api.id === id));
    
    const navigate = useNavigate();

    const handleDelete = async () => {
        await deleteMyApi(card?.id)
            .then(() => {
                setMyAPIs(myAPIs.filter(api => api.id !== card.id))
                successToast(`${name} deleted from MyAPIs`)
                setOpenDeleteModal(false);
            })
            .catch(() => {
                errorToast("Delete API failed")
            })
    };

    const handleAddToMyApis = (e) => {
        e.stopPropagation();
        e.preventDefault()
        if (!myAPIs.some(api => api.id === card.id)) {
            setMyAPIs([card, ...myAPIs]);
            successToast(`${name} Api saved`);
            setIsAdded(!isAdded);
        }
    };

    const handleDeleteEvent = (e) => {
        e.stopPropagation()
        e.preventDefault()
        setOpenDeleteModal(true)
    }

    const handleEditEvent = (e) => {
        e.stopPropagation()
        e.preventDefault()
        navigate(`${card.id}/edit`)
    }

    return API && (
        <div 
            className={`p-4 m-2 rounded-lg cursor-pointer group w-[calc(33.333%-16px)] ${isAdded ? "border-[#454C54] !cursor-not-allowed" : "bg-grey-15 hover:bg-project-card-gradient hover:backdrop-blur"}`}
            style={isAdded ? { background: "linear-gradient(65.38deg, #343A40 -5.16%, rgba(52, 58, 64, 0) 119.64%)" } : {}}
        >
            <Link to={!isPublic && `/my-apis/${card.id}`} className='flex flex-col gap-5'>
                <div className='flex justify-between flex-col'>
                    <div className="flex w-full items-start">
                        <div className={`flex gap-3 ${isPublic ? 'w-full mr-9' : 'w-1/2'} items-start`}>
                            <AvatarCard name={name} customName={customName} image={logo_url} classN="!rounded h-8 min-h-8 min-w-8 w-8" />
                            <div className="flex flex-col items-start gap-1 overflow-hidden">
                                <div>
                                    <span
                                        className='max-w-full text-custom-ghostWhite font-normal text-lg leading-[14px] whitespace-nowrap overflow-hidden text-ellipsis [-webkit-line-clamp:1] [-webkit-box-orient:vertical]'>
                                        {name ?? ''}
                                    </span>
                                </div>
                                <div className="flex items-center gap-6">
                                    <span
                                        className={`${isAdded ? 'text-grey-16' : "text-grey-11"} text-sm font-normal`}>{isPublic ? description : `Last updated ${formattedTime}`}</span>
                                </div>
                            </div>
                        </div>

                        {!isPublic && <div className='flex w-1/2 items-center gap-5 justify-end'>
                            <Button
                                onClick={handleEditEvent}
                                className='flex gap-1.5 items-center group'
                            >
                                <span className='text-grey-16 group-hover:text-grey-18 mt-0.5'> Edit </span>
                                <EditIcon className='text-grey-16 group-hover:text-grey-18' />
                            </Button>
                            <Button
                                onClick={() => {
                                }}
                                className='flex gap-1.5 items-center group'
                            >
                                <CopyIcon className='text-grey-16 group-hover:text-grey-18' />
                            </Button>
                            <Button
                                onClick={handleDeleteEvent}
                                className='flex gap-1.5 items-center group p-2'
                            >
                                <TrashIcon className='text-grey-16 group-hover:text-grey-18' />
                            </Button>
                        </div>}
                    </div>
                    <div className={`flex items-center mt-6 gap-3`}>
                        {!isPublic && <>
                            {customName && <Button
                                className='py-2 px-3 border border-grey-13 rounded-[60px] hover:bg-gradient-pink-4 hover:border-main-pink-5'
                                onClick={() => {
                                }}
                            >{customName}</Button>}
                            <AuthTypeCard className="!px-3 !py-2 !text-white" type={authenticationType ? type : {
                                key: "Empty",
                                value: null,
                                icon: (isActive) => <JwtIcon isActive={isActive} />
                            }} />
                        </>}
                        {isPublic && <Button
                            className={`py-2.5 px-3 ml-10 border border-grey-13 rounded-[10px] ${isAdded ? 'bg-none text-grey-16 cursor-not-allowed' : 'hover:bg-gradient-pink-4 hover:border-main-pink-5'}`}
                            onClick={handleAddToMyApis}
                        >{isAdded ? "API Added" : "Add to my APIs"}</Button>}
                    </div>

                </div>
            </Link>
            {openDeleteModal &&
                <DeleteAuthModal
                    open={openDeleteModal}
                    setOpen={setOpenDeleteModal}
                    handler={handleDelete}
                    apiInfo={card}
                />}
        </div>
    );
};

export default ApiCard;