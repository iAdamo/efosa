import React from "react";

export default function Checkbox({ name, value, handleChange, className }) {
    return (
        <input
            type="checkbox"
            name={name}
            checked={value}
            className={`h-[19px] w-[19px] rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 ${className}`}
            onChange={(e) => handleChange(e)}
        />
    );
}
