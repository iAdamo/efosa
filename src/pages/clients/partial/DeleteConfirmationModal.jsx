import {updateClient, deleteClient} from '@/axios/generalApiCalls';
import Button from "@/components/Button";
import CustomInput from "@/components/CustomInput";
import SForm from "@/components/SForm";
import CloseIcon from "@assets/icons/close.svg?react";
import {Box, Modal, Stack} from "@mui/material";
import {useContext, useEffect, useState} from 'react';
import {useForm} from 'react-hook-form';
import {useNavigate} from 'react-router-dom';
import UploadIcon from "@assets/icons/upload-rounded.svg?react";
import {errorToast, successToast} from "@components/toasts/toasts.jsx";
import DeleteButton from "@pages/clients/partial/DeleteButton.jsx";
import {GeneralContext} from "@contexts/GeneralContext.jsx";

function DeleteConfirmationModal({open, setOpen, handler}) {
    return (
        <div>
            <Modal
                open={open}
                onClose={() => setOpen(false)}
                className="backdrop-blur-[15px]"
            >
                <div
                    className={`w-auto bg-modal-bg-gradient shadow-modal min-w-min lg:min-w-[635px] max-w-[635px] py-10 px-6 rounded-lg absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border border-gradient-grey-3`}>
                    <div className="w-full flex items-center gap-3">
                        <div id="modal-title"
                             className={`text-[28px] font-medium leading-larger text-custom-ghostWhite flex-1`}>
                            Delete client
                        </div>
                        <button onClick={() => setOpen(false)}>
                            <CloseIcon className="icon-white w-6 h-6 p-[6px] s-icon-grey-4"/>
                        </button>
                    </div>

                    <div className="my-[34px] flex flex-col gap-[34px]">
                        This action will delete all the client information and saved authentications under this client,
                        are you sure you want to permanently delete all information?
                    </div>
                    <Stack direction="row" justifyContent={"space-between"}>
                        <Stack direction="row" spacing={1}>
                            <Box sx={{display: "flex", justifyContent: "space-between"}}>
                                <Button
                                    onClick={handler}
                                    type="button"
                                    variant='primary'
                                    className="text-custom-ghostWhite font-semibold text-lg !shadow-none py-[12px] px-[34px]"
                                >
                                    Delete
                                </Button>
                            </Box>
                            <Box sx={{display: "flex", justifyContent: "space-between"}}>
                                <Button
                                    onClick={() => setOpen(false)}
                                    className="text-custom-ghostWhite font-semibold text-lg !shadow-none bg-transparent border-[#454C54] border-[1px] rounded-[10px] py-[12px] px-[34px]"
                                >
                                    Cancel
                                </Button>
                            </Box>
                        </Stack>
                    </Stack>
                </div>
            </Modal>
        </div>
    )
}

export default DeleteConfirmationModal