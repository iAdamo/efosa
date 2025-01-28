import React from "react";

function SForm({ children, className, onSubmit, ...props }) {
	const handleSubmit = (e) => {
		e.preventDefault();
		onSubmit(e);
	};

	return (
		<form
			className={className ? `s-form ${className}` : "s-form"}
			{...props}
			autoComplete="off"
			onSubmit={handleSubmit}
		>
			{children}
		</form>
	);
}

export default SForm;
