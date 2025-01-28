import React from 'react'
import ZapIcon from "@assets/icons/dashboard/sidebar/zap.svg?react";
import Button from '@/components/Button';

function NoOptionsContent({ addApiClick }) {
    return (
        <div className="w-full py-[50px] rounded-lg overflow-hidden bg-custom-blackPearl bg-add-api-btn-gradient border-grey-12 flex flex-col items-center justify-center gap-6">
            <div>
                <ZapIcon className="w-[50px] h-[50px] icon-sky" />
            </div>
            <div className="flex flex-col items-center justify-center">
                <span className="text-[16px] font-normal text-grey-17 leading-5">Don’t find what you’re looking for?</span>
                <span className="text-[16px] font-normal text-grey-17 leading-5">You can add your own API!</span>
            </div>
            <Button onClick={() => addApiClick()} className="border border-grey-13 bg-grey-13 rounded-[10px] py-2 px-9 text-grey-5">
                Add API
            </Button>
        </div>
    )
}

export default NoOptionsContent