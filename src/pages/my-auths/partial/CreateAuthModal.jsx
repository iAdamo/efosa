import React, { useContext, useEffect, useState } from 'react';
import { Modal, Box } from '@mui/material';
import CloseIcon from '@assets/icons/close.svg?react';
import { useForm } from 'react-hook-form';
import { authTypes } from '@pages/my-auths/partial/auth-type/auth-types.jsx';
import { AuthTypeCard } from '@pages/my-auths/partial/auth-type/AuthTypeCard.jsx';
import { GeneralContext } from '@contexts/GeneralContext.jsx';
import {errorToast, successToast} from "@components/toasts/toasts.jsx";
import {addMyAuth, postGenericCRUD} from "@axios/apiCalls.js";
import SForm from "@components/SForm.jsx";
import CustomInput from "@components/CustomInput.jsx";
import {CustomSelect} from "@components/CustomSelect.jsx";
import Button from "@components/Button.jsx";

function CreateAuthModal({ open, setOpen }) {
    const { clients, setAuths, auths } = useContext(GeneralContext);
    const [loading, setLoading] = useState(false);

    const [activeType, setActiveType] = useState('APIKEY');
    const [clientId, setClientId] = useState(null);
    const [clientOptions, setClientOptions] = useState([]);
    const [value, setValue] = useState(null);

    const {
        register,
        formState: {errors},
        handleSubmit,
        reset,
    } = useForm({
        mode: "onChange",
    });

    useEffect(() => {
        reset();
        setClientOptions(clients.map(client => ({
            id: client.id,
            label: client.name,
        })));
    }, [open, clients, reset]);

    const handleTypeClick = (type) => {
        setActiveType(type);
        setValue(null);
    };

    const handleAuthClick = async (data) => {
        const apiAuthData = await postGenericCRUD(
            "API_Authentication",
            {
                authType: activeType.replace('_',''),
            },
        );
        setLoading(true);

        const { data: apiResult = [] } = apiAuthData || {};
        const { id, authType } = apiResult?.[0] || {};

        if (id) {
            await addMyAuth(data.name, clientId.id, id)
                .then((data) => {
                    const { data: nestedData = [] } = data || {};
                    if (nestedData[0]) {
                        const newAuth = {
                            ...nestedData[0],
                            api_authentication: {
                                ...nestedData[0]?.api_authentication,
                                authType
                            }
                        }
                        setAuths([newAuth, ...auths])
                        setOpen (false);
                        successToast("Auth created successfully!")
                    }
                })
                .catch(() => {
                    errorToast("Create auth failed")
                })
                .finally(() => {
                    setLoading(false);
                })
            };
        }

    const renderErrors = (errors, field) => {
        switch (errors?.type) {
            case "required":
                return <label className="s-error">{field} field is required.</label>;
            case "maxLength":
                return (
                    <label className="s-error">
                        Please enter a {field} with less than 200 characters.
                    </label>
                );
            case "pattern":
                return (
                    <label className="s-error">The {field} must be a valid email address.</label>
                );
            case "acceptedFormats":
                return (
                    <label className="s-error">Please upload a file in one of the following formats: .jpg, .png,
                        .jpg</label>
                );
            case "lessThan10MB":
                return (
                    <label className="s-error">The file size must not exceed 10MB.</label>
                );
            default:
                return '';
        }
    };
    //
    // const FormComponent = {
    //     APIKEY: APIKeyForm,
    //     JWT: JWTForm,
    //     BASIC: BasicForm,
    //     OAUTH: OAuthForm
    // }[activeType];

    const MuiInputBaseStyles = {
        padding: '2px 11px !important',
    };

    return (
        <Modal
            open={open}
            onClose={() => setOpen(false)}
            className="backdrop-blur-[15px]"
        >
            <div
                className={`w-auto bg-modal-bg-gradient shadow-modal min-w-min lg:min-w-[726px] max-w-[730pxx] py-10 px-6 rounded-lg absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border border-gradient-grey-3`}
            >
                <div className="w-full flex items-center gap-3 mb-[34px]">
                    <div id="modal-title"
                         className={`text-[28px] font-medium leading-larger text-custom-ghostWhite flex-1`}>
                        {'Create new Auth'}
                    </div>
                    <button onClick={() => setOpen(false)}>
                        <CloseIcon className="icon-white w-6 h-6 p-[6px] s-icon-grey-4"/>
                    </button>
                </div>

                <div className="flex gap-3 items-center justify-start py-4">
                    {authTypes.map((type) => (
                        <AuthTypeCard
                            key={type.id}
                            type={type}
                            isActive={activeType === type.value}
                            onClick={() => handleTypeClick(type.value)}
                        />
                    ))}
                </div>

                <SForm onSubmit={handleSubmit(handleAuthClick)}>
                    <div className="flex flex-col gap-6 pt-4 pb-[34px]">
                        {/*<div className="flex flex-col">*/}
                        {/*    <CustomInput*/}
                        {/*        variant="primary"*/}
                        {/*        {...register("authName", {*/}
                        {/*            required: 'The client name field is required',*/}
                        {/*            maxLength: 200,*/}
                        {/*            pattern: /^[a-zA-Z0-9 ]+$/i,*/}
                        {/*        })}*/}
                        {/*        label={"AUTH NAME"}*/}
                        {/*        placeholder="Create a name for this authentication"*/}
                        {/*        disabled={loading}*/}
                        {/*        aria-invalid={errors.authName ? "true" : "false"}*/}
                        {/*    />*/}
                        {/*</div>*/}

                        {/*<div className="flex flex-col">*/}
                        {/*    <CustomInput*/}
                        {/*        variant="primary"*/}
                        {/*        {...register("apiKeyName", {*/}
                        {/*            required: 'The client name field is required',*/}
                        {/*            maxLength: 200,*/}
                        {/*            pattern: /^[a-zA-Z0-9 ]+$/i,*/}
                        {/*        })}*/}
                        {/*        label={"API KEY NAME"}*/}
                        {/*        placeholder="Enter API key name"*/}
                        {/*        disabled={loading}*/}
                        {/*        aria-invalid={errors.apiKeyName ? "true" : "false"}*/}
                        {/*    />*/}
                        {/*</div>*/}

                        <div className="flex flex-col">
                            <CustomInput
                                variant="primary"
                                {...register("name", {
                                    required: 'The client name field is required',
                                    maxLength: 200,
                                    pattern: /^[a-zA-Z0-9 ]+$/i,
                                })}
                                label={"Auth name"}
                                placeholder="Create a name for this authentication"
                                disabled={loading}
                                aria-invalid={errors.authName ? "true" : "false"}
                            />
                            {renderErrors(errors?.name, 'Auth name')}
                        </div>

                        <div className="flex flex-col">
                            <CustomSelect
                                options={clientOptions}
                                value={clientId}
                                onChange={setClientId}
                                inputStyles={{background: "transparent"}}
                                label="SAVE AUTH TO"
                                labelStyles={'text-base font-medium leading-11 text-grey-17 mb-2'}
                                placeholder="Choose client or save to your library"
                                muiInputBaseStyles={MuiInputBaseStyles}
                            />
                        </div>
                    </div>

                    <Button
                        type="submit"
                        variant='primary'
                        // disabled={!loading}
                        className="text-custom-ghostWhite px-3 font-semibold text-lg !shadow-none"
                    >
                        Add new Auth
                    </Button>
                </SForm>

                {/*<div className="flex flex-col gap-8 py-3">*/}
                {/*    {FormComponent && (*/}
                {/*        <FormComponent*/}
                {/*            handleAuthClick={handleAuthClick}*/}
                {/*            clientId={clientId}*/}
                {/*            setClientId={setClientId}*/}
                {/*            clientOptions={clientOptions}*/}
                {/*            value={value}*/}
                {/*            setValue={setValue}*/}
                {/*        />*/}
                {/*    )}*/}
                {/*</div>*/}
            </div>
        </Modal>
    );
}

export default CreateAuthModal;
