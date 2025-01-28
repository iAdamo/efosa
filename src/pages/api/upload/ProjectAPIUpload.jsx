import { useContext } from "react";
import API from "../../../pages/api/upload/index.jsx";
import { ProjectContext } from "@/contexts/ProjectContext.jsx";
import { useParams } from "react-router-dom";
export default function ProjectAPIUpload(props) {
	const { projectID, sourceAPI, destinationAPI } = useContext(ProjectContext);
	const { direction: urlDirection } = useParams();

	const {
		sourceAPIID,
		destinationAPIID,
		specc,
		refreshProjectInitialData,
		sourceAuthentication,
		destinationAuthentication,
		setSourceAuthentication,
		setDestinationAuthentication,
	} = useContext(ProjectContext);

	let APIID = null;
	let auth = null;
	let setAuth = null;
	if (urlDirection.toUpperCase() === "SOURCE") {
		APIID = sourceAPIID;
		auth = sourceAuthentication;
		setAuth = setSourceAuthentication;
	} else {
		APIID = destinationAPIID;
		auth = destinationAuthentication;
		setAuth = setDestinationAuthentication;
	}

	let selectedAPI = null;
	if (urlDirection.toLowerCase() === "source") {
		selectedAPI = sourceAPI;
	} else {
		selectedAPI = destinationAPI;
	}

	return (
		<>
			<API
				API={selectedAPI}
				projectID={projectID}
				direction={urlDirection}
				auth={auth}
				setAuth={setAuth}
				refreshFunction={refreshProjectInitialData}
			/>
		</>
	);
}
