import React, {useContext, useEffect, useState} from 'react';
import Button from "@components/Button.jsx";
import CustomInput from "@components/CustomInput.jsx";
import SForm from "@components/SForm.jsx";
import CloseIcon from "@assets/icons/close.svg?react";
import {Box, Modal, Stack} from "@mui/material";
import {useForm} from 'react-hook-form';
import {CustomSelect} from "@components/CustomSelect.jsx";
import DeleteButton from "@pages/my-auths/partial/DeleteButton.jsx";
import {errorToast, successToast} from "@components/toasts/toasts.jsx";
import {GeneralContext} from "@contexts/GeneralContext.jsx";
import {updateMyAuth} from "@axios/apiCalls.js";

function EditAuthModal({open, setOpen, auth, handleDelete, toHomeOnchange = true}) {
    const { auths, setAuths } = useContext(GeneralContext);
    const [loading, setLoading] = useState(false);
    const [value, setValue] = useState(null);

    const {
        register,
        formState: {errors},
        handleSubmit,
        reset,
    } = useForm({
        mode: "onChange",
        defaultValues: {
            name: auth.name,
        }
    });

    useEffect(() => {
        reset();
    }, [open]);

    const updateClickFunction = async (data) => {
        let formData = new FormData();
        formData.append('name', data.name);
        setLoading(true);

        await updateMyAuth(formData, auth.id)
            .then((data) => {
                console.log({data})
                setAuths(auths.map(item => item.id === data.data?.id ? data.data : item))
                setOpen(false);
                successToast("Authentication name updated!");
            })
            .catch(() => {
                errorToast("Update auth failed")
            })
            .finally(() => {
                setLoading(false);
            })
    };

    const options = [
        { label: "Item 1", id: 1 },
        { label: "Item 2", id: 2 },
        { label: "Item 3", id: 3 },
    ];

    const MuiInputBaseStyles = {
        padding: '2px 11px !important',
    };

    return (
        <div>
            <Modal
                open={open}
                onClose={() => setOpen(false)}
                className="backdrop-blur-[15px]"
            >
                <div
                    className={`w-auto bg-modal-bg-gradient shadow-modal min-w-min lg:min-w-[730px] max-w-[730flex flex-colpx] py-10 px-6 rounded-lg absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border border-gradient-grey-3`}>
                    <div className="w-full flex items-center gap-3 mb-[34px]">
                        <div id="modal-title"
                             className={`text-[28px] font-medium leading-larger text-custom-ghostWhite flex-1`}>
                            {'Edit Auth information'}
                        </div>
                        <button onClick={() => setOpen(false)}>
                            <CloseIcon className="icon-white w-6 h-6 p-[6px] s-icon-grey-4"/>
                        </button>
                    </div>

                    <SForm onSubmit={handleSubmit(updateClickFunction)}>
                        <div className="flex flex-col gap-6 pt-4 pb-[34px]">
                            <div className="flex flex-col pb-4">
                                <CustomInput
                                    variant="primary"
                                    {...register("name", {
                                        required: 'The client name field is required',
                                        maxLength: 200,
                                        pattern: /^[a-zA-Z0-9 ]+$/i,
                                    })}
                                    label={"AUTH NAME"}
                                    placeholder="Create a name for this authentication"
                                    disabled={loading}
                                    aria-invalid={errors.authName ? "true" : "false"}
                                />
                            </div>

                            <div className="flex flex-col pb-4">
                                <CustomSelect
                                    options={options}
                                    value={value}
                                    onChange={setValue}
                                    addable
                                    withAutoComplete={false}
                                    placeholder="Choose client or save to your library"
                                    inputStyles={{background: "transparent"}}
                                    label="SAVE AUTH TO"
                                    labelStyles={'text-base font-medium leading-11 text-grey-17 mb-2'}
                                    muiInputBaseStyles={MuiInputBaseStyles}
                                />

                            </div>
                        </div>
                        <Stack direction="row" justifyContent={"space-between"}>
                            <Stack direction="row" spacing={1}>
                                <Box sx={{display: "flex", justifyContent: "space-between"}}>
                                    <Button
                                        type="submit"
                                        variant='primary'
                                        className="text-custom-ghostWhite font-semibold text-lg !shadow-none py-[12px] px-[34px]"
                                    >
                                        Save
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
                            <DeleteButton handler={handleDelete}/>
                        </Stack>
                    </SForm>
                </div>
            </Modal>
        </div>
    )
}

export default EditAuthModal