import { updateXOfChoices } from "@/axios/apiCalls";
import useGlobalStore from "@/store/globalStore";
import React from "react";

function XOfResolver() {
    const { reaction, removeXof, removeModal, removeReaction, removeMonitor } = useGlobalStore((s) => ({
        reaction: s.xOf.data.reaction,
        removeXof: s.xOf.removeXof,
        removeModal: s.UI.removeModal,
        removeReaction: s.reactions.removeReaction,
        removeMonitor: s.UI.removeMonitor,
    }));

    const { nodeID, choices, isMultipick } = React.useMemo(() => reaction.data, [reaction]);

    const [selectedChoices, setSelectedChoices] = React.useState([]);

    const handleChoiceClick = (index) => {
        if (isMultipick) {
            setSelectedChoices((prev) =>
                prev.includes(index)
                    ? prev.filter((i) => i !== index)
                    : [...prev, index]
            );
        } else {
            setSelectedChoices([index]);
        }
    };

    const handleSubmit = async () => {
        const res = await updateXOfChoices(nodeID, selectedChoices);
        if (res) {
            console.log("Success");
            removeXof();
            removeModal();
            removeReaction(reaction.id);
            removeMonitor(`monitor-${reaction.id}`);
        }

    };

    return (
        <div className="flex flex-col gap-2">
            {JSON.stringify(selectedChoices)}
            <div className="flex gap-2">
                {choices.map((choice, index) => (
                    <button
                        key={choice}
                        onClick={() => handleChoiceClick(index)}
                        type="button"
                        className={` p-3 ${selectedChoices.includes(index) ? 'bg-blue-500' : 'bg-slate-700'}`}
                    >
                        {JSON.stringify(choice)}
                    </button>
                ))}
            </div>
            <button onClick={handleSubmit}>Submit</button>
        </div>
    );
}

export default XOfResolver;
