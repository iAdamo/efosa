/** @type {import('tailwindcss').Config} */

import plugin from "tailwindcss/plugin";
import { boxShadow, colors, gradientColors, screens, spacing } from "./src/constants";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: screens,
      colors: colors,
      backgroundImage: gradientColors,
      boxShadow: boxShadow,
      spacing: { ...spacing, gutter: "var(--gutter)", borderSpacing: "var(--border-spacing)" },
      fontFamily: {
        sans: ['"Inter"', "Arial", "sans-serif"],
        display: ['"Inter"', "Arial", "sans-serif"],
        fira: ["Fira Code", "monospace"],
        default: ['"Inter"', "Arial", "sans-serif"],
      },
      fontSize: {
        sm: ["10px", "12px"],
        base: ["12px", "14px"],
        lg: ["14px", "16px"],
        "2lg": ["28px", "28px"],
        xl: ["48px", "24px"],
        "2xl": ["32px", "24px"],
        16: ["16px", "18px"],
      },
      fontWeight: {
        heading: "500",
        bold: "600",
        bolder: "700",
        display: "400",
      },
      lineHeight: {
        small: "12px",
        base: "14px",
        large: "24px",
        heading: "16px",
        display: "24px",
        larger: "34px",
        11: "11px",
        26: "26px",
      },
      zIndex: {
        "dialog-overlay": 13000,
        dialog: 12000,
        overlay: 11000,
        "node-overlay": 10000,
        //"api-component": 9000,
        dropdown: 8000,
        nav: 7000,
        header: 6000,
        footer: 5000,
        pseduo: 4000,
        default: 1,
        "bottomless-pit": -10000,
      },
      borderRadius: {
        base: "5px",
        containers: "10px",
        "api-component": "8px",
        label: "4px",
      },
    },
    keyframes: {
      move: {
        "0%": {
          strokeDashoffset: "0",
        },
        "50%": { strokeDashoffset: "-500" },
        "100%": {
          strokeDashoffset: "-1000",
        },
      },
      pulse: {
        "0%, 100%": {
          opacity: 1,
        },
        "50%": {
          opacity: 0.5,
        },
      },
    },
    animation: {
      move: "move 20s linear infinite",
      pulse: "pulse 1s linear infinite",
      "move-and-pulse": "move 20s linear infinite, pulse 1s linear infinite",
    },
  },
  variants: {
    fill: ["hover", "focus"], // this line does the trick
  },
  safelist: [
    "hover:bg-[#ee6b7e1a]", // STRING with 0.1 transparency
    "hover:bg-[#9f4df81a]", // INTEGER with 0.1 transparency
    "hover:bg-[#00df9c1a]", // NUMBER with 0.1 transparency
    "hover:bg-[#2f9bff1a]", // BOOLEAN with 0.1 transparency
    "hover:bg-[#ff00001a]", // OBJECT with 0.1 transparency
    "hover:bg-[red1a]", // CONNECTION with 0.1 transparency
    "hover:border-[#ee6b7e]", // STRING border with 0.1 transparency
    "hover:border-[#9f4df8]", // INTEGER border with 0.1 transparency
    "hover:border-[#00df9c]", // NUMBER border with 0.1 transparency
    "hover:border-[#2f9bff]", // BOOLEAN border with 0.1 transparency
    "hover:border-[#ff0000]", // OBJECT border with 0.1 transparency
    "hover:border-[red]", // CONNECTION border with 0.1 transparency
    "ml-[50px]",
    "ml-[-50px]",
    "bg-[#e9c2f0]",
    "bg-[#8bdee4]",
    "border-[#e9c2f0]",
    "border-[#8bdee4]",
  ],
  plugins: [
    plugin(function ({ matchUtilities, theme }) {
      matchUtilities({
        "col-width": (fraction) => {
          // Extract the number of columns (cols) and total columns (total)
          const [cols, total] = fraction.split("/");

          const calcWidth = (gutter, borderSpacing) => {
            return `calc(((100vw - (${total - 1} * ${gutter}) - (2 * ${borderSpacing})) / ${total}) * ${cols} + (${gutter} * ${cols - 1}))`;
          };

          return {
            // Base width calculation (default formula)
            width: calcWidth(theme("spacing.gutter"), theme("spacing.borderSpacing")),
          };
        },
        "col-width-with-border": (fraction) => {
          // Extract the number of columns (cols) and total columns (total)
          const [cols, total] = fraction.split("/");

          const calcWidth = (gutter, borderSpacing) => {
            return `calc(((100vw - (${total - 1} * ${gutter}) - (2 * ${borderSpacing})) / ${total}) * ${cols} + (${gutter} * ${
              cols - 1
            }) + (${borderSpacing} * ${cols === total ? 2 : 1}))`;
          };

          return {
            // Base width calculation (default formula)
            width: calcWidth(theme("spacing.gutter"), theme("spacing.borderSpacing")),
          };
        },
      });
    }),
  ],
};
