import { useState } from "react";

const Tooltip = ({ text, children, down }) => {
    const [showTooltip, setShowTooltip] = useState(false);
    const [positionTooltip, setPositionTooltip] = useState(true);

    let positionTop;

    const currentPositionTop = (e) => {
        positionTop = e.currentTarget.getBoundingClientRect().top;
        if (down) {
            return setPositionTooltip(false);
        }
        if (positionTop > 60) {
            return setPositionTooltip(true);
        } else {
            return setPositionTooltip(false);
        }
    };
    return (
        <div className="tooltip">
            <div
                className="tooltip-children"
                onMouseEnter={(e) => {
                    currentPositionTop(e);
                    setShowTooltip(true);
                }}
                onMouseLeave={() => {
                    setShowTooltip(false);
                }}
            >
                {children}
            </div>

            {showTooltip && (
                <div className={`tooltip ${positionTooltip ? "up" : "down"}`}>
                    <div
                        className={`triangle ${
                            positionTooltip ? "up" : "down"
                        }`}
                    ></div>
                    {text}
                </div>
            )}
        </div>
    );
};

export default Tooltip;
