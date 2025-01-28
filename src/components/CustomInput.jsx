import SearchIcon from "@assets/icons/search.svg?react";
import { forwardRef, useEffect, useRef, useState } from "react";
import Button from "./Button";

const CustomInput = forwardRef(({
    error = "",
    prefix = null,
    suffix = null,
    isTextArea = false,
    rows = 4,
    className = "",
    inputClassName = "",
    prefixClassName = "",
    suffixClassName = "",
    errorClassName = "",
    variant = "",
    label,
    labelClassName = "",
    endLabel,
    endLabelClassName = "",
    placeholderColor,
    SearchIconClassName = "",
    ...props
}, ref) => {
    const suffixRef = useRef(null);
    const prefixRef = useRef(null);
    const [suffixWidth, setSuffixWidth] = useState(0);
    const [prefixWidth, setPrefixWidth] = useState(0);

    useEffect(() => {
        if (suffixRef?.current) {
            setSuffixWidth(suffixRef.current.offsetWidth);
        }

        if (prefixRef?.current) {
            setPrefixWidth(prefixRef.current.offsetWidth);
        }
    }, [suffix, prefix]);

    const containerBaseStyles = "relative h-max";

    const variantStyles = {
        primary: "bg-transparent text-custom-ghostWhite p-5 rounded-[5px] max-h-12 border border-gradient-grey-4 w-full leading-none",
        searchBox: "px-8 py-3 text-custom-ghostWhite bg-grey-19 max-h-12 rounded-containers border border-hover-grey-1",
        apiComponent: "bg-transparent text-custom-ghostWhite h-[40px] px-[8px] rounded-[5px] max-h-12 border border-gradient-grey-4 w-full leading-none",
    }

    const inputStyles = `${variantStyles?.[variant]}`;

    return (
        <div className={`${containerBaseStyles} ${className}`}>
            {(label || endLabel) && <div className="flex justify-between mb-2 text-grey-17">
                <p className={`font-medium leading-11 h-max ${labelClassName}`}>{label}</p>
                <Button className={`font-normal leading-base ${endLabelClassName}`}>{endLabel}</Button>
            </div>}
            <div className="relative">
                {(prefix || variant === "searchBox") &&
                    variant === "searchBox" ?
                    <SearchIcon className={`absolute top-1/2 left-3 -translate-y-1/2 ${SearchIconClassName || 'icon-white'}  `} />
                    :
                    <span
                        ref={prefixRef}
                        className={`absolute top-1/2 left-3 -translate-y-1/2 ${props.disabled && "cursor-not-allowed"} ${prefixClassName}`}>
                        {prefix}
                    </span>
                }
                {!isTextArea ? (
                    <input
                        className={`placeholder:text-[16px] ${placeholderColor ? `placeholder:text-${placeholderColor}` : 'placeholder:text-gradient-grey-7'} ${props.disabled && "cursor-not-allowed"} ${inputStyles} ${inputClassName}`}
                        style={{
                            paddingLeft: `${(variant === "searchBox" ? 36 : prefix ? prefixWidth + 20 : "" )}px`,
                            paddingRight: `${`${suffix ? suffixWidth + 20 : ''}`}px`,
                        }}
                        ref={ref}
                        {...props}
                    />
                ) : (
                    <textarea
                        className={`${inputStyles} ${inputClassName}`}
                        style={{
                            paddingLeft: `${(variant === "searchBox" ? 36 : prefix ? prefixWidth + 20 : "" )}px`,
                            paddingRight: `${`${suffix ? suffixWidth + 20 : ''}`}px`,
                        }}
                        ref={ref}
                        {...props}
                    />
                )}
                {suffix &&
                    <span
                        onClick={() => props?.onSuffixClick && props?.onSuffixClick()}
                        ref={suffixRef}
                        className={`absolute top-1/2 right-3 -translate-y-1/2 ${props.disabled && "cursor-not-allowed"} ${suffixClassName}`}>
                        {suffix}
                    </span>
                }
            </div>
            {error && <span className={`${errorClassName}`}>{error}</span>}
        </div>
    );
});

export default CustomInput;
