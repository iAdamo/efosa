import { ProjectContext } from "@contexts/ProjectContext";
import { postGenericCRUDWithID } from "@axios/apiCalls";
import { useContext } from "react";

export default function Primitive(props) {
    const { variableProp } = props;
    const { variables, setVariables } = useContext(ProjectContext);
    const variable = variableProp;

    const changeVariableType = async (type) => {
        const newVariableType = await postGenericCRUDWithID(
            "Variables_Primitive",
            variable.primitive.id,
            { type: type }
        );
        const newVariables = [];
        for (let i = 0; i < variables.length; i++) {
            if (variables[i].id != variable.id) {
                newVariables.push(variables[i]);
            } else {
                const changedVariable = variables[i];
                changedVariable.primitive.type = type;
                newVariables.push(changedVariable);
            }
        }

        setVariables(newVariables);
    };

    const changePrimitiveValue = async (value) => {
        const newVariableType = await postGenericCRUDWithID(
            "Variables_Primitive",
            variable.primitive.id,
            { value: value }
        );
        const newVariables = [];
        for (let i = 0; i < variables.length; i++) {
            if (variables[i].id != variable.id) {
                newVariables.push(variables[i]);
            } else {
                const changedVariable = variables[i];
                changedVariable.primitive.value = value;
                newVariables.push(changedVariable);
            }
        }

        setVariables(newVariables);
    };

    return (
        <>
            <div>Variable ID {variable.id}</div>
            <div>Primitive type: {variable.primitive.type}</div>
            {variable.primitive.type == null && (
                <>
                    <div>
                        <div>Select type</div>
                        <div>
                            <button
                                className="s-button s-button-normal border border-white m-2"
                                onClick={() => {
                                    changeVariableType("STRING");
                                }}
                            >
                                String
                            </button>
                            <button
                                className="s-button s-button-normal border border-white m-2"
                                onClick={() => {
                                    changeVariableType("INTEGER");
                                }}
                            >
                                Integer
                            </button>
                            <button
                                className="s-button s-button-normal border border-white m-2"
                                onClick={() => {
                                    changeVariableType("NUMBER");
                                }}
                            >
                                Number
                            </button>
                            <button
                                className="s-button s-button-normal border border-white m-2"
                                onClick={() => {
                                    changeVariableType("BOOLEAN");
                                }}
                            >
                                Boolean
                            </button>
                        </div>
                    </div>
                </>
            )}
            {variable.primitive.type != null && (
                <>
                    <div>
                        Value:{" "}
                        <input
                            type={"text"}
                            className="text-black"
                            defaultValue={variable.primitive.value}
                            onBlur={(e) => {
                                changePrimitiveValue(e.target.value);
                            }}
                        />
                    </div>
                </>
            )}
        </>
    );
}
