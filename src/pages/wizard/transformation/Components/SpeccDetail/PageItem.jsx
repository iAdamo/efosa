import { PagesContext } from "@contexts/PagesContext";
import { useContext, useEffect, useState, useRef, useCallback } from "react";

const PageItem = ({ page }) => {
  const { activePage, setActivePage, openModal, editModalId, setEditModalId, renamePage } = useContext(PagesContext);
  const [inputPageValue, setInputPageValue] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    setInputPageValue(page.pagename);
  }, [page.pagename]);

  useEffect(() => {
    if (page.id === editModalId && inputRef) {
      inputRef.current.focus();
    }
  }, [inputRef, editModalId, page.id]);
  const handleInputBlur = useCallback(
    (e) => {
      setEditModalId(null);
      renamePage(page.id, e.target.value);
    },
    [page.id]
  );
  if (!page) {
    return null;
  }
  return (
    <div className="flex px-4 pageItem">
      <div className="grow flex items-center gap-[24px] cursor-pointer">
        <div className={`w-[9px] h-2 pl-2 ${activePage.id !== page.id && "opacity-0"} `}>v</div>
        {editModalId === page.id ? (
          <input
            className="renameInput px-0 py-2"
            ref={inputRef}
            value={inputPageValue}
            onChange={(e) => {
              setInputPageValue(e.target.value);
            }}
            onBlur={handleInputBlur}
          />
        ) : (
          <p
            className="grow py-2 text-[12px]"
            onContextMenu={(e) => {
              e.preventDefault();
              openModal(e);
            }}
            onClick={() => {
              if (activePage === page) {
                return;
              } else {
                setActivePage(page);
              }
            }}>
            {inputPageValue}
          </p>
        )}
      </div>
    </div>
  );
};

export default PageItem;
