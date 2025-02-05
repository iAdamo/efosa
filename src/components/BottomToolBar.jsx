import SearchIcon from "@assets/icons/search.svg?react";
import { AnimatePresence, motion } from "framer-motion";
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
  searchResults = [],
}) => {
  const [isExtended, setIsExtended] = useState(false);
  const [searchText, setSearchText] = useState("");

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchText(value);
    onSearchChange(value);
  };

  return (
    <div className="fixed z-50 bottom-0 left-0 w-full flex justify-center items-center p-8 ">
      {isExtended && extended && (
        <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm"></div>
      )}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200 }}
        className={`relative flex flex-row p-1 ${className}`}
      >
        {extended ? (
          <>
            <Button
              variant="outline"
              onClick={() => setIsExtended(!isExtended)}
              className={`flex flex-row !w-1/2 gap-2 justify-center items-center ${inputClassName}`}
            >
              <SearchIcon className="icon-white " />
              <span className="text-[16px] text-specc-neutral4">Search</span>
            </Button>
            <AnimatePresence>
              {isExtended && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-[#000000BF] backdrop-blur-sm flex justify-center items-center"
                >
                  <div className="bg-specc-neutral2 border border-specc-TW4 w-11/12 max-w-lg rounded-2xl">
                    <CustomInput
                      variant="searchBox"
                      className="w-full mb-4"
                      inputClassName="w-full !bg-transparent border-b rounded-t"
                      placeholder={placeholder}
                      value={searchText}
                      onChange={handleSearchChange}
                    />
                    <div className="max-h-60 overflow-y-auto">
                      {searchText && searchResults.length > 0 ? (
                        searchResults.map((result, index) => (
                          <div
                            key={index}
                            className="px-4 py-2 hover:bg-specc-neutral3 cursor-pointer text-specc-neutral4"
                            onClick={() => console.log(`Selected: ${result}`)}
                          >
                            {result}
                          </div>
                        ))
                      ) : searchText ? (
                        <div className="text-specc-neutral4">
                          No results found
                        </div>
                      ) : null}
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => setIsExtended(false)}
                      className="mt-4"
                    >
                      Close
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        ) : (
          <CustomInput
            variant="searchBox"
            className="w-1/2 rounded-3xl"
            inputClassName={`${inputClassName}`}
            placeholder={placeholder}
            onChange={onSearchChange}
          />
        )}
        {buttons.map((btn, index) => (
          <Button
            key={index}
            onClick={btn.onClick}
            className={`w-1/2 ${btn.btnClassName}`}
            variant={btn.variant}
          >
            {btn.icon && <btn.icon />}
            {btn.label && (
              <span className={btn.textClassName}>{btn.label}</span>
            )}
          </Button>
        ))}
      </motion.div>
    </div>
  );
};

export default BottomToolBar;
