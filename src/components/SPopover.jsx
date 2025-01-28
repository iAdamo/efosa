import { Popover } from "@headlessui/react";
import React, { useState } from "react";
import { usePopper } from "react-popper";

function SPopover({ children, content, className }) {
	let [referenceElement, setReferenceElement] = useState();
	let [popperElement, setPopperElement] = useState();
	let { styles, attributes } = usePopper(referenceElement, popperElement, {
		placement: "bottom",
		modifiers: [
			{
				name: "offset",
				options: {
					offset: [0, 10],
				},
			},
		],
	});
	return (
		<Popover className="relative">
			{({ open }) => (
				<>
					<Popover.Button className={className} ref={setReferenceElement}>
						{children}
					</Popover.Button>
					<Popover.Panel
						ref={setPopperElement}
						style={styles.popper}
						{...attributes.popper}
						className="absolute z-20"
					>
						<div className="s-popover">{content}</div>
					</Popover.Panel>
				</>
			)}
		</Popover>
	);
}

export default SPopover;
