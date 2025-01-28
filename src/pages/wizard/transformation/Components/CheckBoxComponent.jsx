const CheckBoxComponent = ({ name, type, onChange, isChecked }) => {
	return (
		<div
			className={`checkbox ${isChecked ? "active" : ""} text-[14px] my-2 cursor-pointer`}
			onClick={onChange}
		>
			<div className={`checkblock ${type} h-[14px] w-[14px]`}>
				<input type="checkbox" />v
			</div>
			{name}
		</div>
	);
};

export default CheckBoxComponent;
