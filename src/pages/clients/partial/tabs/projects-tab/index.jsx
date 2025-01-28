import ProjectCard from "@pages/projects/ProjectCard.jsx";
import EmptyData from "@components/EmptyData.jsx";
import FolderIcon from "@assets/icons/dashboard/sidebar/folder.svg?react";

const ProjectManagement = ({projectsList}) => {
    return (
        <div className="flex flex-col overflow-auto gap-[14px] h-full !mt-6 !mb-4">
            {!!projectsList.length ? (
                projectsList.map((project) => {
                    return (
                        <ProjectCard closeIcons key={project?.id} project={project}/>
                    )
                })
            ) : <EmptyData
                icon={<FolderIcon/>}
                info='Your list of projects is empty, start by adding a new project'
            />}
        </div>
    )
}

export default ProjectManagement;