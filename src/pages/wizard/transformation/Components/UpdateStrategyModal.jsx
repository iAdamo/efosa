import CloseIcon from "@/Icons/CloseIcon";
import { useContext, useState } from "react";

import { AddNodeModalContext } from "@contexts/AddNodeModalContext";
import { WizardContext } from "@contexts/WizardContext";
import { getActiveNodeFromID, updateXOfChoices } from "@axios/apiCalls";

const UpdateStrategyModal = (props) => {
    const { listOfStrategies, XOfActiveNode, setActiveNodes, activeNodes } =
        useContext(WizardContext);

    const [selectedStrategies, setSelectedStrategies] = useState([]);

    const toggleIndex = (index) => {
        const newList = [];
        if (selectedStrategies.includes(index)) {
            for (let i = 0; i < selectedStrategies.length; i++) {
                if (selectedStrategies[i] != index) {
                    newList.push(selectedStrategies[i]);
                }
            }
        } else {
            for (let i = 0; i < selectedStrategies.length; i++) {
                newList.push(selectedStrategies[i]);
            }
            newList.push(index);
        }

        setSelectedStrategies(newList);
    };

    const sendChoices = async () => {
        console.log(selectedStrategies);
        const choices = await updateXOfChoices(
            XOfActiveNode.id,
            selectedStrategies
        );
        console.log("Response");
        console.log(choices);
        const activeNode = await getActiveNodeFromID(XOfActiveNode.id);
        console.log(activeNode);
        const allNewActiveNodes = [];
        for (let i = 0; i < activeNodes.length; i++) {
            if (activeNodes[i].id == XOfActiveNode.id) {
                allNewActiveNodes.push(activeNode.data);
            } else {
                allNewActiveNodes.push(activeNodes[i]);
            }
        }
        setActiveNodes(allNewActiveNodes);
    };

    return (
        <div className="modal">
            <div className="modal-backdrop"></div>
            <div className="modal-content">
                <div>
                    The node you just activated can have{" "}
                    {listOfStrategies.length} different structures. You need to
                    choose which structure you want.
                </div>

                <div className="pt-8">
                    <h1>Structures</h1>

                    {XOfActiveNode.isMultiPick && (
                        <>Select one or more of the following structures</>
                    )}
                    {!XOfActiveNode.isMultiPick && (
                        <>Select one of the following structures</>
                    )}
                    <div>
                        {listOfStrategies.map((structure, index) => {
                            return (
                                <>
                                    <div
                                        className={`border border-[20px] ${
                                            selectedStrategies.includes(index)
                                                ? "bg-[#00ff00]"
                                                : ""
                                        }`}
                                        onClick={() => toggleIndex(index)}
                                    >
                                        {JSON.stringify(structure)}
                                    </div>
                                </>
                            );
                        })}
                    </div>
                    <div className="pt-8">
                        <button
                            className="border border-[2px] border-black px-2 py-2"
                            onClick={sendChoices}
                        >
                            Send
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UpdateStrategyModal;
