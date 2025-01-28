import React from 'react'

function CircularProgressBar({ value }) {
    const progressValue = (100 - value);
    return (
        <div class="relative">
            <svg class="-rotate-90" width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="20" cy="20" r="16" fill="none" class="stroke-current text-[#454C54] dark:text-neutral-700" stroke-width="4"></circle>

                <circle
                    cx="20"
                    cy="20"
                    r="16"
                    fill="none"
                    class="stroke-current text-[#85F996] dark:text-[#85F996]"
                    stroke-width="4"
                    stroke-dasharray="100"
                    stroke-dashoffset={String(progressValue)}
                    stroke-linecap="round"></circle>

                <defs>
                    <linearGradient id="paint0_linear_11121_10449" x1="6.66667" y1="1.66667" x2="54.1667" y2="12.5" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#85F996" />
                        <stop offset="1" stop-color="#0A5C16" />
                    </linearGradient>
                </defs>
            </svg>

            <div class="absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2">
                <span class="text-[#f8f9fa] text-xs font-normal font-['Inter'] -tracking-[1px]">{value}%</span>
            </div>
        </div>
    )
}

export default CircularProgressBar