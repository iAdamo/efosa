import {
  deleteGenericCRUDWithID,
  getGenericCRUDWithID,
  postGenericCRUD,
} from "@/axios/apiCalls";
import Button from "@/components/Button";
import CustomInput from "@/components/CustomInput";
import CustomLoader from "@/components/CustomLoader";
import SSelectDropDown, { DropdownItem } from "@/components/SSelectDropdown";
import SSidebar from "@/components/SSidebar/SSidebar";
import { ProjectContext } from "@/contexts/ProjectContext";
import { WizardContext } from "@/contexts/WizardContext";
import useGlobalStore from "@/store/globalStore";
import { ELEMENTS } from "@/store/uiSlice";
import EditIcon from "@assets/icons/EditIcon.svg?react";
import FilterIcon from "@assets/icons/new-filter.svg?react";
import PlusSquareIcon from "@assets/icons/plus-square.svg?react";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import RemoveCircleOutlineRoundedIcon from "@mui/icons-material/RemoveCircleOutlineRounded";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  styled,
  Tooltip,
} from "@mui/material";
import { useContext, useEffect, useRef, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { ReadMore } from "./ReadMore";

const selector = (state) => ({
  webhookVariables: state.webhookVariables,
});

export default function VariableMenuSidebar() {
  const { projectID, variables, setVariables } = useContext(ProjectContext);
  const { speccID, usedVariables, setUsedVariables } =
    useContext(WizardContext);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditLoading, setIsEditLoading] = useState(false);
  const [isInsertLoading, setIsInsertLoading] = useState(null);

  const {
    setSidebar,
    removeSidebar,
    selectedFieldID,
    selectedVariableID,
    setSelectedVariableID,
    accordionToggle,
    setCreatedVariableId,
    variableObjectType,
  } = useGlobalStore((state) => ({
    removeSidebar: state.UI.removeSidebar,
    setSidebar: state.UI.setSidebar,
    selectedFieldID: state.selectedFieldID,
    selectedVariableID: state.selectedVariableID,
    setSelectedVariableID: state.setSelectedVariableID,
    accordionToggle: state.UI.accordionToggle,
    setCreatedVariableId: state.setCreatedVariableID,
    variableObjectType: state.variableObjectType,
  }));
  const { webhookVariables } = useGlobalStore(useShallow(selector));

  const [openIndex, setOpenIndex] = useState(-1);

  const handleToggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  const accordionRefs = useRef([]);

  useEffect(() => {
    const newIndex = [...webhookVariables, ...variables].findIndex(
      (variable) => variable.id === selectedVariableID
    );
    setOpenIndex(newIndex !== -1 ? newIndex : null);

    if (newIndex !== -1 && accordionRefs.current[newIndex]) {
      accordionRefs.current[newIndex].scrollIntoView({
        behavior: "smooth",
      });
    }
  }, [selectedVariableID, webhookVariables, variables, accordionToggle]);

  const createNewVariable = async () => {
    setIsLoading(true);
    try {
      const newVariable = await postGenericCRUD("Active_Variables", {
        projectID: projectID,
        isProject: true,
      });

      setCreatedVariableId(newVariable.data[0].id);

      setVariables([...variables, newVariable.data[0]]);
      setSidebar(ELEMENTS.SIDEBAR.CREATE_VARIABLE_MENU);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInsertVariable = async (variableId) => {
    const getUsedVariableId = usedVariables?.find(
      (item) => item.variableID === variableId
    )?.id;

    const webhookVariablesId = webhookVariables?.find(
      (item) => item?.id === variableId
    )?.id;

    const variableType = webhookVariablesId ? "WEBHOOK" : "VARIABLE";

    if (variableId === selectedVariableID) {
      try {
        setIsInsertLoading((prev) => {
          return { ...prev, [variableId]: true };
        });
        const deleteVariable = await deleteGenericCRUDWithID(
          "Used_Variables",
          getUsedVariableId
        );
        setUsedVariables(
          usedVariables.filter((item) => item.id !== getUsedVariableId)
        );
        setSelectedVariableID(null);
      } catch (error) {
        console.error(error);
      } finally {
        setIsInsertLoading((prev) => {
          return { ...prev, [variableId]: false };
        });
      }
    } else {
      try {
        setIsInsertLoading((prev) => {
          return { ...prev, [variableId]: true };
        });

        const payload = {
          variableID: variableId,
          speccID: speccID,
          variableType: variableType,
          ...(variableObjectType === "MEATBALL" && { meatballID: selectedFieldID }),
          ...(variableObjectType === "FIELD" && { fieldID: selectedFieldID }),
          ...(variableObjectType === "ONINPUT" && { ONInputID: selectedFieldID })
        };

        const insertedVariable = await postGenericCRUD("Used_Variables", payload);

        const allUsedVariables = [];
        for (let i = 0; i < usedVariables.length; i++) {
          allUsedVariables.push(usedVariables[i]);
        }
        allUsedVariables.push(insertedVariable.data[0]);

        setUsedVariables(allUsedVariables);
        setSelectedVariableID(insertedVariable?.data?.[0]?.variableID);
      } catch (error) {
        console.error(error);
      } finally {
        setIsInsertLoading((prev) => {
          return { ...prev, [variableId]: false };
        });
      }
    }
  };

  const StyledTooltip = styled(({ className, ...props }) => (
    <Tooltip
      slotProps={{ popper: { sx: { zIndex: 99999 } } }}
      arrow
      placement="top"
      {...props}
      classes={{ popper: className }}
    />
  ))`
    & .MuiTooltip-tooltip {
      background: #141619;
      color: #f8f9fa;
      font-size: 10px;
      font-weight: 400;
      margin-bottom: 6px !important;
      border-radius: 8px;
      padding: 8px;
    }
    & .MuiTooltip-arrow {
      color: #141619;
    }
  `;

  const handleEditVariable = async (e, variableId) => {
    e.stopPropagation();
    setIsEditLoading((prev) => {
      return { ...prev, [variableId]: true };
    });

    try {
      const fetchedVariableById = await getGenericCRUDWithID(
        "Active_Variables",
        variableId
      );

      setCreatedVariableId(fetchedVariableById?.data?.[0]?.id);
      setSidebar(ELEMENTS.SIDEBAR.CREATE_VARIABLE_MENU);
      setIsEditLoading((prev) => {
        return { ...prev, [variableId]: false };
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsEditLoading((prev) => {
        return { ...prev, [variableId]: false };
      });
    }
  };

  return (
    <SSidebar sidebarClassName=" bg-[#1e2125] py-3 operation-node-sidebar flex flex-col col-width-[2.5/12] gap-6 max-w-[332px] h-full rounded-api-component max-h-[695px]">
      <div className="flex justify-between items-center px-3">
        <div class="text-custom-ghostWhite text-lg font-medium font-['Inter'] leading-[11px] tracking-normal">
          Variable library
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
      <Button
        onClick={() => createNewVariable()}
        disabled={isLoading}
        disableClassName="flex items-center justify-center mx-3 font-normal rounded-containers text-custom-ghostWhite bg-grey-13 py-2 border border-transparent hover:border-grey-23 cursor-pointer"
        className="flex items-center justify-center mx-3 font-normal rounded-containers text-custom-ghostWhite bg-grey-13 py-2 border border-transparent hover:border-grey-23 cursor-pointer"
      >
        {isLoading ? (
          <CustomLoader
            iconClassName="w-4 h-4"
            labelClassName="text-custom-ghostWhite"
          />
        ) : (
          "Create new variable"
        )}
      </Button>
      <div className="flex flex-col gap-s12 px-s12">
        <CustomInput
          variant="searchBox"
          SearchIconClassName="icon-grey-21"
          placeholder="Search"
          inputClassName={"w-full placeholder:text-sm placeholder:text-grey-23"}
        />
        <div className="flex justify-between items-center operation-nodes-filters">
          <SSelectDropDown defaultValue="All" width="160px">
            <DropdownItem item="All" />
          </SSelectDropDown>
          <div className="cursor-pointer flex gap-s4 items-center font-normal">
            <FilterIcon />
            Filter
          </div>
        </div>
      </div>
      <div className="overflow-y-auto px-3">
        {(variables?.length === 0 && webhookVariables?.length === 0) ? (
          <div className="rounded-label flex justify-center p-2 text-custom-ghostWhite font-medium bg-grey-13 bg-opacity-20">
            No variable available
          </div>
        ) : (
          <div className="overflow-y-auto overflow-x-hidden flex flex-col gap-2">
            {[...webhookVariables, ...variables].map((variableData, index) => {
              const isWebhookVariable = webhookVariables.includes(variableData);
              return (
                <Accordion
                  ref={(el) => (accordionRefs.current[index] = el)}
                  className="group hover:bg-hover-grey-1"
                  elevation={0}
                  disableGutters={true}
                  sx={{
                    backgroundColor: "#454C5433",
                    minHeight: 0,
                    borderRadius: "4px",
                    overflow: "hidden",
                    "& .MuiAccordionSummary-root": {
                      minHeight: "0 !important",
                      margin: "0 !important",
                      padding: "8px",
                    },
                    "&.MuiAccordion-root:before": {
                      backgroundColor: "transparent",
                    },
                    "& .Mui-expanded": {
                      minHeight: "0 !important",
                      margin: "0 !important",
                    },
                    "& .MuiAccordionDetails-root": {
                      margin: "0 !important",
                      padding: "0px 8px 8px !important",
                    },
                  }}
                  key={index}
                  expanded={openIndex === index}
                  onChange={() => handleToggleAccordion(index)}
                >
                  <AccordionSummary
                    aria-controls={`${index}-content`}
                    expandIcon={
                      <ExpandMoreIcon
                        sx={{ color: "#454C54", height: "16px", width: "16px" }}
                      />
                    }
                    id={`${index}-header`}
                    sx={{
                      "& .MuiAccordionSummary-content": {
                        margin: 0,
                      },
                    }}
                  >
                    <div className="w-full items-center flex">
                      <span className="text-custom-ghostWhite font-medium">
                        {variableData.name || "No name"}
                      </span>
                      {((!isWebhookVariable) || (variableData?.primitive?.type)) && (
                        <span
                          className={`rounded p-s4 ml-s4 self-start text-sm font-normal 
                                                    ${variableData?.primitive?.type === "STRING" ? "bg-[#DB909B33] text-[#DB909B]" : ""}
                                                    ${variableData?.primitive?.type === "NUMBER" ? "bg-[#7DD09E33] text-[#7DD09E]" : ""}
                                                    ${variableData?.primitive?.type === "INTEGER" ? "bg-[#A77DD533] text-[#A77DD5]" : ""}
                                                    ${variableData?.primitive?.type === "BOOLEAN" ? "bg-[#2f9bff33] text-[#2f9bff]" : ""}`}
                        >
                          {variableData?.primitive?.type}
                        </span>
                      )}
                    </div>

                    {isWebhookVariable && (<span
                      className={`rounded p-s4 mx-s4 self-start text-sm font-normal text-white bg-grey-14`}>
                      {"WEBHOOK"}
                    </span>)}

                    {!isWebhookVariable && <Button
                      onClick={(e) => handleEditVariable(e, variableData?.id)}
                      className="text-custom-ghostWhite font-medium mr-s4"
                    >
                      {isEditLoading[variableData?.id] ? (
                        <CustomLoader iconClassName="w-4 h-4" />
                      ) : (
                        <EditIcon />
                      )}
                    </Button>}
                    <span
                      onClick={() => handleInsertVariable(variableData?.id)}
                      className={`mr-s20 mt-s2 opacity-0 ${selectedVariableID ? (selectedVariableID === variableData.id ? "group-hover:opacity-100" : "invisible") : "group-hover:opacity-100"}  w-s16 h-s16 flex justify-center items-center`}
                    >
                      {variableData.id !== selectedVariableID ? (
                        <StyledTooltip title={"Insert variable"}>
                          <span>
                            {isInsertLoading?.[variableData?.id] ? (
                              <CustomLoader iconClassName="w-4 h-4" />
                            ) : (
                              <PlusSquareIcon
                                style={{
                                  height: "16px",
                                  width: "16px",
                                  color: "#F8F9FA",
                                }}
                              />
                            )}
                          </span>
                        </StyledTooltip>
                      ) : (
                        <StyledTooltip title="Remove variable">
                          {isInsertLoading?.[variableData?.id] ? (
                            <CustomLoader iconClassName="w-4 h-4" />
                          ) : (
                            <RemoveCircleOutlineRoundedIcon
                              style={{
                                height: "16px",
                                width: "16px",
                                color: "#F8F9FA",
                              }}
                            />
                          )}
                        </StyledTooltip>
                      )}
                    </span>
                  </AccordionSummary>
                  <AccordionDetails>
                    <div className="flex flex-col gap-2">
                      <ReadMore
                        id={variableData.id}
                        text={
                          "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Velit beatae porro maxime mollitia distinctio, aperiam ipsam omnis modi pariatur animi eius provident quam aliquid quis dolor aut minus quasi cupiditate."
                        }
                      />
                    </div>
                  </AccordionDetails>
                </Accordion>
              );
            })}
          </div>
        )}
      </div>
    </SSidebar>
  );
}
