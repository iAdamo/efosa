import React from "react";
import { useDrag } from "@react-aria/dnd";
import SBadge from "@components/SBadge";
import SAccordion from "@components/SAccordion";

function DragableMeatball({
    defaultValue,
    description,
    exampleValue,
    isRequired,
    name,
    type,
    isTest
}) {
    const { dragProps, isDragging } = useDrag({
        getItems() {
            return [
                {
                    "text/plain": JSON.stringify({
                        name,
                    }),
                },
            ];
        },
    });

    const accRender = () => (
        <div {...dragProps} className="meatball" data-is-dragging={isDragging}>
            <SAccordion
                content={
                    <div className="flex flex-col">
                        {description && (
                            <span className="label">{description}</span>
                        )}
                    </div>
                }
                title={
                    <div className="flex flex-col gap-[10px]">
                        <span className="label capitalize">{name}</span>
                        {type && <SBadge label={type} />}
                        {isRequired && <SBadge label={"Required"} />}{" "}
                    </div>
                }
            ></SAccordion>
        </div>
    );

    const normalRender = () => (
        <div
            {...dragProps}
            data-is-dragging={isDragging}
            className="meatball flex flex-col gap-[10px]"
        >
            <span className="label capitalize">{name}</span>
            {type && <SBadge label={type} />}
            {isRequired && <SBadge label={"Required"} />}{" "}
        </div>
    );

    const isAccordian = () => {
        if (description) {
            return true;
        }
        return false;
    };
    return isAccordian() ? accRender() : normalRender();
}

export default DragableMeatball;
