import { postGenericCRUDWithID } from "@/axios/apiCalls";
import Button from "@/components/Button";
import CustomInput from '@/components/CustomInput';
import { CustomSelect } from '@/components/CustomSelect';
import React from "react";

function JWTForm({ value, setValue, clientOptions, clientId, setClientId, MuiInputBaseStyles, handleAuthClick, authData }) {
    const handleChange = (field) => (e) => {
        setValue({ ...value, [field]: e.target.value });
    };

    return (
        <>
            {/* TODO: UI design implemented as per new figma */}
            {/* <CustomSelect
                options={options}
                value={value}
                onChange={setValue}
                addable
                withAutoComplete={false}
                placeholder="Choose from saved JWT token"
                inputStyles={{ background: "transparent" }}
                labelStyles={'text-base font-medium leading-11 text-grey-17 mb-2'}
                muiInputBaseStyles={MuiInputBaseStyles}
            /> */}


            <div className='flex flex-col gap-6'>
                <CustomInput
                    label="AUTH NAME"
                    variant="primary"
                    placeholder="Create a name for this authentication"
                    onChange={handleChange('name')}
                />

                <CustomInput
                    label={"TOKEN"}
                    variant={"primary"}
                    placeholder={"Insert JWT token"}
                    // onBlur={async (e) => {
                    //     await postGenericCRUDWithID(
                    //         "Authentication_JWT",
                    //         authData?.jwt?.id,
                    //         {
                    //             secret: e.target.value,
                    //         },
                    //     );
                    // }}
                    onChange={handleChange('secret')}
                />

                <CustomSelect
                    options={clientOptions}
                    value={clientId}
                    onChange={setClientId}
                    inputStyles={{background: "transparent"}}
                    label="SAVE AUTH TO"
                    labelStyles={'text-base font-medium leading-11 text-grey-17'}
                    placeholder="Choose client or save to your library"
                    muiInputBaseStyles={MuiInputBaseStyles}
                />
            </div>

            <div className='flex gap-3'>
                <Button
                    variant='primary'
                    onClick={handleAuthClick}
                    className="text-custom-ghostWhite px-3 font-semibold text-lg !shadow-none"
                >
                    Add new Auth
                </Button>
            </div>
        </>
    )
}

export default JWTForm