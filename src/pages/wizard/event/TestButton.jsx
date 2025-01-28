import React, { useState } from "react";
import SDialog from "@components/SDialog";
import TransferContent from "./TransferContent";
import { Button } from "react-aria-components";

function TestButton() {
	const [modalOpen, setModalOpen] = useState(false);
	return (
		<>
			<Button onPress={() => setModalOpen((s) => !s)} className={"test-badge"}>
				TEST
			</Button>
			<SDialog isOpen={modalOpen} closeCallback={() => setModalOpen(false)}>
				<TransferContent />
			</SDialog>
		</>
	);
}

export default TestButton;
