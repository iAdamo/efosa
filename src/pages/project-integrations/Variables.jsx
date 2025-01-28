import { ProjectContext } from "@contexts/ProjectContext";
import { postGenericCRUD } from "@axios/apiCalls";
import { useContext, useState } from "react";
import SelectedVariable from "./SelectedVariable";

export default function Variables(props) {
    const { projectID, variables, setVariables } = useContext(ProjectContext);

    const createNewVariable = async () => {
        const newVariable = await postGenericCRUD("Active_Variables", {
            projectID: projectID,
            isProject: true,
        });

        setVariables([...variables, newVariable.data[0]]);
    };

    const [selectedVariable, setSelectedVariable] = useState(null);


    if (selectedVariable != null) {
        return (
            <>
                <SelectedVariable
                    selectedVariableID={selectedVariable}
                    setSelectedVariable={setSelectedVariable}
                />
            </>
        );
    }

    return (
        <>
            <div className="bg-[#111111] text-white">
                <div>Variables</div>

                <table className="w-[100%]">
                    <tr>
                        <td>Name</td>
                        <td>Type</td>
                        <td>#</td>
                    </tr>
                    {variables.map((variable) => {
                        return (
                            <>
                                <tr>
                                    <td>{variable.name}</td>
                                    <td>
                                        {variable.variableType == null
                                            ? "Not selected"
                                            : variable.variableType}
                                    </td>
                                    <td
                                        onClick={() => {
                                            setSelectedVariable(variable.id);
                                        }}
                                    >
                                        Edit
                                    </td>
                                </tr>
                            </>
                        );
                    })}
                </table>

                <button
                    className="bg-white text-black"
                    onClick={() => {
                        createNewVariable();
                    }}
                >
                    New variable
                </button>
            </div>
        </>
    );
}
