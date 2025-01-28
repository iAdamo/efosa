import { toast } from "react-toastify";

export const showToast = (msg, type = "success") => {
    const obj = {
        position: "bottom-left",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        hideProgressBar: true,
    };
    switch (type) {
        case "success":
            toast.success(msg, obj);
            break;
        case "error":
            toast.error(msg, obj);
            break;
        default:
            toast.success(msg, obj);
            break;
    }
};
