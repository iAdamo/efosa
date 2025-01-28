import {Box, Modal, Stack} from "@mui/material";
import Button from "@/components/Button";
import CloseIcon from "@assets/icons/close.svg?react";
import WarningIcon from "@assets/icons/warning-default.svg?react";

function DeleteAuthModal({open, setOpen, handler, apiInfo}) {
    const {API = {}} = apiInfo
    const hasProject = !!apiInfo.projects_count

    return (
        <div>
            <Modal
                open={open}
                onClose={() => setOpen(false)}
                className="backdrop-blur-[15px]"
            >
                <div
                    className={`w-auto border bg-modal-bg-gradient shadow-modal min-w-min lg:min-w-[635px] max-w-[635px] py-10 px-6 rounded-lg absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${
                        hasProject
                            ? "border-[#DBBF7E]"
                            : "border-gradient-grey-3"
                    }`}
                >
                    <div className="w-full flex items-center gap-3">
                        <div id="modal-title"
                             className={`text-[28px] font-medium leading-larger text-custom-ghostWhite flex-1`}>
                            Delete {`${API.name}`}?
                        </div>
                        <button onClick={() => setOpen(false)}>
                            <CloseIcon className="icon-white w-6 h-6 p-[6px] s-icon-grey-4"/>
                        </button>
                    </div>

                    <div className="my-[34px] text-gradient-grey-10 text-xs	font-normal flex gap-3 items-center">
                        {hasProject && <WarningIcon />}
                        {hasProject ? `This API is used in ${apiInfo.projects_count} projects, are you sure you want to remove it from your saved APIs?` : `Are you sure you want to remove it from your saved APIs?`}
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

export default DeleteAuthModal