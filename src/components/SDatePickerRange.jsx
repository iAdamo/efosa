import React, { useContext, useEffect, useState } from "react";
import {
    Button,
    CalendarCell,
    CalendarGrid,
    DateInput,
    DateRangePicker,
    DateSegment,
    Dialog,
    FieldError,
    Group,
    Heading,
    Label,
    Popover,
    RangeCalendar,
    Text,
    DateRangePickerContext,
    useSlottedContext,
} from "react-aria-components";
import {
    endOfMonth,
    startOfMonth,
    today,
    getLocalTimeZone,
    parseDate,
} from "@internationalized/date";
import { useDateFormatter } from "react-aria";
import nextIcon from "@assets/icons/next.svg";
import backIcon from "@assets/icons/back.svg";

function CalendarPicker({ children }) {
    const [value, onChange] = useState(null);
    const [focusedValue, onFocusChange] = useState(null);

    return (
        <DateRangePickerContext.Provider
            value={{ value, onChange, focusedValue, onFocusChange }}
        >
            {children}
        </DateRangePickerContext.Provider>
    );
}

function Preset({ value, children }) {
    const context = useSlottedContext(DateRangePickerContext);
    const onPress = () => {
        context.onFocusChange(value.start);
        context.onChange(value);
    };

    return (
        <Button onPress={onPress}>
            <span className="label">{children}</span>
        </Button>
    );
}

function MyRangeCalander() {
    const context = useSlottedContext(DateRangePickerContext);
    return (
        <RangeCalendar
            visibleDuration={{ months: 2 }}
            pageBehavior="single"
            aria-label="Date filter"
        >
            <Heading />
            <div className="calendar-container">
                <div className="calendar">
                    <header>
                        <Button
                            className={"icon-interactive icon-rounded"}
                            slot="previous"
                        >
                            <img className="icon-white" src={backIcon} />
                        </Button>
                    </header>
                    <CalendarGrid>
                        {(date) => <CalendarCell date={date} />}
                    </CalendarGrid>
                </div>
                <div className="calendar">
                    <header className="w-full flex justify-end">
                        <Button
                            className={"icon-interactive icon-rounded"}
                            slot="next"
                        >
                            <img className="icon-white" src={nextIcon} />
                        </Button>
                    </header>
                    <CalendarGrid offset={{ months: 1 }}>
                        {(date) => <CalendarCell date={date} />}
                    </CalendarGrid>
                </div>
            </div>
        </RangeCalendar>
    );
}

function DateDisplay({currentValue}) {
    const { value } = useSlottedContext(DateRangePickerContext);
    const formatter = useDateFormatter({ dateStyle: "medium" });

    const todayDate = today(getLocalTimeZone());
    const strDate = (date) => {
        const { day, month, year } = date;
        return `${day}/${month}/${year}`;
    };
    const startDate = currentValue?.start ? currentValue?.start : currentValue;
    const endDate = currentValue?.end ? currentValue?.end : currentValue; 

    return (
        <span className="label">
            {currentValue
                ? formatter.formatRange(
                    startDate?.toDate(getLocalTimeZone()),
                    endDate?.toDate(getLocalTimeZone())
                  )
                :"--"}
        </span>
    );
}

const MyDateRangePicker = ({
    description,
    errorMessage,
    onChange,
    ref,
    defaultValue,
    currentValue=null,
    setCurrentValue=null,
    ...props
}) => {
    const { value } = useSlottedContext(DateRangePickerContext);
    const now = today(getLocalTimeZone());
    const [currentDate, setCurrentDate] = useState("")
    useEffect(() => {   
        onChange(value);
        if(setCurrentValue) {
            setCurrentValue(value);
        }
        setCurrentDate(value);
    }, [value]);

    useEffect(() => {
        setCurrentDate(currentValue)
    }, [currentValue])
    return (
        <DateRangePicker
            ref={ref}
            className="date-picker-range text-center flex flex-grow"
            {...props}
        >
            <div className="date-picker-container min-w-[150px] h-[32px] flex items-center justify-center">
                <Group>
                    <Button className={'w-[100%]'}>
                        <DateDisplay currentValue={currentDate} />
                    </Button>
                </Group>
                {description && <Text slot="description">{description}</Text>}
                <FieldError>{errorMessage}</FieldError>

                <Popover>
                    <Dialog>
                        <div className="presets">
                            <Preset
                                value={{
                                    start: now,
                                    end: now,
                                }}
                            >
                                Today
                            </Preset>
                            <Preset
                                value={{
                                    start: now.subtract({ days: 1 }),
                                    end: now.subtract({ days: 1 }),
                                }}
                            >
                                Yesterday
                            </Preset>
                            <Preset
                                value={{
                                    start: now.subtract({ days: 3 }),
                                    end: now.subtract({ days: 1 }),
                                }}
                            >
                                Last 3 days
                            </Preset>
                            <Preset
                                value={{
                                    start: now.subtract({ days: 7 }),
                                    end: now.subtract({ days: 1 }),
                                }}
                            >
                                Last 7 days
                            </Preset>
                            <Preset
                                value={{
                                    start: startOfMonth(now),
                                    end: now,
                                }}
                            >
                                Month to Date
                            </Preset>
                            <Preset
                                value={{
                                    start: startOfMonth(
                                        now.subtract({ months: 1 })
                                    ),
                                    end: endOfMonth(
                                        now.subtract({ months: 1 })
                                    ),
                                }}
                            >
                                Previous Month
                            </Preset>
                        </div>
                        <MyRangeCalander currentValue={currentValue}/>
                    </Dialog>
                </Popover>
            </div>
        </DateRangePicker>
    );
};

const SDatePickerRange = React.forwardRef((props, ref) => {
    return (
        <>
            <CalendarPicker>
                <MyDateRangePicker {...props} ref={ref} />
            </CalendarPicker>
        </>
    );
});

export default SDatePickerRange;
