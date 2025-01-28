import React from "react";
import ArrowUpIcon from "@assets/icons/arrow-up.svg?react"
import ArrowDownIcon from "@assets/icons/arrow-down.svg?react"

const SSortableHeaders = ({ options }) => {
    return (
        <div
            className="flex gap-7 items-center"
        >
            {options.map(({ label, isAscending, onSort }) => (
                <div
                    className="flex gap-2 items-center cursor-pointer"
                    onClick={onSort}
                >
                    <span className="text-xs font-medium text-custom-ghostWhite">{label}</span>
                    {isAscending ? <ArrowUpIcon /> : <ArrowDownIcon />}
                </div>
            ))}
        </div>
    );
}

export default SSortableHeaders;
