import SearchIcon from "@assets/icons/search.svg?react";
import XIcon from "@assets/icons/x-icon.svg?react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";
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
  const [recentSearches, setRecentSearches] = useState([]);

  const inputRef = useRef(null);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchText(value);
    onSearchChange(value);
  };

  const handleSearchSubmit = () => {
    if (searchText.trim() && !recentSearches.includes(searchText)) {
      setRecentSearches((prev) => {
        const updated = [searchText, ...prev].slice(0, 5); // Limit to 5 recent searches
        return updated;
      });
    }
  };

  useEffect(() => {
    if (isExtended && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isExtended]);

  return (
    <div className="fixed z-[15000] bottom-0 left-0 w-full flex justify-center items-center p-8 ">
      {isExtended && extended && (
        <div className="fixed inset-0 bg-[#06060640] backdrop-blur-sm"></div>
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
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute bottom-14 -left-36 -translate-x-1/2 flex justify-center"
                >
                  <div className="bg-specc-neutral2 border border-specc-TW4 w-[34rem] rounded-2xl">
                    <div className="flex flex-row justify-between px-2 items-center rounded-t-2xl border-b border-specc-TW4">
                      <CustomInput
                        variant="searchBox"
                        className="w-full"
                        inputClassName="w-full !bg-transparent border-0 rounded-none"
                        placeholder={placeholder}
                        value={searchText}
                        onChange={handleSearchChange}
                        onKeyDown={(e) =>
                          e.key === "Enter" && handleSearchSubmit()
                        }
                        ref={inputRef}
                      />
                      <XIcon
                        className="icon-white cursor-pointer"
                        onClick={() => setIsExtended(false)}
                      />
                    </div>

                    <div className="overflow-y-auto max-h-60 p-2 space-y-2 flex-shrink-0">
                      {searchText ? (
                        searchResults.length > 0 ? (
                          searchResults.map((result, index) => (
                            <div
                              key={index}
                              className="bg-specc-TW4 border border-specc-neutral2 p-4 hover:bg-specc-TW4 hover:border-specc-neutral4 cursor-pointer text-specc-neutral4 rounded-md"
                              onClick={() => handleSelectSearch(result)}
                            >
                              {result}
                            </div>
                          ))
                        ) : (
                          <div className="text-specc-neutral4 text-center p-6">
                            No results found
                          </div>
                        )
                      ) : recentSearches.length > 0 ? (
                        <>
                          <div className="text-specc-neutral4 font-medium px-4 py-2">
                            Recent Searches
                          </div>
                          {recentSearches.map((search, index) => (
                            <div
                              key={index}
                              className="px-4 py-2 hover:bg-specc-neutral3 cursor-pointer text-specc-neutral4"
                              onClick={() => handleSelectSearch(search)}
                            >
                              {search}
                            </div>
                          ))}
                        </>
                      ) : (
                        <div className="text-specc-neutral4 text-center p-6">
                          No recent searches
                        </div>
                      )}
                    </div>
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
            onChange={handleSearchChange}
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
