import { nodeToolbarGroupHook } from "./nodeToolBarGroupHook";

const NodeToolBarGroup = ({ toolbarNode }) => {
    const [toggleIsGroupNode] = nodeToolbarGroupHook({ toolbarNode });

    if (toolbarNode.parentNode) {
        return null;
    }

    return (
        <div className="flex justify-center mt-4 mb-4">
            <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={toggleIsGroupNode}
            >
                {toolbarNode.isGroup ? "Unset group" : "Set group"}
            </button>
        </div>
    );
};

export default NodeToolBarGroup;
