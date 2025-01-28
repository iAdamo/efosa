import { PagesContext } from "@contexts/PagesContext";
import { WizardContext } from "@contexts/WizardContext";
import useOutsideClickHandler from "@hooks/useOutsideHandler";
import { PlusIcon } from "@heroicons/react/solid";

import { useContext, useEffect, useRef } from "react";
import PageItem from "./PageItem";
import PageModal from "./PageModal";
import OperationNodes from "../OperationNodes/OperationNodes";
import ActionLog from "./ActionLog";

const SideBar = () => {
	const { isSidebarOpen, setIsSidebarOpen } = useContext(WizardContext);

	const { pages, addNewPage, speccID, isOpenModal, positionModal } =
		useContext(PagesContext);

	const pageToolbarRef = useRef(null);
	useOutsideClickHandler(pageToolbarRef, (e) => {
		let runClose = true;
		let currentTarget = e.target;
		while (currentTarget) {
			if (currentTarget.className && currentTarget.className.length > 0) {
				if (currentTarget.className) {
					if (currentTarget.className.includes("largeButtonContainer")) {
						runClose = false;
						break;
					}
				}
			}
			currentTarget = currentTarget.parentElement;
		}
		console.log("runClose", runClose);

		if (runClose) {
			setIsSidebarOpen(null);
		}
	});

	if (!isSidebarOpen) {
		return null;
	}

	return (
		<div
			ref={pageToolbarRef}
			className="w-[213px] h-full bg-[#080808] right-0 top-0 z-30 pt-3 absolute z-[9999]"
		>
			{isOpenModal && <PageModal page={isOpenModal} pos={positionModal} />}

			{isSidebarOpen == "Pages" && (
				<div className="pb-2">
					<div className="flex border-b pb-2">
						<div className="flex-grow pl-6 font-bold text-[12px]">Pages</div>
						<div className="pr-6 bg-white text-black" onClick={addNewPage}>
							<PlusIcon
								className="text-black bg-white w-[14px] h-[14px]"
								aria-hidden="true"
							/>
						</div>
					</div>
					{pages?.length > 1 && (
						<PageItem
							page={{
								id: "combined",
								pagename: "Combined",
								speccID: speccID,
							}}
						/>
					)}

					{pages?.map((page) => {
						return <PageItem page={page} key={page.id} />;
					})}
				</div>
			)}

			{isSidebarOpen == "ON" && <OperationNodes />}
			{isSidebarOpen == "Action" && <ActionLog />}
		</div>
	);
};

export default SideBar;
