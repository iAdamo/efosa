export const SHOWING_RELATED_NODES_DELAY = 250;

export const DIRECTION = {
  SOURCE: "SOURCE",
  DESTINATION: "DESTINATION",
};

export const WIZARD_COMPONENT_TYPE = {
  RUN: "RUN",
  MATCH: "MATCH",
};

export const NAVIGATION_TYPES = {
  INTEGRATIONS: "INTEGRATIONS",
  PROJECT_SETTINGS: "PROJECT_SETTINGS",
};

export const UI_ACTIONS = {
  NAVIGATE: "NAVIGATE",
};

//Todo change all params to this const
export const PARAMS = {
  URL_PROJECT_ID: "urlProjectID",
};

export const NODE_TYPES = {
  API: "API",
  OPERATION: "OPERATION",
};

export const spacing = {
  s2: "2px",
  s4: "4px",
  s6: "6px",
  s8: "8px",
  s10: "10px",
  s12: "12px",
  s14: "14px",
  s16: "16px",
  s20: "20px",
  s24: "24px",
  s28: "28px",
  s32: "32px",
  s40: "40px",
  s48: "48px",
  s60: "60px",
  s64: "64px",
  s80: "80px",
  s100: "100px",
  s120: "120px",
};

export const fromKeys = ["fromArray", "fromBoolean", "fromDecimal", "fromInteger", "fromString"];
export const toKeys = ["toArray", "toBoolean", "toDecimal", "toInteger", "toString"];

export const typeColors = {
  STRING: "#ee6b7e",
  INTEGER: "#9f4df8",
  NUMBER: "#00df9c",
  BOOLEAN: "#2f9bff",
  OBJECT: "#ff0000",
  CONNECTION: "red",
  DEFAULT: "grey",
};

export const modules = {
  TRANSFORMATION: "TRANSFORMATION",
};

// Screen sizes for different devices
export const screens = {
  md: "992px", // smaller laptops
  lg: "1200px", // bigger laptops
  xl: "2560px", // 4k screens or bigger
};

export const colors = {
  main: {
    pink: {
      1: "#ea35fa",
      2: "#ea35facc",
      3: "#ea35fa80",
      4: "#ea35fa33",
      5: "#e04fd9",
      6: "#e9c2f066",
      7: "#e9c2f04d",
      8: "#e9c2f01a",
    },
    peach: {
      1: "#ee6b7e",
      2: "#ee6b7ecc",
      3: "#ee6b7e80",
      4: "#ee6b7e33",
    },
    purple: {
      1: "#9f4df8",
      2: "#9f4df8cc",
      3: "#9f4df880",
      4: "#9f4df833",
    },
  },
  secondary: {
    cerise: "#d32dca",
    cerise05: "#d32dca0D",
    cerise30: "#d32dca4D",
    cerise80: "#d32dca80",
    "pink-dark": "#a207ac",
    "pink-light": "#e9c2f01f",
    "pink-light-1": "#e9c2f0",
    "purple-dark": "#624bc2",
    "mint-green": "#00efd9",
    "mint-green-10": "#00efd91A",
    "mint-green-15": "#00efd926",
    "mint-green-50": "#00efd980",
    "mint-green-2": "#00efd980",
    "pale-green": "#85f996",
    "blue-light": "#2f9bff",
    "blue-dark": "#4b68fa",
    yellow: "#f6c519",
    white: "#ffffff",
    "yellow-50": "#f6c51980",
    "yellow-20": "#f6c51933",
    "yellow-5": "#f6c5190D",
    aqua: "#8bdee41f",
    "aqua-1": "#8bdee4",
    "aqua-2": "#8bdee466",
  },
  gradient: {
    "pink-1": "#ED6A7D",
    "pink-2": "#EA35FA",
    "pink-3": "#B82DDE",
    "pink-4": "#E04FD933",
    "blue-1": "#2F9BFF",
    "blue-2": "#4B68FA",
    "purple-1": "#9F4DF8",
    "purple-2": "#624BC2",
    "green-1": "#00DF9C",
    "green-2": "#009E6F",
    "green-3": "#85f99633",
    "grey-1": "#454c5466",
    "grey-2": "#dee2e699",
    "grey-3": "#a8a9ab33",
    "grey-4": "#c1bfc433",
    "grey-5": "#f8f9fa52",
    "grey-6": "#454c5480",
    "grey-7": "#a8a9abcc",
    "grey-8": "#c1bfc414",
    "grey-9": "#454c5433",
    "grey-10": "#f8f9fa99",
    "grey-11": "#a8a9ab1f",
    "grey-12": "#ffffff33",
    "grey-13": "#454c5440",
  },
  highlight: {
    yellow: "#E3FF12",
  },
  grey: {
    0: "#27292D",
    1: "#2b2b2b",
    2: "#3c3c3c",
    3: "#555555",
    4: "#8c8c8c",
    5: "#aeaeae",
    6: "#e5e5e5",
    7: "#f2f2f2",
    8: "#333333",
    9: "#3d3d3d",
    10: "#3b3b3b",
    11: "#706D79",
    12: "#424A52",
    13: "#454C54",
    14: "#1E2023",
    15: "#1E2125",
    16: "#6C757D",
    17: "#A8A9AB",
    18: "#d3d5d6",
    19: "#1d2025",
    20: "#C9C9C9",
    21: "#c1bfc4",
    22: "#282d30",
    23: "#cacdd1",
  },
  status: {
    success: "#00df9c",
    error: "#ff3737",
    warning: "#ff9a33",
    "gradient-error": "#f3585833",
    "error-1": "#f35858",
  },
  custom: {
    yellow: "#f6c519",
    yellowOpacity5: "#f6c5190D",
    pink: "#d32dca",
    mintgreen: "#00efd9",
    sourceBgColor: "#ea35fa",
    destinationBgColor: "#00efd980",
    sourceTextColor: "#ea35fa",
    destinationTextColor: "#00efd9",
    sourceSelectionColor: "#D32DCA80",
    destinationSelectionColor: "#00EFD933",
    blackPearl: "#141619",
    patternGrey: "#DEE2E6",
    ghostWhite: "#F8F9FA",
  },
  hover: {
    "grey-1": "#343A40",
  },
  specc: {
    neutral1: "#060606",
    neutral2: "#161616",
    neutral3: "#848484",
    neutral4: "#D9D9D9",
    neutral5: "#CACDD1",
    TW4: "rgba(255, 255, 255, 0.04)",
    TW8: "rgba(255, 255, 255, 0.08)",
    TB75: "rgba(0, 0, 0, 0.75)",
    cardbtn: "#0C0C0D",
    cardbtnborder: "#1D1E1F",
    txt: "#F8F9FA",
  },
};

export const gradientColors = {
  "wizard-controls-gradient": "linear-gradient(0deg, #383D43 -151.52%, #1C1F23 165.86%)",
  "landing-sidebar-gradient": "linear-gradient(180deg, rgba(18, 20, 23, 0) 56.89%, #2F3139 113.4%)",
  "purple-menu-gradient": "linear-gradient(134.34deg, rgba(134, 98, 227, 0.2) -7.93%, rgba(134, 98, 227, 0.9) 118.96%)",
  "pink-menu-gradient": "linear-gradient(134.34deg, rgba(230, 113, 156, 0.2) -7.93%, rgba(224, 79, 217, 0.9) 118.96%)",
  "blue-menu-gradient": "linear-gradient(134.34deg, rgba(103, 187, 249, 0.2) -7.93%, rgba(103, 187, 249, 0.9) 118.96%)",
  "sidebar-option-gradient": "linear-gradient(23.5deg, #343A40 -79.3%, rgba(52, 58, 64, 0) 234.04%)",
  "primary-button-gradient": "linear-gradient(90deg, #E04FD9 0%, #E6719C 100%)",
  "stripe-button-gradient": "linear-gradient(92.88deg, rgba(30, 33, 37, 0.2) -32.82%, rgba(69, 76, 84, 0.8) 95.65%)",
  "project-card-gradient": "linear-gradient(24.77deg, #343A40 26.75%, rgba(52, 58, 64, 0) 126.94%)",
  "custom-modal-gradient": "linear-gradient(170.33deg, #202427 1.59%, #353B40 100.79%)",
  "modal-bg-gradient": "linear-gradient(170.33deg, #202427 1.59%, #353B40 100.79%)",
  "modal-buttons-gradient": "linear-gradient(78.18deg, rgba(30, 33, 37, 0.2) -68.21%, rgba(69, 76, 84, 0.8) 101.36%)",
  "add-api-btn-gradient": "linear-gradient(24.38deg, #343A40 0.87%, rgba(52, 58, 64, 0) 120.34%)",
  "source-gradient": "linear-gradient(168.53deg, #F8F9FA -13.99%, rgba(248, 249, 250, 0) 135.32%)",
  "repeat-btn-gradient": "linear-gradient(3.16deg, #454C54 -33.24%, rgba(69, 76, 84, 0) 156.36%)",
  "inner-select-gradient": "linear-gradient(325.24deg, #343A40 6.92%, rgba(52, 58, 64, 0) 105.71%)",
  "exit-match-gradient": "linear-gradient(90deg, #E3FF12 -30.42%, #C0FF12 125.52%)",
  "example-data-gradient": "linear-gradient(24deg, #343A40 0.87%, rgba(52, 58, 64, 0.00) 120.34%)",
  "popover-gradient": "linear-gradient(180deg, rgba(18, 20, 23, 0) -32.26%, #2F3139 113.4%)",
  "start-new-project-button-gradient": "linear-gradient(95.58deg, rgba(224, 79, 217, 0) -43.5%, #E6719C 129.65%)",
  "choose-from-template-button-gradient": "linear-gradient(134.34deg, rgba(134, 98, 227, 0.2) -7.93%, rgba(134, 98, 227, 0.9) 118.96%)",
  "topBar-gradient": "linear-gradient(0.37deg, #383D43 -151.52%, #1C1F23 165.86%)",
};

export const boxShadow = {
  "primary-button": "0px 0px 5px 1px #E04FD966",
  "stripe-button": "0px 4px 20px 0px #05050514",
  modal: "0px 4px 20px 0px #31373B66",
  tag: "0px 4px 4px 0px #14161914",
  "inner-select": "0px 4px 10px 0px #14161966",
  topBar: "2px 0px 20px 8px #23262B24",
  "add-module": "0px 4px 20px 0px #14161966",
};
