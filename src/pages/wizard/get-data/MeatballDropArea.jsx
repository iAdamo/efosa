import React, { useRef } from "react";
import { useDrop } from "@react-aria/dnd";

function MeatballDropArea({ addMeatballToSelected }) {
    let ref = useRef(null);
    let { dropProps, isDropTarget } = useDrop({
        ref,
        async onDrop(e) {
            let items = await Promise.all(e.items);
            const data = JSON.parse(await items[0].getText("text/plain"));
            const { name } = data;
            addMeatballToSelected(name);
        },
    });
    return (
        <div
            {...dropProps}
            ref={ref}
            data-is-drop-target={isDropTarget}
            className="drop-area"
        >
            <span className="label">Drag and drop from list</span>
        </div>
    );
}

export default MeatballDropArea;
