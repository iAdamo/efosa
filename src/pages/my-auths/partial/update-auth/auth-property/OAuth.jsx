import React, {useState} from "react";
import {SCheckbox} from "@components/SCheckbox.jsx";
import Button from "@components/Button.jsx";
import CustomInput from "@components/CustomInput.jsx";
import {CustomSelect} from "@components/CustomSelect.jsx";
import SForm from "@components/SForm.jsx";
import {useForm} from "react-hook-form";
import CopyIcon from "@assets/icons/copy-icon-2.svg";

const OAuth = () => {
    const [value, setValue] = useState(null);

    const {
        register,
        formState: {errors},
        handleSubmit,
        reset,
    } = useForm({
        mode: "onChange",
    });


    const createClickFunction = (data) => {
        console.log(data)
    };

    return (
        <div className="py-2 flex flex-col gap-7">
            <SCheckbox className="s-checkbox-pink-6">
                <span className="label-large flex gap-x-1">
                    <span className="text-custom-ghostWhite">Baseencode</span>
                </span>
            </SCheckbox>

            <div className="flex flex-col gap-6">
                <SForm onSubmit={handleSubmit(createClickFunction)}>
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col">
                            <CustomInput
                                variant="primary"
                                {...register("authName", {
                                    required: 'The client name field is required',
                                    maxLength: 200,
                                    pattern: /^[a-zA-Z0-9 ]+$/i,
                                })}
                                label={"URL"}
                                placeholder="Add url"
                                aria-invalid={errors.authName ? "true" : "false"}
                            />
                        </div>

                        <div className="flex flex-col">
                            <CustomInput
                                variant="primary"
                                {...register("authName", {
                                    required: 'The client name field is required',
                                    maxLength: 200,
                                    pattern: /^[a-zA-Z0-9 ]+$/i,
                                })}
                                label={"URL"}
                                placeholder="Add url"
                                aria-invalid={errors.authName ? "true" : "false"}
                            />
                        </div>

                        <div className="flex flex-col">
                            <CustomInput
                                variant="primary"
                                {...register("authName", {
                                    required: 'The client name field is required',
                                    maxLength: 200,
                                    pattern: /^[a-zA-Z0-9 ]+$/i,
                                })}
                                label={"URL"}
                                placeholder="Add url"
                                aria-invalid={errors.authName ? "true" : "false"}
                            />
                        </div>

                        <Button
                            variant="text"
                            onClick={() => copyLink()}
                            className="flex items-center gap-1.5"
                        >
                            <CopyIcon className="text-grey-16"/>
                            <span className="text-white"></span>
                        </Button>
                    </div>

                    <Button
                        type="submit"
                        variant='primary'
                        className="text-custom-ghostWhite px-3 font-semibold text-lg !shadow-none"
                    >
                        Add new Auth
                    </Button>
                </SForm>
            </div>

            <div className="flex gap-3 items-center">
                <Button
                    type="submit"
                    variant='custom'
                    className="text-custom-ghostWhite font-semibold !shadow-none"
                >
                    Save
                </Button>

                <Button
                    onClick={() => {
                    }}
                    className="text-custom-ghostWhite font-semibold text-lg bg-transparent border-[#454C54] border-[1px] rounded-containers py-3 px-6"
                >
                    Cancel
                </Button>
            </div>
        </div>
    )
}

export default OAuth;