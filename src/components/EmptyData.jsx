export default function EmptyData({
    icon,
    info
}) {
    return (
        <div
            className="flex flex-col gap-4 w-full justify-center items-center bg-[#1E2125] rounded-lg py-28">
            {icon}
            <div className="text-[#454C54] text-lg font-bold font-['Inter'] ">{info}</div>
        </div>
    );
}
