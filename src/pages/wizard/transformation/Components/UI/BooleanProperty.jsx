import BooleanIcon from "@/Icons/BooleanIcon";
import { useEffect, useState } from "react";

const BooleanProperty = ({ name, description, value, handelChecked, type }) => {
    const [isChecked, setIsChecked] = useState();
    const [firstColor, setFirstColor] = useState(null);
    const [secondColor, setSecondColor] = useState(null);

    useEffect(() => {
        setIsChecked(value);
    }, [value]);

    useEffect(() => {
        if (type === "SOURCE") {
            setSecondColor("#8AC5BD");
            setFirstColor("#B9EFE8");
        }
        if (type === "DESTINATION") {
            setSecondColor("#F1B477");
            setFirstColor("#F6DEC6");
        }
    });
    return (
        <div className="flex items-center my-6">
            <div className="property w-[139px] mr-[44px] ">
                <p className="name">{name}</p>
                <p className="description my-3">{description}</p>
                <p className="value">
                    Value:
                    <span
                        style={{
                            color: `${isChecked ? secondColor : "#808080"}`,
                        }}
                    >
                        {isChecked ? " True" : " False"}
                    </span>
                </p>
            </div>
            <div className={`relative ${isChecked && "rotate-180"}`}>
                <input
                    className="absolute cursor-pointer opacity-0 w-full h-full"
                    type="checkbox"
                    onChange={() => {
                        setIsChecked(!isChecked);
                        handelChecked(!isChecked);
                    }}
                    checked={value}
                />
                <BooleanIcon
                    firstColor={isChecked ? firstColor : false}
                    secondColor={isChecked ? secondColor : false}
                />
            </div>
        </div>
    );
};

export default BooleanProperty;
