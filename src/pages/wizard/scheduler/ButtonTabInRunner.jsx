const ButtonTabInRunner = ({ isActive, onClick, title }) => (
	<button
		className={`text-sm min-w-[144px] font-medium px-3 py-2 mr-5 h-10 text-white ${
			isActive ? "bg-grey-3 shadow" : "border text-[#808080]"
		} rounded-tl-lg rounded-tr-lg font-semibold`}
		onClick={onClick}
	>
		{title}
	</button>
);

export default ButtonTabInRunner;
