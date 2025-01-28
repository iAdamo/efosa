import { Fragment, useEffect, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import tick from "@assets/icons/tick.svg";
import caretOpen from "@assets/icons/caret-open.svg";
import caretClose from "@assets/icons/caret-close.svg";

export default function SFormSelect({ register, ...props }) {
	const { selectedValue } = props;

	const [selected, setSelected] = useState(
		props.disableFirstSelection
			? ""
			: props.options.find((option) => option === selectedValue)
				? selectedValue
				: props.options[0],
	);

	useEffect(() => {
		setSelected(
			props.disableFirstSelection
				? ""
				: props.options.find((option) => option === selectedValue)
					? selectedValue
					: props.options[0],
		);
	}, [props.options, props.disableFirstSelection, selectedValue]);

	useEffect(() => {
		if (props.reset === true) {
			setSelected(props.options[0]);
		}
	}, [props.reset, props.options]);

	useEffect(() => {
		//props.getValue(selected);
	}, [selected]);

	return (
		<div className={`top-16 listbox-container ${props.className}`}>
			<Listbox
				key={props.key}
				value={selected}
				defaultValue={props.options[0]}
				onChange={(val) => {
					setSelected(val);
					props.getValue(val);
				}}
				name="assignee"
			>
				{({ open }) => (
					<div className="relative mt-1 listbox ">
						<Listbox.Button
							className={`p-[5px] relative cursor-default rounded-lg bg-white py-2 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 !text-base ${
								props.buttonClassName
							} ${open ? props.activeStyles : props.inActiveStyles}`}
						>
							<div className="flex gap-[10px] item">
								{props.icon && props.icon}
								<span className="block ">
									{selected === "" ? props.label : selected}
								</span>
							</div>
							<span className="pointer-events-none  inset-y-0 right-0 flex items-center">
								<img
									src={open ? caretClose : caretOpen}
									className="ui-active:hidden icon-grey-5 h-3 w-3"
									alt="caret"
									height="12px"
									width="12px"
								/>
							</span>
						</Listbox.Button>
						<Transition
							as={Fragment}
							leave="transition ease-in duration-100"
							leaveFrom="opacity-100"
							leaveTo="opacity-0"
						>
							<Listbox.Options className="absolute mt-1 max-h-60 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm z-50">
								{props.options.map((option, index) => (
									<Listbox.Option
										key={option}
										disabled={!!(props.disableFirst === true && index === 0)}
										className={({ active }) =>
											`relative cursor-default select-none py-2 ${
												active ? "bg-amber-100 text-amber-900" : "text-gray-900"
											}`
										}
										value={option}
									>
										{({ selected }) => (
											<>
												<div className="w-[24px]">
													<img
														src={tick}
														className={`${
															selected ? "block" : "hidden"
														} icon-grey-5 ${props.arrowIcon}`}
														alt="tick"
														height="20px"
														width="20px"
													/>
												</div>

												<span
													className={`block ${
														selected ? "font-medium" : "font-normal"
													}`}
												>
													{option}
												</span>
											</>
										)}
									</Listbox.Option>
								))}
							</Listbox.Options>
						</Transition>
					</div>
				)}
			</Listbox>
		</div>
	);
}
