import { postGenericCRUDWithID, testDateTimeCall } from "@/axios/apiCalls";
import CustomInput from "@/components/CustomInput";
import CustomLoader from "@/components/CustomLoader";
import { CustomSelect } from "@/components/CustomSelect";
import { ProjectContext } from "@/contexts/ProjectContext";
import useGlobalStore from "@/store/globalStore";
import moment from "moment";
import { useContext, useEffect, useMemo, useState } from "react";
import TimeVariableSection from "./TimeVariableSection";

function DateVariableMenu({ dateId }) {
  const [dateFormat, setDateFormat] = useState(null);
  const [generatedDateTime, setGeneratedDateTime] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [warnings, setWarnings] = useState({
    year: false,
    month: false,
    date: false,
    hour: false,
    minute: false,
    second: false,
  });
  const [timeConfigs, setTimeConfigs] = useState({
    year: "",
    month: "",
    date: "",
    hour: "",
    minute: "",
    second: "",
  });

  useEffect(() => {
    const { year, month, date, hour, minute, second } = timeConfigs;

    setWarnings((prev) => ({
      ...prev,
      year: false,
      month: (year === "FIXED" && month === "RELATIVE"),
      date: (
        ((year === "FIXED" || month === "FIXED") && date === "RELATIVE") ||
        (year === "FIXED" && month === "RELATIVE" && date === "RELATIVE") ||
        (year === "RELATIVE" && month === "FIXED" && date === "RELATIVE")
      ),
      hour: (
        (year === "FIXED" && month === "FIXED" && date === "FIXED" && hour === "RELATIVE") ||
        (year === "FIXED" && month === "RELATIVE" && date === "FIXED" && hour === "RELATIVE") ||
        (year === "RELATIVE" && month === "RELATIVE" && date === "FIXED" && hour === "RELATIVE") ||
        (year === "FIXED" && month === "RELATIVE" && date === "RELATIVE" && hour === "RELATIVE") ||
        (year === "FIXED" && month === "FIXED" && date === "RELATIVE" && hour === "RELATIVE") ||
        (month === "FIXED" && hour === "RELATIVE")
      ),
      minute: ((hour === "FIXED" && minute === "RELATIVE") ||
        (year === "FIXED" && month === "RELATIVE" && date === "FIXED" && hour === "RELATIVE" && minute === "RELATIVE") ||
        (year === "FIXED" && month === "RELATIVE" && date === "RELATIVE" && hour === "RELATIVE" && minute === "RELATIVE") ||
        (year === "FIXED" && month === "FIXED" && date === "RELATIVE" && hour === "RELATIVE" && minute === "RELATIVE") ||
        (year === "FIXED" && month === "FIXED" && date === "FIXED" && hour === "RELATIVE" && minute === "RELATIVE") ||
        (month === "FIXED" && minute === "RELATIVE") ||
        (date === "FIXED" && minute === "RELATIVE")
      ),
      second: (
        ((hour === "FIXED" || minute === "FIXED") && second === "RELATIVE") ||
        (hour === "FIXED" && minute === "RELATIVE" && second === "RELATIVE") ||
        (hour === "RELATIVE" && minute === "FIXED" && second === "RELATIVE") ||
        (year === "FIXED" && second === "RELATIVE") ||
        (month === "FIXED" && second === "RELATIVE") ||
        (date === "FIXED" && second === "RELATIVE")
      ),
    }));

  }, [timeConfigs]);

  const handleTimeConfigChange = (key, value) => {
    setTimeConfigs((prev) => ({ ...prev, [key]: value }));
  };

  const { availableDateFormats, variables, setVariables } =
    useContext(ProjectContext);

  const { createdVariableID } = useGlobalStore((state) => ({
    createdVariableID: state.createdVariableID,
  }));

  const formatOption = useMemo(() => {
    return availableDateFormats?.map((data) => ({
      label: data.format,
      id: data.id,
      value: data.format,
    }));
  }, [availableDateFormats]);

  useEffect(() => {
    if (selectedVariable?.date?.dateFormatID) {
      for (let i = 0; i < availableDateFormats.length; i++) {
        if (selectedVariable.date.dateFormatID == availableDateFormats[i].id) {
          setDateFormat({
            label: availableDateFormats[i].format,
            id: availableDateFormats[i].id,
            value: availableDateFormats[i].format,
          });
          break;
        }
      }
      runTestOfDate(createdVariableID);
    }
  }, [dateId]);

  var currentdate = new Date();
  var datetime =
    currentdate.getFullYear() +
    "-" +
    ("0" + (currentdate.getMonth() + 1)).slice(-2) +
    "-" +
    ("0" + currentdate.getDate()).slice(-2) +
    " " +
    ("0" + currentdate.getHours()).slice(-2) +
    ":" +
    ("0" + currentdate.getMinutes()).slice(-2) +
    ":" +
    ("0" + currentdate.getSeconds()).slice(-2);

  const [testDateTime, setTestDateTime] = useState(datetime);

  const runTestOfDate = async (variableID, newTestTimestamp = null) => {
    let timestampToUse = null;
    if (newTestTimestamp == null) {
      timestampToUse = testDateTime;
    } else {
      timestampToUse = newTestTimestamp;
    }

    const generatedTime = await testDateTimeCall(variableID, timestampToUse);
    setGeneratedDateTime(generatedTime);
  };

  const MuiInputBaseStyles = {
    padding: "2px 10px !important",
  };

  let selectedVariable = null;
  for (let i = 0; i < variables.length; i++) {
    if (variables[i].id == createdVariableID) {
      selectedVariable = variables[i];
      break;
    }
  }

  const handleFormatChange = async (selectedValue) => {
    setDateFormat(selectedValue);
    const formatId = selectedValue?.id;
    setIsLoading(true);

    try {
      const newVariableType = await postGenericCRUDWithID(
        "Variables_Date",
        dateId,
        { dateFormatID: formatId }
      );

      const newVariables = [];
      for (let i = 0; i < variables.length; i++) {
        if (variables[i].id != createdVariableID) {
          newVariables.push(variables[i]);
        } else {
          const changedVariable = variables[i];
          changedVariable.date.dateFormatID = formatId;

          for (let i = 0; i < availableDateFormats.length; i++) {
            if (formatId == availableDateFormats[i].id) {
              changedVariable.dateConfig = availableDateFormats[i];
              break;
            }
          }

          newVariables.push(changedVariable);
        }
      }

      setVariables(newVariables);
      runTestOfDate(createdVariableID);
    } catch (error) {
      console.error("Error updating date format");
    } finally {
      setIsLoading(false);
    }
  };

  const updateTestTimestamp = (newTestTimestamp) => {
    const formattedTimestamp = moment(newTestTimestamp).format(
      "YYYY-MM-DD HH:mm:ss"
    );

    if (formattedTimestamp) {
      setTestDateTime(formattedTimestamp);
      runTestOfDate(createdVariableID, formattedTimestamp);
    }

  };

  const allowTimeSelect =
    selectedVariable?.dateConfig?.hasHour ||
    selectedVariable?.dateConfig?.hasMinute ||
    selectedVariable?.dateConfig?.hasSecond;

  return (
    <div className="overflow-y-auto flex flex-col gap-s24 px-s12">
      <div className="w-full create-variable-sidebar">
        <CustomSelect
          options={formatOption}
          value={dateFormat}
          onChange={(value) => handleFormatChange(value)}
          placeholder={"Select date format"}
          withAutoComplete={false}
          muiInputBaseStyles={MuiInputBaseStyles}
          muiOutlinedInput={{ padding: "6px" }}
          inputStyles={{
            background: "#454C54",
            border: "none",
            fontSize: "12px",
            fontWeight: 500,
            fontFamily: "Inter",
          }}
          itemsWrapper={{ border: "none" }}
          itemSelectedBgcolor={"#454C54"}
          listItemStyles={{ padding: "4px !important", borderRadius: "4px" }}
          optionsTypography={{ fontSize: "12px !important", fontWeight: 400 }}
          listboxStyles={{
            display: "flex",
            flexDirection: "column",
            gap: "4px",
            padding: "12px 8px",
            background:
              "linear-gradient(170.33deg, #202427 1.59%, #353B40 100.79%)",
          }}
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-s12">
          <CustomLoader />
        </div>
      ) : (
        selectedVariable?.date?.dateFormatID !== null && (
          <div className="flex flex-col gap-s24">
            {!!selectedVariable?.dateConfig?.hasYear && (
              <TimeVariableSection
                selectedVariable={selectedVariable}
                label={"Year"}
                timeValue={"yearValue"}
                timePlusMinus={"yearPlusMinus"}
                timeRelativeOrFixed={"yearRelativeOrFixed"}
                runTestOfDate={runTestOfDate}
                dateId={dateId}
                isBugWarning={warnings?.year}
                onTimeChange={(value) => handleTimeConfigChange("year", value)}
              />
            )}
            {!!selectedVariable?.dateConfig?.hasMonth && (
              <TimeVariableSection
                selectedVariable={selectedVariable}
                label={"Month"}
                timeValue={"monthValue"}
                timePlusMinus={"monthPlusMinus"}
                timeRelativeOrFixed={"monthRelativeOrFixed"}
                runTestOfDate={runTestOfDate}
                dateId={dateId}
                isBugWarning={warnings?.month}
                onTimeChange={(value) => handleTimeConfigChange("month", value)}
              />
            )}
            {!!selectedVariable?.dateConfig?.hasDay && (
              <TimeVariableSection
                selectedVariable={selectedVariable}
                label={"Date"}
                timeValue={"dayValue"}
                timePlusMinus={"dayPlusMinus"}
                timeRelativeOrFixed={"dayRelativeOrFixed"}
                runTestOfDate={runTestOfDate}
                dateId={dateId}
                isBugWarning={warnings?.date}
                onTimeChange={(value) => handleTimeConfigChange("date", value)}
              />
            )}
            {!!selectedVariable?.dateConfig?.hasHour && (
              <TimeVariableSection
                selectedVariable={selectedVariable}
                label={"Hour"}
                timeValue={"hourValue"}
                timePlusMinus={"hourPlusMinus"}
                timeRelativeOrFixed={"hourRelativeOrFixed"}
                runTestOfDate={runTestOfDate}
                dateId={dateId}
                onTimeChange={(value) => handleTimeConfigChange("hour", value)}
                isBugWarning={warnings?.hour}
              />
            )}
            {!!selectedVariable?.dateConfig?.hasMinute && (
              <TimeVariableSection
                selectedVariable={selectedVariable}
                label={"Minute"}
                timeValue={"minuteValue"}
                timePlusMinus={"minutePlusMinus"}
                timeRelativeOrFixed={"minuteRelativeOrFixed"}
                runTestOfDate={runTestOfDate}
                dateId={dateId}
                onTimeChange={(value) =>
                  handleTimeConfigChange("minute", value)
                }
                isBugWarning={warnings?.minute}
              />
            )}
            {!!selectedVariable?.dateConfig?.hasSecond && (
              <TimeVariableSection
                selectedVariable={selectedVariable}
                label={"Second"}
                timeValue={"secondValue"}
                timePlusMinus={"secondPlusMinus"}
                timeRelativeOrFixed={"secondRelativeOrFixed"}
                runTestOfDate={runTestOfDate}
                dateId={dateId}
                onTimeChange={(value) =>
                  handleTimeConfigChange("second", value)
                }
                isBugWarning={warnings?.second}
              />
            )}
          </div>
        )
      )}

      <div className="flex flex-col gap-s12 pt-s12 border-t border-grey-13">
        <CustomInput
          type={allowTimeSelect ? "datetime-local" : "date"}
          defaultValue={testDateTime}
          onBlur={(e) => updateTestTimestamp(e.target.value)}
          label="TEST TIMESTAMP"
          labelClassName="text-sm font-normal text-grey-16"
          inputClassName="py-s8 placeholder:text-xs test-timestamp"
          variant="primary"
          placeholder="Name of the variable"
        />
        <CustomInput
          readOnly
          value={generatedDateTime}
          label="Generated timestamp"
          labelClassName="text-sm font-normal text-grey-16"
          inputClassName="py-s8 pl-0 placeholder:text-xs border-none"
          variant="primary"
          placeholder="generated time"
        />
      </div>
    </div>
  );
}

export default DateVariableMenu;
