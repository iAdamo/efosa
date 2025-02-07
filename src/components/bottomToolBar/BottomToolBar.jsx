import XIcon from "@assets/icons/cross.svg?react";
import SearchIcon from "@assets/icons/search.svg?react";
import SearchResults from "@components/SearchResults";
import useRecentSearches from "@hooks/BottomToolBar/useRecentSearches";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../Button";
import CustomInput from "../CustomInput";

const BottomToolBar = ({
  extended = false,
  onSearchChange,
  placeholder = "Search",
  buttons = [],
  className = "",
  inputClassName = "",
  searchResults = [],
}) => {
  const [isExtended, setIsExtended] = useState(false);
  const [searchText, setSearchText] = useState("");
  const { recentSearches, addRecentSearch } = useRecentSearches();
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const handleSelectSearch = (result) => {
    const { uploadUrl, name } = result;
    if (uploadUrl) {
      setIsExtended(false);
      navigate(uploadUrl);
    }

    if (result && !recentSearches.includes(result)) {
      addRecentSearch(result);
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchText(value);
    onSearchChange(value);
  };

  useEffect(() => {
    if (isExtended && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isExtended]);

  return (
    <div className="fixed z-[15000] bottom-0 left-0 w-full flex justify-center items-center p-8">
      {isExtended && extended && (
        <div className="fixed inset-0 bg-[#06060640] backdrop-blur-sm"></div>
      )}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200 }}
        className={`relative flex flex-row p-1 w-auto ${className}`}
      >
        {extended ? (
          <>
            <Button
              variant="outline"
              onClick={() => setIsExtended(!isExtended)}
              className={`gap-2 ${inputClassName}`}
            >
              <SearchIcon className="icon-white" />
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
                  <div className="flex flex-col gap-1 pb-1 bg-specc-neutral2 border border-specc-TW4 w-[34rem] rounded-2xl">
                    <div className="flex flex-row justify-between px-4 items-center rounded-t-2xl border-b border-specc-TW4">
                      <CustomInput
                        variant="searchBox"
                        className="w-full"
                        inputClassName="w-full !bg-transparent border-0 rounded-none"
                        placeholder={placeholder}
                        value={searchText}
                        onChange={handleSearchChange}
                        ref={inputRef}
                      />
                      <XIcon
                        className="icon-white cursor-pointer"
                        onClick={() => setIsExtended(false)}
                      />
                    </div>
                    <SearchResults
                      results={searchResults}
                      onSelect={handleSelectSearch}
                      recentSearches={recentSearches}
                      searchText={searchText}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        ) : (
          <CustomInput
            variant="searchBox"
            className="rounded-3xl"
            inputClassName={inputClassName}
            placeholder={placeholder}
            onChange={handleSearchChange}
          />
        )}
        {buttons.map((ButtonComponent, index) => (
          <ButtonComponent key={index} />
        ))}
      </motion.div>
    </div>
  );
};

export default BottomToolBar;
