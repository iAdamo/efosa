import React from "react";
import { Text, FieldError, Label, RadioGroup } from "react-aria-components";

function SSingleSelect({
	label,
	description,
	errorMessage,
	children,
	...props
}) {
	return (
		<RadioGroup className={"s-single-select"} {...props}>
			{children}
			{description && (
				<Text slot="description" className="label">
					{description}
				</Text>
			)}
			<FieldError>{errorMessage}</FieldError>
		</RadioGroup>
	);
}

export default SSingleSelect;
