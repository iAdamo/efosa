import { PagesContext } from "@contexts/PagesContext";
import { WizardContext } from "@contexts/WizardContext";
import { LinksContext } from "@contexts/LinksContext";
import { createLinkAPI } from "@axios/apiCalls";
import { useContext, useEffect, useMemo, useState } from "react";
import { SHOWING_RELATED_NODES_DELAY } from "@constants";
import DraggableLinkPoint from "@pages/wizard/transformation/Components/DraggableLinkPoint";
import { Handle } from "@xyflow/react";
import HandlerPoints from "../UI/HandlerPoints";

export const OPERATION_NODE_FIELD_TYPES = {
	INPUT: "INPUT",
	OUTPUT: "OUTPUT",
};

const OperationNodeField = ({ type, isEmpty, ON, link, ONConfig, index }) => {
	const {
		schemaLinks,
		layoutWidth,
		activeSchemas,
		relatedNodes,
		hideCollapsed,
		dragElement,
		setSchemaLinks,
	} = useContext(WizardContext);
	const { triggerLinksRebuild } = useContext(LinksContext);

	const [inputLinkSourceData, setInputLinkSourceData] = useState({});

	const blockClassName = useMemo(() => {
		let className = "relative flex-col schema-block";
		if (type === OPERATION_NODE_FIELD_TYPES.INPUT) {
			className += " reverse  textalign-left ";
		} else {
			className += "  textalign-right ";
		}
		return className;
	}, [type, isEmpty]);

	useEffect(() => {
		if (!link) {
			setInputLinkSourceData({});
		} else {
			triggerLinksRebuild();
		}
	}, [link]);

	const getSourceData = () => {
		if (link && link.ONdestinationID) {
			const sourceElement = document.getElementById(`${link.fieldsourceID}`);
			if (!sourceElement) {
				setTimeout(() => {
					getSourceData();
				}, SHOWING_RELATED_NODES_DELAY);
				return;
			}
			const data = {
				dotStyle: [...sourceElement.classList].find((item) =>
					item.includes("dot"),
				),
				title:
					sourceElement.parentElement.parentElement.querySelector("h1")
						.innerHTML,
			};
			setInputLinkSourceData(data);
		}
	};
	useEffect(() => {
		getSourceData();
	}, [
		link,
		schemaLinks,
		layoutWidth,
		activeSchemas.length,
		relatedNodes.length,
		hideCollapsed,
	]);

	// TODO: replace all h1 to span in all fields
	return (
		<div className={blockClassName}>
			<h1
				className="schemaFontName py-2"
				style={{
					// opacity: Number(!isTextHidden),
					display: "inline-block",
				}}
			>
				{(link && inputLinkSourceData.title) || "Input"}
			</h1>

			<div onClick={(e) => e.stopPropagation()}>
				{/* <DraggableLinkPoint
                    activeField={null}
                    direction={null}
                    isCollapsed={false}
                    isInGroupModal={false}
                    isInOperationNode={true}
                    dragStarted={null}
                    dragEnded={null}
                    handleDrag={null}
                    ONConfig={ONConfig}
                    ON={ON}
                    isInput={true}
                    inputName={null}
                    isOutput={false}
                    indexOfOutput={null}
                    orderOfInput={link?.order}
                    isNodeAsONField={false}
                /> */}
				<HandlerPoints />
			</div>
		</div>
	);
};

export default OperationNodeField;
