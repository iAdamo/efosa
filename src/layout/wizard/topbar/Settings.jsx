
import { postGenericCRUDWithID } from "@/axios/apiCalls";
import { ProjectContext } from "@/contexts/ProjectContext";
import { WizardContext } from "@/contexts/WizardContext";
import { useContext } from "react";
import { useParams } from "react-router-dom";

export default function Settings(props) {
    const { isSettingsOpen, setIsSettingsOpen, settingsRef } = props;
    const { speccID } = useParams();
    const { sourceAPICustomName, destinationAPICustomName, specc } =
        useContext(ProjectContext);
    const {
        isSidebarOpen,
        setIsSidebarOpen,
        scheduleModalIsOpen,
        setScheduleModalIsOpen,
        isAIChatOpen,
        setIsAIChatOpen,
        setIsSpeccStarted,
        isSpeccStarted,
        refreshInitialData,
        isReverse,
        setIsReverse,
        sourceAPIName,
        destinationAPIName
    } = useContext(WizardContext);


    const reverseSpecc = async () => {
        const isReversed = await postGenericCRUDWithID('Speccs', speccID, {
            isReverse: !isReverse,
        });

        setIsReverse(!isReverse);
        refreshInitialData();


    };
    if (!isSettingsOpen) return null;
    return (
        <>
            <div className="h-[289px] top-s48 absolute p-4 bg-gradient-to-tr from-[#343a40] to-[#343a40] rounded-lg border border-[#424951] backdrop-blur-xl flex-col justify-start items-start gap-[38px] inline-flex" ref={settingsRef}>
                <div className="self-stretch h-[62px] flex-col justify-start items-start gap-3 flex">
                    <div className="flex-col justify-start items-center gap-6 flex">
                        <div className="text-center text-[#a8a9ab] text-xs font-normal font-['Inter'] uppercase">Data direction</div>
                    </div>
                    <div className="self-stretch h-[35px] justify-start items-start gap-2 flex hover:bg-[#343A40]">
                        <div className="flex-grow h-[35px] p-2 bg-[#343a40] rounded-[5px] justify-start items-start gap-2.5 flex">
                            <div className="justify-start items-center gap-3 flex flex-grow">
                                <svg xmlns="http://www.w3.org/2000/svg" width="21" height="12" viewBox="0 0 21 14" fill="none">
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M1.86077 7.00013C1.81356 7.03312 1.76693 7.06688 1.72091 7.10139C0.691384 7.87353 0 9.01467 0 10.3168V11.848C0 12.5728 0.587602 13.1604 1.31245 13.1604C2.03729 13.1604 2.62489 12.5728 2.62489 11.848V10.3168C2.62489 9.99449 2.79389 9.57777 3.29585 9.2013C3.80503 8.81942 4.55761 8.56684 5.39561 8.56684H15.7532L14.8171 9.26889C14.2373 9.70379 14.1197 10.5264 14.5546 11.1063C14.9896 11.6862 15.8122 11.8037 16.3921 11.3688L20.4752 8.30643C20.8057 8.05856 21.0002 7.66957 21.0002 7.25647C21.0002 7.10938 20.9756 6.96535 20.9289 6.82966C20.8369 6.56053 20.6599 6.3308 20.4299 6.17251L16.3921 3.14414C15.8122 2.70923 14.9896 2.82675 14.5546 3.40663C14.1197 3.9865 14.2373 4.80914 14.8171 5.24405L15.7477 5.94195H5.53926C4.75931 5.90102 3.88095 5.23952 3.37178 4.85606C3.34546 4.83624 3.32013 4.81716 3.29585 4.79895C2.79389 4.42248 2.62489 4.00576 2.62489 3.68348V2.15229C2.62489 1.42745 2.03729 0.839844 1.31245 0.839844C0.587602 0.839844 0 1.42745 0 2.15229V3.68348C0 4.98558 0.691383 6.12672 1.72091 6.89886C1.76693 6.93337 1.81356 6.96713 1.86077 7.00013Z" fill="#F8F9FA" />
                                </svg>
                                <div className="justify-start items-center gap-1 flex">
                                    <div className="text-center text-[#f8f9fa] text-sm font-normal font-['Inter']">From </div>
                                    <div className="px-2 py-1 bg-[#e9c2f0]/10 rounded justify-center items-center gap-2.5 flex">
                                        <div className="text-[#e9c2f0] text-sm font-semibold font-['Inter'] uppercase leading-[11px] tracking-tight">{sourceAPIName}</div>
                                    </div>
                                    <div className="text-center text-[#f8f9fa] text-sm font-normal font-['Inter']">to</div>
                                    <div className="px-2 py-1 bg-[#8bdee4]/10 rounded justify-center items-center gap-2.5 flex">
                                        <div className="text-[#8bdde3] text-sm font-semibold font-['Inter'] uppercase leading-[11px] tracking-tight">{destinationAPIName}</div>
                                    </div>
                                </div>
                                <div className="flex-grow items-end justify-end content-end flex cursor-pointer" onClick={() => {
                                    reverseSpecc();
                                }}>

                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 16 17" fill="none" className="">
                                        <g clip-path="url(#clip0_10953_13037)">
                                            <path d="M0.666016 3.16602V7.16602H4.66602" stroke="#454C54" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                            <path d="M15.334 13.834V9.83398H11.334" stroke="#454C54" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                            <path d="M13.6593 6.50038C13.3212 5.5449 12.7466 4.69064 11.989 4.01732C11.2315 3.344 10.3157 2.87355 9.32716 2.64988C8.33861 2.42621 7.30951 2.4566 6.33589 2.73823C5.36226 3.01985 4.47585 3.54352 3.75935 4.26038L0.666016 7.16704M15.3327 9.83371L12.2393 12.7404C11.5229 13.4572 10.6364 13.9809 9.66281 14.2625C8.68919 14.5441 7.66009 14.5745 6.67154 14.3509C5.68299 14.1272 4.76722 13.6568 4.00966 12.9834C3.2521 12.3101 2.67746 11.4559 2.33935 10.5004" stroke="#454C54" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                        </g>
                                        <defs>
                                            <clipPath id="clip0_10953_13037">
                                                <rect width="16" height="16" fill="white" transform="translate(0 0.5)" />
                                            </clipPath>
                                        </defs>
                                    </svg>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="justify-start items-start gap-5 inline-flex">
                    <div className="self-stretch pr-5 border-r border-[#454c54]/50 flex-col justify-start items-start gap-3 inline-flex">
                        <div className="justify-start items-center gap-1 inline-flex">
                            <div className="px-2 py-1 bg-[#e9c2f0]/10 rounded justify-center items-center gap-2.5 flex">
                                <div className="text-[#e9c2f0] text-sm font-semibold font-['Inter'] uppercase leading-[11px] tracking-tight">{sourceAPIName}</div>
                            </div>
                            <div className="text-center text-[#e9c2f0] text-xs font-medium font-['Inter'] uppercase">settings</div>
                        </div>
                        <div className="self-stretch h-[42px] flex-col justify-start items-start flex">
                            <div className="self-stretch h-[42px] p-2 rounded-[5px] flex-col justify-start items-start gap-2.5 flex">
                                <div className="justify-start items-center gap-2 inline-flex">
                                    <div className="w-5 h-5 px-0.5 pt-[1.93px] pb-[2.07px] bg-[#a8a9ab] rounded justify-center items-center flex">
                                        <div className="w-4 h-4 relative flex-col justify-start items-start flex" />
                                    </div>
                                    <div className="text-[#f8f9fa] text-sm font-medium font-['Inter'] leading-relaxed">Get</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex-col justify-start items-start gap-3 inline-flex">
                        <div className="justify-start items-center gap-1 inline-flex">
                            <div className="px-2 py-1 bg-[#8bdee4]/10 rounded justify-center items-center gap-2.5 flex">
                                <div className="text-[#8bdde3] text-sm font-semibold font-['Inter'] uppercase leading-[11px] tracking-tight">{destinationAPIName}</div>
                            </div>
                            <div className="text-center text-[#8bdde3] text-xs font-medium font-['Inter'] uppercase"> settings</div>
                        </div>
                        <div className="self-stretch h-[126px] flex-col justify-start items-start flex">
                            <div className="self-stretch h-[42px] p-2 rounded-[5px] flex-col justify-start items-start gap-2.5 flex">
                                <div className="justify-start items-center gap-2 inline-flex">
                                    <div className="w-5 h-5 px-0.5 pt-[1.93px] pb-[2.07px] bg-[#a8a9ab] rounded justify-center items-center flex">
                                        <div className="w-4 h-4 relative flex-col justify-start items-start flex" />
                                    </div>
                                    <div className="text-[#f8f9fa] text-sm font-medium font-['Inter'] leading-relaxed">Post</div>
                                </div>
                            </div>
                            <div className="self-stretch h-[42px] p-2 rounded-[5px] flex-col justify-start items-start gap-2.5 flex">
                                <div className="justify-start items-center gap-2 inline-flex">
                                    <div className="w-5 h-5 relative rounded border border-[#a8a9ab]" />
                                    <div className="text-[#a8a9ab] text-sm font-medium font-['Inter'] leading-relaxed">Update</div>
                                </div>
                            </div>
                            <div className="self-stretch h-[42px] p-2 rounded-[5px] flex-col justify-start items-start gap-2.5 flex">
                                <div className="justify-start items-center gap-2 inline-flex">
                                    <div className="w-5 h-5 relative rounded border border-[#a8a9ab]" />
                                    <div className="text-[#a8a9ab] text-sm font-medium font-['Inter'] leading-relaxed">Delete</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}


