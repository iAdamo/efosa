import React from "react";
import { cva } from "class-variance-authority";

const input = cva(["s-input"], {
  variants: {
    sType: {
      pink: "s-input-pink",
      mint: "s-input-mint",
    },
  },
  defaultVariants: {
    sType: "pink",
  },
});

const SInput = React.forwardRef(({ sType, className, wrapperClassName, Util, ...props }, ref) => {
  return (
    <div
      className={
        className ? input({ sType }) + " " + className : input({ sType })
      }
    >
      <div className={`s-input-wrapper ${wrapperClassName}`}>
        {props.leftIcon && props.leftIcon}
        <input ref={ref} {...props} />
        {Util && <Util />}
        {props.icon && props.icon}
      </div>
    </div>
  );
});

export default SInput;
