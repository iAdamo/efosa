import BgImg from './image/bg-gradient-image.png';

const Dropdown = ({label}) => (
    <div
        className="inline-flex flex-col items-start justify-center gap-2.5 px-2 py-1 bg-[#1e212566] rounded-lg">
        <div className="inline-flex items-center gap-2">
            <div
                className="relative w-fit mt-[-1.00px] [font-family:'Inter',Helvetica] font-normal text-[#dee2e6] text-[10px]">
                {label}
            </div>
            <img className="relative w-4 h-4" alt="Chevron Down"
                 src="https://c.animaapp.com/GutENyys/img/bx-chevron-down-2-2.svg"/>
        </div>
    </div>
);

const InsightsResult = () => {
    return (
        <div
            className="rounded-lg flex flex-col justify-between border p-4 border-[#454c5466] shadow-[0px_4px_80px_#00000033]"
            style={{
                width: "auto",
                height: "100%",
                backgroundImage: `url(${BgImg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
            }}
        >
            <div
                className="flex items-center justify-between gap-3 items-start h-[11px] font-semibold text-[#f8f9fa] text-xs tracking-[0] leading-[11px] whitespace-nowrap">
                Insights
                <Dropdown label="Monthly"/>
            </div>

            <div>
                <h3 className="font-medium text-[60px] leading-[73px] tracking-[0.02em] text-custom-ghostWhite">0%</h3>
                <div className="font-normal text-[#f8f9fa66] text-sm tracking-[0.28px] leading-[normal]">more executions than November</div>
            </div>
        </div>
    );
};

export default InsightsResult;