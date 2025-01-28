import React, {useState} from "react";
import {AuthTypeCard} from "@pages/my-auths/partial/auth-type/AuthTypeCard.jsx";
import {authTypes} from "@pages/my-auths/partial/auth-type/auth-types.jsx";
import OAuth from "./auth-property/OAuth.jsx";

const EditAuth = ({auth}) => {
    const [activeType, setActiveType] = useState(auth.authType)

    const handleTypeClick = (value) => {
        setActiveType(value)
    }

    const authTypeComponents = {
        API_KEY: "No Information",
        JWT: "No Information",
        OAUTH: <OAuth />,
        BASIC:  "No Information",
    };

    const ActiveAuthTypeContent = authTypeComponents[activeType]

    return (
        <div className="flex flex-col w-1/2 gap-3 py-7">
            <div
                style={{
                    background: "linear-gradient(24.77deg, #343A40 26.75%, rgba(52, 58, 64, 0) 126.94%)",
                    backdropFilter: "blur(4px)"
                }}
                className="py-4 px-6 rounded-lg border-grey-12 "
            >
                <div className="flex gap-3 items-center justify-start">
                    {authTypes.map((type) => (
                        <AuthTypeCard
                            key={type.id}
                            type={type}
                            isActive={activeType === type.value}
                            onClick={() => handleTypeClick(type.value)}
                        />
                    ))}
                </div>
            </div>

            <div className="py-4 px-6 bg-grey-15 rounded-lg ">
                {ActiveAuthTypeContent}
            </div>
        </div>
    )
}

export default EditAuth;