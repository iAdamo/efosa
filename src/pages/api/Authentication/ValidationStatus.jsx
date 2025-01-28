import AlertTriangleIcon from '@/Icons/updated/topbar/AlertTriangleIcon'
import CheckCircle from '@assets/icons/checkCircle.svg?react'

export const ValidationSuccessBox = () => {
    return (
        <div className="flex gap-3 items-center h-10">
            <div className='flex items-center justify-center p-3 bg-gradient-green-3  rounded-lg'>
                <CheckCircle />
            </div>
            <div>
                <div className="text-secondary-pale-green font-medium text-lg">OAuth Validated</div>
                <div className="text-grey-17 mt-1">Validation successful, relevant information to be displayed here</div>
            </div>
        </div>
    )
}

export const ValidationErrorBox = ({ errors }) => {
    return (
        <div className="flex gap-3 items-center">
            <div className='flex items-center justify-center p-3 bg-status-gradient-error rounded-lg'>
                <AlertTriangleIcon display={"icon-error-1 stroke-2"} />
            </div>
            <div>
                <div className="text-status-error-1 font-normal text-lg">Error authenticating OAuth</div>
                {Object.keys(errors).map((key, index) => {
                    if (errors?.[key]?.length > 1) {
                        return errors?.[key]?.map((error, index) => {
                            return (
                                <div className="text-grey-17 mt-1"><span className='capitalize'>{key}</span> : {error || "Unknown error"}</div>
                            )
                        })
                    } else {
                        return (
                            <div className="text-grey-17 mt-1"><span className='capitalize'>{key}</span> : {errors?.[key]?.[0]?.["error"] || errors?.[key]?.[0] || "Unknown error"}</div>
                        );
                    }
                })}
            </div>
        </div>
    )
}