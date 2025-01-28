import AlertTriangleIcon from "@/Icons/updated/topbar/AlertTriangleIcon";

const ErrorMessage = ({ errors }) => {

    return (
        <div className="bg-gradient-grey-9 rounded py-12 flex flex-col justify-center">
            <div className="max-w-[411px] mx-auto">
                <div className="flex justify-center mb-3">
                    <div className='h-10 w-10 flex items-center justify-center p-3 bg-status-gradient-error rounded-lg'>
                        <AlertTriangleIcon display={"icon-error-1 stroke-2 h-4 w-4"} />
                    </div>
                </div>
                <div className="text-center">
                    <div className="text-status-error text-lg font-normal mb-1">Unable to get data</div>
                    <div className="text-grey-17 text-sm">{errors}</div>
                </div>
            </div>
        </div>
    )
};

export default ErrorMessage