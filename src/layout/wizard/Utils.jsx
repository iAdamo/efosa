import React from "react";
import DataInspectorModal from "./DataInspector/DataInspectorModal";
import useGlobalStore from "@/store/globalStore";
import { ELEMENTS } from "@/store/uiSlice";


function Utils() {
	const { currentModal } = useGlobalStore((s) => ({
		currentModal: s.UI.ELEMENTS.MODAL,
	}));
	return <DataInspectorModal showDataInspector={currentModal === ELEMENTS.MODAL.DATA_INSPECTOR} />;
}

export default Utils;
