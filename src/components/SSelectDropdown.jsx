import {
	Button,
	FieldError,
	ListBox,
	ListBoxItem,
	Popover,
	Select,
	SelectValue,
} from "react-aria-components";
import ArrowIcon from "@/assets/icons/acrd-close.svg?react";
import { useState } from "react";
import { useEffect } from "react";

export default function SSelectDropdown({
	onChange,
	children,
	width,
	placeholder,
	icon,
	...props
}) {
	const [selectedItem, setSelectedItem] = useState(props.defaultValue ?? null);

	return (
		<Select
			selectedKey={selectedItem}
			placeholder={placeholder ?? ""}
			onSelectionChange={(val) => {
				setSelectedItem(val);
				onChange(val);
			}}
		>
			<Button>
				<SelectValue className=" text-left text-[#aeaeae] text-xs font-normal font-['Inter'] leading-[11px] flex gap-[10px] items-center">
					{icon && icon}
					{selectedItem}
				</SelectValue>
				<ArrowIcon className="icon-grey-5 w-3 h-3" />
			</Button>
			<FieldError>Please select an option</FieldError>
			<Popover offset={2} style={{ width: width }}>
				<ListBox>{children}</ListBox>
			</Popover>
		</Select>
	);
}

export function DropdownItem({ item, id, icon, ...props }) {
	return (
		<ListBoxItem {...props} id={id ?? item}>
			<div className="flex gap-[10px]">
				{/* <Node className="icon-pink" /> */}
				{icon}
				<div class="text-[#aeaeae] text-xs font-normal font-['Inter'] leading-[11px]">
					{item}
				</div>
			</div>
		</ListBoxItem>
	);
}
