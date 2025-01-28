import { useState } from "react";
import { Combobox } from "@headlessui/react";

function SSelect({ options }) {
	const [selectedOption, setSelectedOption] = useState(options[0]);
	const [query, setQuery] = useState("");

	const filteredOptions =
		query === ""
			? options
			: options.filter((option) => {
					return option.toLowerCase().includes(query.toLowerCase());
				});

	return (
		<Combobox value={selectedOption} onChange={setSelectedOption}>
			<Combobox.Input onChange={(event) => setQuery(event.target.value)} />
			<Combobox.Options>
				{filteredOptions.map((option) => (
					<Combobox.Option key={option} value={option}>
						{option}
					</Combobox.Option>
				))}
			</Combobox.Options>
		</Combobox>
	);
}

export default SSelect;
