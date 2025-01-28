import useOutsideClickHandler from "@hooks/useOutsideHandler";
import { ChevronUpIcon } from "@heroicons/react/solid";
import { useRef, useState } from "react";

const SelectNode = ({ value, onClick, options }) => {
	const [isShowOption, setIsShowOption] = useState(false);

	const selectRef = useRef();

	useOutsideClickHandler(selectRef, () => setIsShowOption(false));
	return (
		<div
			onClick={() => setIsShowOption(!isShowOption)}
			className="cursor-pointer flex items-center justify-between rounded-md bg-[#EEEEEE] h-4 relative"
		>
			<p className="px-2 text-xs">{value}</p>

			<div className={`mr-2 ${!isShowOption ? "rotate-180" : ""}`}>
				<ChevronUpIcon width="15px" />
			</div>
			{isShowOption && (
				<div
					ref={selectRef}
					className="absolute top-4 bg-[#080808] z-40 rounded-md w-full py-3 max-h-[100px] overflow-auto customBoxShadow "
				>
					{options.map((item) => (
						<p
							key={item.name}
							className="text-[10px] px-3 py-1 cursor-pointer hover:bg-[#d5d5d5]"
							onClick={() => {
								onClick(item.value);
								setIsShowOption(false);
							}}
						>
							{item.value}
						</p>
					))}
				</div>
			)}
		</div>
	);
};

export default SelectNode;
