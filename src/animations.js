export const routeAnim = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
  },
  exit: {
    opacity: 0,
  },
};

export const sidebarFlyIn = {
  initial: {
    x: -100,
    opacity: 0,
  },
  animate: {
    x: 0,
    opacity: 1,
  },
  exit: {
    x: -100,
    opacity: 0,
  },
  transition: {
    duration: 0.8,
    type: "spring",
  },
};

export const sidebarFlyInRight = {
  initial: {
    x: +100,
    opacity: 0,
  },
  animate: {
    x: 0,
    opacity: 1,
  },
  exit: {
    x: +100,
    opacity: 0,
  },
  transition: {
    duration: 0.8,
    type: "spring",
  },
};

export const navbarFlyIn = {
  initial: {
    y: -50,
    opacity: 0,
  },
  animate: {
    y: 0,
    opacity: 1,
  },
  exit: {
    y: -50,
    opacity: 0,
  },
  transition: {
    duration: 0.8,
    type: "spring",
  },
};

export const modalOpen = {
  initial: {
    scale: 0.8,
    opacity: 0,
  },
  animate: {
    scale: 1,
    opacity: 1,
  },
  exit: {
    scale: 0,
    opacity: 0,
  },
  transition: {
    duration: 0.8,
    type: "spring",
  },
};

export const opacityAnim = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
  },
  exit: {
    opacity: 0,
  },
};
