import { useContext, useEffect, useState } from "react";
import AutolistConfig from "./AutolistConfig/AutolistConfig";
import { ProjectContext } from "@/contexts/ProjectContext";
import { deleteGenericCRUDWithID, postGenericCRUD } from "@/axios/apiCalls";

export default function AutogenerateSpeccs() {
	const { projectID, autolist, setAutolist } = useContext(ProjectContext);
	const toggleAutogeneration = async (checked) => {
		if (checked) {
			let createdAutolist = await postGenericCRUD("Autolist", {
				type: "PROJECT",
				typeID: projectID,
			});

			setAutolist(createdAutolist.data[0]);
		} else {
			let deleteAutolist = await deleteGenericCRUDWithID(
				"Autolist",
				autolist.id
			);
			setAutolist(null);
		}
	};

	return (
		<>
			<div className="bg-[#111111] text-white mt-2 flex flex-col">
				<div>Autogeneration of Speccs</div>
				<div>
					Autogenerate?{" "}
					<input
						type="checkbox"
						checked={autolist == null ? false : true}
						onChange={(e) => {
							toggleAutogeneration(e.target.checked);
						}}
					/>
				</div>
				<div className="text-black">
					<AutolistConfig
						autolist={autolist}
						setAutolist={setAutolist}
						showDataInspector={true}
					/>
				</div>
			</div>
		</>
	);
}
