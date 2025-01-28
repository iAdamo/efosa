import ActiveStepIcon from "@assets/icons/active-step-icon.svg?react";
import Warning from "@assets/icons/warning.svg?react";
import CircularProgress from "@components/loaders/CircularLoader";

const getOptionIcon = (option) => {
  return (
    <div className="h-s16 max-w-s16 min-h-s16 z-10">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="8" cy="8" r="7" stroke="#454C54" stroke-width="2" />
      </svg>
    </div>
  );
};

export const getIcon = (icon, isOK, isCollapsed, isActive) => {
  if (isActive) {
    return (
      <div className="h-s16 max-w-s16 min-h-s16 z-10">
        <ActiveStepIcon imgClassName="w-[15px] h-[15px]" />
      </div>
    );
  }
  if (isOK === "LOADING") {
    return <CircularProgress imgClassName="w-[15px] h-[15px] z-10" />;
  }
  if (!isCollapsed) {
    if (isOK === "OK") {
      return (
        <svg className="z-10" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="8" cy="8" r="7" stroke="#85F996" stroke-width="2" />
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M11.3744 5.29289C11.7649 5.68342 11.7649 6.31658 11.3744 6.70711L7.70776 10.3738C7.31723 10.7643 6.68407 10.7643 6.29354 10.3738L4.62688 8.70711C4.23635 8.31658 4.23635 7.68342 4.62688 7.29289C5.0174 6.90237 5.65057 6.90237 6.04109 7.29289L7.00065 8.25245L9.96021 5.29289C10.3507 4.90237 10.9839 4.90237 11.3744 5.29289Z"
            fill="#85F996"
          />
        </svg>
      );
    }
    if (isOK === "ERROR") {
      return <Warning alt="warning" className="icon-error z-10" />;
    }
  }
  return getOptionIcon(icon);
};
