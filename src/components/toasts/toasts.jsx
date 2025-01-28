import toastError from "@assets/icons/toast-error.svg";
import toastSuccess from "@assets/icons/toast-success.svg";
import { toast } from "sonner";

export const errorToast = (message) => {
	toast.error(message, {
		position: "top-center",
		autoClose: 5000,
		hideProgressBar: false,
		closeOnClick: true,
		pauseOnHover: true,
		draggable: true,
		style: {
			backgroundColor: "rgba(255, 0, 46, 0.70)",
			border: "1px solid rgba(255, 0, 46, 0.70)",
			padding: "15px",
		},

		progress: undefined,
		theme: "colored",
		icon: <img src={toastError} alt="error" />,
	});
};

export const successToast = (message, position = "top-center") => {
	toast.success(message, {
		position,
		autoClose: 5000,
		hideProgressBar: false,
		closeOnClick: true,
		pauseOnHover: true,
		draggable: true,
		progress: undefined,
		theme: "colored",
		icon: <img src={toastSuccess} alt="success" />,
	});
};
