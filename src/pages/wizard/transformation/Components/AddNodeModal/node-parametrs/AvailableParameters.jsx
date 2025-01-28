import React, {useContext, useEffect, useCallback, useState} from "react";
import SInput from "@components/SInput.jsx";
import SearchIcon from "@assets/icons/search.svg?react";
import Fuse from "fuse.js";
import {NodeToolBarContext} from "@contexts/NodeToolBarContext.jsx";
import useGlobalStore from "@/store/globalStore";
import NodeParameters
    from "@pages/wizard/transformation/Components/SpeccDetail/NodeToolBar/components/node-parameters.jsx";

const fuseOptions = {
    keys: ["name", "type"],
    includeScore: true,
    threshold: 0.5,
};

const selector = (state) => ({
    deactivateNode: state.deactivateNode,
    activeFields: state.activeFields.allIds.map(
        (id) => state.activeFields.byId[id],
    ),
    addActiveField: state.addActiveField,
    deleteActiveField: state.deleteActiveField,
});

const AvailableParameters = (props) => {
    const { availableFields = [], directionInfo } = props;

    const [searchText, setSearchText] = useState("");
    const [filteredAvailableNodes, setFilteredAvailableNodes] = useState([]);

    const { toolbarNode } = useContext(NodeToolBarContext);
    const { activeFields, addActiveField, deleteActiveField } = useGlobalStore(selector);

    useEffect(() => {
        if (!searchText.trim()) {
            setFilteredAvailableNodes(availableFields);
        } else {
            const fuse = new Fuse(availableFields, fuseOptions);
            const results = fuse.search(searchText).map((result) => result.item);
            const words = searchText.toLowerCase().split(/\s+/);

            const filteredResults = results.filter((item) =>
                words.every(
                    (word) =>
                        item.name.toLowerCase().includes(word) ||
                        item.type.toLowerCase().includes(word)
                )
            );
            setFilteredAvailableNodes(filteredResults);
        }
    }, [searchText]);

    const filterActiveFields = useCallback(
        (nodeID) => activeFields.filter((item) => item.nodeID === nodeID),
        [activeFields]
    );

    const toggleParameter = async (availableField) => {
        const activeField = activeFields.find(
            (item) => item.name === availableField && item.nodeID === toolbarNode.id,
        );
        if (activeField) {
            deleteActiveField(activeField.id);
        } else {
            addActiveField(toolbarNode.id, availableField);
        }
    };

    return (
        <div className='pt-2'>
            {!!availableFields.length && <SInput
                type="text"
                className="modal-header-input !w-full"
                placeholder="Search"
                onChange={(e) => setSearchText(e.target.value)}
                leftIcon={<SearchIcon className="icon-grey-5 mr-[5px]" />}
            />}

            <NodeParameters
                toolbarNode={toolbarNode}
                params={toolbarNode ? toolbarNode.availableFields : []}
                toggleParameter={(name) => toggleParameter(name)}
                activeFields={
                    toolbarNode ? filterActiveFields(toolbarNode.id) : []
                }
                isShowModal
                directionInfo={directionInfo}
            />
        </div>
    );
};

export default AvailableParameters