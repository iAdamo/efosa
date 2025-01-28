import EmptyData from "@components/EmptyData.jsx";
import AuthCard from "@pages/clients/partial/tabs/auths-tab/AuthCard.jsx";
import AuthKeyIcon from "@assets/icons/dashboard/sidebar/authKeyIcon.svg?react";

const AuthManagement = ({authsList}) => {
    return (
        <div className="flex flex-col overflow-auto gap-[14px] h-full !mt-6 !mb-4">
            {!!authsList.length ? (
                authsList.map((auth) => {
                    return <AuthCard key={auth?.id} auth={auth}/>
                })
            ) : <EmptyData
                icon={<AuthKeyIcon/>}
                info='Your list of auths is empty, start by adding a new auth'
            />}
        </div>
    )
}

export default AuthManagement;