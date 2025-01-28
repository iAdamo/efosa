import { useContext, useState } from "react";
import { RunnerContext } from "@contexts/RunnerContext";
import { WizardContext } from "@contexts/WizardContext";
import SInput from "@/components/SInput";

const UniqueIdentifierSearch = (props) => {
	const { selectedNodes, direction, isMatching, setNewUniqueClick } = props;

	const {
		firstSelectedUniqueIdentifier,
		setFirstSelectedUniqueIdentifier,
		secondSelectedUniqueIdentifier,
		setSecondSelectedUniqueIdentifier,
		thirdSelectedUniqueIdentifier,
		setThirdSelectedUniqueIdentifier,
	} = useContext(RunnerContext);

	let uniqueIdentifier;
	let uniqueIdentifierSetter;
	if (direction == "SOURCE") {
		uniqueIdentifier = firstSelectedUniqueIdentifier;
		uniqueIdentifierSetter = setFirstSelectedUniqueIdentifier;
	}
	if (direction == "DESTINATION") {
		if (isMatching) {
			uniqueIdentifier = thirdSelectedUniqueIdentifier;
			uniqueIdentifierSetter = setThirdSelectedUniqueIdentifier;
		} else {
			uniqueIdentifier = secondSelectedUniqueIdentifier;
			uniqueIdentifierSetter = setSecondSelectedUniqueIdentifier;
		}
	}

	const [showNode, setShowNode] = useState(true);
	const { activeNodes } = useContext(WizardContext);
	const listOfNodes = activeNodes.filter((node) => {
		if (selectedNodes.includes(node.id)) {
			return true;
		}
		return false;
	});

	const parentNode = listOfNodes.find((node) => {
		if (node.parentNode == null) {
			return true;
		}
		return false;
	});
	console.log("LIST OF NODES");
	console.log(listOfNodes);

	return (
		<div className="w-[361px]">
			<div className="w-full border-b border-[#DADADA] flex items-center justify-between relative">
				<SInput
					style={{ outlineWidth: 0 }}
					className="w-full"
					type="text"
				/>
				<div className="absolute right-7 top-2"></div>
			</div>
			{listOfNodes?.map((node) => (
				<div className="flex flex-col gap-1 mt-3">
					<button
						className="m-0 flex justify-between items-center hover:bg-[#DADADA] pl-5 pr-7 text-sm color-[#55689B]"
						onClick={() => setShowNode(!showNode)}
					>
						{node.name}
						{showNode ? "^" : "v"}
					</button>
					{showNode && (
						<div className="flex flex-col gap-1 pl-11 w-[361px]">
							{node?.availableFields?.map((availableField) => (
								<button
									className="hover:bg-[#DADADA] w-full text-left "
									key={node.id}
									type="button"
									onClick={() => {
										uniqueIdentifierSetter({
											nodeID: node.id,
											keyName: availableField.name,
										});
										setNewUniqueClick(node.id, availableField.name);
									}}
								>
									{availableField.name}
								</button>
							))}
						</div>
					)}
				</div>
			))}
		</div>
	);
};

export default UniqueIdentifierSearch;
