import { createProject } from '@/axios/generalApiCalls';
import Button from "@/components/Button";
import CustomInput from "@/components/CustomInput";
import { CustomSelect } from '@/components/CustomSelect';
import SForm from "@/components/SForm";
import CloseIcon from "@assets/icons/close.svg?react";
import TemplatesImage from "@assets/icons/dashboard/sidebar/template-landing.svg?react";
import FilePlusIcon from "@assets/icons/file-plus.svg?react";
import { Box, Modal } from "@mui/material";
import { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { GeneralContext } from "@contexts/GeneralContext.jsx";

function CreateNewProjectModal({ open, setOpen }) {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { clients, setClients } = useContext(GeneralContext);
    const [clientOptions, setClientOptions] = useState([]);
    const [activeButton, setActiveButton] = useState(null);

    const {
        register,
        formState: { errors },
        handleSubmit,
    } = useForm({
        mode: "onChange",
    })

    const renderErrors = (errors) => {
        switch (errors?.type) {
            case "required":
                return <label className="s-error">Specc name is required</label>;
            case "maxLength":
                return (
                    <label className="s-error">
                        Please enter a name with less than 30 characters
                    </label>
                );
            case "pattern":
                return (
                    <label className="s-error">Please remove special characters</label>
                );
            default:
                return <label className="s-label">*Required</label>;
        }
    };

    const createClickFunction = async (data) => {
        const obj = {};
        obj.name = data.projectName;
        //obj.clientId = value.id ?? null;
        setLoading(true);
        const createdProject = await createProject(obj);

        /*
        setClients(clients.map(item => {
            if (item.id === createdProject?.data[0]?.clientId) {
                return {
                    ...item,
                    projects_count: item.projects_count + 1
                };
            }
            return item;
        }));
        */

        setLoading(false);

        if (createdProject.httpcode === 400) {
            return errorToast(
                "Create project failed",
                createdProject.message,
                null,
                false,
            );
        }
        if (createdProject?.data[0]) {
            navigate(`/project/${createdProject.data[0].id}/settings`);
        }
    };

    const [value, setValue] = useState(null);

    /*const options = [
        { label: "Item 1", id: 1 },
        { label: "Item 2", id: 2 },
        { label: "Item 3", id: 3 },
    ];*/

    useEffect(() => {
        setClientOptions(clients?.map(client => {
            return {
                id: client.id,
                label: client.name
            }
        }))
        console.log(clients)
    }, []);

    const handleClick = (buttonId) => {
        setActiveButton(prev => prev === buttonId ? null : buttonId);
    };

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
                <div className={`w-auto bg-modal-bg-gradient shadow-modal max-w-[635px] py-10 px-6 rounded-lg absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border border-gradient-grey-3`}>
                    <div className="w-full flex items-center gap-3">
                        <div id="modal-title" className={`text-[28px] font-medium leading-larger text-custom-ghostWhite flex-1`}>
                            {'Create new project'}
                        </div>
                        <button onClick={() => setOpen(false)}>
                            <CloseIcon className="icon-white w-6 h-6 p-[6px] s-icon-grey-4" />
                        </button>
                    </div>
                    <div className={`font-normal text-base text-grey-17 pr-6 mt-3`}>
                        Kick off your projects, no matter how big or small! You can start fresh with a blank slate or pick one of our handy templates to speed up your workflow.
                    </div>

                    <SForm onSubmit={handleSubmit(createClickFunction)} >
                        <div className="my-[34px] flex flex-col gap-[34px]">
                            <div className="w-full flex gap-[10px]">
                                <Button
                                    className={`group flex items-center justify-center flex-1 h-16 rounded-lg hover:bg-start-new-project-button-gradient hover:border hover:border-[#e6719d]
                                        ${activeButton === 'startProject' ? 'bg-start-new-project-button-gradient border border-[#e6719d]'
                                            : 'bg-modal-buttons-gradient border border-transparent text-grey-17'}`}
                                    onClick={() => handleClick('startProject')}
                                >
                                    <div className="group flex flex-col justify-center items-center gap-[10px] group-hover:text-custom-ghostWhite">
                                        <FilePlusIcon className={`${activeButton === 'startProject' ? 'icon-pink-5' : ''} hover-icon-pink-5`} />
                                        Start a new project
                                    </div>
                                </Button>

                                <Button
                                    className={`group flex items-center justify-center flex-1 h-16 rounded-lg hover:bg-choose-from-template-button-gradient hover:border hover:border-[#8662E3]
                                         ${activeButton === 'chooseTemplate' ? 'bg-choose-from-template-button-gradient border border-[#8662E3]'
                                            : 'bg-modal-buttons-gradient border border-transparent text-grey-17'}`}
                                    onClick={() => handleClick('chooseTemplate')}
                                >
                                    <div className="flex flex-col justify-center items-center gap-[10px] group-hover:text-custom-ghostWhite">
                                        <TemplatesImage className={`${activeButton === 'chooseTemplate' ? 'icon-blue-1' : 'icon-grey-6'} hover-icon-blue-1`} />
                                        Choose from Template
                                    </div>
                                </Button>
                            </div>

                            <div className="flex flex-col">
                                <CustomInput
                                    variant="primary"
                                    {...register("projectName", {
                                        required: true,
                                        maxLength: 30,
                                        pattern: /^[a-zA-Z0-9 ]+$/i,
                                    })}
                                    inputClassName={'py-0 h-12 flex items-center text-16'}
                                    label={"PROJECT NAME"}
                                    placeholder="Add a name for your project"
                                    disabled={loading}
                                    aria-invalid={errors.projectName ? "true" : "false"}
                                />
                                {renderErrors(errors?.projectName)}
                                <div className="mt-6">
                                    <CustomSelect
                                        options={clientOptions}
                                        value={value}
                                        onChange={setValue}
                                        addable
                                        withAutoComplete={false}
                                        placeholder="Choose client workspace"
                                        inputStyles={{ background: "transparent" }}
                                        label="THIS PROJECT BELONGS TO.."
                                        labelStyles={'text-base font-medium leading-11 text-grey-17 mb-2'}
                                        muiInputBaseStyles={MuiInputBaseStyles}
                                    />
                                </div>
                            </div>
                        </div>
                        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                            <Button disableClassName='h-10 flex items-center justify-center border border-grey-13 rounded-containers px-2 text-gradient-grey-5 font-semibold text-lg !shadow-none' type="submit" variant='primary' className="text-custom-ghostWhite font-semibold text-lg !shadow-none" >Create Project</Button>
                        </Box>
                    </SForm >
                </div>
            </Modal>
        </div>
    )
}

export default CreateNewProjectModal