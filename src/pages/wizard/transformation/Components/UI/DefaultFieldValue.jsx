import CustomInput from "@/components/CustomInput";
import { ProjectContext } from "@/contexts/ProjectContext";
import { WizardContext } from "@/contexts/WizardContext";
import { useDebounce } from "@/hooks/useDebounce";
import useGlobalStore from "@/store/globalStore";
import { ELEMENTS } from "@/store/uiSlice";
import XIcon from "@assets/icons/x-icon.svg?react";
import { useContext, useEffect, useMemo, useState } from "react";
import { useShallow } from "zustand/react/shallow";

const selector = (state) => ({
  webhookVariables: state.webhookVariables,
});

function DefaultFieldValue({ fieldID }) {
  const [value, setValue] = useState("");
  const debouncedValue = useDebounce(value, 1000);
  const {
    activeFields,
    setActiveFieldDefaultValue,
    removeActiveFieldDefaultValue,
    setSidebar,
    setSelectedFieldID,
    setSelectedVariableID,
    setAccordionToggle,
    selectedVariableID,
    selectedFieldID,
    setVariableObjectType
  } = useGlobalStore((state) => ({
    activeFields: state.activeFields,
    setActiveFieldDefaultValue: state.setActiveFieldDefaultValue,
    removeActiveFieldDefaultValue: state.removeActiveFieldDefaultValue,
    setSidebar: state.UI.setSidebar,
    setAccordionToggle: state.UI.setAccordionToggle,
    setSelectedFieldID: state.setSelectedFieldID,
    setSelectedVariableID: state.setSelectedVariableID,
    selectedVariableID: state.selectedVariableID,
    selectedFieldID: state.selectedFieldID,
    setVariableObjectType: state.setVariableObjectType
  }));
  const { webhookVariables } = useGlobalStore(useShallow(selector));
  const { usedVariables } = useContext(WizardContext);
  const { variables } = useContext(ProjectContext);

  const [isOpenFieldId, setIsOpenFieldId] = useState(null);

  const getSelectedVariableData = usedVariables?.find(
    (item) => item?.fieldID === Number(fieldID)
  );

  const getVariable = variables?.find(
    (item) => item?.id === getSelectedVariableData?.variableID
  );

  const getWebhookVariable = webhookVariables?.find(
    (item) => item?.id === getSelectedVariableData?.variableID
  );

  const field = useMemo(
    () => activeFields.byId[fieldID],
    [activeFields, fieldID]
  );

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const handleRemove = () => {
    removeActiveFieldDefaultValue(fieldID);
  };

  useEffect(() => {
    if (debouncedValue) setActiveFieldDefaultValue(fieldID, debouncedValue);
  }, [debouncedValue, fieldID, setActiveFieldDefaultValue]);

  const handleXIconClick = (id, data, webhook) => {
    setSidebar(ELEMENTS.SIDEBAR.VARIABLE_MENU);
    setSelectedFieldID(id);

    setSelectedVariableID(data ? data?.id : webhook?.id);
    setAccordionToggle((prev) => !prev);
    setIsOpenFieldId(id);
    setVariableObjectType("FIELD");
  };

  return (
    <>
      {field.defaultValue ? (
        <div>
          <div className="flex justify-between">
            <span>{field.defaultValue}</span>

            <button
              type="button"
              onClick={handleRemove}
              className="hidden group-hover:block"
            >
              <svg
                width="10"
                height="15"
                viewBox="0 0 10 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <title>Delete Icon</title>
                <path
                  d="M9.08341 3.99935V12.166C9.08341 12.4754 8.9605 12.7722 8.74171 12.991C8.52291 13.2098 8.22617 13.3327 7.91675 13.3327H2.08341C1.774 13.3327 1.47725 13.2098 1.25846 12.991C1.03966 12.7722 0.916748 12.4754 0.916748 12.166V3.99935M2.66675 3.99935V2.83268C2.66675 2.52326 2.78966 2.22652 3.00846 2.00772C3.22725 1.78893 3.524 1.66602 3.83341 1.66602H6.16675C6.47617 1.66602 6.77291 1.78893 6.99171 2.00772C7.2105 2.22652 7.33341 2.52326 7.33341 2.83268V3.99935"
                  stroke="#454C54"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </button>
          </div>
          {/* <div className="rounded bg-grey-13 max-h-[18px] overflow-hidden pl-s4 py-s4 text-sm text-gradient-grey-7 bg-opacity-20 flex items-center justify-between pr-s12">
                           {getVariable?.name}
                            <span className="cursor-pointer" onClick={() => handleXIconClick(fieldID, getVariable)}><XIcon className={"w-s12 h-s12 icon-white"} /></span>
                        </div> */}
        </div>
      ) : (
        <div
          className={`${(getVariable?.id && selectedVariableID && getVariable?.id === selectedVariableID) || ((isOpenFieldId || selectedFieldID) && isOpenFieldId === selectedFieldID) ? "" : "hidden"}  group-hover:block`}
        >
          {!(getVariable || getWebhookVariable) ? (
            <CustomInput
              variant="apiComponent"
              value={value}
              onChange={handleChange}
              suffix={<XIcon className={"icon-white"} />}
              onSuffixClick={() => handleXIconClick(fieldID, getVariable, getWebhookVariable)}
              suffixClassName={"cursor-pointer"}
            />
          ) : (
            (getVariable || getWebhookVariable) && (
              <div className="rounded bg-grey-13 max-h-[18px] overflow-hidden pl-s4 py-s4 text-sm text-gradient-grey-7 bg-opacity-20 flex items-center justify-between pr-s12">
                {getVariable?.name || getWebhookVariable?.name}
                <span
                  className="cursor-pointer"
                  onClick={() => handleXIconClick(fieldID, getVariable, getWebhookVariable)}
                >
                  <XIcon className={"w-s12 h-s12 icon-white"} />
                </span>
              </div>
            )
          )}
        </div>
      )}
    </>
  );
}

export default DefaultFieldValue;
