import React from 'react';

const DeleteButton = ({handler}) => {
    return (
        <button className="my-auto bg-red" type="button" onClick={handler}>
            <div className="flex space-x-2 border-b border-[#F35858] pb-1 cursor-pointer">
                <svg className="my-auto" width="16" height="17" viewBox="0 0 16 17" fill="none"
                     xmlns="http://www.w3.org/2000/svg">
                    <g clip-path="url(#clip0_11569_19949)">
                        <path d="M2 4.5H3.33333H14" stroke="#F35858" stroke-width="2" stroke-linecap="round"
                              stroke-linejoin="round"/>
                        <path
                            d="M12.6668 4.50016V13.8335C12.6668 14.1871 12.5264 14.5263 12.2763 14.7763C12.0263 15.0264 11.6871 15.1668 11.3335 15.1668H4.66683C4.31321 15.1668 3.97407 15.0264 3.72402 14.7763C3.47397 14.5263 3.3335 14.1871 3.3335 13.8335V4.50016M5.3335 4.50016V3.16683C5.3335 2.81321 5.47397 2.47407 5.72402 2.22402C5.97407 1.97397 6.31321 1.8335 6.66683 1.8335H9.3335C9.68712 1.8335 10.0263 1.97397 10.2763 2.22402C10.5264 2.47407 10.6668 2.81321 10.6668 3.16683V4.50016"
                            stroke="#F35858" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </g>
                    <defs>
                        <clipPath id="clip0_11569_19949">
                            <rect width="16" height="16" fill="white" transform="translate(0 0.5)"/>
                        </clipPath>
                    </defs>
                </svg>
                <div className="my-auto text-[#F35858]">Delete client</div>
            </div>
        </button>
    );
};

export default DeleteButton;