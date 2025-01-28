import {useContext, useEffect, useMemo, useState} from "react";
import { useParams } from "react-router-dom";
import STabs from "@components/STabs.jsx";
import CustomInput from "@components/CustomInput.jsx";
import { GeneralContext } from "@contexts/GeneralContext.jsx";
import ProjectManagement from "@pages/clients/partial/tabs/projects-tab/index.jsx";
import AuthManagement from "@pages/clients/partial/tabs/auths-tab/index.jsx";
import auths from "../tabs/auths-tab/authData.json";

const ProjectAuthManagement = () => {
    const { projects } = useContext(GeneralContext);
    const { clientId } = useParams();
    const [searchText, setSearchText] = useState('');
    const [selectedTab, setSelectedTab] = useState("Projects");

    const getSelectedTab = (value) => setSelectedTab(value);

    const filteredProjects = useMemo(() =>
        projects.filter((project) => project.clientId === +clientId), [projects, clientId]);

    const filteredAuths = useMemo(() =>
        auths.filter((auth) => auth.assignedId === +clientId), [auths, clientId]);

    const filterList = (list, searchText) => {
        return list.filter(item =>
            item.name?.toLowerCase().includes(searchText.toLowerCase())
        );
    };

    const filteredProjectsList = useMemo(() =>
        searchText ? filterList(filteredProjects, searchText) : filteredProjects,
    [searchText, filteredProjects]
    );

    const filteredAuthsList = useMemo(() =>
        searchText ? filterList(filteredAuths, searchText) : filteredAuths,
    [searchText, filteredAuths]
    );

    return (
        <div className="">
            <STabs
                getSelectedTab={getSelectedTab}
                tabListSibling={
                    <div className="flex gap-5 items-center">
                        <CustomInput
                            variant="searchBox"
                            className="min-w-[600px] w-full"
                            inputClassName="w-full"
                            placeholder="Search"
                            onChange={(e) => setSearchText(e.target.value)}
                        />
                    </div>
                }
                tabStyles={{
                    tabContent: "!p-0",
                    tabChild: "justify-between",
                    tabListStyle: "flex w-[200px] bg-grey-15 p-2 text-grey-17 rounded",
                    activeTab: "!bg-grey-13"
                }}
                tabs={[
                    {
                        name: "Projects",
                        children: <ProjectManagement projectsList={filteredProjectsList} />,
                    },
                    {
                        name: "Saved Auths",
                        children: <AuthManagement authsList={filteredAuthsList} />,
                    },
                ]}
            />
        </div>
    );
};

export default ProjectAuthManagement;
