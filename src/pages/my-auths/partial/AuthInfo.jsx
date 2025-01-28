export const AuthInfo = ({ label, value, isLast }) => (
    <div
        className={`flex items-start gap-2 w-[160px] box-border ${
            !isLast ? 'border-r border-[#454c54]' : ''
        }`}
    >
        <span className='text-sm font-normal text-[#706D79]'>{label}</span>
        <span className="text-sm font-normal text-white max-w-[95px] md:max-w-[160px] truncate">
            {value}
        </span>
    </div>
);
