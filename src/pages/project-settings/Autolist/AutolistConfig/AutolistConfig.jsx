import {
	deleteGenericCRUDWithID,
	fetchAutolist,
	getMeatballsForEndpoint,
	getSearchNodeEndpoints,
	setAutoListUnique,
	setAutoListWayToList,
} from "@/axios/apiCalls";
import { useMemo, useState, useContext, useEffect } from "react";

import SelectEndpoint from "./Subsections/SelectEndpoint";
import SetMeatballValues from "./Subsections/SetMeatballValues";
import SetList from "./Subsections/SetList";
import SetUnique from "./Subsections/SetUnique";
import GenerateHeaders from "./Subsections/GenerateHeaders";
import { ProjectContext } from "@/contexts/ProjectContext";

const AutolistConfig = (props) => {
	const { showDataInspector, autolist, setAutolist } = props;

	if (!autolist) {
		return <></>;
	}

	const [step, setStep] = useState(0);

	//const { speccID, setShowDataInspector } = useContext(WizardContext);
	const { setShowDataInspector } = useContext(ProjectContext);

	const { projectID } = useContext(ProjectContext);

	const [endpoints, setEndpoints] = useState(null);

	const [selectedEndpoint, setSelectedEndpoint] = useState(null);

	const [lists, setLists] = useState(null);

	const [fetchedMeatballs, setFetchedMeatballs] = useState(null);

	const [listOfUnique, setListOfUnique] = useState(null);

	useEffect(() => {
		if (
			autolist != null &&
			autolist.endpoint != null &&
			autolist.wayToList != null &&
			autolist.unique != null &&
			autolist.configFetch != null
		) {
			setStep(6);
		} else {
			if (endpoints == null) {
				setStep(0);
			} else {
				if (selectedEndpoint == null) {
					setStep(1);
				} else {
					if (lists == null) {
						if (fetchedMeatballs == null) {
							setStep(2);
						} else {
							setStep(3);
						}
					} else {
						if (listOfUnique == null) {
							setStep(4);
						} else {
							setStep(5);
						}
					}
				}
			}
		}
	}, [
		endpoints,
		selectedEndpoint,
		lists,
		fetchedMeatballs,
		listOfUnique,
		JSON.stringify(autolist),
	]);

	const selectEndpointClick = async (endpoint) => {
		setSelectedEndpoint(endpoint);
		const meatballs = await getMeatballsForEndpoint(
			projectID,
			"SOURCE",
			endpoint,
		);

		setFetchedMeatballs(meatballs);
	};

	useEffect(() => {
		(async () => {
			const allEndpointsResponse = await getSearchNodeEndpoints(
				projectID,
				"SOURCE",
			);

			if (Array.isArray(allEndpointsResponse)) {
				setEndpoints(allEndpointsResponse);
			}
		})();
	}, []);

	const updateMeatballValue = (index, value) => {
		const allMeatballs = [];
		for (let i = 0; i < fetchedMeatballs.length; i++) {
			if (i == index) {
				if (fetchedMeatballs[i].type == "boolean") {
					if (value == "-1") {
						delete fetchedMeatballs[i].value;
					} else {
						fetchedMeatballs[i].value = value == 1 ? true : false;
					}
				} else {
					if (value.length == 0) {
						delete fetchedMeatballs[i].value;
					} else {
						fetchedMeatballs[i].value = value;
					}
				}
			}

			allMeatballs.push(fetchedMeatballs[i]);
		}

		setFetchedMeatballs(allMeatballs);
	};

	const fetchDataClick = async () => {
		const data = await fetchAutolist(
			autolist.id,
			selectedEndpoint,
			fetchedMeatballs,
		);

		setLists(data.lists);
		setAutolist(data.autolist);
	};

	const setListClick = async (list) => {
		const uniques = await setAutoListWayToList(autolist.id, list);

		setListOfUnique(uniques.uniqueList.waypoints);
		setAutolist(uniques.autolist);
	};

	const setUniqueClick = async (unique) => {
		const success = await setAutoListUnique(autolist.id, unique);
		setAutolist(success.autolist);
	};

	const deleteAutolistClick = async () => {
		const deleteAutolist = await deleteGenericCRUDWithID("Autolist", autolist.id);
		setAutolist(null);
	};

	if (step == 6) {
		return <></>;
	}

	return (
		<>
			<div className="modal h-screen">
				<div
					className="modal-backdrop"
					onClick={() => {
						setShowDataInspector(false);
					}}
				></div>

				<div className={`modal-content flex flex-col scroll h-[90%] w-[90%]`}>
					Step: {step}
					<div
						onClick={() => {
							deleteAutolistClick();
						}}
					>
						X
					</div>
					{step == 0 && (
						<>
							<div className="flex flex-col">
								<div className="flex-grow text-center text-[20px]">
									<p>Fetching endpoints...</p>
								</div>
							</div>
						</>
					)}
					{step == 1 && (
						<>
							<SelectEndpoint
								endpoints={endpoints}
								selectEndpointClick={selectEndpointClick}
							/>
						</>
					)}
					{step == 2 && (
						<>
							<div className="flex flex-col">
								<div className="flex-grow text-center text-[20px]">
									<p>Fetching meatballs...</p>
								</div>
							</div>
						</>
					)}
					{step == 3 && (
						<>
							<SetMeatballValues
								updateMeatballValue={updateMeatballValue}
								fetchedMeatballs={fetchedMeatballs}
								selectedEndpoint={selectedEndpoint}
								setFetchedMeatballs={setFetchedMeatballs}
								fetchDataClick={fetchDataClick}
							/>
						</>
					)}
					{step == 4 && <SetList setListClick={setListClick} lists={lists} />}
					{step == 5 && (
						<SetUnique
							setUniqueClick={setUniqueClick}
							listOfUnique={listOfUnique}
							setListOfUnique={setListOfUnique}
						/>
					)}
				</div>
			</div>
		</>
	);
};

export default AutolistConfig;
