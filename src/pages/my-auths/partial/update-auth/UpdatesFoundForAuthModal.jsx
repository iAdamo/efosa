import Button from "@components/Button.jsx";
import CloseIcon from "@assets/icons/close.svg?react";
import {Box, Modal, Stack} from "@mui/material";
import WarningIcon from "@assets/icons/warning-default.svg?react";

function UpdatesFoundForAuthModal({open, setOpen, handler}) {
    return (
        <div>
            <Modal
                open={open}
                onClose={() => setOpen(false)}
                className="backdrop-blur-[15px]"
            >
                <div
                    className={`w-auto bg-modal-bg-gradient shadow-modal min-w-min lg:min-w-[635px] max-w-[635px] py-10 px-6 rounded-lg absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border border-[#DBBF7E]`}>
                    <div className="w-full flex items-center gap-3">
                        <div id="modal-title"
                             className={`text-[28px] font-medium leading-larger text-custom-ghostWhite flex-1`}>
                            Updates found for Auth
                        </div>
                        <button onClick={() => setOpen(false)}>
                            <CloseIcon className="icon-white w-6 h-6 p-[6px] s-icon-grey-4"/>
                        </button>
                    </div>

                    <div className="my-[34px] flex items-center gap-3">
                        <WarningIcon />
                        <span className="text-[#F8F9FA99] text-xs font-semibold">
                            Since this Auth is used in 12 Speccs making changes can result in unexpected errors and stop those projects - please confirm if you would like to go ahead with the updates
                        </span>
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
                                    Yes update my auth
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

export default UpdatesFoundForAuthModal