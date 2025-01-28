import SButton from "@/components/SButton";
import useGlobalStore from "@/store/globalStore";
import { useReactFlow } from "@xyflow/react";
import React from "react";
import { useState } from "react";
import { useShallow } from "zustand/react/shallow";

const selector = (state) => ({
	autoLayout: state.autoLayout,
});

function Utils() {
	const { fitView } = useReactFlow();
	const { autoLayout } = useGlobalStore(useShallow(selector));
	const [loading, setLoading] = useState(false);
	const handleAutoLayout = async () => {
		setLoading(true);
		try {
			await autoLayout(fitView);
		} catch (e) {
			console.error(e);
		} finally {
			setLoading(false);
		}
	};
	return (
		<SButton sType={"build"} loading={loading} onClick={handleAutoLayout}>
			AutoLayout
		</SButton>
	);
}

export default Utils;
