import { postGenericCRUDWithID } from "@/axios/apiCalls";
import Button from "@/components/Button";
import CustomInput from "@/components/CustomInput";
import CustomLoader from "@/components/CustomLoader";
import { CustomSelect } from "@/components/CustomSelect";
import { ProjectContext } from "@/contexts/ProjectContext";
import useGlobalStore from "@/store/globalStore";
import MinusIcon from "@assets/icons/minus-icon.svg?react";
import PlusIcon from "@assets/icons/plus-icon.svg?react";
import Warning from "@assets/icons/warning.svg?react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";

function TimeVariableSection({
  label,
  timeValue,
  timePlusMinus,
  timeRelativeOrFixed,
  runTestOfDate,
  dateId,
  selectedVariable,
  isBugWarning,
  onTimeChange,
}) {
  const [relativeOrFixed, setRelativeOrFixed] = useState("");
  const [plusOrMinus, setPlusOrMinus] = useState(null);

  const { createdVariableID } = useGlobalStore((state) => ({
    createdVariableID: state.createdVariableID,
  }));
  const { variables, setVariables } = useContext(ProjectContext);
  const [inputValue, setInputValue] = useState(null);
  const [isRelativeFixedLoading, setIsRelativeFixedLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const getSelectLabel =
      selectedVariable?.date?.[timePlusMinus] === "PLUS" ? "Plus" : "Minus";

    if (getSelectLabel) {
      setPlusOrMinus({
        label: getSelectLabel,
        value: selectedVariable?.date?.[timePlusMinus],
      });
    }

    if (selectedVariable?.date?.[timeRelativeOrFixed]) {
      setRelativeOrFixed(selectedVariable?.date?.[timeRelativeOrFixed]);
      onTimeChange(selectedVariable?.date?.[timeRelativeOrFixed]);
    }
  }, []);

  const handleChange = async (objectName, event, label) => {
    try {
      let newValue = event?.target?.value || event?.value;

      if (
        newValue === "monthRelativeOrFixed" ||
        newValue === "dateRelativeOrFixed" ||
        newValue === "YearRelativeOrFixed"
      ) {
        setRelativeOrFixed(newValue);
      }

      if (newValue === "PLUS" || newValue === "MINUS") {
        setPlusOrMinus(event);
      }

      if (newValue === "RELATIVE" || newValue === "FIXED") {
        setIsRelativeFixedLoading(true);
        setRelativeOrFixed(newValue);
        onTimeChange(newValue);
        setInputValue("0");
        if (label === "Year") {
        }
        const objectValue =
          label === "Year"
            ? { yearValue: "0" }
            : label === "Month"
              ? { monthValue: "0" }
              : { dayValue: "0" };

        const inputValueResponse = await postGenericCRUDWithID(
          "Variables_Date",
          dateId,
          objectValue
        );
      }

      if (newValue?.length > 0 || newValue === "") {
        const obj = {};
        obj[objectName] = newValue || newValue;
        const updatedDate = await postGenericCRUDWithID(
          "Variables_Date",
          dateId,
          obj
        );

        const allVariables = [];
        for (let i = 0; i < variables.length; i++) {
          if (variables[i]?.id != createdVariableID) {
            allVariables.push(variables[i]);
          } else {
            const changedVariable = variables[i];
            changedVariable.date = updatedDate?.data;
            allVariables?.push(changedVariable);
          }
        }
        setVariables(allVariables);
        runTestOfDate(createdVariableID);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsRelativeFixedLoading(false);
    }
  };

  const MuiInputBaseStyles = {
    padding: "2px 10px !important",
  };

  const customSelectStyles = {
    backgroundColor: "#1E2125",
    borderRadius: "4px",
    "& .MuiAccordionSummary-root": {
      minHeight: "0 !important",
      padding: "4px",
    },
    "& .MuiAccordionDetails-root": {
      padding: "0px 8px 8px !important",
    },
  };

  const handleInputChange = (e) => {
    const value = e.target.value;

    if (timeValue === "yearValue" && selectedVariable?.date?.[timeRelativeOrFixed] === "FIXED") {
      if (/^\d{0,4}$/.test(value)) {
        setInputValue(value);
      }
    } else if (timeValue === "monthValue" && selectedVariable?.date?.[timeRelativeOrFixed] === "FIXED") {
      if (value === "" || (/^\d{1,2}$/.test(value) && value >= 0 && value <= 12)) {
        setInputValue(value);
      }
    } else if (timeValue === "dayValue" && selectedVariable?.date?.[timeRelativeOrFixed] === "FIXED") {
      if (value === "" || (/^\d{1,2}$/.test(value) && value >= 0 && value <= 31)) {
        setInputValue(value);
      }
    } else if (timeValue === "hourValue" && (selectedVariable?.date?.[timeRelativeOrFixed] === "FIXED")) {
      if (value === "" || (/^\d{1,2}$/.test(value) && value >= 0 && value <= 24)) {
        setInputValue(value);
      }
    } else if ((timeValue === "minuteValue" || timeValue === "secondValue") && (selectedVariable?.date?.[timeRelativeOrFixed] === "FIXED")) {
      if (value === "" || (/^\d{1,2}$/.test(value) && value >= 0 && value <= 60)) {
        setInputValue(value);
      }
    } else {
      setInputValue(value);
    }
  };

  const handleToggle = () => {
    setExpanded((prev) => !prev);
  };

  return (
    <div className="flex flex-col gap-s12">
      <div className="flex flex-row items-center justify-between font-normal text-custom-ghostWhite">
        <div>{label}</div>
        <RadioGroup
          sx={{ gap: "24px" }}
          row
          aria-labelledby="demo-controlled-radio-buttons-group"
          name="controlled-radio-buttons-group"
          value={relativeOrFixed}
          onChange={(e) => handleChange(timeRelativeOrFixed, e, label)}
        >
          <FormControlLabel
            sx={{
              margin: "0",
              gap: "8px",
              "& .MuiFormControlLabel-label": { fontSize: "10px" },
            }}
            value="FIXED"
            control={
              <Radio
                sx={{
                  color: "#6C757D",
                  padding: 0,
                  "& .MuiSvgIcon-root": { fontSize: 20 },
                  "&.Mui-checked": { color: "#F8F9FA" },
                }}
              />
            }
            label="Set date"
          />
          <FormControlLabel
            sx={{
              margin: "0",
              gap: "8px",
              "& .MuiFormControlLabel-label": { fontSize: "10px" },
            }}
            value="RELATIVE"
            control={
              <Radio
                sx={{
                  color: "#6C757D",
                  padding: 0,
                  "& .MuiSvgIcon-root": { fontSize: 20 },
                  "&.Mui-checked": { color: "#F8F9FA" },
                }}
              />
            }
            label="Adjust date"
          />
        </RadioGroup>
      </div>

      {isRelativeFixedLoading ? (
        <div className="flex justify-center">
          <CustomLoader />
        </div>
      ) : (
        selectedVariable?.date?.[timeRelativeOrFixed] === "RELATIVE" && (
          <CustomSelect
            options={[
              { label: "Plus", value: "PLUS", id: 1 },
              { label: "Minus", value: "MINUS", id: 2 },
            ]}
            readOnly={isBugWarning}
            value={plusOrMinus}
            onChange={(e) => handleChange(timePlusMinus, e, label)}
            withAutoComplete={false}
            placeholder={"Select"}
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
        )
      )}
      <CustomInput
        id={"timePlusMinus"}
        min={0}
        type="number"
        max={"9999"}
        value={inputValue}
        onChange={handleInputChange}
        disabled={isBugWarning}
        defaultValue={selectedVariable?.date[timeValue]}
        onBlur={(e) => handleChange(timeValue, e, label)}
        labelClassName="text-sm font-normal text-grey-16"
        inputClassName={`${isBugWarning ? "border-status-error-1" : "border-grey-13"} py-s8 placeholder:text-grey-13 placeholder:text-xs`}
        variant="primary"
        placeholder="Enter variable value"
        label="Value"
      />
      <Button className="w-max underline underline-offset-1 text-grey-16">
        Choose preset
      </Button>

      {isBugWarning && (
        <Accordion
          className="group px-s6 py-0 border border-status-error-1"
          elevation={0}
          disableGutters={true}
          expanded={expanded}
          onChange={handleToggle}
          sx={{ ...customSelectStyles }}
        >
          <AccordionSummary
            id="accordion-header"
            expandIcon={
              expanded ? (
                <MinusIcon className="w-s16 h-s16" />
              ) : (
                <PlusIcon className="w-s16 h-s16" />
              )
            }
            sx={{ "& .MuiAccordionSummary-content": { margin: 0 } }}
          >
            <div className="w-full items-center flex">
              <span className="flex items-center gap-s4 text-custom-ghostWhite font-medium">
                <Warning alt="warning" className="icon-error w-[24px] h-[24px]" />
                {"Bug warning"}
              </span>
            </div>
          </AccordionSummary>
          <AccordionDetails>
            <div className="flex flex-col gap-2 text-status-error-1 text-sm">
              Please review the timestamp to ensure the desired outcome, as setting
              an 'adjust' value after a 'set' value may result in a conflict.
            </div>
          </AccordionDetails>
        </Accordion>
      )}
    </div>
  );
}

export default TimeVariableSection;
