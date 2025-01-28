import UploadedAPIComponent from "./UploadedAPIComponent";
import { v4 as uuidv4 } from "uuid";
import UploadedPublicAPIComponent from "./UploadedPublicAPIComponent";
import { isArguments } from "lodash";
import { useContext } from "react";
import { GeneralContext } from "@/contexts/GeneralContext";
import { deleteGenericCRUDWithID } from "@/axios/apiCalls";

export default function MyApisList({ selectedTab, isDraggable, ...props }) {
	const { myAPIs, setMyAPIs } = useContext(GeneralContext);

	const deleteMyAPI = async (myAPIID) => {
		const deleted = deleteGenericCRUDWithID("MyAPIs", myAPIID);
		if (deleted) {
			const newMyAPIs = myAPIs.filter((api) => api.id !== myAPIID);
			setMyAPIs(newMyAPIs);
		}
	};
	return (
		<div className="flex flex-wrap gap-[10px] w-full h-full overflow-scroll pb-16">
			{myAPIs.map((item, index) => {
				return selectedTab === "My APIs" ? (
					<UploadedAPIComponent
						myAPI={item}
						isDraggable={isDraggable}
						key={uuidv4()}
						deleteMyAPI={deleteMyAPI}
					/>
				) : (
					<UploadedPublicAPIComponent
						isDraggable={isArguments}
						key={uuidv4()}
					/>
				);
			})}
		</div>
	);
}
