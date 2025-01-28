import { fetchProjectInitial } from "@axios/projectApiCalls";
import Loading from "@components/loaders/Loading";
import { createContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export const ProjectContext = createContext(null);

const ProjectWrapper = ({ children, projectId }) => {
	const { urlProjectID } = useParams();
	const [isInitialDataFetched, setIsInitialDataFetched] = useState(false);
	const [projectID, setProjectID] = useState(urlProjectID || projectId);
	const [sourceAPIID, setSourceAPIID] = useState(null);
	const [sourceAPICustomName, setSourceAPICustomName] = useState("");
	const [destinationAPICustomName, setDestinationAPICustomName] = useState("");
	const [destinationAPIID, setDestinationAPIID] = useState(null);
	const [projectName, setProjectName] = useState("");
	const [specc, setSpecc] = useState(null);
	const [projectSpeccs, setProjectSpeccs] = useState([]);
	const [sourceAPI, setSourceAPI] = useState(null);
	const [destinationAPI, setDestinationAPI] = useState(null);
	const [variables, setVariables] = useState([]);
	const [availableDateFormats, setAvailableDateFormats] = useState([]);
	const [availablePredefinedVariables, setAvailablePredefinedVariables] =
		useState([]);
	const [isSourceAuthenticated, setIsSourceAuthenticated] = useState(false);
	const [isDestinationAuthenticated, setIsDestinationAuthenticated] =
		useState(false);

	const [sourceAuthentication, setSourceAuthentication] = useState(null);
	const [destinationAuthentication, setDestinationAuthentication] =
		useState(null);

	const [availableSNC, setAvailableSNC] = useState([]);

	const [autolist, setAutolist] = useState(null);

	const [isLoading, setIsLoading] = useState(false);

	const refreshProjectInitialData = async () => {
		const initialData = await getProjectInitialData();
		setProjectInitialData(initialData);
	};

	const getProjectInitialData = async () => {
		const initialData = await fetchProjectInitial(projectID);
		return initialData;
	};

	const contextValue = {
		refreshProjectInitialData,
		projectName,
		setProjectName,
		projectID,
		sourceAPIID,
		destinationAPIID,
		sourceAPICustomName,
		setSourceAPICustomName,
		destinationAPICustomName,
		setDestinationAPICustomName,
		specc,
		projectSpeccs,
		sourceAPI,
		destinationAPI,
		variables,
		setVariables,
		availableDateFormats,
		availablePredefinedVariables,
		autolist,
		setAutolist,
		isSourceAuthenticated,
		isDestinationAuthenticated,
		sourceAuthentication,
		destinationAuthentication,
		setSourceAuthentication,
		setDestinationAuthentication,
		availableSNC,
	};

	const setProjectInitialData = (initialData) => {
		//setFirstName(initialData.user.firstName);
		//setLastName(initialData.user.lastName);
		//setProjects(initialData.projects);
		setProjectName(initialData.project.name);
		setSourceAPIID(initialData?.project?.sourceAPIID);

		setSourceAPICustomName(initialData?.sourceAPICustomName);
		setDestinationAPICustomName(initialData?.destinationAPICustomName);

		setDestinationAPIID(initialData?.project?.destinationAPIID);
		setSpecc(initialData?.specc);
		setProjectSpeccs(initialData?.speccs);
		setSourceAPI(initialData?.project.sourceAPI);
		setDestinationAPI(initialData?.project.destinationAPI);
		setVariables(initialData?.variables);
		setAvailableDateFormats(initialData?.availableDateFormats);
		setAvailablePredefinedVariables(initialData?.availablePredefinedVariables);
		setAutolist(initialData?.autolist);
		setIsSourceAuthenticated(initialData?.isSourceAuthenticated);
		setIsDestinationAuthenticated(initialData?.isDestinationAuthenticated);
		setSourceAuthentication(initialData?.sourceAuth);
		setDestinationAuthentication(initialData?.destinationAuth);
		setAvailableSNC(initialData?.availableSNC);
	};

	useEffect(() => {
		if (!isInitialDataFetched) {
			setIsLoading(true);
			getProjectInitialData(projectID).then((initialData) => {
				setProjectInitialData(initialData);
				setIsInitialDataFetched(true);
				setIsLoading(false);
			});
		}
		return () => { };
	}, [isInitialDataFetched, setIsInitialDataFetched]);
	// change it
	if (!isInitialDataFetched) {
		return <Loading />;
	}

	return (
		<ProjectContext.Provider value={contextValue}>
			{children}
		</ProjectContext.Provider>
	);
};
export default ProjectWrapper;
