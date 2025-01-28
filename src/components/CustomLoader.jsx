import React from 'react'
import { motion } from "framer-motion";
import LoaderIcon from "@assets/icons/new-loaderIcon.svg?react";

function CustomLoader({ label = "", labelClassName = "", iconClassName = "" }) {
    return (
        <div className='flex items-center gap-6 max-w-[233px]'>
            <div className='max-w-[49px]'>
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                        repeat: Infinity,
                        duration: 1,
                        ease: "linear",
                    }}
                >
                    <LoaderIcon className={`${iconClassName}`} />
                </motion.div>
            </div>
            {label && <div className={`py-3 text-lg ${labelClassName}`}>
                {label}
            </div>}
        </div>
    )
}

export default CustomLoader