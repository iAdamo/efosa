import React from "react";

// Note: register and name is required for this component to work
const SRadio = React.forwardRef(({ register, name, value, options }, ref) => {
	const createOptions = (options) => {
		return options.map(({ label, value, ...props }, idx) => (
			<div className="s-radio-container">
				<input
					className="s-radio"
					ref={ref}
					type="radio"
					value={value}
					id={"radio" + name + value + idx}
					{...register(name)}
					{...props}
				/>
				<label
					className="flex flex-row items-center"
					for={"radio" + name + value + idx}
				>
					{label}
				</label>
			</div>
		));
	};
	return <div className="flex flex-col">{createOptions(options)}</div>;
});

export default SRadio;
