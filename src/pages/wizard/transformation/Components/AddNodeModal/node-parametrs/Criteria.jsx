import React, {useEffect, useState} from "react";
import SInput from "@components/SInput.jsx";
import SearchIcon from "@assets/icons/search.svg?react";
import {marked} from "marked";
import Fuse from "fuse.js";

const fuseOptions = {
    keys: ["name"],
    includeScore: true,
    threshold: 0.5,
};

const Criteria = (props) => {
    const [searchText, setSearchText] = useState("");
    const [filteredMeatballsNodes, setFilteredMeatballsNodes] = useState([]);
    const { availableMeatballs = [] } = props;

    useEffect(() => {
        if (!searchText.trim()) {
            setFilteredMeatballsNodes(availableMeatballs);
        } else {
            const words = searchText.toLowerCase().split(/\s+/)

            const fuse = new Fuse(availableMeatballs, fuseOptions);
            const results = fuse
                .search(searchText)
                .map((result) => result.item)
                .filter((item) =>
                    words.every(
                        (word) =>
                            item.name.toLowerCase().includes(word)
                    )
                );
            setFilteredMeatballsNodes(results);
        }
    }, [searchText, availableMeatballs]);

    return (
        <div className='pt-2'>
            {!!availableMeatballs.length && <SInput
                type="text"
                className="modal-header-input !w-full"
                placeholder="Search"
                onChange={(e) => setSearchText(e.target.value)}
                leftIcon={<SearchIcon className="icon-grey-5 mr-[5px]" />}
            />}

            <div className='flex flex-col gap-[5px]'>
                {filteredMeatballsNodes.length > 0 ? (
                    filteredMeatballsNodes.map((elem, index) => (
                        <div key={index} className='w-full p-[10px] h-full flex items-start gap-[30px] justify-between'>
                            <div className="max-w-[90px] w-full flex items-center gap-[10px] font-bold">
                                <div className='flex flex-col items-start break-all'>
                                    {elem.name}
                                    <span className='text-[10px] font-medium text-[#FF9A33]'>{elem.isRequired ? `Required` : "Not Required"}</span>
                                </div>
                            </div>

                            <div className='w-full flex meatballs-view flex-col items-start'>
                                <div className="flex gap-[5px] items-center">
                                    <div
                                        className={`w-[6px] h-[6px] ${
                                            elem.type === "string"
                                                ? "bg-[#ee6b7e]"
                                                : elem.type === "integer"
                                                    ? "bg-[#9f4df8]"
                                                    : elem.type === "number"
                                                        ? "bg-[#00df9c]"
                                                        : elem.type === "boolean"
                                                            ? "bg-[#2f9bff]"
                                                            : "bg-[#ff0000]"
                                        } rounded`}
                                    />
                                    <span
                                        className="text-[#AEAEAE] text-[10px] font-medium font-['Inter']">
                                        {elem.type}
                                    </span>
                                </div>

                                {elem.enum && <div className="mb-[5px]">
                                    <span className="text-[#AEAEAE] text-[11px] font-medium font-['Inter'] mr-[30px]">
                                        Enum:
                                    </span>
                                    {["ECOM", "RECURRING"].map((elem, index) => (
                                        <span
                                            key={index}
                                            className="bg-grey-2 text-grey-6 px-[5px] ml-[10px]"
                                        >
                                        {`"${elem}"`}
                                    </span>
                                    ))}
                                </div>}

                                <div className="text-[#AEAEAE] w-full text-[10px] font-medium font-['Inter'] mb-[10px] heading-wrapper !px-0"
                                     dangerouslySetInnerHTML={{__html: marked(elem.description ?? '')}}
                                />
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-grey-7 text-[12px] font-medium font-['Inter'] text-center mt-[10px]">
                        No available meatballs nodes found.
                    </p>
                )}
            </div>
        </div>
    );
};

export default Criteria
