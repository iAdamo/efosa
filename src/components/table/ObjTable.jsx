import { getTypeValuesFromArrRow, getTypeValuesFromObjRow } from "@/utils/table";
import SAccordion from "@components/SAccordion";
import accordionOpenIcon from "@assets/icons/acrd-open.svg";
import accordionCloseIcon from "@assets/icons/acrd-close.svg";
import indentIcon from "@assets/icons/indent.svg";
import TextCopy from "@components/TextCopy";

export function RowDataShowObj(row, isFirst = false) {
    const [singleValues, objectValues, arrayValues] =
        getTypeValuesFromObjRow(row);
    if (isFirst) {
        const listOfPrim = listOfPrimValues(singleValues);
        const listObject = listOfObjectValues(objectValues);
        const listArray = listOfArrayValues(arrayValues);

        return (
            <SAccordion
                title={<div className="flex gap-2">{listOfPrim}</div>}
                content={
                    (listObject.length > 0 || listArray.length > 0) && (
                        <div className="nested-data">
                            {listArray}
                            {listObject}
                        </div>
                    )
                }
                titleClassname="mb-2 flex gap-2 justify-end items-center"
                openIcon={accordionOpenIcon}
                closeIcon={accordionCloseIcon}
                reverseIcon
            />
        );
    } else {
        const listOfPrim = listOfPrimValues(singleValues);
        const listObject = listOfObjectValues(objectValues);
        const listArray = listOfArrayValues(arrayValues);
        return (
            <>
                <div className="flex gap-2">{listOfPrim}</div>
                {
                    <div className="pl-4">
                        {listArray}
                        {listObject}
                    </div>
                }
            </>
        );
    }
}

function RowDataShowArr(row, isFirst = false) {
    const [singleValues, objectValues, arrayValues] =
        getTypeValuesFromArrRow(row);
    if (isFirst) {
        const listOfPrim = renderStringArr(singleValues);
        const listObject = RowDataShowObj(objectValues);
        const listArray = listOfArrayValues(arrayValues);

        return (
            <div className="nested-data">
                {listOfPrim}
                {listArray}
                {listObject}
            </div>
        );
    } else {
        const listOfPrim = renderStringArr(singleValues);
        const listObject = objectValues.map((row) => RowDataShowObj(row));
        const listArray = listOfArrayValues(arrayValues);
        return (
            <>
                <div className="flex gap-2">{listOfPrim}</div>
                {
                    <div className="pl-4">
                        {listArray}
                        {listObject}
                    </div>
                }
            </>
        );
    }
}

function listOfObjectValues(objectValues) {
    return objectValues.map((row) => {
        return (
            <div>
                <div className="flex">
                    <div className="mt-2">
                        <img src={indentIcon} className="icon-pink" />
                    </div>
                    <div>
                        <div className="text-white text-xs font-normal font-['Inter'] leading-[14px] tracking-tight pl-4">
                            {row.name}
                        </div>
                        <div className="text-fuchsia-500 text-[10px] font-normal font-['Inter'] leading-[14px] tracking-tight pl-4">
                            Related node
                        </div>
                        {Array.isArray(row.value)
                            ? RowDataShowArr(row.value)
                            : RowDataShowObj(row.value)}
                    </div>
                </div>
            </div>
        );
    });
}

const listOfArrayValues = (arrayValues) => {
    return arrayValues.map((row) => {
        return (
            <div>
                <div className="flex">
                    <div className="mt-2">
                        <img src={indentIcon} className="icon-pink" />
                    </div>
                    <div>
                        <div className="text-white text-xs font-normal font-['Inter'] leading-[14px] tracking-tight pl-4">
                            {row.name}
                        </div>
                        <div className="text-fuchsia-500 text-[10px] font-normal font-['Inter'] leading-[14px] tracking-tight pl-4">
                            Related node
                        </div>
                        {Array.isArray(row.value)
                            ? RowDataShowArr(row.value)
                            : RowDataShowObj(row.value)}
                    </div>
                </div>
            </div>
        );
    });
};

function listOfPrimValues(values) {
    return values.map((row) => (
        <div>
            <TextCopy
                text={row.value}
                component={
                    <div className="flex flex-col text-white flex-grow px-4 py-1 my-1">
                        <div className="text-white text-xs font-normal font-['Inter'] leading-[14px] tracking-tight">
                            {row.value}
                        </div>
                        <div className="text-zinc-400 text-[12px] font-normal font-['Inter'] leading-[14px] tracking-tight">
                            {row.name}
                        </div>
                    </div>
                }
            />
        </div>
    ));
}

const renderStringArr = (value) => {
    return (
        <div className="flex flex-col text-white flex-grow px-4 py-1 my-1">
            <div className="text-white text-xs font-normal font-['Inter'] leading-[14px] tracking-tight">
                {value.join("| ")}
            </div>
        </div>
    );
};
