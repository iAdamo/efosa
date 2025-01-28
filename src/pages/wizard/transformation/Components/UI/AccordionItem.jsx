import { ChevronDownIcon } from "@heroicons/react/outline";
import { useEffect, useState } from "react";
const AccordionItem = ({ title, icon, children, open }) => {
    const [onShow, setOnShow] = useState(false);

    useEffect(() => {
        if (open) {
            setOnShow(true);
        }
    }, [open]);

    return (
        <div className={`accordionitem ${onShow ? " active" : ""}`}>
            <header onClick={() => setOnShow(onShow ? false : true)}>
                <div className="accordionitem-name">
                    {icon} <p>{title}</p>
                </div>
                <div className="accordionitem-chevron w-6 h-6 ">
                    <ChevronDownIcon
                        stroke={onShow ? "#9B51E0" : "#808080"}
                        width="24"
                        height="24"
                    />
                </div>
            </header>
            {onShow && <div>{children}</div>}
        </div>
    );
};

export default AccordionItem;
