import React, { useEffect, useState } from "react";
import SAccordion from "./SAccordion";

const SAccordionGroup = ({
	items,
	accordionClassname,
	titleClassname,
	contentClassname,
	defaultAnyOpen,
}) => {
	const [openIndex, setOpenIndex] = useState(defaultAnyOpen ? 0 : -1);

	const toggleAccordion = (index) => {
		setOpenIndex(openIndex === index ? null : index);
	};

	return (
		<div className="s-accordion-group">
			{items.map((item, index) => (
				<SAccordion
					title={item.title}
					content={item.content}
					open={openIndex === index}
					index={index}
					toggleAccordion={toggleAccordion}
					accordionClassname={accordionClassname}
					titleClassname={titleClassname}
					contentClassname={contentClassname}
				/>
			))}
		</div>
	);
};

export default SAccordionGroup;
