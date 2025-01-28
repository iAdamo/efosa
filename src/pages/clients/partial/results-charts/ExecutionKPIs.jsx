import { Cell, Pie, PieChart } from "recharts";

const VARIANT_STYLES = [
    {
        id: "error-gradient",
        name: "Error",
        value: 20,
        stops: [
            { offset: "0%", color: "#D7685E" },
            { offset: "100%", color: "rgba(215, 104, 94, 0)" },
        ],
    },
    {
        id: "warning-gradient",
        name: "Warning",
        value: 30,
        stops: [
            { offset: "0%", color: "#DBBF7E" },
            { offset: "100%", color: "rgba(219, 191, 126, 0)" },
        ],
    },
    {
        id: "success-gradient",
        name: "Success",
        value: 50,
        stops: [
            { offset: "0%", color: "#14AB7E" },
            { offset: "100%", color: "rgba(20, 171, 126, 0)" },
        ],
    },
];

const LegendItem = ({ color, text }) => (
    <div className="flex items-center gap-1">
        <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: color }}
        ></div>
        <span style={{ color }} className="text-[10px] italic font-normal text-[#14AB7E] flex items-center">
            {text}
        </span>
    </div>
);

const Dropdown = ({ label }) => (
    <div className="inline-flex flex-col items-start justify-center gap-2.5 px-2 py-1 bg-[#1e212566] rounded-lg">
        <div className="inline-flex items-center gap-2">
            <div className="relative w-fit whitespace-nowrap mt-[-1.00px] font-normal text-[#dee2e6] text-[10px]">
                {label}
            </div>
            <img
                className="relative w-4 h-4"
                alt="Chevron Down"
                src="https://c.animaapp.com/GutENyys/img/bx-chevron-down-2-2.svg"
            />
        </div>
    </div>
);

const ExecutionKPIs = () => {
    return (
        <div className="bg-[#141619] p-4 rounded-lg border border-[#454c5466] col-span-1 md:col-auto">
            <div className="flex items-center justify-between w-full">
                <PieChart width={160} height={160}>
                    <defs>
                        {VARIANT_STYLES.map(({id, stops}) => (
                            <linearGradient key={id} id={id}>
                                {stops.map(({offset, color}, index) => (
                                    <stop key={index} offset={offset} stopColor={color}/>
                                ))}
                            </linearGradient>
                        ))}
                    </defs>

                    <Pie
                        data={VARIANT_STYLES}
                        innerRadius={60}
                        outerRadius={80}
                        stroke="none"
                        paddingAngle={5}
                        strokeWidth={4}
                        dataKey="value"
                    >
                        {VARIANT_STYLES.map((entry, index) => (
                            <Cell key={entry.id} fill={`url(#${entry.id})`} strokeWidth={4}/>
                        ))}
                    </Pie>

                    <foreignObject x="0" y="0" width="100%" height="100%">
                        <div
                            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                            <div className="text-white font-bold text-lg">0</div>
                            <div className="text-sm text-grey-13">Executions</div>
                        </div>
                    </foreignObject>
                </PieChart>

                <div className="ml-4 flex flex-col gap-12">
                    <div className="flex flex-col gap-2">
                        <span className="text-sm font-semibold text-custom-ghostWhite whitespace-nowrap">Execution KPIs</span>
                        <Dropdown label="This week"/>
                    </div>
                    <div className="flex flex-col gap-2">
                        {VARIANT_STYLES.map(({id, name, stops}) => (
                            <LegendItem key={id} color={stops[0].color} text={name}/>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExecutionKPIs;