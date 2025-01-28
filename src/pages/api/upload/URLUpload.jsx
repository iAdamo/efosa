import SInput from "@/components/SInput";
import Globe from "@assets/icons/globe.svg?react";
import { useState } from "react";

export default function URLUpload(props) {
	const { url, setURL } = props;

	return (
		<div className="flex flex-col gap-[5px] pt-[10px]">
			<SInput
				type="text"
				className="modal-headerinput "
				placeholder="www.api.com"
				value={url}
				onChange={(e) => {
					setURL(e.target.value);
				}}
				icon={<Globe className="icon-grey-4" />}
			/>
		</div>
	);
}
