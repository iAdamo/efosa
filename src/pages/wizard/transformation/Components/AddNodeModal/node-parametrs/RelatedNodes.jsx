import React, {useContext, useEffect, useState} from "react";
import SInput from "@components/SInput.jsx";
import SearchIcon from "@assets/icons/search.svg?react";
import Fuse from "fuse.js";
import {NodeToolBarContext} from "@contexts/NodeToolBarContext.jsx";
import RelatedNodeParameters
    from "@pages/wizard/transformation/Components/SpeccDetail/NodeToolBar/components/related-node-parameters.jsx";
import {WizardContext} from "@contexts/WizardContext.jsx";

const fuseOptions = {
    keys: ["name"],
    includeScore: true,
    threshold: 0.5,
};

const RelatedNodes = (props) => {
    const { availableRelatedNodes = [], directionInfo } = props;

    const [searchText, setSearchText] = useState("");
    const [filteredNodes, setFilteredNodes] = useState([]);

    const { toolbarNode } = useContext(NodeToolBarContext);
    const {
        activeNodes,
        shouldUpdateNodesFieldAndMeatballs,
        setShouldUpdateNodesFieldAndMeatballs,
    } = useContext(WizardContext);

    useEffect(() => {
        if (!searchText.trim()) {
            setFilteredNodes(availableRelatedNodes);
        } else {
            const words = searchText.toLowerCase().split(/\s+/)

            const fuse = new Fuse(availableRelatedNodes, fuseOptions);
            const results = fuse
                .search(searchText)
                .map((result) => result.item)
                .filter((item) =>
                    words.every(
                        (word) =>
                            item.name.toLowerCase().includes(word)
                    )
                );
            setFilteredNodes(results);
        }
    }, [searchText]);

    return (
        <div className="pt-2">
            {!!availableRelatedNodes.length && <SInput
                type="text"
                className="modal-header-input !w-full"
                placeholder="Search"
                onChange={(e) => setSearchText(e.target.value)}
                leftIcon={<SearchIcon className="icon-grey-5 mr-[5px]" />}
            />}

            <RelatedNodeParameters
                key="relatedNodeParamAll"
                parentNode={toolbarNode ?? null}
                setNode={() => setNode()}
                availableRelatedNodes={
                    toolbarNode ? filteredNodes : []
                }
                activeNodes={activeNodes}
                toolbarNode={toolbarNode}
                shouldUpdateNodesFieldAndMeatballs={
                    shouldUpdateNodesFieldAndMeatballs
                }
                setShouldUpdateNodesFieldAndMeatballs={(value) =>
                    setShouldUpdateNodesFieldAndMeatballs(value)
                }
                isShowModal
                directionInfo={directionInfo}
            />
        </div>
    );
};

export default RelatedNodes;
