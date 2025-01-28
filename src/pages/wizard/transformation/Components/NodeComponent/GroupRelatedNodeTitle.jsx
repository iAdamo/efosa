import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/solid";

const GroupRelatedNodeTitle = ({ title, isCollapsed, onClick, direction }) => {
    return (
        <div
            onClick={onClick}
            className={`flex items-center ${
                direction === "SOURCE" ? "" : "flex-row-reverse"
            } `}
        >
            <div className="fontFamilyQuicksand font-bold text-xs text-[#808080]">
                {title}
            </div>
            <div>
                {isCollapsed ? (
                    <ChevronUpIcon width="22px" height="22px" color="#808080" />
                ) : (
                    <ChevronDownIcon
                        width="22px"
                        height="22px"
                        color="#808080"
                    />
                )}
            </div>
        </div>
    );
};

export default GroupRelatedNodeTitle;
