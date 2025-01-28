import { useEffect } from "react";

export default function DropdownMenu(props) {
    const { setDropdownSelected, setDropdownOpen } = props;

    return (
        <>
            <div className="w-[151px] p-2.5 bg-neutral-700 rounded-lg flex-col justify-start items-start inline-flex z-[2] top-[20px] absolute">
                <div
                    className="self-stretch p-[5px] rounded-[5px] justify-start items-center gap-[5px] inline-flex  hover:bg-neutral-600"
                    onClick={() => {
                        setDropdownSelected("OAUTH");
                        setDropdownOpen(false);
                    }}
                >
                    <div className="w-5 h-5 p-1 justify-center items-center flex">
                        <div className="w-3 h-3 relative flex-col justify-start items-start flex"></div>
                    </div>
                    <div className="text-white text-xs font-medium font-['Inter'] leading-3">
                        OAuth
                    </div>
                </div>
                <div
                    className="self-stretch p-[5px] bg-neutral-700 rounded-[5px] justify-start items-center gap-[5px] inline-flex  hover:bg-neutral-600"
                    onClick={() => {
                        setDropdownSelected("JWT");
                        setDropdownOpen(false);
                    }}
                >
                    <div className="w-5 h-5 relative"></div>
                    <div className="text-white text-xs font-medium font-['Inter'] leading-3">
                        JWT
                    </div>
                </div>
                <div
                    className="self-stretch p-[5px] justify-start rounded-[5px] items-center gap-[5px] inline-flex  hover:bg-neutral-600"
                    onClick={() => {
                        setDropdownSelected("BASIC");
                        setDropdownOpen(false);
                    }}
                >
                    <div className="w-5 h-5 p-1 justify-center items-center flex">
                        <div className="w-3 h-3 relative flex-col justify-start items-start flex"></div>
                    </div>
                    <div className="w-[76px] text-white text-xs font-normal font-['Inter'] leading-3">
                        Basic Authentication
                    </div>
                </div>
                <div
                    className="self-stretch p-[5px] rounded-[5px] justify-start items-center gap-[5px] inline-flex  hover:bg-neutral-600"
                    onClick={() => {
                        setDropdownSelected("APIKEY");
                        setDropdownOpen(false);
                    }}
                >
                    <div className="w-5 h-5 p-1 justify-center items-center flex">
                        <div className="w-3 h-3 relative flex-col justify-start items-start flex"></div>
                    </div>
                    <div className="text-white text-xs font-medium font-['Inter'] leading-3">
                        API Key
                    </div>
                </div>
            </div>
        </>
    );
}
