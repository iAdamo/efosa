import { ProjectContext } from "@contexts/ProjectContext";
import { postGenericCRUDWithID, testDateTimeCall } from "@axios/apiCalls";
import { useContext, useEffect, useState } from "react";

const TimeComponent = (props) => {
    const {
        variable,
        label,
        timeValue,
        timePlusMinus,
        timeRelativeOrFixed,
        runTestOfDate,
    } = props;
    const { variables, setVariables } = useContext(ProjectContext);

    const updateAnythingInObject = async (objectName, objectValue) => {
        if (objectValue.length > 0) {
            const obj = {};
            obj[objectName] = objectValue;
            const updatedDate = await postGenericCRUDWithID(
                "Variables_Date",
                variable.date.id,
                obj
            );

            const allVariables = [];
            for (let i = 0; i < variables.length; i++) {
                if (variables[i].id != variable.id) {
                    allVariables.push(variables[i]);
                } else {
                    const changedVariable = variables[i];
                    changedVariable.date = updatedDate.data;
                    allVariables.push(changedVariable);
                }
            }
            setVariables(allVariables);
            runTestOfDate(variable.id);
        }
    };

    return (
        <>
            <div>
                <div>{label}</div>
                <div>
                    Relative or fixed{" "}
                    <select
                        className="text-black"
                        onChange={(e) => {
                            updateAnythingInObject(
                                timeRelativeOrFixed,
                                e.target.value
                            );
                        }}
                    >
                        <option
                            value={"FIXED"}
                            selected={
                                variable.date[timeRelativeOrFixed] == "FIXED"
                            }
                        >
                            Fixed
                        </option>
                        <option
                            value={"RELATIVE"}
                            selected={
                                variable.date[timeRelativeOrFixed] == "RELATIVE"
                            }
                        >
                            Relative
                        </option>
                    </select>
                </div>
                {variable.date[timeRelativeOrFixed] == "RELATIVE" && (
                    <div>
                        Plus or minus{" "}
                        <select
                            className="text-black"
                            onChange={(e) => {
                                updateAnythingInObject(
                                    timePlusMinus,
                                    e.target.value
                                );
                            }}
                        >
                            <option
                                value={"PLUS"}
                                selected={
                                    variable.date[timePlusMinus] == "PLUS"
                                }
                            >
                                Plus
                            </option>
                            <option
                                value={"MINUS"}
                                selected={
                                    variable.date[timePlusMinus] == "MINUS"
                                }
                            >
                                Minus
                            </option>
                        </select>
                    </div>
                )}
                <div>
                    Value{" "}
                    <input
                        className="text-black"
                        type={"text"}
                        defaultValue={variable.date[timeValue]}
                        onBlur={(e) => {
                            updateAnythingInObject(timeValue, e.target.value);
                        }}
                    />
                </div>
            </div>
        </>
    );
};

export default function DateVariableType(props) {
    const { variableProp } = props;
    const variable = variableProp;
    const { availableDateFormats, variables, setVariables } =
        useContext(ProjectContext);

    const [generatedDateTime, setGeneratedDateTime] = useState("");

    const updateDateFormat = async (formatID) => {
        const newVariableType = await postGenericCRUDWithID(
            "Variables_Date",
            variable.date.id,
            { dateFormatID: formatID }
        );

        const newVariables = [];
        for (let i = 0; i < variables.length; i++) {
            if (variables[i].id != variable.id) {
                newVariables.push(variables[i]);
            } else {
                const changedVariable = variables[i];
                changedVariable.date.dateFormatID = formatID;

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

        runTestOfDate(variable.id);
    };

    var currentdate = new Date();
    var datetime =
        currentdate.getFullYear() +
        "-" +
        ("0" + (currentdate.getMonth() + 1)).slice(-2) +
        "-" +
        ("0" + currentdate.getDate()).slice(-2) +
        " " +
        ("0" + currentdate.getHours()).slice(-2) +
        ":" +
        ("0" + currentdate.getMinutes()).slice(-2) +
        ":" +
        ("0" + currentdate.getSeconds()).slice(-2);

    const [testDateTime, setTestDateTime] = useState(datetime);

    const runTestOfDate = async (variableID, newTestTimestamp = null) => {
        let timestampToUse = null;
        if (newTestTimestamp == null) {
            timestampToUse = testDateTime;
        } else {
            timestampToUse = newTestTimestamp;
        }
        const generatedTime = await testDateTimeCall(variableID, timestampToUse);
        setGeneratedDateTime(generatedTime);
    };

    const updateTestTimestamp = (newTestTimestamp) => {
        setTestDateTime(newTestTimestamp);
        runTestOfDate(variable.id, newTestTimestamp);
    };

    return (
        <>
            <div>Variable ID {variable.id}</div>

            <div>
                Test with timestamp:{" "}
                <input
                    className="text-black"
                    type="text"
                    defaultValue={testDateTime}
                    onBlur={(e) => {
                        updateTestTimestamp(e.target.value);
                    }}
                />
            </div>

            <div>Select date format</div>
            <div>
                <select
                    className="text-black"
                    onChange={(e) => {
                        updateDateFormat(e.target.value);
                    }}
                >
                    {variable.date.dateFormatID == null && (
                        <>
                            <option selected={true}>Select format</option>
                        </>
                    )}
                    {availableDateFormats.map((availableFormat) => {
                        const isSelected =
                            availableFormat.id == variable.date.dateFormatID;
                        return (
                            <option
                                selected={isSelected}
                                value={availableFormat.id}
                            >
                                {availableFormat.format}
                            </option>
                        );
                    })}
                </select>
            </div>
            {variable.date.dateFormatID != null && (
                <div>
                    {!!variable.dateConfig.hasYear && (
                        <TimeComponent
                            variable={variable}
                            label={"Year"}
                            timeValue={"yearValue"}
                            timePlusMinus={"yearPlusMinus"}
                            timeRelativeOrFixed={"yearRelativeOrFixed"}
                            runTestOfDate={runTestOfDate}
                        />
                    )}
                    {!!variable.dateConfig.hasMonth && (
                        <TimeComponent
                            variable={variable}
                            label={"Month"}
                            timeValue={"monthValue"}
                            timePlusMinus={"monthPlusMinus"}
                            timeRelativeOrFixed={"monthRelativeOrFixed"}
                            runTestOfDate={runTestOfDate}
                        />
                    )}
                    {!!variable.dateConfig.hasDay && (
                        <TimeComponent
                            variable={variable}
                            label={"Day"}
                            timeValue={"dayValue"}
                            timePlusMinus={"dayPlusMinus"}
                            timeRelativeOrFixed={"dayRelativeOrFixed"}
                            runTestOfDate={runTestOfDate}
                        />
                    )}
                    {!!variable.dateConfig.hasHour && (
                        <TimeComponent
                            variable={variable}
                            label={"Hour"}
                            timeValue={"hourValue"}
                            timePlusMinus={"hourPlusMinus"}
                            timeRelativeOrFixed={"hourRelativeOrFixed"}
                            runTestOfDate={runTestOfDate}
                        />
                    )}
                    {!!variable.dateConfig.hasMinute && (
                        <TimeComponent
                            variable={variable}
                            label={"Minute"}
                            timeValue={"minuteValue"}
                            timePlusMinus={"minutePlusMinus"}
                            timeRelativeOrFixed={"minuteRelativeOrFixed"}
                            runTestOfDate={runTestOfDate}
                        />
                    )}
                    {!!variable.dateConfig.hasSecond && (
                        <TimeComponent
                            variable={variable}
                            label={"Second"}
                            timeValue={"secondValue"}
                            timePlusMinus={"secondPlusMinus"}
                            timeRelativeOrFixed={"secondRelativeOrFixed"}
                            runTestOfDate={runTestOfDate}
                        />
                    )}
                </div>
            )}
            <div className="bg-white mt-4 text-black">
                <div>Generated timestamp:</div>
                <div>{generatedDateTime}</div>
            </div>
        </>
    );
}
