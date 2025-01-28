import TextLoaders from "@components/loaders/TextLoaders";
import React from "react";
import "react-loading-skeleton/dist/skeleton.css";

function APIDetailsLoader() {
	return (
		<div className="api-loading-div">
			<TextLoaders count={4} containerClassName="flex flex-col" />
		</div>
	);
}

export default APIDetailsLoader;
