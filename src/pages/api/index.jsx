import { useContext } from "react";

import { ProjectContext } from "@contexts/ProjectContext";
import UploadBox from "./UploadBox";
import Authentication from "./Authentication/Authentication";
import APIName from "./APIName/APIName";

import { GeneralContext } from "@contexts/GeneralContext";
import SButton from "@components/SButton";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

export default function API(props) {
	const { isMyAPI } = props;
	const { direction: urlDirection, myapiid: myAPIID } = useParams();

	const ConfirmSettingsButton = () => {
		const navigate = useNavigate();
		return (
			<SButton
				sType={"build"}
				disabled={false}
				onClick={() => {
					navigate(-1);
				}}
			>
				<span>Save API</span>
			</SButton>
		);
	};

	if (isMyAPI) {
		const { myAPIs, refreshGeneralInitialData } = useContext(GeneralContext);
		let myAPI = null;
		for (let i = 0; i < myAPIs.length; i++) {
			if (myAPIs[i].id === Number(myAPIID)) {
				myAPI = myAPIs[i];
			}
		}

		const APIID = myAPI.APIID;

		return (
			<>
				<div>
					<div className="flex flex-col">
						<div>
							<UploadBox
								APIID={APIID}
								isMyAPI={isMyAPI}
								direction={null}
								myAPI={myAPI}
								projectID={null}
								specc={null}
								refreshFunction={refreshGeneralInitialData}
							/>
						</div>
						<div>
							<APIName
								APIID={APIID}
								isMyAPI={isMyAPI}
								direction={null}
								myAPI={myAPI}
							/>
						</div>
					</div>
				</div>
				<div>
					<Authentication
						APIID={APIID}
						isMyAPI={isMyAPI}
						direction={null}
						myAPI={myAPI}
					/>
				</div>
			</>
		);
	}
	if (!isMyAPI) {
		const navigate = useNavigate();
		const confirm = () => {
			navigate("../settings");
		};

		const direction = urlDirection?.toUpperCase();
		let APIID = null;
		const {
			sourceAPIID,
			destinationAPIID,
			projectID,
			specc,
			refreshProjectInitialData,
			sourceAuthentication,
			destinationAuthentication,
			setSourceAuthentication,
			setDestinationAuthentication,
		} = useContext(ProjectContext);

		let auth = null;
		let setAuth = null;
		if (direction === "SOURCE") {
			APIID = sourceAPIID;
			auth = sourceAuthentication;
			setAuth = setSourceAuthentication;
		} else {
			APIID = destinationAPIID;
			auth = destinationAuthentication;
			setAuth = setDestinationAuthentication;
		}

		return (
			<>
				<div>
					<div className="flex flex-col">
						<div>
							<UploadBox
								APIID={APIID}
								isMyAPI={isMyAPI}
								direction={direction}
								projectID={projectID}
								specc={specc}
								refreshFunction={refreshProjectInitialData}
							/>
						</div>
						<div>
							<APIName APIID={APIID} isMyAPI={isMyAPI} direction={direction} />
						</div>
					</div>
				</div>
				<div>
					<Authentication
						APIID={APIID}
						isMyAPI={isMyAPI}
						direction={direction}
						auth={auth}
						setAuth={setAuth}
					/>
				</div>
			</>
		);
	}
}
