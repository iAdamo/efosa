import Tooltip from "@components/Tooltip";

const TooltipText = ({ period }) => (
    <div className="flex flex-col gap-2 w-[150px] font-semibold text-xs">
        <div className="flex items-center">
            <span className="text-xl w-8 text-left">*</span>
            <p>Any value</p>
        </div>
        <div className="flex items-center">
            <span className="text-xl w-8 text-left">`</span>
            <p>Value list seperator</p>
        </div>
        <div className="flex items-center">
            <span className="text-xl w-8 text-left">-</span>
            <p>Range of values</p>
        </div>
        <div className="flex  items-center">
            <span className="w-8 text-left">/</span>
            <p>Step values</p>
        </div>
        <div className="flex items-center">
            <span className="w-8 text-left">{period}</span>
            <p>Allowed values</p>
        </div>
    </div>
);

const TimePeriodEntry = ({
    title,
    description,
    value,
    onChange,
    isActive,
    period,
}) => {
    return (
        <div className="w-[61px] flex flex-col gap-2">
            <input
                className={`w-full h-[54px] border border-[#D9D9D9] rounded-md text-center text-[#55689B] text-[32px] font-medium ${
                    isActive ? "bg-[#CEDFFA]" : ""
                }`}
                value={value}
                onChange={onChange}
            />
            <div className="flex justify-center">
                <Tooltip down text={<TooltipText period={period} />}>
                    <div
                        className={`w-full text-center ${
                            isActive ? "text-[#55689B]" : ""
                        }`}
                    >
                        <p className="underline text-sm">{title}</p>

                        {description && (
                            <p className="text-xs">({description})</p>
                        )}
                    </div>{" "}
                </Tooltip>
            </div>
        </div>
    );
};

export default TimePeriodEntry;
