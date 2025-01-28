import { PagesContext } from "@contexts/PagesContext";
import useOutsideClickHandler from "@hooks/useOutsideHandler";
import { useCallback, useContext, useEffect, useRef, useState } from "react";

const PageModal = ({ page, pos }) => {
    const { setIsOpenModal, deletePage, setEditModalId } =
        useContext(PagesContext);

    const modalToolbarRef = useRef(null);
    useOutsideClickHandler(modalToolbarRef, () => setIsOpenModal(false));

    const startPageRename = useCallback(() => {
        setEditModalId(page.id);
        setIsOpenModal(false);
    }, [page.id]);

    return (
        <div
            ref={modalToolbarRef}
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
            }}
            className={`w-[194px] pageModal cursor-pointer absolute bg-[#1C1C1C] py-[14px] z-50`}
            style={{
                top: pos.y - 50 + "px",
                right: window.innerWidth - pos.x + "px",
            }}
        >
            <p className="px-4 py-1 cursor-pointer" onClick={startPageRename}>
                Rename
            </p>
            <p
                className="px-4 py-1 cursor-pointer"
                onClick={() => deletePage(page.id)}
            >
                Delete
            </p>
        </div>
    );
};

export default PageModal;
