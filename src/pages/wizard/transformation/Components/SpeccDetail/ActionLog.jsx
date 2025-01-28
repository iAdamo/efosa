import React, { useCallback, useState, useContext } from "react";
import ActionLogEvent from "./ActionLogEvent";


const ActionLog = () => {

    let fakeEvent1 = {
        type: "completed",
        message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
        date: "01.09.2023",
        time: "15:36"
    }

    let fakeEvent2 = {
        type: "message",
        message: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ",
        date: "01.09.2023",
        time: "15:36"
    }
    let fakeEvent3 = {
        type: "alert",
        message: "Ut enim ad minim veniam",
        date: "01.09.2023",
        time: "15:36"
    }
    let fakeEvent4 = {
        type: "success",
        message: "Success!",
        date: "01.09.2023",
        time: "15:36"
    }
    let fakeEvent5 = {
        type: "fail",
        message: "Fail, try again!",
        date: "01.09.2023",
        time: "15:36"
    }
    return (
        <>
        <p className="pl-6 pb-2 font-semibold text-[12px]">Action log</p>
        <div className="w-full bg-[#E5E5E5] h-[1px]" />

        <div>
            
        <ActionLogEvent event={fakeEvent1}/>
        <ActionLogEvent event={fakeEvent2}/>
        <ActionLogEvent event={fakeEvent3}/>
        <ActionLogEvent event={fakeEvent4}/>
        <ActionLogEvent event={fakeEvent5}/>

        </div>
        
        
        </>
    );
};

export default ActionLog;
