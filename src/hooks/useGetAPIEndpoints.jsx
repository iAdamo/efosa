import { useState, useEffect } from "react";
import { getApiEndpoints } from "@axios/apiCalls";

const useGetAPIEndpoints = (speccID) => {
	const [sourceEndpoints, setSourceEndpoint] = useState(null);
	const [destinationEndpoints, setDestinationEndpoints] = useState(null);
	const [destinationMatchingEndpoints, setDestinationMatchingEndpoints] =
		useState(null);

	useEffect(() => {
		Promise.all([
			getApiEndpoints(speccID, "SOURCE", false),
			getApiEndpoints(speccID, "DESTINATION", false),
			getApiEndpoints(speccID, "DESTINATION", true),
		]).then((res) => {
			setSourceEndpoint(res[0]);
			setDestinationEndpoints(res[1]);
			setDestinationMatchingEndpoints(res[2]);
		});
	}, [speccID]);

	return {
		sourceEndpoints,
		destinationEndpoints,
		destinationMatchingEndpoints,
	};
};

export default useGetAPIEndpoints;
