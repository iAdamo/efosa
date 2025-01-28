import useGlobalStore from "@/store/globalStore";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Area,
  AreaChart,
  ReferenceArea,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// Custom Tooltip Component
const CustomTooltip = ({ active, payload, label, refAreaLeft, refAreaRight }) => {
  if (active && payload && payload.length && refAreaLeft && refAreaRight) {
    return (
      <div
        className="custom-tooltip"
        style={{
          backgroundColor: "#FFFFFF",
          padding: "10px",
          border: "1px solid #CCCCCC",
          borderRadius: "4px",
        }}
      >
        <p className="text-black">{`${refAreaLeft} to ${refAreaRight}`}</p>
        <p className="text-black">{`${payload[0].value} Executions`}</p>
      </div>
    );
  }
  return null;
};

const TimelineChart = ({ is24hDate, selectedDateRange }) => {
  const [refAreaLeft, setRefAreaLeft] = useState("");
  const [refAreaRight, setRefAreaRight] = useState("");
  const [selected, setSelected] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { allExecutionDetailsData } = useGlobalStore(
    (state) => ({
      allExecutionDetailsData: state.allExecutionDetailsData,
    })
  );
  const [finalData, setFinalData] = useState([]);
  const { speccID } = useParams();

  const generateDateRange = (start, end) => {
    const dateArray = [];
    const currentDate = new Date(start);
    const endDate = new Date(end);

    while (currentDate <= endDate) {
      dateArray.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dateArray;
  };

  const generateData = () => {
    const answer = [];
    const dateRange = generateDateRange(selectedDateRange.formattedStartDate, selectedDateRange.formattedEndDate);

    dateRange.forEach(date => {
      const dateString = date.toISOString().split("T")[0]; // Format as 'YYYY-MM-DD'
      const existingData = allExecutionDetailsData?.projects?.flatMap(project =>
        project.speccs
          .find(specc => specc.id === Number(speccID))
          ?.runs?.filter(run => run.end.startsWith(dateString))
      );

      if (existingData.length) {
        const counts = existingData.reduce((acc, run) => {
          acc.successCount += run.success;
          acc.warningCount += run.isRerun;
          acc.errorCount += run.crashed;
          return acc;
        }, { successCount: 0, warningCount: 0, errorCount: 0 });

        answer.push({
          time: dateString,
          ...counts
        });
      } else {
        answer.push({
          time: dateString,
          successCount: 0,
          warningCount: 0,
          errorCount: 0,
        });
      }
    });

    return answer.sort((a, b) => new Date(a.time) - new Date(b.time));
  };

  useEffect(() => {
    setFinalData(generateData())
  }, [is24hDate, allExecutionDetailsData]);

  return (
    <div className="highlight-bar-charts" style={{ userSelect: "none" }}>
      <ResponsiveContainer width="100%" height={350}>
        <AreaChart
          margin={{ left: -20, top: 20, right: 18 }}
          data={finalData}
          onMouseDown={(e) => {
            if (selected) {
              setRefAreaRight("");
            }
            setSelected(false);
            setRefAreaLeft(e.activeLabel);
          }}
          onMouseMove={(e) => {
            refAreaLeft && !selected && setRefAreaRight(e.activeLabel);
          }}
          onMouseUp={() => {
            setSelected(true);
          }}
        >
          <XAxis
            dataKey="time"
            tick={{
              fontSize: 12,
              fill: "#AEAEAE",
              fontWeight: "normal",
            }}
            tickFormatter={(value) => {
              const date = new Date(value);
              return is24hDate
                ? date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false })
                : date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
            }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            type="number"
            yAxisId="1"
            axisLine={false}
            tickLine={false}
            tick={{
              fontSize: 12,
              fill: "#AEAEAE",
              fontWeight: "normal",
            }}
          />
          <Tooltip content={isHovered && <CustomTooltip refAreaLeft={refAreaLeft} refAreaRight={refAreaRight} />} />
          <Area
            yAxisId="1"
            type="monotone"
            dataKey="warningCount"
            stroke="#F6C519"
            fill="none"
            strokeWidth={"2px"}
            animationDuration={300}
            stackId={1}
          />
          <Area
            yAxisId="1"
            type="monotone"
            dataKey="errorCount"
            stroke="#FF3737"
            fill="none"
            strokeWidth={"2px"}
            animationDuration={300}
            stackId={1}
          />
          <Area
            yAxisId="1"
            type="monotone"
            dataKey="successCount"
            stroke="#00FF00"
            fill="none"
            strokeWidth={"2px"}
            animationDuration={300}
            stackId={1}
          />

          {/* range selection area */}
          {/* {refAreaLeft && refAreaRight && (
            <>
              <ReferenceArea
                yAxisId="1"
                x1={refAreaLeft}
                x2={refAreaRight}
                fill="#ffffff"
                opacity={0.3}
                isFront={true}
                y1={2}
                y2={Math.max(...finalData?.map(item =>
                  Math.max(item.successCount, item.warningCount, item.errorCount)
                ))}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              />
              <ReferenceLine
                yAxisId="1"
                x={refAreaLeft}
                stroke="#F6C519"
                strokeWidth={"1px"}
                strokeDasharray="3 3"
                ifOverflow="extendDomain"
                label={({ viewBox }) => (
                  <svg>
                    <circle  // Top left circle
                      cx={viewBox.x}
                      cy={viewBox.y + 6}  // Adjust to move the circle down slightly 
                      r={4}
                      fill="#F6C519"
                    />
                    <circle // Bottom left circle
                      cx={viewBox.x}
                      cy={viewBox.height + 16} // Adjust to move the circle to the bottom
                      r={4}
                      fill="#F6C519"
                    />
                  </svg>
                )}
              />
              <ReferenceLine
                yAxisId="1"
                x={refAreaRight}
                stroke="#F6C519" // Dark right border color
                strokeWidth={"1px"}  // Right border width
                strokeDasharray="3 3" // Dotted right border
                className={'absolute'}
                label={({ viewBox }) => (
                  <svg>
                    <circle // Top right circle
                      cx={viewBox.x}
                      cy={viewBox.y + 6}  // Adjust to move the circle down slightly 
                      r={4}
                      fill="#F6C519"
                    />
                    <circle // Bottom right circle
                      cx={viewBox.x}
                      cy={viewBox.height + 16} // Adjust to move the circle to the bottom 
                      r={4}
                      fill="#F6C519"
                    />
                  </svg>
                )}
              />
            </>
          )} */}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TimelineChart;

