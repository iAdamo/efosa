import { ProjectContext } from "@contexts/ProjectContext";
import AuthenticationNotAvailable from "./AuthenticationNotAvailable";
import { useContext } from "react";
import Authenticate from "./Authenticate";

export default function Authentication(props) {
	const { direction, isMyAPI, APIID, myAPI, refreshFunction, auth, setAuth } =
		props;

	const idToUse = APIID;

	return (
		<>
			<div className="">
				{!idToUse && <AuthenticationNotAvailable />}
				{idToUse && (
					<Authenticate APIID={idToUse} auth={auth} setAuth={setAuth} />
				)}
			</div>
		</>
	);
}
