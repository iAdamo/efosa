import React from 'react';

const Button = ({
    type = 'button',
    onClick,
    children,
    variant,
    disabled = false,
    loading = false,
    className = '',
    disableClassName = "",
    ...props
}) => {

    const baseStyles = 'p-2';

    const variantStyles = {
        custom: 'flex items-center shadow-primary-button bg-[#454C54] py-3 px-6 rounded-containers w-fit',
        primary: 'flex items-center shadow-primary-button bg-primary-button-gradient py-[13px] px-2 rounded-containers max-h-10',
        stripe: 'bg-stripe-button-gradient w-full h-full rounded-lg font-semibold leading-4 shadow-stripe-button max-w-[260px] py-3',
        addAuth: 'flex items-center h-8 py-[9px] px-6 rounded-containers bg-grey-13 text-custom-ghostWhite text-base font-semibold',
    };

    const buttonStyles = `${variantStyles?.[variant]} ${className || baseStyles}`;

    return (
        <button
            type={type}
            onClick={!disabled && !loading ? onClick : undefined}
            disabled={disabled || loading}
            className={disabled ? disableClassName : buttonStyles}
            aria-disabled={disabled || loading}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
