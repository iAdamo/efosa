import { ProjectContext } from "@contexts/ProjectContext";
import { postGenericCRUDWithID } from "@axios/apiCalls";
import { useContext } from "react";

export default function Predefined(props) {
    const {
        availablePredefinedVariables,
        availableDateFormats,
        variables,
        setVariables,
    } = useContext(ProjectContext);
    const { variableProp } = props;
    const variable = variableProp;

    const updatePredefinedVariable = async (predefinedVariableID) => {
        const newPredefinedVariable = await postGenericCRUDWithID(
            "Variables_Predefined",
            variable.predefined.id,
            { availablePredefinedVariableID: predefinedVariableID }
        );

        const newVariables = [];
        for (let i = 0; i < variables.length; i++) {
            if (variables[i].id != variable.id) {
                newVariables.push(variables[i]);
            } else {
                const changedVariable = variables[i];
                changedVariable.predefined.availablePredefinedVariableID =
                    predefinedVariableID;

                for (let i = 0; i < availablePredefinedVariables.length; i++) {
                    if (
                        predefinedVariableID ==
                        availablePredefinedVariables[i].id
                    ) {
                        changedVariable.availablePredefined =
                            availablePredefinedVariables[i];
                        break;
                    }
                }

                newVariables.push(changedVariable);
            }
        }

        setVariables(newVariables);
    };

    const deletePredefinedVariable = async () => {
        const newPredefinedVariable = await postGenericCRUDWithID(
            "Variables_Predefined",
            variable.predefined.id,
            { availablePredefinedVariableID: null }
        );

        const newVariables = [];
        for (let i = 0; i < variables.length; i++) {
            if (variables[i].id != variable.id) {
                newVariables.push(variables[i]);
            } else {
                const changedVariable = variables[i];
                changedVariable.predefined.availablePredefinedVariableID = null;
                delete changedVariable.availablePredefined;

                newVariables.push(changedVariable);
            }
        }

        setVariables(newVariables);
    };

    const updateDateFormat = async (formatID) => {
        const newVariableType = await postGenericCRUDWithID(
            "Variables_Predefined",
            variable.predefined.id,
            { formatID: formatID }
        );

        const newVariables = [];
        for (let i = 0; i < variables.length; i++) {
            if (variables[i].id != variable.id) {
                newVariables.push(variables[i]);
            } else {
                const changedVariable = variables[i];
                changedVariable.predefined.formatID = formatID;

                for (let i = 0; i < availableDateFormats.length; i++) {
                    if (formatID == availableDateFormats[i].id) {
                        changedVariable.dateConfig = availableDateFormats[i];
                        break;
                    }
                }

                newVariables.push(changedVariable);
            }
        }

        setVariables(newVariables);
    };

    return (
        <>
            <div>Predefined</div>
            {variable.predefined.availablePredefinedVariableID == null && (
                <>
                    <div>Select predefined variable</div>

                    {availablePredefinedVariables.map(
                        (availablePredefinedVariable) => {
                            return (
                                <button
                                    className="s-button s-button-normal border border-white m-2"
                                    onClick={() => {
                                        updatePredefinedVariable(
                                            availablePredefinedVariable.id
                                        );
                                    }}
                                >
                                    {availablePredefinedVariable.displayName}
                                </button>
                            );
                        }
                    )}
                </>
            )}
            {variable.predefined.availablePredefinedVariableID != null && (
                <>
                    <div>Selected predefined variable</div>
                    <div>{variable.availablePredefined.displayName}</div>
                    <div>
                        <button
                            className="s-button s-button-normal border border-white m-2"
                            onClick={() => {
                                deletePredefinedVariable();
                            }}
                        >
                            Reset
                        </button>
                    </div>

                    {variable.availablePredefined.type == "DATE" && (
                        <>
                            <div>Select date format</div>
                            <div>
                                <select
                                    className="text-black"
                                    onChange={(e) => {
                                        updateDateFormat(e.target.value);
                                    }}
                                >
                                    {variable.predefined.formatID == null && (
                                        <>
                                            <option selected={true}>
                                                Select format
                                            </option>
                                        </>
                                    )}
                                    {availableDateFormats.map(
                                        (availableFormat) => {
                                            const isSelected =
                                                availableFormat.id ==
                                                variable.predefined.formatID;
                                            return (
                                                <option
                                                    selected={isSelected}
                                                    value={availableFormat.id}
                                                >
                                                    {availableFormat.format}
                                                </option>
                                            );
                                        }
                                    )}
                                </select>
                            </div>
                        </>
                    )}
                </>
            )}
        </>
    );
}
