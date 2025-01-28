import { useEffect, useState } from "react";

const InputProperty = ({
    name,
    description,
    value,
    inputType,
    handelChecked,
    inputHandler,
}) => {
    const [inputValue, setInputValue] = useState("");

    useEffect(() => {
        if (value) {
            setInputValue(value);
        }
    }, []);

    return (
        <div className="flex items-center my-6">
            <div className="property ">
                <p className="name">{name}</p>
                <p className="description my-3">{description}</p>
                <p className="w-[210px] flex justify-between items-center">
                    {inputType === "text" ? "Equals: " : "Value: "}
                    <input
                        className="w-[151px] h-4 pl-3"
                        type={inputType}
                        onChange={(e) => {
                            setInputValue(e.target.value);
                            handelChecked && handelChecked(e);
                            inputHandler && inputHandler(e.target.value);
                        }}
                        value={value}
                    />
                </p>
            </div>
        </div>
    );
};

export default InputProperty;
