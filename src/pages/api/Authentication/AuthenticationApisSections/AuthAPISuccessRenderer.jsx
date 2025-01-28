import CustomInput from '@/components/CustomInput';
import { Checkbox } from '@mui/material';
import { ValidationSuccessBox } from '../ValidationStatus';


const AuthAPISuccessRenderer = ({ activeTab, apiTabs, authData }) => {

    const capitalize = (text) => {
        return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
    };

    const renderSuccess = () => {
        return apiTabs?.map(({ name }) => {
            const apiType = name?.toLowerCase()?.replace(' ', '');
            const apiTabType = activeTab?.toLowerCase()?.replace(' ', '');

            if (apiType === apiTabType) {
                switch (apiType) {
                    case 'apikey':
                        return (
                            <div className="w-full flex flex-col gap-6">
                                <CustomInput
                                    label={"API key name"}
                                    variant={"primary"}
                                    defaultValue={authData?.apikey?.keyName || ""}
                                    inputClassName="border-none !p-0 font-normal text-[16px] leading-11 text-custom-ghostWhite"
                                    readOnly
                                />
                            </div>
                        );
                    case 'jwt':
                        return (
                            <div className="w-full flex flex-col gap-6">
                                <CustomInput
                                    label={"Token"}
                                    variant={"primary"}
                                    value="<hidden>"
                                    inputClassName="border-none !p-0 "
                                    readOnly
                                />
                            </div>
                        );
                    case 'oauth':
                        return (
                            <div className="w-full flex flex-col gap-6">
                                <div className='flex gap-2 items-center text-lg font-medium leading-26'>
                                    <Checkbox
                                        inputProps={{ 'aria-label': 'controlled' }}
                                        defaultChecked
                                        readOnly
                                        disabled
                                        checked={true}
                                        sx={{
                                            color: '#E9C2F0',
                                            borderRadius: '4px',
                                            '&.Mui-checked': {
                                                color: '#E9C2F0',
                                            },
                                        }}
                                    />
                                    Baseencode
                                </div>
                                <CustomInput
                                    label={"URL"}
                                    variant={"primary"}
                                    value={authData?.oauth.tokenURL}
                                    inputClassName="border-none !p-0 font-normal text-[16px] leading-11 text-custom-ghostWhite"
                                    readOnly
                                    suffix={<div className="p-2.5 rounded-sm bg-hover-grey-1 shadow-tag text-xs font-medium leading-3 text-custom-ghostWhite">{authData?.oauth?.postOrGet}</div>}
                                />

                                <CustomInput
                                    label={authData?.oauth?.clientIDFieldName || "Client ID"}
                                    variant={"primary"}
                                    value={authData?.oauth.clientID}
                                    inputClassName="border-none !p-0 font-normal text-[16px] leading-11 text-custom-ghostWhite"
                                    readOnly
                                    suffix={
                                        <div className="p-2.5 rounded-sm bg-hover-grey-1 shadow-tag text-xs font-medium leading-3 text-custom-ghostWhite">
                                            {authData?.oauth?.clientIDPlacement && capitalize(authData?.oauth?.clientIDPlacement)}
                                        </div>}
                                />

                                <CustomInput
                                    label={authData?.oauth.clientSecretFieldName || "Client Secret"}
                                    variant={"primary"}
                                    value={"<hidden>"}
                                    inputClassName="border-none !p-0 font-normal text-[16px] leading-11 text-custom-ghostWhite"
                                    readOnly
                                    suffix={
                                        <div className="p-2.5 rounded-sm bg-hover-grey-1 shadow-tag text-xs font-medium leading-3 text-custom-ghostWhite">
                                            {authData?.oauth?.secretPlacement && capitalize(authData?.oauth?.secretPlacement)}
                                        </div>}
                                />

                                <div className='flex flex-col gap-6'>
                                    {authData?.oauth?.customRows?.map((field) => (
                                        <div key={field.id}>
                                            <CustomInput
                                                label={field?.fieldName || 'Insert field name'}
                                                variant="primary"
                                                value={field?.fieldValue || "Add your field value"}
                                                inputClassName="border-none !p-0 font-normal text-[16px] leading-11 text-custom-ghostWhite"
                                                readOnly
                                                suffix={<div className="p-2.5 rounded-sm bg-hover-grey-1 shadow-tag text-xs font-medium leading-3 text-custom-ghostWhite">{field?.bodyOrHeader}</div>}
                                            />
                                        </div>
                                    ))}
                                </div>

                                <div className='mt-2'>
                                    <ValidationSuccessBox />
                                </div>
                            </div>
                        );
                    case 'basic':
                        return (
                            <div className="w-full flex flex-col gap-6">
                                <CustomInput
                                    label={"USERNAME"}
                                    variant={"primary"}
                                    value={authData?.basic?.username}
                                    inputClassName="border-none !p-0 font-normal text-[16px] leading-11 text-custom-ghostWhite"
                                    readOnly
                                />
                            </div>
                        );
                    default:
                        return null;
                }
            }
            return null;
        });
    };

    return (
        <>
            {renderSuccess()}
        </>
    );
};

export default AuthAPISuccessRenderer;
