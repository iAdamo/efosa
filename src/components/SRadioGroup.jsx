import { useState, useEffect } from "react";
import { RadioGroup, Radio, Label } from "react-aria-components";

export default function SRadioGroup({ children, defaultValue, ...props }) {
	const [selectedValue, setSelectedValue] = useState(
		defaultValue ?? children[0].value,
	);

	useEffect(() => {
		props.getValue(selectedValue);
	}, [selectedValue]);

	return (
		<RadioGroup
			onChange={(val) => setSelectedValue(val)}
			value={selectedValue}
			{...props}
			defaultValue={defaultValue}
		>
			{children}
		</RadioGroup>
	);
}
