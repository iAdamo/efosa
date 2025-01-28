import { postGenericCRUDWithID } from "@/axios/apiCalls";
import CustomInput from "@/components/CustomInput";
import { CustomSelect } from "@/components/CustomSelect";
import ToggleButtonGroupCustom from "@/components/CustomToggleButtonGroup";
import SSidebar from "@/components/SSidebar/SSidebar";
import { ProjectContext } from "@/contexts/ProjectContext";
import useGlobalStore from "@/store/globalStore";
import { ELEMENTS } from "@/store/uiSlice";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { useContext, useEffect, useState } from "react";
import DateVariableMenu from "./DateVariableMenu";

function CreateVariableMenu() {
  const { setSidebar, removeSidebar, createdVariableID } = useGlobalStore(
    (state) => ({
      removeSidebar: state.UI.removeSidebar,
      setSidebar: state.UI.setSidebar,
      createdVariableID: state.createdVariableID,
    })
  );
  const { variables, setVariables } = useContext(ProjectContext);

  const [alignment, setAlignment] = useState(null);
  const [selectBooleanType, setSelectBooleanType] = useState("");
  const [types, setTypes] = useState(null);
  const [primitiveId, setPrimitiveId] = useState(null);
  const [dateId, setDateId] = useState(null);
  const [primitiveInputValue, setPrimitiveInputValue] = useState("");

  const MuiInputBaseStyles = {
    padding: "2px 10px !important",
  };

  const getCreatedVariable = variables?.find(
    (variable) => variable.id === createdVariableID
  );

  const typeOptions = [
    { label: "String", value: "STRING", id: 1 },
    { label: "Number", value: "NUMBER", id: 2 },
    { label: "Integer", value: "INTEGER", id: 3 },
    { label: "Boolean", value: "BOOLEAN", id: 4 },
  ];

  useEffect(() => {
    if (getCreatedVariable) {
      setAlignment(getCreatedVariable?.variableType);
      const selectedOption = typeOptions.find(
        (option) => option.value === getCreatedVariable?.primitive?.type
      );
      if (selectedOption) {
        setTypes(selectedOption);
      }
      setPrimitiveInputValue(getCreatedVariable?.primitive?.value);
      setPrimitiveId(getCreatedVariable?.primitive?.id);
      setDateId(getCreatedVariable?.date?.id);
    }
  }, [getCreatedVariable, createdVariableID]);

  const handleToggleChange = async (event, newAlignment) => {
    try {
      setAlignment(newAlignment);

      const response = await postGenericCRUDWithID(
        "Active_Variables",
        createdVariableID,
        { variableType: newAlignment }
      );

      if (response && response.data) {
        const updatedVariables = variables?.map((variable) =>
          variable?.id === createdVariableID ? response?.data : variable
        );
        newAlignment === "PRIMITIVE"
          ? setPrimitiveId(response?.data?.primitive?.id)
          : setDateId(response?.data?.date?.id);
        setVariables(updatedVariables);
      } else {
        console.error("Failed to update the variable");
      }
    } catch (error) {
      console.error("Error updating the variable name");
    }
  };

  const updateVariableName = async (e) => {
    try {
      const newName = e.target.value;

      const response = await postGenericCRUDWithID(
        "Active_Variables",
        createdVariableID,
        { name: newName }
      );

      if (response && response.data) {
        const updatedVariables = variables?.map((variable) =>
          variable?.id === createdVariableID ? response?.data : variable
        );
        setVariables(updatedVariables);
      } else {
        console.error("Failed to update the variable");
      }
    } catch (error) {
      console.error("Error updating the variable name");
    }
  };

  const handleSelectType = async (type) => {
    if (primitiveInputValue || selectBooleanType) {
      try {
        await postGenericCRUDWithID("Variables_Primitive", primitiveId, {
          value: "",
        });
        const updatedVariables = variables?.map((variable) =>
          variable.id === createdVariableID
            ? {
                ...variable,
                primitive: { ...variable.primitive, value: "" },
              }
            : variable
        );
        setVariables(updatedVariables);
      } catch (error) {
        console.error("Failed to update the primitive value");
      }
    }

    setPrimitiveInputValue("");
    setSelectBooleanType("");

    try {
      setTypes(type);

      const newVariableType = await postGenericCRUDWithID(
        "Variables_Primitive",
        primitiveId,
        { type: type?.value }
      );

      setVariables((prevVariables) =>
        prevVariables.map((variable) =>
          variable.id === createdVariableID
            ? {
                ...variable,
                primitive: {
                  ...variable.primitive,
                  type: type?.value,
                },
              }
            : variable
        )
      );
    } catch (error) {
      console.error("Failed to update variable type");
    }
  };

  const handleChangeIntValue = (e) => {
    const inputValue = e.target.value;

    if (types?.value === "STRING") {
      setPrimitiveInputValue(inputValue);
    } else {
      const decimalCount = (inputValue.match(/\./g) || []).length;
      const regex = /^[0-9,/]*\.?[0-9,/]*$/;
      if (regex.test(inputValue) && decimalCount <= 1) {
        setPrimitiveInputValue(inputValue);
      }
    }
  };

  const updatePrimitiveValue = async (e) => {
    try {
      await postGenericCRUDWithID("Variables_Primitive", primitiveId, {
        value: primitiveInputValue,
      });
      const updatedVariables = variables?.map((variable) =>
        variable.id === createdVariableID
          ? {
              ...variable,
              primitive: { ...variable.primitive, value: primitiveInputValue },
            }
          : variable
      );
      setVariables(updatedVariables);
    } catch (error) {
      console.error("Failed to update the primitive value");
    }
  };

  const handleSelectBooleanType = async (event, selectedType) => {
    setSelectBooleanType(selectedType);

    try {
      await postGenericCRUDWithID("Variables_Primitive", primitiveId, {
        value: selectedType,
      });
      const updatedVariables = variables?.map((variable) =>
        variable.id === createdVariableID
          ? {
              ...variable,
              primitive: { ...variable.primitive, value: selectedType },
            }
          : variable
      );
      setVariables(updatedVariables);
    } catch (error) {
      console.error("Failed to update the primitive value");
    }
  };

  const inputProps = {
    inputClassName: "py-s8 placeholder:text-xs",
    variant: "primary",
    placeholder: "Enter variable value",
    type: "text",
  };

  return (
    <SSidebar sidebarClassName="bg-[#1e2125] py-s12 operation-node-sidebar flex flex-col col-width-[2.5/12] gap-s24 max-w-[332px] h-full rounded-api-component max-h-max">
      <div className="flex justify-between items-center px-s12">
        <div className="w-full flex gap-s12 items-center">
          <span
            className="cursor-pointer"
            onClick={() => setSidebar(ELEMENTS.SIDEBAR.VARIABLE_MENU)}
          >
            <ArrowBackRoundedIcon sx={{ height: "16px", width: "16px" }} />
          </span>
          <div class="text-custom-ghostWhite text-lg font-medium font-['Inter'] leading-[11px] tracking-normal">
            Create Variable
          </div>
        </div>
        <div class="flex gap-2 items-center text-[#aeaeae] text-[10px] font-medium font-['Inter'] leading-[11px] tracking-normal">
          <div
            onClick={() => removeSidebar()}
            className="cursor-pointer h-4 w-4 flex items-center justify-center"
          >
            <CloseRoundedIcon fontSize="small" className="text-white" />
          </div>
        </div>
      </div>

      <CustomInput
        className="px-s12"
        onBlur={(e) => updateVariableName(e)}
        defaultValue={getCreatedVariable?.name}
        labelClassName="text-sm font-normal text-grey-16"
        inputClassName="py-s8 placeholder:text-xs"
        variant="primary"
        placeholder="Name of the variable"
        label="Variable Name"
      />

      <div className="w-full px-s12">
        <div className="text-grey-16 text-xs font-normal font-['Inter'] mb-s12">
          Choose variable type
        </div>
        <ToggleButtonGroupCustom
          name="url"
          alignment={alignment}
          handleChange={handleToggleChange}
          options={[
            { value: "PRIMITIVE", label: "Primitive" },
            { value: "DATE", label: "Date" },
          ]}
          buttonStyles={{
            height: "32px",
            width: "100%",
            fontSize: "10px",
            fontWeight: 500,
            color: "#CACDD1",
          }}
          groupStyles={{ height: "36px", width: "100%" }}
        />
      </div>

      {alignment === "PRIMITIVE" && (
        <div className="flex flex-col px-s12 gap-s24">
          <CustomSelect
            options={typeOptions}
            value={types}
            onChange={(type) => handleSelectType(type)}
            withAutoComplete={false}
            placeholder="Select"
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
            optionsTypography={{
              fontSize: "12px !important",
              fontWeight: 400,
            }}
            listboxStyles={{
              display: "flex",
              flexDirection: "column",
              gap: "4px",
              padding: "12px 8px",
              background:
                "linear-gradient(170.33deg, #202427 1.59%, #353B40 100.79%)",
            }}
          />

          {types?.value === "STRING" && (
            <CustomInput
              value={primitiveInputValue}
              onChange={handleChangeIntValue}
              onBlur={(e) => updatePrimitiveValue(e)}
              {...inputProps}
              label="Enter String value"
            />
          )}
          {types?.value === "NUMBER" && (
            <CustomInput
              value={primitiveInputValue}
              onChange={handleChangeIntValue}
              onBlur={(e) => updatePrimitiveValue(e)}
              {...inputProps}
              label="Enter Number value"
            />
          )}
          {types?.value === "INTEGER" && (
            <CustomInput
              value={primitiveInputValue}
              onChange={handleChangeIntValue}
              onBlur={(e) => updatePrimitiveValue(e)}
              {...inputProps}
              label="Enter Integer value"
            />
          )}
          {types?.value === "BOOLEAN" && (
            <ToggleButtonGroupCustom
              name="booleanTypes"
              alignment={selectBooleanType}
              handleChange={handleSelectBooleanType}
              options={[
                { value: "true", label: "True" },
                { value: "false", label: "False" },
              ]}
              buttonStyles={{
                height: "32px",
                width: "100%",
                fontSize: "10px",
                fontWeight: 500,
                color: "#CACDD1",
              }}
              groupStyles={{ height: "36px", width: "100%" }}
            />
          )}
        </div>
      )}

      {alignment === "DATE" && <DateVariableMenu dateId={dateId} />}
    </SSidebar>
  );
}

export default CreateVariableMenu;
