import { postGenericCRUD, postGenericCRUDWithID } from '@/axios/apiCalls'
import Button from '@/components/Button'
import CustomInput from '@/components/CustomInput'
import ToggleButtonGroupCustom from '@/components/CustomToggleButtonGroup'
import useOutsideClickHandler from '@/hooks/useOutsideHandler'
import PlusSquareIcon from '@assets/icons/plus-square.svg?react'
import { Checkbox } from '@mui/material'
import { useRef, useState } from 'react'

function OAuthForm({ handleAuthClick, authData, setAuthData }) {
    const [alignment, setAlignment] = useState({
        "url": "post",
        "clientId": "header",
        "clientSecret": "header"
    });
    const [showSearch, setShowSearch] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedValue, setSelectedValue] = useState({ label: "", value: "" });
    const [auths, setAuths] = useState([
        { name: 'Stripe OAuth', type: 'Stripe OAuth' },
        { name: 'Shopify OAuth', type: 'Shopify OAuth' },
        { name: 'Square', type: 'Square' },
        { name: 'PayPal', type: 'PayPal' },
    ]);

    const blockRef = useRef(null);
    useOutsideClickHandler(blockRef, () => {
        setShowSearch(prev => prev ? false : prev);
    });

    const handleChange = async (event, newAlignment, name, fieldId, index) => {

        
        const updatedAlignment = newAlignment ?? alignment?.[name];

        if (name === "url") {
            setAlignment((prev) => ({ ...prev, [name]: updatedAlignment }));
            try {
                await postGenericCRUDWithID(
                    "Authentication_OAuth",
                    authData?.oauth?.id,
                    {
                        postOrGet: updatedAlignment?.toUpperCase(),
                    },
                );

                setAuthData((prev) => ({
                    ...prev,
                    oauth: {
                        ...prev.oauth,
                        postOrGet: updatedAlignment?.toUpperCase(),
                    },
                }));
            } catch (error) {
                console.error(error);
            }
        }

        if (name === "clientId") {
            setAlignment((prev) => ({ ...prev, [name]: updatedAlignment }));
            try {
                await postGenericCRUDWithID(
                    "Authentication_OAuth",
                    authData?.oauth?.id,
                    {
                        clientIDPlacement: updatedAlignment?.toUpperCase(),
                    },
                );

                setAuthData((prev) => ({
                    ...prev,
                    oauth: {
                        ...prev.oauth,
                        clientIDPlacement: updatedAlignment?.toUpperCase(),
                    },
                }));
            } catch (error) {
                console.error(error);
            }
        }

        if (name === "clientSecret") {
            setAlignment((prev) => ({ ...prev, [name]: updatedAlignment }));
            await postGenericCRUDWithID(
                "Authentication_OAuth",
                authData?.oauth?.id,
                {
                    secretPlacement: updatedAlignment?.toUpperCase(),
                },
            );

            setAuthData((prev) => ({
                ...prev,
                oauth: {
                    ...prev.oauth,
                    secretPlacement: updatedAlignment?.toUpperCase(),
                },
            }));
        }

        if (name === `customField-${fieldId}`) {
            setAlignment((prev) => ({ ...prev, [name]: updatedAlignment }));
            await postGenericCRUDWithID(
                "Authentication_OAuth_Custom",
                authData?.oauth?.customRows?.[index].id,
                {
                    bodyOrHeader: updatedAlignment?.toUpperCase(),
                },
            );

            setAuthData((prev) => {
                const updatedCustomRows = [...prev.oauth.customRows]; // Create a shallow copy of the customRows array
                updatedCustomRows[index] = { ...updatedCustomRows[index], bodyOrHeader: updatedAlignment?.toUpperCase() }; // Modify the specific custom row
    
                return {
                    ...prev,
                    oauth: {
                        ...prev.oauth,
                        customRows: updatedCustomRows, // Replace the customRows with the updated one
                    },
                };
            });
        }
    };

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const filteredAuths = auths.filter((auth) =>
        auth.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    function handleSetValueofSelect(auth) {
        setSelectedValue({ label: auth.name, value: auth.value });
        setShowSearch(false);
    }

    const customButtonStyles = {
        color: '#DEE2E6',
        height: '32px',
        '&.Mui-selected': {
            border: '1px solid #424A524D !important',
            background: 'linear-gradient(24.77deg, #343A40 26.75%, rgba(52, 58, 64, 0) 126.94%)',
            backdropFilter: 'blur(8px)',
        },
    };


    const addField = async () => {
        const newCustomRow = await postGenericCRUD(
            "Authentication_OAuth_Custom",
            {
                authenticationOAuthID: authData?.oauth?.id,
            },
        );
        setAuthData({
            ...authData,
            oauth: {
                ...authData.oauth,
                customRows: [...authData?.oauth?.customRows, newCustomRow?.data[0]],
            },
        });
    }


    return (
        <>
            <div className='relative' ref={blockRef}>
                {/* TODO: UI design implemented as per new figma */}
                {/* <CustomInput
                    label={"URL"}
                    variant={"primary"}
                    placeholder={"Choose from saved OAuth"}
                    inputClassName={`${selectedValue?.label === "" ? "" : "!bg-grey-13 border-transparent"} text-[16px] font-normal leading-11 cursor-pointer caret-transparent`}
                    suffix={
                        selectedValue?.label === "" ?
                            <span>
                                {!showSearch ? <KeyboardArrowUp className='text-grey-13' /> : <KeyboardArrowDown className='text-grey-13' />}
                            </span>
                            :
                            <Remove className='cursor-pointer' onClick={() => setSelectedValue({ label: "", value: "" })} />
                    }
                    value={selectedValue.label}
                    onClick={(e) => {
                        setShowSearch((prev) => !prev);
                    }}
                    readonly
                />

                {showSearch && <div className='z-50 rounded-lg border border-grey-12 absolute w-full mt-2 flex flex-col gap-2.5 p-4 bg-inner-select-gradient shadow-inner-select backdrop-blur-3xl'>
                    <ToggleButtonGroupCustom
                        alignment={alignment}
                        handleChange={handleChange}
                        options={[
                            { value: 'my-auths', label: 'MyAuths' },
                            { value: 'client-auths', label: 'Client Auths' },
                        ]}
                        buttonStyles={customButtonStyles}
                    />

                    <CustomInput
                        variant="searchBox"
                        className="w-full"
                        inputClassName="w-full"
                        placeholder="Search"
                        value={searchTerm}
                        onChange={handleSearch}
                    />

                    <div className='flex flex-col gap-1'>
                        {filteredAuths.map((auth, index) => (
                            <span
                                key={index}
                                className="flex justify-between items-center h-9 text-[16px] text-grey-20 font-normal leading-11 px-2 py-3 text-grey-20 rounded-md hover:bg-hover-grey-1 hover:text-custom-ghostWhite cursor-pointer group"
                                onClick={() => handleSetValueofSelect(auth)}
                            >
                                {auth.name}
                                <Add className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                            </span>
                        ))}
                    </div>
                </div>} */}
            </div>

            <div className='flex flex-col gap-6'>
                <CustomInput
                    label={"AUTH NAME"}
                    variant={"primary"}
                    placeholder={"Create a name for this authentication"}
                    onChange={(e) =>
                        setValue({ ...value, name: e.target.value })
                    }
                    // onBlur={async (e) => {
                    //     await postGenericCRUDWithID(
                    //         "Authentication_API_Key",
                    //         authData?.apikey?.id,
                    //         {
                    //             name: e.target.value,
                    //         },
                    //     );
                    // }}
                    // defaultValue={authData?.apikey?.keyName}
                />

                <div className='flex gap-2 items-center text-lg font-medium leading-26'>
                    <Checkbox
                        inputProps={{'aria-label': 'controlled'}}
                        defaultChecked
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
                    placeholder={"Add url"}
                    endLabelClassName="underline"
                    defaultValue={authData?.oauth?.tokenURL}
                    suffix={
                        <ToggleButtonGroupCustom
                            name="url"
                            alignment={authData?.oauth?.postOrGet?.toLowerCase() || alignment?.["url"]}
                            handleChange={handleChange}
                            options={[
                                {value: 'get', label: 'GET'},
                                {value: 'post', label: 'POST'},
                            ]}
                            buttonStyles={{height: '32px'}}
                        />
                    }
                    onBlur={async (e) => {
                        await postGenericCRUDWithID(
                            "Authentication_OAuth",
                            authData?.oauth?.id,
                            {
                                tokenURL: e.target.value,
                            },
                        );
                    }}
                />

                <div>
                    {/*<CustomOAuthLabel*/}
                    {/*    label={authData?.oauth?.clientIDFieldName || 'CLIENT ID'}*/}
                    {/*    endLabel={"Edit label"}*/}
                    {/*    field={authData?.oauth}*/}
                    {/*    apiName={"clientIDFieldName"}*/}
                    {/*    setAuthData={setAuthData}*/}
                    {/*    isCustom={false}*/}
                    {/*/>*/}

                    <CustomInput
                        variant={"primary"}
                        placeholder={"Client ID"}
                        endLabelClassName="underline"
                        defaultValue={authData?.oauth?.clientID}
                        suffix={
                            <ToggleButtonGroupCustom
                                name={"clientId"}
                                alignment={authData?.oauth?.clientIDPlacement?.toLowerCase() || alignment?.["clientId"]}
                                handleChange={handleChange}
                                options={[
                                    {value: 'body', label: 'Body'},
                                    {value: 'header', label: 'Header'},
                                ]}
                                buttonStyles={{height: '32px'}}
                            />
                        }
                        onBlur={async (e) => {
                            await postGenericCRUDWithID(
                                "Authentication_OAuth",
                                authData?.oauth?.id,
                                {
                                    clientID: e.target.value,
                                },
                            );
                        }}
                    />
                </div>

                <div>
                    {/*<CustomOAuthLabel*/}
                    {/*    label={authData?.oauth.clientSecretFieldName || 'CLIENT SECRET'}*/}
                    {/*    endLabel={"Edit label"}*/}
                    {/*    field={authData?.oauth}*/}
                    {/*    apiName={"clientSecretFieldName"}*/}
                    {/*    setAuthData={setAuthData}*/}
                    {/*    isCustom={false}*/}
                    {/*/>*/}
                    <CustomInput
                        variant={"primary"}
                        placeholder={"Client Secret"}
                        endLabelClassName="underline"
                        suffix={
                            <ToggleButtonGroupCustom
                                name={"clientSecret"}
                                alignment={authData?.oauth?.secretPlacement?.toLowerCase() || alignment?.["clientSecret"]}
                                handleChange={handleChange}
                                options={[
                                    {id: 1, value: 'body', label: 'Body'},
                                    {id: 2, value: 'header', label: 'Header'},
                                ]}
                                buttonStyles={{height: '32px'}}
                            />
                        }
                        onBlur={async (e) => {
                            await postGenericCRUDWithID(
                                "Authentication_OAuth",
                                authData?.oauth?.id,
                                {
                                    clientSecret: e.target.value,
                                },
                            );
                        }}
                    />
                </div>

                <div className='flex flex-col gap-6'>
                    {authData?.oauth?.customRows?.map((field, index) => (
                        <div key={field.id}>
                            {/*<CustomOAuthLabel*/}
                            {/*    label={'Insert field name'}*/}
                            {/*    endLabel="Edit label"*/}
                            {/*    field={field}*/}
                            {/*    setAuthData={setAuthData}*/}
                            {/*    index={index}*/}
                            {/*    isCustom={true}*/}
                            {/*/>*/}
                            <CustomInput
                                variant="primary"
                                placeholder={'Add your field value'}
                                value={field.value}
                                suffix={
                                    <ToggleButtonGroupCustom
                                        name={`customField-${field.id}`}
                                        alignment={authData?.oauth?.customRows[index]?.bodyOrHeader?.toLowerCase() || alignment?.[`customField-${field?.id}`]}
                                        handleChange={(event, newAlignment) =>
                                            handleChange(event, newAlignment, `customField-${field?.id}`, field?.id, index)}
                                        options={[
                                            {id: 1, value: 'body', label: 'Body'},
                                            {id: 2, value: 'header', label: 'Header'},
                                        ]}
                                        buttonStyles={{height: '32px'}}
                                    />
                                }
                                onBlur={async (e) => {
                                    await postGenericCRUDWithID(
                                        "Authentication_OAuth_Custom",
                                        field?.id,
                                        {
                                            fieldValue: e.target.value,
                                        },
                                    );
                                }}
                                defaultValue={field?.fieldValue}
                            />
                        </div>
                    ))}
                </div>
                <div>
                    <Button onClick={addField}
                            className='flex gap-2 items-center underline underline-offset-4 leading-26'>
                        <PlusSquareIcon/>
                        Add another field
                    </Button>
                </div>
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

export default OAuthForm