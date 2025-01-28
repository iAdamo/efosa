import React from "react";

import { OverlayArrow, Tooltip } from "react-aria-components";

const STooltip = ({ children, content, shouldOpen, ...props }) => {
  return (
    <Tooltip placement={props.placement ?? "left"}>
      {shouldOpen && (
        <div className={`tooltip-container ${props.containerClassName}`}>
          {content}
        </div>
      )}
    </Tooltip>
  );
};

export default STooltip;
