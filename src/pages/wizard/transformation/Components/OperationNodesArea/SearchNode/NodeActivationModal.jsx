import { WizardContext } from "@contexts/WizardContext";
import {
	deleteOperationNodeApi,
	getSearchNodeEndpoints,
	setNodeForON,
} from "@axios/apiCalls";
import { useMemo, useState, useContext, useEffect } from "react";

const NodeActivationModal = (props) => {
	const { ON } = props;

	const {
		speccID,
		operationNodes,
		operationNodesConfig,
		setOperationNodes,
		sourceAPIID,
		destinationAPIID,
	} = useContext(WizardContext);

	const [selectedAPI, setSelectedAPI] = useState(null);

	const [endpoints, setEndpoints] = useState(null);

	useEffect(() => {
		(async () => {
			if (selectedAPI) {
				const allEndpointsResponse = await getSearchNodeEndpoints(
					speccID,
					selectedAPI,
				);

				if (Array.isArray(allEndpointsResponse)) {
					setEndpoints(allEndpointsResponse);
				}
			}
		})();
	}, [selectedAPI]);

	const [searchString, setSearchString] = useState("");

	const [operationNodeToUse, setOperationNodeToUse] = useState(null);

	useEffect(() => {
		let firstEmptyOperationNode = null;
		for (let i = 0; i < operationNodes.length; i++) {
			const config = operationNodesConfig.find((operationNodeConfig) => {
				if (operationNodeConfig.id == operationNodes[i].configID) {
					return true;
				}
				return false;
			});

			if (config.package == "SearchNode") {
				if (operationNodes[i].nodeID == null) {
					firstEmptyOperationNode = operationNodes[i];
					break;
				}
			}
		}

		if (firstEmptyOperationNode) {
			setOperationNodeToUse(firstEmptyOperationNode);
		} else {
			setOperationNodeToUse(null);
		}
	}, [JSON.stringify(operationNodes)]);

	if (operationNodeToUse == null) {
		return <></>;
	}

	const deleteOperationNode = async () => {
		await deleteOperationNodeApi(operationNodeToUse.id);
		const filteredNodes = operationNodes.filter(
			(el) => el.id !== operationNodeToUse.id,
		);
		setOperationNodes(filteredNodes);
	};

	const activateNodeForON = async (endpoint) => {
		const APIID = selectedAPI == "SOURCE" ? sourceAPIID : destinationAPIID;

		const model = {
			speccID: speccID,
			APIID: APIID,
			endpoint: endpoint,
			isPostResponse: false,
			name: endpoint,
			parentNode: null,
			isMatching: true,
			pairingID: null,
		};

		const ONNode = await setNodeForON(operationNodeToUse.id, model);

		const allONs = [];
		for (let i = 0; i < operationNodes.length; i++) {
			if (operationNodes[i].id == operationNodeToUse.id) {
				operationNodes[i].nodeID = ONNode;
			}
			allONs.push(operationNodes[i]);
		}
		setOperationNodes(allONs);
		setSelectedAPI(null);
		setEndpoints(null);
		setSearchString("");
	};

	return (
		<>
			<div className="modal">
				<div className="modal-backdrop"></div>
				<div className="modal-content">
					<p
						onClick={() => {
							deleteOperationNode();
						}}
					>
						Delete
					</p>
					{selectedAPI != null && endpoints != null && (
						<>
							<div className="flex flex-col text-center">
								<div>Search</div>
								<div>
									<input
										type="text"
										onChange={(e) => {
											setSearchString(e.target.value.trim());
										}}
									/>
								</div>
							</div>
							<div className="overflow-auto">
								<div className="text-center mt-6">
									<div className="">
										<div className="h-[100%]">
											{endpoints.map((endpoint) => {
												let include = true;

												if (searchString.length > 0) {
													if (!endpoint.includes(searchString)) {
														include = false;
													}
												}
												if (!include) {
													return <></>;
												}
												return (
													<div
														className="display-block h-max-content border p-2 border-[#000000] text-[18px] hover:bg-[#aaaaaa] text-left hover:cursor-pointer"
														onClick={() => {
															activateNodeForON(endpoint);
														}}
													>
														{endpoint}
													</div>
												);
											})}
										</div>
									</div>
								</div>
							</div>
						</>
					)}
					{selectedAPI != null && endpoints == null && (
						<>
							<div className="flex flex-col">
								<div className="flex-grow text-center text-[20px]">
									<p>Fetching endpoints...</p>
								</div>
							</div>
						</>
					)}
					{selectedAPI == null && (
						<>
							<div className="flex flex-col">
								<div className="flex-grow text-center text-[20px]">
									<p>Select API</p>
								</div>
								<div className="flex text-center mt-6">
									<div
										className="flex-grow p-4 border m-2 bg-[#777777] hover:bg-[#aaaaaa] hover:cursor-pointer text-white text-[20px]"
										onClick={() => {
											setSelectedAPI("SOURCE");
										}}
									>
										Source
									</div>
									<div
										className="flex-grow p-4 border m-2 bg-[#777777] hover:bg-[#aaaaaa] hover:cursor-pointer text-white text-[20px]"
										onClick={() => {
											setSelectedAPI("DESTINATION");
										}}
									>
										Destination
									</div>
								</div>
							</div>
						</>
					)}
				</div>
			</div>
		</>
	);
};

export default NodeActivationModal;
