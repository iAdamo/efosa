import React from "react";
import Skeleton from "react-loading-skeleton";

function TextLoaders({ count, containerClassName }) {
	return (
		<Skeleton
			count={count}
			containerClassName={containerClassName}
			highlightColor="#3c3c3c"
			baseColor="#555555"
		/>
	);
}

export default TextLoaders;
