import React from 'react'
import apiIcon from "@assets/icons/api.svg";
import NodeIcon from "@assets/icons/node.svg"
import SSearch from '@/components/SSearch';
import infoIcon from "@assets/icons/info.svg";
import { useState } from 'react';
import { useEffect } from 'react';
import { useCallback } from 'react';
import NestedGrid from '@/components/NestedGrid/NestedGrid';

function ExecutionDetailsGetData({ getDataModuleResponse, expanded }) {
    const [getTableData, setGetTableData] = useState([]);

    const getDataResults = useCallback(() => {
        if (getDataModuleResponse) {
            try {
                const parsedData = getDataModuleResponse?.output?.JSON ? JSON.parse(getDataModuleResponse.output.JSON) : null;

                if (parsedData?.listOfDataObjects) {

                    let getDatalistOfDataObjects = [];
                    parsedData?.listOfDataObjects.forEach((data) => {
                        getDatalistOfDataObjects.push(data.datarow);
                    });

                    setGetTableData(getDatalistOfDataObjects);

                } else {
                    setGetTableData([]);
                    console.warn('No data objects found in the response.');
                }
            } catch (error) {
                console.error("Error parsing JSON:", error);
                setGetTableData([]);
            }
        }
    }, [getDataModuleResponse]);

    useEffect(() => {
        getDataResults();
    }, [getDataResults]);

    return (
        <>
            <div className={`details-getdata-container meatballs-container-transition relative ${expanded ? "w-[100%] flex bg-black p-[20px]" : "w-[50px] pt-[20px] pr-[10px] pl-[10px]"} h-[929px] border border-[#D32DCA]`}>

                <div className="flex gap-2 h-[17px] items-center">
                    <img
                        src={apiIcon}
                        width={15}
                        height={15}
                        className='icon-pink'
                    />
                    <span className="text-[14px] font-[700] text-[#D32DCA]">
                        GET DATA
                    </span>
                </div>

                <div className='flex gap-2.5'>
                    <img src={NodeIcon} className='icon-pink' alt="NodeIcon" />
                    <span className="text-[14px] font-[700]">Parent node name populated</span>
                    <img src={infoIcon} className="icon-grey-5 cursor-pointer" />
                </div>

                <div>
                    <img src="" alt="" />
                    <span className='text-xs font-medium'>Choose a piece of data to see it’s journey through the execution</span>
                </div>

                <div className="flex justify-between">
                    <SSearch isTest={true} />
                </div>

                <div
                    className="w-fit get-data-label flex"
                >
                    <div
                        className=" flex flex-wrap h-[34px] rounded p-[10px] bg-[#111111] hover:bg-[#00EFD91A] border border-[#D32DCA] cursor-pointer"
                    >
                        <div className=" h-[14px] flex gap-[2px] flexwrap">
                            <span>test 1</span>
                            <span>=</span>
                            <span className="text-[#D32DCA] font-[600] ">
                                test 2
                            </span>
                        </div>
                    </div>
                </div>
                <div className="min-w-[50%] overflow-y-auto">
                    {getTableData?.length > 0 ? <NestedGrid gridData={getTableData} /> : <p>No data Available</p>}
                </div>
            </div>
        </>
    )
}

export default ExecutionDetailsGetData