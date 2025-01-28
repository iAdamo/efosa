import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

export default function SCalendar({ ...props }) {
  const [value, setValue] = useState(props.dateValue ?? new Date());

  useEffect(() => {
    props.getDateFromCalendar(value);
  }, [value]);

  return (
    <div className="calendar-container">
      <Calendar
        onChange={(date) => setValue(date)}
        formatWeekDay={(day) => day.substr(0, 1)}
        value={value}
        tileDisabled={({ activeStartDate, date, view }) => {
          return date < new Date();
        }}
        formatShortWeekday={(locale, date) =>
          ["S", "M", "T", "W", "T", "F", "S"][date.getDay()]
        }
      />
    </div>
  );
}
