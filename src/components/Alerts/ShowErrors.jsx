import errorIcon from "@assets/icons/error.svg";

const ShowErrors = ({errors}) => {

    return (
        <div className="flex flex-col gap-[10px]">
            <div className="flex gap-[10px] items-start text-[12px] p-[10px] bg-[#C700371A] border border-[#FF3737] rounded-md">
                <img src={errorIcon} />
                <div className="flex flex-col gap-[5px]">
                    <span className="rounded-md">Error Message</span>

                    <span className="whitespace-break-spaces">

                
                        {JSON.stringify(errors, null, 4) || "<No value>"}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default ShowErrors;