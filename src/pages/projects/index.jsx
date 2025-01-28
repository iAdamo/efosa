import { useContext, useState } from "react";

import Button from "@/components/Button";
import CustomInput from "@/components/CustomInput";
import SBreadcrumbs from "@/components/SBreadcrumbs";
import SDialog from "@/components/SDialog";
import DeleteModal from "@/components/modals/delete-modal";
import CreateNewProjectModal from "@/pages/projects/CreateNewProjectModal";
import PlusIcon from "@assets/icons/plusIcon.svg?react";
import { deleteGenericCRUDWithID } from "@axios/apiCalls";
import { GeneralContext } from "@contexts/GeneralContext";
import Fuse from "fuse.js";
import ProjectCard from "./ProjectCard";

export default function Projects(props) {
	const { projects, refreshGeneralInitialData } = useContext(GeneralContext);
	const [projectList, setProjectList] = useState(projects);
	const [deleteModalState, setDeleteModalState] = useState({
		isOpen: false,
		id: "",
		name: "",
	});
	const [open, setOpen] = useState(false);

	const fuseOptions = {
		// isCaseSensitive: false,
		includeScore: true,
		// shouldSort: true,
		includeMatches: true,
		//findAllMatches: true,
		minMatchCharLength: 1,
		// location: 0,
		threshold: 0.5,
		// distance: 100,
		//useExtendedSearch: true,
		//ignoreLocation: true,
		// ignoreFieldNorm: false,
		// fieldNormWeight: 1,
		keys: ["name"],
	};

	const setProjectListBasedOnSearch = (searchText) => {
		let list = [];
		if (searchText === "") {
			list = [...projects];
		} else if (projectList.length > 0) {
			if (searchText === "") {
				list = [...projects];
			}
			const fuse = new Fuse(projectList, fuseOptions);
			const result = fuse.search(searchText);

			if (result.length > 0) {
				result.map((item) => {
					list.push(item.item);
				});
			}
		}
		setProjectList([...list]);
	};

	const handleDelete = (id, name) => {
		setDeleteModalState({
			isOpen: true,
			id: id,
			name: name,
		});
	}



	return (
		<>
			<SDialog isOpen={deleteModalState.isOpen}>
				<DeleteModal
					headingText="Delete"
					contentText={`Delete ${deleteModalState.name}?
           This action cannot be undone.`}
					deleteAction={async () => {
						await deleteGenericCRUDWithID("Projects", deleteModalState.id).then(
							(res) => {
								setDeleteModalState({ ...deleteModalState, isOpen: false });

								setProjectList(
									projectList.filter((item) => item.id !== deleteModalState.id),
								);
							},
						);
						refreshGeneralInitialData()
					}}
					closeSpeccModal={() => {
						setDeleteModalState({ ...deleteModalState, isOpen: false });
					}}
				/>
			</SDialog>
			<div className="w-full h-screen flex flex-col gap-10 pl-8 p-10">
				<SBreadcrumbs />

				{/* title text */}
				<div className="w-full flex">
					<div className="w-1/2 flex flex-col gap-2">
						<span className="text-[28px] font-medium leading-larger">
							All Projects
						</span>
						<span className="w-full max-w-[585px] text-base font-normal text-grey-17 font-['Inter'] tracking-wide">
							Easily set up and oversee API integrations for seamless data exchange and optimised workflows. Keep your systems connected and communication streamlined across platforms.
						</span>
					</div>

					<div className="w-1/2 flex justify-end items-center gap-4">
						<CustomInput variant="searchBox" className="max-w-[365px] w-full" inputClassName="w-full" placeholder="Search" onChange={(e) => setProjectListBasedOnSearch(e.target.value)} />
						<div>
							<Button className="gap-2" variant="primary"
								onClick={() => setOpen(true)}
							>
								<PlusIcon />
								<span className="text-lg font-bold">New project</span>
							</Button>

							<CreateNewProjectModal open={open} setOpen={setOpen} />
						</div>
					</div>
				</div>

				{/* all projects render */}
				<div className="flex flex-col overflow-auto gap-[14px] h-full">
					{projectList.length > 0 ? (
						projectList.map((project) => {
							return (
								<ProjectCard key={project?.id} project={project} deleteClick={(id, name) => handleDelete(id, name)} />
							)
						})
					)
						:
						<div className="flex w-full justify-center h-full items-center">
							<div className="text-white text-lg font-bold font-['Inter'] ">
								No projects found
							</div>
						</div>
					}
				</div>
			</div>

		</>
	);
}
