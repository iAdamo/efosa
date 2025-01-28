import React from "react";
import CloseIcon from "@assets/icons/close.svg?react";
import CheckMarkIcon from "@/Icons/CheckMarkIcon.jsx";

const AuthFilterModal = ({setOpen, selected, toggleSelection, clearAll}) => {
    const selectedCount = Object.values(selected).filter(Boolean).length;

    return (
        <div>
            <div
                style={{
                    background: ' linear-gradient(85.81deg, #343A40 -0.2%, rgba(52, 58, 64, 0) 111.97%)',
                    border: '1px solid #424A52',
                    filter: 'drop-shadow(0px 4px 10px rgba(20, 22, 25, 0.4))',
                    backdropFilter: 'blur(50px)'
                }}
                className={`min-w-min lg:min-w-[245px] max-w-[245px] p-4 rounded-lg absolute z-10 top-7 left-0 border border-gradient-grey-3`}>
                <div className="flex flex-col gap-5">
                    <div className="flex items-center gap-3">
                        <div id="modal-title"
                             className={`text-xs font-medium leading-larger text-custom-ghostWhite flex-1`}>
                            Filter by Auth type
                        </div>
                        <button onClick={() => setOpen(false)}>
                            <CloseIcon className="icon-white w-6 h-6 p-[6px] s-icon-grey-4"/>
                        </button>
                    </div>

                    <div className="flex items-center justify-between">
                            <span className="text-[10px] text-tgrey-20 font-medium">
                                {selectedCount} out of 4 selected
                            </span>

                        <button
                            onClick={clearAll}
                            className="text-[10px] font-medium text-grey-13 underline"
                        >
                            Clear all
                        </button>
                    </div>
                </div>
                <ul className="flex flex-col mt-3">
                    {Object.keys(selected).map((type) => (
                        <li
                            key={type}
                            onClick={() => toggleSelection(type)}
                            className={`flex rounded items-center gap-2 cursor-pointer p-2 text-custom-ghostWhite ${
                                selected[type] ? "bg-[#F7F8F91A]" : ""
                            } hover:text-white`}
                        >
                            <CheckMarkIcon color="#F8F9FA"/>
                            <span>{type}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default AuthFilterModal;