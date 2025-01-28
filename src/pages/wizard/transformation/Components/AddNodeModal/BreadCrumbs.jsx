import { useContext } from "react";
import { AddNodeModalContext } from "@contexts/AddNodeModalContext";
import SButton from "@/components/SButton";
const BreadCrumbs = () => {
	const { apiLevels, setApiLevels } = useContext(AddNodeModalContext);

	const handleClick = (index) => {
		if (index === 0) {
			setApiLevels([]);
		}
		setApiLevels((prev) => prev.slice(0, index));
	};
	if (!apiLevels.length) {
		return null;
	}

	return (
		<div className="flex gap-3 my-3">
			<SButton className={`item`} onClick={() => handleClick(0)} key={0}>
				{"<"}
				<span>Main</span>
			</SButton>
			{apiLevels.map((item, index) => {
				return (
					<SButton onClick={() => handleClick(index + 1)} key={item.name}>
						{!index ? "<" : "<-"}
						<span>{item.name}</span>
					</SButton>
				);
			})}
		</div>
	);
};

export default BreadCrumbs;
