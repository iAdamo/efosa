import CheckIcon from "@/Icons/checkicon";
import ChevronRight from "@/Icons/ChevronRightIcon";
import BadgeCloseIcon from "@/Icons/BadgeCloseIcon";
const Badge = ({
	type,
	content,
	onClick,
	isClose,
	isChecked,
	withSub,
	customClass,
}) => {
	return (
		<button
			className={`bg-grey-2 text-start hover:bg-grey-3 min-h-[30px] p-3 flex gap-2 items-center ${type}${isClose ? " close" : ""}${
				isChecked ? "bg-custom-pink" : ""
			}${withSub ? " withsub" : ""} ${customClass || ""}`}
			onClick={onClick}
		>
			{isChecked && <CheckIcon />}
			{content}
			{withSub && <ChevronRight />}
			{isClose && <BadgeCloseIcon />}
		</button>
	);
};

export default Badge;
