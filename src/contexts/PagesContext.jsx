import {
    deleteSpeccpagesApi,
    getSpeccpagesApi,
    postSpeccpagesApi,
    updateSpeccpagesApi,
} from "@axios/apiCalls";
import { createContext, useState } from "react";

export const PagesContext = createContext(null);

const PagesWrapper = (props) => {
    const [pages, setPages] = useState([]);
    const [activePage, setActivePage] = useState(null);
    const [isOpenModal, setIsOpenModal] = useState();
    const [positionModal, setPositionModal] = useState({});
    const [editModalId, setEditModalId] = useState(null);

    const { speccID } = props;

    const addFirstPage = async () => {
        const data = {
            speccID: Number(speccID),
            pagename: "Page 1",
        };

        await postSpeccpagesApi(data);
        const response = await getSpeccpagesApi(speccID);

        setPages(response.data);
    };

    const addNewPage = async () => {
        if (!pages) {
            await addFirstPage();
        } else {
            const data = {
                speccID: Number(speccID),
                pagename: `Page ${pages.length + 1}`,
            };

            await postSpeccpagesApi(data);
            const response = await getSpeccpagesApi(speccID);
            setPages(response.data);
        }
        setActivePage(pages.pop());
    };

    const renamePage = async (pageID, pageName) => {
        const data = {
            speccID,
            pagename: pageName,
        };
        await updateSpeccpagesApi(data, pageID);
        const response = await getSpeccpagesApi(speccID);
        setPages(response.data);
    };

    const deletePage = async (pageId) => {
        await deleteSpeccpagesApi(pageId, speccID);

        const allPages = await getSpeccpagesApi(speccID);
        setPages(allPages.data);
        setIsOpenModal(false);
    };

    const openModal = (e) => {
        const page = pages.find((item) => item.pagename === e.target.innerText);
        setPositionModal({ x: e.clientX, y: e.clientY });
        setIsOpenModal(page);
    };

    const contextValue = {
        pages,
        setPages,
        activePage,
        setActivePage,
        addNewPage,
        speccID,
        addFirstPage,
        deletePage,
        openModal,
        isOpenModal,
        setIsOpenModal,
        renamePage,
        setEditModalId,
        editModalId,
        positionModal,
    };

    return (
        <PagesContext.Provider value={contextValue}>
            {props.children}
        </PagesContext.Provider>
    );
};

export default PagesWrapper;
