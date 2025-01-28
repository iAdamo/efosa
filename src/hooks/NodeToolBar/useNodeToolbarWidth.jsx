import { NodeToolBarContext } from "@contexts/NodeToolBarContext";
import { useContext, useState, useEffect } from "react";

const useNodeToolbarWidth = (toolbarNode) => {
    const { setWidthToolBar } = useContext(NodeToolBarContext);
    const [toolbarFixedClass, setToolbarFixedClass] = useState("");

    const onDragToolbarWidth = (e) => {
        setTimeout(() => setWidthToolBar(window.innerWidth - e.pageX), 10);
    };

    const onDragToolbarWidthEnd = (e) => {
        setTimeout(() => setWidthToolBar(window.innerWidth - e.pageX), 10);
    };

    useEffect(() => {
        if (toolbarNode) {
            setWidthToolBar(322);
        } else {
            setWidthToolBar(0);
        }
    }, [toolbarNode]);

    useEffect(() => {
        if (
            (toolbarNode?.schema?.direction || toolbarNode?.direction) ===
            "SOURCE" || toolbarNode?.direction === 'DESTINATION'
        ) {
            setToolbarFixedClass("fixed_toolbar");
        } else {
            setTimeout(() => {
                setToolbarFixedClass("");
            }, 305);
        }
    }, [toolbarNode]);

    return {
        toolbarFixedClass,
        setToolbarFixedClass,
        onDragToolbarWidth,
        onDragToolbarWidthEnd,
    };
};

export default useNodeToolbarWidth;
