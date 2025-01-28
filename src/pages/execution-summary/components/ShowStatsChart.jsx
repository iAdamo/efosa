import { gaugeClasses } from "@mui/x-charts";
import { Gauge } from "@mui/x-charts/Gauge";

export default function ShowStatChart({
  successValue,
  errorValue,
  warningValue,
  maxValue
}) {
  return (
    <div className="flex w-[100%] min-h-[100%]">
      <div className="relative w-[100%] min-h-[100%] p-1 flex flex-col items-center justify-center left-[15px]">
        <div className="absolute top-[-10px]">
          <Gauge
            width={250}
            height={100}
            value={Number(warningValue)}
            valueMax={Number(maxValue)}
            startAngle={90}
            innerRadius="90%"
            outerRadius="120%"
            endAngle={-90}
            sx={(theme) => ({
              width: "300px",
              height: "150px",
              borderRadius: "50px",
              [`& .${gaugeClasses.valueText}`]: {
                fontSize: 40,
              },
              [`& .${gaugeClasses.valueArc}`]: {
                fill: "url(#gaugeGradient)",
                borderRadius: "20px",
                borderTopLeftRadius: "200px",
                strokeWidth: 10,
                strokeLinecap: "round",
              },
              [`& .${gaugeClasses.referenceArc}`]: {
                fill: "#2B2B2B",
              },
            })}
          >
            <svg width="0" height="0">
              <defs>
                <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FFC011" />
                  <stop offset="100%" stopColor="#FF8533" />
                </linearGradient>
              </defs>
            </svg>
          </Gauge>
          <div className="absolute h-[100px] top-[6px] right-[58px] m-[4px]">
            <Gauge
              width={147}
              height={100}
              value={Number(errorValue)}
              startAngle={90}
              valueMax={Number(maxValue)}
              innerRadius="70%"
              outerRadius="110%"
              endAngle={-90}
              sx={{
                width: "176px",
                height: "150px",
                [`& .${gaugeClasses.valueText}`]: {
                  fontSize: 40,
                },
                [`& .${gaugeClasses.valueArc}`]: {
                  fill: "url(#redGradient)",
                },
                [`& .${gaugeClasses.referenceArc}`]: {
                  fill: "#2B2B2B",
                },
              }}
            >
              <svg width="0" height="0">
                <defs>
                  <linearGradient id="redGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FF3737" />
                    <stop offset="100%" stopColor="#C80025" />
                  </linearGradient>
                </defs>
              </svg>
            </Gauge>
          </div>

          <div className="absolute top-[32px] right-[71.5px] m-[4px]">
            <Gauge
              width={85}
              height={100}
              value={Number(successValue)}
              startAngle={90}
              valueMax={Number(maxValue)}
              innerRadius="70%"
              outerRadius="120%"
              endAngle={-90}
              sx={{
                width: "150px",
                height: "130px",
                [`& .${gaugeClasses.valueText}`]: {
                  fontSize: 40,
                },
                [`& .${gaugeClasses.valueArc}`]: {
                  fill: "url(#greenGradient)",
                },
                [`& .${gaugeClasses.referenceArc}`]: {
                  fill: "#2B2B2B",
                },
              }}
            >
              <svg width="0" height="0">
                <defs>
                  <linearGradient id="greenGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#00DF9C" />
                    <stop offset="100%" stopColor="#2BFF6B" />
                  </linearGradient>
                </defs>
              </svg>
            </Gauge>
          </div>
        </div>
      </div>
    </div>
  );
}