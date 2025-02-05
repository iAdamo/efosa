import SearchIcon from "@assets/icons/search.svg?react";
import { motion } from "framer-motion";
import { useState } from "react";
import Button from "./Button";
import CustomInput from "./CustomInput";

const BottomToolBar = ({
  extended = false,
  onSearchChange,
  placeholder = "Search",
  buttons = [], // Array of additional buttons
  className = "",
  inputClassName = "",
}) => {
  const [isExtended, setIsExtended] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);

  return (
    <div
      className="fixed z-50 bottom-0 left-0 w-full flex justify-center items-center p-8 "
    >
      {isExtended && extended && (
        <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm"></div>
      )}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200 }}
        className={`"relative flex " ${className}`}
      >
        {extended ? (
          <Button
            onClick={() => setIsExtended(!isExtended)}
            className={`flex flex-row gap-2 justify-center items-center
               !bg-transparent ${inputClassName}`}
          >
            <SearchIcon className="icon-white " />
            <span className="text-[16px] p-1 text-specc-neutral4">Search</span>
          </Button>
        ) : (
          <>
            <CustomInput
              variant="searchBox"
              className="w-1/2 rounded-3xl"
              inputClassName={`${inputClassName}`}
              placeholder={placeholder}
              onChange={onSearchChange}
            />
            {buttons.map((btn, index) => (
              <Button
                key={index}
                onClick={btn.onClick}
                className={btn.btnClassName}
                variant={btn.variant}
              >
                {btn.icon && <btn.icon />}
                {btn.label && (
                  <span className={btn.textClassName}>{btn.label}</span>
                )}
              </Button>
            ))}
          </>
        )}
      </motion.div>
    </div>
  );
};

export default BottomToolBar;
