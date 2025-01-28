import Loading from "@components/loaders/Loading";
import { fetchGeneralInitial } from "@axios/generalApiCalls";
import React, { createContext, useEffect, useState } from "react";
export const GeneralContext = createContext(null);

const GeneralWrapper = (props) => {
	const [isInitialDataFetched, setIsInitialDataFetched] = useState(false);
	const [firstName, setFirstName] = useState(null);
	const [lastName, setLastName] = useState(null);
	const [companyName, setCompanyName] = useState(null);
	const [userID, setUserID] = useState(null);
	const [projects, setProjects] = useState([]);
	const [myAPIs, setMyAPIs] = useState([]);
	const [clients, setClients] = useState([]);

	const [auths, setAuths] = useState([]);
	const [isLoading, setIsLoading] = useState(false);

	const refreshGeneralInitialData = () => {
		getGeneralInitialData().then((initialData) => {
			setGeneralInitialData(initialData);
		});
	};

	const getGeneralInitialData = async () => {
		const initialData = await fetchGeneralInitial();
		return initialData;
	};

	let newVar = {
		refreshGeneralInitialData,
		firstName,
		projects,
		myAPIs,
		setMyAPIs,
		lastName,
		userID,
		companyName,
		auths,
		setAuths,
		clients,
		setClients
	};
	const contextValue = newVar;

	const setGeneralInitialData = (initialData) => {
		setFirstName(initialData.user.firstName);
		setLastName(initialData.user.lastName);
		setProjects(initialData.projects);
		setMyAPIs(initialData?.myAPIs);
		setClients(initialData?.clients);
		setUserID(initialData.user.id);
		setCompanyName(initialData?.user?.companyName);
		setAuths(initialData?.myAuths)
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: <Todo: In future change to zustant>
	useEffect(() => {
		if (!isInitialDataFetched) {
			setIsLoading(true);
			getGeneralInitialData(props.speccID).then((initialData) => {
				setGeneralInitialData(initialData);
				setIsInitialDataFetched(true);
				setIsLoading(false);
			});
		}
	}, [isInitialDataFetched]);

	if (!isInitialDataFetched) {
		return (
			<div className="h-screen">
				<Loading />
			</div>
		);
	}

	return (
		<GeneralContext.Provider value={contextValue}>
			{props.children}
		</GeneralContext.Provider>
	);
};
export default GeneralWrapper;
