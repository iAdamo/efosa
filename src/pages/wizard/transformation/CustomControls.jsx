import useGlobalStore from "@/store/globalStore";
import { ELEMENTS } from "@/store/uiSlice";
import { useReactFlow, useViewport } from "@xyflow/react";
import React from "react";
import MatchRunToggle from "./MatchRunToggle";
import PlusCircleIcon from "@assets/icons/plus-circle.svg?react";

function CustomControls() {
    const { setModal, autoLayout, setSidebar, selectedSidebar } = useGlobalStore((s) => ({
        setModal: s.UI.setModal,
        autoLayout: s.autoLayout,
        setSidebar: s.UI.setSidebar,
        selectedSidebar: s.UI.ELEMENTS.SIDEBAR
    }));
    const { setViewport, fitView: originalFitView } = useReactFlow();
    const { x, y, zoom } = useViewport();
    const fitView = () => {
        originalFitView({ padding: 100 })
    }
    // const zoomPercent = Math.round((zoom - 1) * 100);
    const zoomIn = () =>
        setViewport({ x: x, y: y, zoom: zoom >= 0.5 && zoom < 2 ? zoom + 0.25 : zoom });
    const zoomOut = () =>
        setViewport({ x: x, y: y, zoom: zoom > 0.5 && zoom <= 2 ? zoom - 0.25 : zoom });

    const handleAutoLayout = async () => {
        try {
            await autoLayout(fitView);
        } catch (e) {
            console.error(e);
        } finally {
            //setLoading(false);
        }
    };
    return (
        <div className="bg-transparent absolute bottom-0 left-0.5 my-[15px] flex justify-center items-center w-full">
            <div className="bg-wizard-controls-gradient h-[54px] px-[12px] py-[4px] rounded-api-component flex items-center border border-gradient-grey-1 gap-4">
                <div className="flex items-center">
                    <button
                        type="button"
                        className="group bg-grey-13 flex gap-2 items-center text-lg text-custom-ghostWhite font-semibold h-8 px-3 rounded-containers border border-transparent hover:bg-gradient-pink-4 hover:border-main-pink-5 "
                        onClick={() => {
                            selectedSidebar === ELEMENTS.SIDEBAR.OPERATION_NODES ? setSidebar(ELEMENTS.SIDEBAR.RUN_PROGRESS) : setSidebar(ELEMENTS.SIDEBAR.OPERATION_NODES);
                        }}>
                        <PlusCircleIcon className="icon-grey-1111 hover-icon-pink-6" />
                        Insert
                    </button>
                    <button
                        type="button"
                        className="hover:bg-grey-13 h-[32px] px-[12px] py-[10px] rounded-api-component flex gap-1 items-center text-grey-17 text-lg hover:text-custom-ghostWhite hover:font-semibold"
                        onClick={() => {
                            setModal(ELEMENTS.MODAL.DATA_INSPECTOR);
                        }}>
                        <svg opacity="0.2" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M7.33333 12.6667C10.2789 12.6667 12.6667 10.2789 12.6667 7.33333C12.6667 4.38781 10.2789 2 7.33333 2C4.38781 2 2 4.38781 2 7.33333C2 10.2789 4.38781 12.6667 7.33333 12.6667Z" stroke="#F8F9FA" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M13.9996 13.9996L11.0996 11.0996" stroke="#F8F9FA" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                        Data inspector
                    </button>
                    <button type="button" className="hover:bg-grey-13 h-[32px] px-[12px] py-[10px] rounded-api-component flex gap-1 items-center text-grey-17 text-lg hover:text-custom-ghostWhite hover:font-semibold" onClick={handleAutoLayout}>
                        <svg opacity="0.2" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M6.66667 2H2V6.66667H6.66667V2Z" stroke="#F8F9FA" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M14.0007 2H9.33398V6.66667H14.0007V2Z" stroke="#F8F9FA" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M14.0007 9.33398H9.33398V14.0007H14.0007V9.33398Z" stroke="#F8F9FA" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M6.66667 9.33398H2V14.0007H6.66667V9.33398Z" stroke="#F8F9FA" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                        Arrange
                    </button>
                    {/* <MatchRunToggle /> */}
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" width="2" height="48" viewBox="0 0 2 48" fill="none">
                    <path d="M1 1L0.999998 47" stroke="#454C54" stroke-opacity="0.2" stroke-linecap="round" />
                </svg>
                <div className="flex gap-4">
                    <button type="button" onClick={zoomIn}>
                        <svg opacity="0.2" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 5V19" stroke="#F8F9FA" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M5 12H19" stroke="#F8F9FA" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                    </button>
                    <button type="button" onClick={zoomOut}>
                        <svg opacity="0.2" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5 12H19" stroke="#F8F9FA" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                    </button>
                    <button type="button" onClick={fitView}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M5 9L2 12L5 15" stroke="#454C54" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M9 5L12 2L15 5" stroke="#454C54" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M15 19L12 22L9 19" stroke="#454C54" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M19 9L22 12L19 15" stroke="#454C54" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M2 12H22" stroke="#454C54" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M12 2V22" stroke="#454C54" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                    </button>
                    <button type="button">
                        <svg opacity="0.2" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M19 11H5C3.89543 11 3 11.8954 3 13V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V13C21 11.8954 20.1046 11 19 11Z"
                                stroke="#F8F9FA"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            />
                            <path
                                d="M7 11V7C7 5.67392 7.52678 4.40215 8.46447 3.46447C9.40215 2.52678 10.6739 2 12 2C13.3261 2 14.5979 2.52678 15.5355 3.46447C16.4732 4.40215 17 5.67392 17 7V11"
                                stroke="#F8F9FA"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CustomControls;
