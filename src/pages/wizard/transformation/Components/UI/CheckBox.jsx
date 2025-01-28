import { APIBuilderContext } from "@/Context/APIBuilderContext";
import { set } from "lodash";
import { useContext, useEffect, useState } from "react";

const CheckBox = ({ id, parentsList, builderParams }) => {
    const [active, setActive] = useState(false);
    const { selectedCheckBox, setSelectedCheckBox } =
        useContext(APIBuilderContext);

    const selectedAllParameters = (builderParameters, parentsList = []) => {
        let copyList = [];
        builderParameters.map((item) => {
            copyList.push([...parentsList, item.id].join());
            if (item.parameters.length > 0) {
                const list = selectedAllParameters(item.parameters, [
                    ...parentsList,
                    item.id,
                ]);
                copyList = [...copyList, ...list];
            }
        });
        return copyList;
    };

    const clickCheckBox = () => {
        if (builderParams) {
            if (active) {
                setSelectedCheckBox([]);
                setActive(false);
            } else {
                const result = selectedAllParameters(builderParams);
                setSelectedCheckBox(result);
                setActive(true);
            }
        } else {
            const copy = [...selectedCheckBox];
            let index;
            let parametersId = [...parentsList, id].join();

            index = copy.findIndex((item) => item === parametersId);
            if (index === -1) {
                copy.push(parametersId);
            } else {
                copy.splice(index, 1);
            }
            setSelectedCheckBox(copy);
        }
    };

    useEffect(() => {
        if (!builderParams) {
            const parametersId = [...parentsList, id].join();
            setActive(
                selectedCheckBox.findIndex((item) => parametersId === item) !==
                    -1
            );
        }
    }, [selectedCheckBox]);

    return (
        <div
            onClick={clickCheckBox}
            className={`w-2.5 h-2.5 rounded-sm ${!active && "border"}`}
            style={{
                background: active && "#9155D9",
                borderColor: !active && "#979696",
            }}
        />
    );
};

export default CheckBox;
