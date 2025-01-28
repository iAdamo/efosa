import React, {useContext} from "react";
import RelatedNodes from "@pages/wizard/transformation/Components/AddNodeModal/node-parametrs/RelatedNodes.jsx";
import AvailableParameters from "@pages/wizard/transformation/Components/AddNodeModal/node-parametrs/AvailableParameters.jsx";
import Criteria from "@pages/wizard/transformation/Components/AddNodeModal/node-parametrs/Criteria.jsx";
import CollapsibleContainer from "@components/CollapsibleSection.jsx";
import {NodeToolBarContext} from "@contexts/NodeToolBarContext.jsx";

const BorderContent = (props) => {
    const {directionInfo} = props
    const {textStyle} = directionInfo
    const { toolbarNode } = useContext(NodeToolBarContext);

    const {
        availableRelatedNodes = [],
        availableFields = [],
        availableMeatballs = []
    } = toolbarNode

    if (!toolbarNode) {
        return (
            <div className="flex justify-center items-center h-full">
                <p className="text-gray-500">No data available. Please select a node.</p>
            </div>
        );
    }

    const nodeStatus = [
        {
            name: "Available Parameters",
            value: "AP",
            bColor: '#555555',
            tColor: textStyle,
            bGColor: '#111111',
            content: <AvailableParameters availableFields={availableFields} directionInfo={directionInfo}/>,
        },
        {
            name: "Related nodes",
            value: "RN",
            bColor: '#555555',
            tColor: textStyle,
            bGColor: '#080808',
            content: <RelatedNodes availableRelatedNodes={availableRelatedNodes} directionInfo={directionInfo}/>,
        },
        {
            name: "Criteria",
            value: "CR",
            bColor: '#F6C519',
            tColor: "text-[#F6C519]",
            bGColor: '#080808',
            content: <Criteria availableMeatballs={availableMeatballs}/>,
        },
    ];

    return (
        <div className='flex flex-col gap-[18px]'>
            <CollapsibleContainer sections={nodeStatus} />
        </div>
    );
};

export default BorderContent;
