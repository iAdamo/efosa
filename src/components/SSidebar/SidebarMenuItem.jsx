import MinusBg from "@assets/icons/minus-bg.svg?react";

export default function SidebarMenuItem({ className, name, icon, isSelected, onClick, navigation,children,	 ...props }) {
	const temp = false;
	return (
		<div
			onClick={(e) => onClick(e)}
			onKeyDown={(e) => onClick(e)}
			className={`${className} w-full flex flex-grow gap-[8px] justify-start items-center p-[10px] cursor-pointer group hover:bg-grey-13 hover:bg-opacity-25 rounded select-none ${isSelected ? "bg-grey-13 bg-opacity-25" : ""
				} `}>
			{icon}
			<div className="flex gap-[5px] items-center">
				<span className={`sidebar-menu-item-label ${isSelected ? "!text-white" : ""}`}>{children ||name}</span>
				{props.showDelete && <MinusBg onClick={() => props.deleteClick()} alt="minus" className="h-[13px] w-[13px] group-hover:block hidden" />}
			</div>
		</div>
	);
}
