import { useState, useEffect } from "react";

export default function useResponsiveGrid() {
  const [state, setState] = useState(getResponsiveState());

  useEffect(() => {
    const handleResize = () => {
      setState(getResponsiveState());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const calculatePosition = (column, row) => {
    const { width, height, gutter, borderSpacing } = state;

    // Calculate the width and height of each grid cell
    const columnWidth = (width - (12 - 1) * gutter) / 12; // 12 columns
    const rowHeight = (height - (8 - 1) * gutter) / 8; // 8 rows

    // Compute the position
    return {
      x: column * columnWidth + column * gutter + borderSpacing,
      y: row * rowHeight + row * gutter + borderSpacing,
    };
  };

  return { ...state, calculatePosition };
}

function getResponsiveState() {
  const { innerWidth: width, innerHeight: height } = window;

  // Retrieve CSS variables from the root
  const rootStyles = getComputedStyle(document.documentElement);
  const gutter = parseFloat(rootStyles.getPropertyValue("--gutter")) || 0;
  const borderSpacing = parseFloat(rootStyles.getPropertyValue("--border-spacing")) || 0;

  return {
    width,
    height,
    gutter,
    borderSpacing,
  };
}
