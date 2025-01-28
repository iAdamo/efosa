import Button from "@/components/Button";
import CloseIcon from "@assets/icons/close.svg?react";
import {Box, Modal, Stack} from "@mui/material";

function DeleteAuthModal({open, setOpen, handleDelete}) {
    return (
        <div>
            <Modal
                open={open}
                onClose={() => setOpen(false)}
                className="backdrop-blur-[15px]"
            >
                <div
                    className={`w-auto bg-modal-bg-gradient shadow-modal min-w-min lg:min-w-[635px] max-w-[635px] py-10 px-6 rounded-lg absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border border-gradient-grey-3`}>
                    <div className="flex flex-col gap-8">
                        <div className="w-full flex items-center gap-3">
                            <div id="modal-title"
                                 className={`text-[28px] font-medium leading-larger text-custom-ghostWhite flex-1`}>
                                Delete Auth?
                            </div>
                            <button onClick={() => setOpen(false)}>
                                <CloseIcon className="icon-white w-6 h-6 p-[6px] s-icon-grey-4"/>
                            </button>
                        </div>

                        <span className="text-xs text-[#F8F9FA99] font-normal">
                            This action will delete all the information related to this Auth, are you sure you want to delete?
                        </span>
                        <Stack direction="row" justifyContent={"space-between"}>
                            <Stack direction="row" spacing={1}>
                                <Box sx={{display: "flex", justifyContent: "space-between"}}>
                                    <Button
                                        onClick={handleDelete}
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
                </div>
            </Modal>
        </div>
    )
}

export default DeleteAuthModal