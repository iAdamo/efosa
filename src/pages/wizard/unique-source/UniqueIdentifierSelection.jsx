import UniqueIdentifierNodeSchema from "./UniqueIdentifierNodeSchema";
import { useEffect, useState, useContext } from "react";
import UniqueIdentifierSearch from "./UniqueIdentifierSearch";
import { RunnerContext } from "@contexts/RunnerContext";
import {
	getInitialUniques,
	getUniquesFromPath,
	updateSourceTransferKey,
} from "@axios/apiCalls";
import { WizardContext } from "@contexts/WizardContext";

const UniqueIdentifierSelection = (props) => {
	const [showSearch, setShowSearch] = useState("");
	const [selectedIdentifier, setSelectedIdentifier] = useState("");

	const [selectedNodes, setSelectedNodes] = useState([]);
	const [availableUnique, setAvailableUnique] = useState(null);

	const { disabled, node, direction, isMatching } = props;

	const { selectedPairing } = useContext(RunnerContext);

	useEffect(() => {
		(async () => {
			if (node) {
				setSelectedNodes([node.id]);
			}

			if (direction === "DESTINATION" && !isMatching) {
				const initialUniques = await getInitialUniques(selectedPairing.id);
				console.log("Initial uniques");
				console.log(initialUniques);
				setAvailableUnique(initialUniques);
			}
		})();
	}, [node, direction]);

	const {
		firstSelectedUniqueIdentifier,
		secondSelectedUniqueIdentifier,
		thirdSelectedUniqueIdentifier,
	} = useContext(RunnerContext);

	console.log("Direction");

	let uniqueIdentifier;
	if (direction == "SOURCE") {
		uniqueIdentifier = firstSelectedUniqueIdentifier;
	}
	if (direction == "DESTINATION") {
		if (isMatching) {
			console.log("Using third");
			uniqueIdentifier = thirdSelectedUniqueIdentifier;
		} else {
			uniqueIdentifier = secondSelectedUniqueIdentifier;
		}
	}

	const { transferkey } = useContext(WizardContext);

	const setNewUniqueClick = async (sourceKeyNodeID, sourceKeyName) => {
		const updatedKey = await updateSourceTransferKey(
			transferkey.id,
			sourceKeyNodeID,
			sourceKeyName,
		);
	};

	return (
		<div className={`mt-[40px] fontFamilyQuicksand px-6`}>
			<p className="m-0 font-bold text-sm max-w-[379px]">
				Select unique identifer for {node.name}
			</p>
			<div className="flex justify-center mt-7">
				<div className="max-w-[505px] w-full h-9 border border-[#F5F5F5] rounded-md relative">
					<div className="flex w-full h-full">
						<button
							onClick={() =>
								setShowSearch((prev) => (prev === "Schema" ? "" : "Schema"))
							}
							type="button"
							className="flex items-center gap-4 h-full w-[144px] pl-8 border-r border-[#DADADA] font-semibold text-sm"
						>
							Show all v
						</button>
						<button
							type="button"
							className="flex items-center font-medium text-sm ml-5 uppercase"
							onClick={() =>
								setShowSearch((prev) => (prev === "Search" ? "" : "Search"))
							}
						>
							UNIQUE IDENTIFIER :
							<p className="m-0 text-xs text-[#55689B] font-normal pl-2">
								{uniqueIdentifier?.keyName}
							</p>
						</button>
					</div>

					{(direction === "SOURCE" || isMatching) && (
						<>
							{showSearch === "Schema" && (
								<div className="rounded-md w-[187px] px-4 py-3">
									<UniqueIdentifierNodeSchema
										key={node?.id}
										node={node}
										selectedNodes={selectedNodes}
										setSelectedNodes={setSelectedNodes}
									/>
								</div>
							)}
							{showSearch === "Search" && (
								<div className="absolute left-[145px] top-9">
									<UniqueIdentifierSearch
										setSelectedIdentifier={setSelectedIdentifier}
										selectedNodes={selectedNodes}
										direction={direction}
										isMatching={isMatching}
										setNewUniqueClick={setNewUniqueClick}
									/>
								</div>
							)}
						</>
					)}
				</div>
			</div>
		</div>
	);
};

const showUniques = (uniques, setAvailableUnique) => {
	const { selectedPairing } = useContext(RunnerContext);
	const getNewUniques = async (path) => {
		const uniques = await getUniquesFromPath(selectedPairing.id, path);
		setAvailableUnique(uniques);
	};

	const { setSecondSelectedUniqueIdentifier } = useContext(RunnerContext);
	return (
		<>
			<p
				onClick={() => {
					console.log("Getting uniques");
					getNewUniques(uniques.path);
				}}
			>
				Name: {uniques.name}
			</p>
			{uniques.fields && uniques.fields.length > 0 && (
				<p>
					<b>Fields:</b> <br />
					{uniques.fields.map((field) => {
						return (
							<>
								<p
									onClick={() => {
										setSecondSelectedUniqueIdentifier({
											path: field.path,
											keyName: field.name,
										});
									}}
								>
									{field.name}
								</p>
							</>
						);
					})}
				</p>
			)}

			{uniques.relatedNodes && uniques.relatedNodes.length > 0 && (
				<>
					<p>
						<b>Related nodes:</b> <br />
						{uniques.relatedNodes.map((relatedNode) => {
							return <>{showUniques(relatedNode, setAvailableUnique)}</>;
						})}
					</p>
					<br />
					<br />
				</>
			)}
		</>
	);
};

export default UniqueIdentifierSelection;
