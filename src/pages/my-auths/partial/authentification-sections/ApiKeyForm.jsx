import React from 'react';
import CustomInput from '@/components/CustomInput';
import Button from '@/components/Button';
import {CustomSelect} from "@components/CustomSelect.jsx";

function APIKeyForm({ handleAuthClick, clientId, setClientId, value, setValue, clientOptions, MuiInputBaseStyles }) {
    const handleChange = (field) => (e) => {
        setValue({ ...value, [field]: e.target.value });
    };

    return (
        <>
            <div className='flex flex-col gap-6'>
                <CustomInput
                    label="AUTH NAME"
                    variant="primary"
                    placeholder="Create a name for this authentication"
                    onChange={handleChange('name')}
                />
                <CustomInput
                    label="API KEY NAME"
                    variant="primary"
                    placeholder="Enter API key name"
                    onChange={handleChange('keyName')}
                />
                <CustomInput
                    label="API KEY VALUE"
                    variant="primary"
                    placeholder="Enter API key value"
                    onChange={handleChange('keyValue')}
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
                <Button variant='primary' onClick={handleAuthClick} className="text-custom-ghostWhite px-3 font-semibold text-lg">
                    Add new Auth
                </Button>
            </div>
        </>
    );
}

export default APIKeyForm;
