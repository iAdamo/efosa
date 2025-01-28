import React, { useState } from "react";
import ArrowDownIcon from "@/Icons/ArrowDownIcon.jsx";
import ArrowUpIcon from "@/Icons/ArrowUpIcon.jsx";

const CollapsibleSection = ({ section, collapsedStates, toggleCollapse }) => {
    const { name, value, content, bColor, tColor, bGColor } = section;

    return (
        <div
            className={`meatballs-view w-full px-[10px] py-[15px] border-[1px] rounded-lg relative border-[${bColor}]`}
        >
            <div className="absolute left-3 top-[-15px] status-dropdown cursor-pointer">
                <div
                    className={`flex items-center bg-[${bGColor}] appearance-none p-[5px] focus:outline-none transition duration-300 ease-in-out ${tColor}`}
                    onClick={() => toggleCollapse(value)}
                >
                    <span>{name}</span>
                    <span className="ml-2">
                        {collapsedStates[value] ? <ArrowDownIcon /> : <ArrowUpIcon />}
                    </span>
                </div>
            </div>
            {!collapsedStates[value] && (
                <div className="overflow-hidden h-auto">
                    <div className="overflow-y-auto">
                        {content}
                    </div>
                </div>
            )}
        </div>
    );
};

const CollapsibleContainer = ({ sections }) => {
    const [collapsedStates, setCollapsedStates] = useState(
        sections.reduce((acc, section) => {
            acc[section.value] = false;
            return acc;
        }, {})
    );

    const toggleCollapse = (section) => {
        setCollapsedStates((prevState) => ({
            ...prevState,
            [section]: !prevState[section],
        }));
    };

    return (
        <>
            {sections.map((section) => (
                <CollapsibleSection
                    key={section.value}
                    section={section}
                    collapsedStates={collapsedStates}
                    toggleCollapse={toggleCollapse}
                />
            ))}
        </>
    );
};

export default CollapsibleContainer;
