import { DataContext } from "@contexts/DataContext";
import { LinksContext } from "@contexts/LinksContext";
import { MatchContext } from "@contexts/MatchContext";
import { WizardContext } from "@contexts/WizardContext";
import { useContext, useEffect, useState } from "react";
import Xarrow from "react-xarrows";

const SchemaLinks = () => {
	const {
		setSelectedLink,
		layoutWidth,
		hideCollapsed,
		dragElement,
		ONAreaDetails,
	} = useContext(WizardContext);

	const { linksFiltered } = useContext(DataContext);

	const { rebuild, generateDraggablePointIDFromLink, getLinkLineColor } =
		useContext(LinksContext);
	const [arrows, setArrows] = useState([]);

	const showArrow = (link) => {
		const [start, end] = generateDraggablePointIDFromLink(link);

		if (!start) {
			return <></>;
		}
		if (!end) {
			return <></>;
		}

		if (!document.getElementById(start) || !document.getElementById(end)) {
			return <></>;
		}

		const lineColor = () => {
			return getLinkLineColor(link);
		};

		return (
			<Xarrow
				key={link.id}
				zIndex={10000}
				passProps={{
					onClick: (e) => {
						setSelectedLink({
							...link,
							//type: typeCurrentLine,
							positionX: e.clientX,
							positionY: e.clientY,
							/*
                            sourceFieldName:
                                sourceElement.parentElement.parentElement.querySelector(
                                    "h1"
                                ).innerHTML,
                            sourceFieldNodeName:
                                sourceElement.parentElement.parentElement
                                    .parentElement.parentElement.dataset
                                    .nodeTitle,
                            destinationFieldName:
                                destinationElement.parentElement.parentElement.querySelector(
                                    "h1"
                                ).innerHTML,
                            destinationFieldNodeName:
                                destinationElement.parentElement.parentElement
                                    .parentElement.parentElement.dataset
                                    .nodeTitle,
                                    */
						});
					},
					className: `cursor-pointer ${dragElement && " opacity-50"}`,
				}}
				start={start}
				end={end}
				showHead={false}
				color={lineColor()}
				headSize={4}
			/>
		);
	};

	const { isMatchMode } = useContext(MatchContext);
	const {
		operationNodesFiltered,
		sourceActiveNodesFiltered,
		destinationActiveNodesFiltered,
		activeFieldsFiltered,
	} = useContext(DataContext);

	useEffect(() => {
		if (linksFiltered) {
			setArrows(linksFiltered?.map(showArrow));
		}
	}, [
		linksFiltered,
		layoutWidth,
		hideCollapsed,
		ONAreaDetails,
		isMatchMode,
		operationNodesFiltered,
		sourceActiveNodesFiltered,
		destinationActiveNodesFiltered,
		activeFieldsFiltered,
		rebuild,
	]);
	return arrows;
};

export default SchemaLinks;
