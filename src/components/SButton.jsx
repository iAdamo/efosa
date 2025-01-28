import React from "react";
import { cva } from "class-variance-authority";

const button = cva(["s-button"], {
  variants: {
    size: {
      normal: "s-button-normal",
      condensed: "s-button-condensed",
    },
    loading: {
      true: "s-button-loading",
    },
    sType: {
      build: "s-button-build",
      template: "s-button-build",
      tutorials: "s-button-build",
      api1: "s-button-api-1",
      api2: "s-button-api-2",
      secondary: "s-button-secondary",
      success: "s-button-success",
      error: "s-button-error",
      paused: "s-button-paused",
    },
  },
  defaultVariants: {
    sType: "secondary",
    size: "normal",
  },
});

function SButton({ size, sType, loading, children, className, ...props }) {
  return (
    <button
      className={
        className
          ? `${button({ size, sType, loading })} ${className}`
          : button({ size, sType, loading })
      }
      {...props}
    >
      {children}
    </button>
  );
}

export default SButton;
