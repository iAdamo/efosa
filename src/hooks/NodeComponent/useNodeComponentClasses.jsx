import { useMemo } from "react";

const useNodeComponentClasses = (
	fullNode,
	isMainNode,
	isRelatedNode,
	direction,
	isInGroupModal,
	toolbarNode,
) => {
	const { blockClassName, style } = useMemo(() => {
		const style = {
			marginLeft: 0,
		};
		let blockClassName =
			"rounded-lg border border-grey-3 px-3 py-4 node-component max-w-full";
		if (isMainNode) {
			blockClassName += " mr-8";
		}
		if (isRelatedNode) {
			style.marginLeft =
				direction === "SOURCE"
					? `${isRelatedNode * 2}rem`
					: `-${isRelatedNode * 2}rem`;
		}
		if (direction === "SOURCE") {
			blockClassName += " node-glow";
		}
		if (direction === "DESTINATION") {
			blockClassName += " node-glow-orange";
		}

		if (isInGroupModal) {
			blockClassName += " bg-white max-w-[260px]";
		}

		if (toolbarNode?.id == fullNode?.id) {
			blockClassName += " active";
		}
		return { blockClassName, style };
	}, [isMainNode, isRelatedNode, toolbarNode]);

	return { blockClassName, style };
};

export default useNodeComponentClasses;
