import { useEffect, useState } from "react";

const IntegerAndStringMeatball = ({
    meatball,
    name,
    description,
    value,
    inputType,
    handelChecked,
    inputHandler,
    updateMeatballValueOnBlur,
    deleteMeatballHandler,
    updateIsPagination,
    updatePaginationType,
    valueOnChange,
}) => {
    const [inputValue, setInputValue] = useState("");

    useEffect(() => {
        if (value) {
            setInputValue(value);
        }
    }, []);

    console.log(meatball);

    let inputFieldType =
        inputType == "integer" || inputType == "number" ? "number" : "string";

    return (
        <div className="flex items-center my-6">
            <div className="property ">
                <p className="name">Property name: {name}</p>
                {description?.length > 0 && (
                    <p className="description my-3">
                        Description: {description}
                    </p>
                )}

                <p className="w-[210px] flex justify-between items-center">
                    {inputType === "text" ? "Equals: " : "Value: "}
                    <input
                        className="w-[151px] h-4 pl-3"
                        type={"text"}
                        onBlur={(e) => {
                            updateMeatballValueOnBlur(e.target.value, meatball);
                        }}
                        onChange={(e) => {
                            valueOnChange(meatball.id, e.target.value);
                        }}
                        defaultValue={value}
                    />
                </p>
                <p className="pt-4 pb-2">
                    Is pagination?
                    <input
                        type={"checkbox"}
                        className="w-[14px] ml-6"
                        defaultChecked={meatball.isPagination ? true : false}
                        onChange={(e) =>
                            updateIsPagination(
                                e.target.checked ? 1 : 0,
                                meatball
                            )
                        }
                    />
                </p>
                <p>What type of pagination is it?</p>
                {meatball.isPagination == 1 && (
                    <select
                        defaultValue={meatball.typeOfPagination}
                        className="text-[12px] pt-0 pb-0"
                        onChange={(e) =>
                            updatePaginationType(e.target.value, meatball)
                        }
                    >
                        <option>PAGE</option>
                        <option>OFFSET</option>
                        <option>LASTID</option>
                    </select>
                )}
            </div>
        </div>
    );
};

export default IntegerAndStringMeatball;
