import { LinksContext } from "@contexts/LinksContext";
import { WizardContext } from "@contexts/WizardContext";
import { useCallback, useContext, useEffect } from "react";

const useDraggableAreaDetails = (areaReference) => {
    const { setONAreaDetails, layoutWidth } = useContext(WizardContext);
    const { triggerLinksRebuild } = useContext(LinksContext);
    useEffect(() => {
        const info = areaReference.current.getBoundingClientRect();
        setONAreaDetails({
            width: info.width,
            left: info.left,
            scrollLeft: 0,
        });
    }, [areaReference.current, layoutWidth]);

    const areaScrollHandler = useCallback((e) => {
        const info = e.target.getBoundingClientRect();
        setONAreaDetails({
            width: info.width,
            left: info.left,
            scrollLeft: e.target.scrollLeft,
        });
        triggerLinksRebuild();
    }, []);
    return { areaScrollHandler };
};

export default useDraggableAreaDetails;
