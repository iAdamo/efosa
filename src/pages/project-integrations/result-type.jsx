import { min } from "lodash";
import {
    dayOfWeek,
    strategy,
    months,
    hoursOptions,
    minutesOptions,
} from "./list-data";

export class Result {
    strategy = strategy[0];
    startDate = new Date();
    endDate = new Date();
    repeat = repeat[0];
    every = {
        minutes: 0,
        hours: 0,
        day: 0,
        month: {
            selectedMonth: months[0],
            dateOfMonth: {
                isSelected: false,
                selectedDate: 0,
                hour: hoursOptions[0],
                minutes: minutesOptions[0],
            },

            dayInWeek: {
                isSelected: false,
                daySequence: dayOfWeek[0],
                dayName: weekDays[0],
                hour: hoursOptions[0],
                minutes: minutesOptions[0],
            },
        },
    };
}
