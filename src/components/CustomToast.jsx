import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CheckCircle from '@assets/icons/checkCircle.svg?react'

const COMMON_STYLE = {
    fontSize: '16px',
    borderRadius: '5px',
    fontWeight: 500,
    width: '540px',
    maxWidth: '540px',
    padding: 0,
    margin: 0,
    lineHeight: '18px',
    minHeight: 'unset',
    backdropFilter: 'blur(20px)',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
};

const VARIANT_STYLES = {
    success: {
        background: 'linear-gradient(90deg, rgba(133, 249, 150, 0.2) 0%, rgba(10, 92, 22, 0.2) 103.15%)',
        border: '1px solid #85F996',
        color: '#85F996',
        icon: <CheckCircle />,
    },
    error: {
        background: 'linear-gradient(90deg, rgba(114, 28, 36, 0.2) 0%, rgba(42, 6, 12, 0.2) 103.15%)',
        border: '1px solid red',
        color: 'red',
    },
    info: {
        background: 'linear-gradient(90deg, rgba(12, 84, 96, 0.2) 0%, rgba(3, 33, 38, 0.2) 103.15%)',
        border: '1px solid white',
        color: 'white',
    },
    warning: {
        background: 'linear-gradient(90deg, rgba(133, 100, 4, 0.2) 0%, rgba(59, 45, 4, 0.2) 103.15%)',
        border: '1px solid yellow',
        color: 'yellow',
    },
};


const Toast = () => {
    return (
        <ToastContainer
            position="top-center"
            autoClose={3000}
            hideProgressBar
            closeOnClick
            draggable
            pauseOnHover
            closeButton={false}
            bodyStyle={{
                flex: 'none',
                margin: 'auto',
            }}
        />
    );
};
export const showToast = (message, variant) => {
    const variantStyle = VARIANT_STYLES[variant] || {};
    const toastConfig = {
        style: { ...COMMON_STYLE, ...variantStyle },
        icon: variantStyle.icon || '',
    };
    toast(message, toastConfig);
};
export default Toast;