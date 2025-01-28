import {
	FieldError,
	Text,
	CheckboxGroup,
	Checkbox,
} from "react-aria-components";
import React from "react";

export function SCheckboxGroup({
	label,
	description,
	errorMessage,
	children,
	...props
}) {
	return (
		<CheckboxGroup className={"s-checkbox-group"} {...props}>
			{label}
			{children}
			{description && <Text slot="description">{description}</Text>}
			<FieldError>{errorMessage}</FieldError>
		</CheckboxGroup>
	);
}

export function SCheckbox({
	children,
	onChange,
	className,
	...props
}) {

	return (
		<Checkbox
			className={`${className} s-checkbox`}
			onChange={onChange}
			{...props}
		>
			{({ isIndeterminate }) => (
				<>
					<div className="checkbox">
						<svg viewBox="0 0 18 18" aria-hidden="true">
							{isIndeterminate ? (
								<rect x={1} y={7.5} width={15} height={3} />
							) : (
								<polyline points="1 9 7 14 15 4" />
							)}
						</svg>
					</div>
					{children}
				</>
			)}
		</Checkbox>
	);
}
