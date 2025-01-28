const NodeToolBarCounts = ({
    schemasLength,
    relatedNodesLength,
    activeParameters,
}) => {
    return (
        <div className="toolbar_table flex px-[38px] border-b border-[#D4D4D4] pb-[19px]">
            <div>
                <p>0</p>
                <p>{schemasLength}</p>
                <p>{relatedNodesLength}</p>
            </div>
            <div className="pl-1 pr-2">
                <p>Property</p>
                <p>Parameters</p>
                <p>Related odes</p>
            </div>
            <div className="border-l border-[#D4D4D4] pl-[15px] pr-1">
                <h2>0</h2>
                <h2>{activeParameters}</h2>
                <h2>0</h2>
            </div>
            <div>
                <h2>Active</h2>
                <h2>Active</h2>
                <h2>Active</h2>
            </div>
        </div>
    );
};

export default NodeToolBarCounts;
