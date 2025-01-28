import { postGenericCRUDWithID } from '@/axios/apiCalls'
import Button from '@/components/Button'
import CustomInput from '@/components/CustomInput'
import { CustomSelect } from '@/components/CustomSelect'
import React from 'react'

function BasicForm({ value, setValue, clientId, setClientId, clientOptions, MuiInputBaseStyles, handleAuthClick, authData }) {
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
                placeholder="Choose from saved Basic"
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
                    label={"USERNAME"}
                    variant={"primary"}
                    placeholder={"Enter username"}
                    // defaultValue={authData?.basic?.username}
                    // onBlur={async (e) => {
                    //     await postGenericCRUDWithID(
                    //         "Authentication_Basic",
                    //         authData?.basic?.id,
                    //         {
                    //             username: e.target.value,
                    //         },
                    //     );
                    // }}
                    onChange={handleChange('username')}
                />

                <CustomInput
                    label={"PASSWORD"}
                    variant={"primary"}
                    placeholder={"Enter password"}
                    type={"password"}
                    // onBlur={async (e) => {
                    //     await postGenericCRUDWithID(
                    //         "Authentication_Basic",
                    //         authData?.basic?.id,
                    //         {
                    //             password: e.target.value,
                    //         },
                    //     );
                    // }}
                    onChange={handleChange('password')}
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

export default BasicForm