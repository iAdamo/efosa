import React, { useState } from "react";

const Dropdown = ({ label }) => (
    <div className="inline-flex flex-col items-start justify-center gap-2.5 px-2 py-1 bg-[#1e212566] rounded-lg">
        <div className="inline-flex items-center gap-2">
            <div className="relative w-fit mt-[-1.00px] font-normal text-[#dee2e6] text-[10px]">
                {label}
            </div>
            <img className="relative w-4 h-4" alt="Chevron Down" src="https://c.animaapp.com/GutENyys/img/bx-chevron-down-2-2.svg" />
        </div>
    </div>
);

const ExecutionOverview = () => {
    const [activeIndex, setActiveIndex] = useState(null);
    const data = [
        { key: "Mon", value: 114 },
        { key: "Tue", value: 95 },
        { key: "Wed", value: 122 },
        { key: "Thu", value: 117 },
        { key: "Fri", value: 83 },
        { key: "Sat", value: 83 },
        { key: "Sun", value: 120 },
        { key: "Mon", value: 100 },
        { key: "Tue", value: 95 },
        { key: "Wed", value: 122 },
        { key: "Thu", value: 117 },
        { key: "Fri", value: 83 },
        { key: "Sat", value: 83 },
        { key: "Sun", value: 120 },
    ];

    return (
        <div
            className="bg-[#141619] rounded-lg border border-[#454c5466] p-4 shadow-md col-span-1 md:col-span-2">
            <div className="flex w-full justify-between items-center mb-4">
                <h2 className="font-semibold text-[#f8f9fa] text-xs">Execution Overview</h2>
                <Dropdown label="Last 2 weeks"/>
            </div>
            <div className="flex justify-between items-end">
                {data.map((item, index) => (
                    <div
                        key={index}
                        className="relative w-6"
                        onMouseEnter={() => setActiveIndex(index)}
                        onMouseLeave={() => setActiveIndex(null)}
                        onClick={() => setActiveIndex(index)}
                    >
                        <div
                            style={{ height: `${item.value}px` }}
                            className={`rounded w-[22px] cursor-pointer transition-all ${
                                activeIndex === index ? 'bg-[#454c54] opacity-100' : 'bg-[#454c5433] opacity-80'
                            }`}
                        ></div>
                        <div className="text-center text-[#454c54] text-[8px] mt-1">
                            {item.key}
                        </div>
                        {activeIndex === index && (
                            <div
                                className="absolute top-[-20px] left-[-2px] w-full bg-[#1e2125] rounded text-center text-[#f8f9fa] text-[10px]"
                            >
                                {item.value}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ExecutionOverview;
