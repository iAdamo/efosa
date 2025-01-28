import CustomInput from "@/components/CustomInput";
import CustomLoader from "@/components/CustomLoader";
import SAccordion from "@/components/SAccordion";
import SBadge from "@/components/SBadge";
import SSelectDropdown, { DropdownItem } from "@/components/SSelectDropdown";
import ToggleSwitch from "@/components/ToggleSwitch";
import { ProjectContext } from "@/contexts/ProjectContext";
import useGlobalStore from "@/store/globalStore";
import { ELEMENTS } from "@/store/uiSlice";
import { getNodeName } from "@/utils/nodeComponentHelpers";
import CheckedApi2 from "@assets/icons/checked-api2.svg?react";
import Checked from "@assets/icons/checked-icon.svg?react";
import NewTag from "@assets/icons/new-tag.svg?react";
import UnChecked from "@assets/icons/un-check-icon.svg?react";
import XIcon from "@assets/icons/x-icon.svg?react";
import { addMeatball, deleteMeatball, postGenericCRUDWithID } from "@axios/apiCalls";
import { WizardContext } from "@contexts/WizardContext";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import KeyboardArrowUpRoundedIcon from "@mui/icons-material/KeyboardArrowUpRounded";
import KeyboardDoubleArrowLeftRoundedIcon from "@mui/icons-material/KeyboardDoubleArrowLeftRounded";
import { styled, Tooltip } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import { useContext, useEffect, useMemo, useState } from "react";
import { useShallow } from "zustand/react/shallow";

function GetData({ node, expanded, isTest, toExpand, setExpansion }) {
  const [allMeatballs, setAllMeatballs] = useState({});
  const { setMeatballs, refreshInitialData, meatballs: meatBallsContext } = useContext(WizardContext);
  const [paginationMeatball, setPaginationMeatball] = useState(null);
  const [isToggled, setIsToggled] = useState(null);
  const [isCheckBoxLoading, setIsCheckboxLoading] = useState(null);
  const [isToggleLoading, setIsToggleLoading] = useState(null);
  const [isChecked, setIsChecked] = useState({});
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [value, setValue] = useState(null);
  const { sourceAPICustomName, destinationAPICustomName } = useContext(ProjectContext);
  const { setSidebar, setSelectedFieldID, setVariableObjectType, setSelectedVariableID } = useGlobalStore((state) => ({
    setSidebar: state.UI.setSidebar,
    setSelectedFieldID: state.setSelectedFieldID,
    setSelectedVariableID: state.setSelectedVariableID,
    setVariableObjectType: state.setVariableObjectType,
  }));
  const { usedVariables } = useContext(WizardContext);
  const { variables } = useContext(ProjectContext);
  const selector = (state) => ({
    webhookVariables: state.webhookVariables,
  });
  const { webhookVariables } = useGlobalStore(useShallow(selector));


  useEffect(() => {
    if (node?.availableMeatballs) {
      const meatballs = {};
      node.availableMeatballs.forEach((mb) => {
        meatballs[mb.name] = mb;
      });
      setAllMeatballs(meatballs);
    }
  }, [node]);

  const meatballs = useMemo(() => {
    return meatBallsContext.filter((mb) => mb?.nodeID === node?.id);
  }, [meatBallsContext, node]);

  useEffect(() => {
    if (meatballs && allMeatballs) {
      const checkedValue = Object.keys(allMeatballs).reduce((acc, item) => {
        acc[item] = meatballs.some((mb) => mb.name === item && mb.isPagination === 0);
        return acc;
      }, {});

      const toggleValue = Object.keys(allMeatballs).reduce((acc, item) => {
        acc[item] = meatballs.some((mb) => mb.name === item && mb.isPagination === 1);
        return acc;
      }, {});

      setIsChecked(checkedValue);
      setIsToggled(toggleValue);
    }
  }, [allMeatballs]);

  const removeMeatballFromSelected = async (name) => {
    const [selectedMeatballData] = meatballs.filter((mb) => mb.name === name);
    setMeatballs((prev) => prev.map((mb) => (mb.name === name ? { ...mb, loading: true } : mb)));
    await deleteMeatball(selectedMeatballData.id);
    setMeatballs((prev) => prev.filter((mb) => mb.name !== name));
  };

  const editMeatballSelected = async (name, value) => {
    const [selectedMeatballData] = meatballs.filter((mb) => mb.name === name);
    await updateMeatballValue(selectedMeatballData.id, value.value);
    setMeatballs((prev) => prev.map((mb) => (mb.name === name ? { ...mb, value: value.value } : mb)));
  };

  const addMeatballToSelected = async (name) => {
    const selectedMeatballData = allMeatballs[name];
    // Meatballs getting filered by parent node id in parent component
    setMeatballs((prev) => [...prev, { name: name, nodeID: node.id, loading: true }]);
    const res = await addMeatball({
      speccID: node.speccID,
      nodeID: node.id,
      meatballName: name,
      inType: selectedMeatballData.in,
    });
    setMeatballs((prev) => prev.map((mb) => (mb.name === name ? { ...res.data[0], loading: false } : mb)));
  };

  const addPaginationMeatball = async (name, typeOfPagination) => {
    const selectedMeatballData = allMeatballs[name];
    // Meatballs getting filered by parent node id in parent component
    setMeatballs((prev) => [...prev, { name: name, nodeID: node.id, loading: true }]);
    const res = await addMeatball({
      speccID: node.speccID,
      nodeID: node.id,
      meatballName: name,
      inType: selectedMeatballData.in,
      isPagination: true,
      typeOfPagination: typeOfPagination,
    });
    setMeatballs((prev) => prev.map((mb) => (mb.name === name ? { ...res.data[0], loading: false } : mb)));
  };

  const updateMeatballValue = async (id, key, value) => {
    const updatedMeatballValue = postGenericCRUDWithID("Meatballs", id, {
      [key]: value,
    });
    setMeatballs((prev) => {
      return prev.map((mb) => {
        if (mb.id === id) {
          return { ...mb, value };
        }
        return mb;
      });
    });
  };

  const handleSelectAll = async (event) => {
    const isChecked = event.target.checked;

    setIsChecked((prevState) => {
      const updatedState = {};
      Object.keys(allMeatballs).forEach((name) => {
        updatedState[name] = isChecked;
      });
      return updatedState;
    });

    setIsCheckboxLoading((prev) => {
      const loadingState = {};
      Object.keys(allMeatballs).forEach((name) => {
        loadingState[name] = true;
      });
      return loadingState;
    });

    try {
      // Delete toggled values
      const toggledOnMeatballs = Object.keys(isToggled).filter((name) => isToggled[name]);
      if (toggledOnMeatballs.length > 0) {
        await Promise.all(
          toggledOnMeatballs.map((name) => {
            const selectedMeatballData = meatballs.find((mb) => mb.name === name);
            return deleteMeatball(selectedMeatballData?.id);
          })
        );
      }

      if (isChecked) {
        await Promise.all(
          Object.keys(allMeatballs).map((name) =>
            addMeatball({
              speccID: node?.speccID,
              nodeID: node?.id,
              meatballName: name,
              inType: allMeatballs[name]?.in,
            })
          )
        );
      } else {
        await Promise.all(
          Object.keys(allMeatballs)
            .filter((name) => meatballs.some((mb) => mb.name === name))
            .map((name) => {
              const selectedMeatballData = meatballs.find((mb) => mb.name === name);
              return deleteMeatball(selectedMeatballData?.id);
            })
        );

        setValue((prev) => {
          const valueState = {};
          Object.keys(allMeatballs).forEach((name) => {
            valueState[name] = null;
          });
          return valueState;
        });
      }

      await refreshInitialData();
    } catch (error) {
      console.error("Error in Select All:", error);
    } finally {
      setIsCheckboxLoading(() => {
        const loadingState = {};
        Object.keys(allMeatballs).forEach((name) => {
          loadingState[name] = false;
        });
        return loadingState;
      });

      setIsToggled(() => {
        const toggledState = {};
        Object.keys(allMeatballs).forEach((name) => {
          toggledState[name] = false;
        });
        return toggledState;
      });
    }
  };

  const handleToggle = async (value, meatballData) => {
    const typeValue = allMeatballs[meatballData?.name];

    if (!meatballData?.name || !typeValue) return;

    const selectedData = meatballs?.find((mb) => mb.name === meatballData.name);

    setIsToggled((prevState) => ({
      ...prevState,
      [meatballData.name]: value,
    }));
    try {
      if (value) {
        setIsToggleLoading((prev) => ({
          ...prev,
          [meatballData.name]: true,
        }));
        await addMeatball({
          speccID: node.speccID,
          nodeID: node.id,
          meatballName: meatballData?.name,
          inType: typeValue.in,
          isPagination: true,
        });

        await refreshInitialData();
        setIsToggleLoading((prev) => ({
          ...prev,
          [meatballData.name]: false,
        }));
      } else if (!value) {
        setIsToggleLoading((prev) => ({
          ...prev,
          [meatballData.name]: true,
        }));
        await deleteMeatball(selectedData?.id);

        await refreshInitialData();

        setValue((prev) => ({ ...prev, [meatballData.name]: null }));

        setIsToggleLoading((prev) => ({
          ...prev,
          [meatballData.name]: false,
        }));
      }
    } catch (error) {
      console.error(error);
      setIsToggleLoading((prev) => ({
        ...prev,
        [meatballData.name]: false,
      }));
    }
  };

  const handleCheckboxChange = async (event, meatballData) => {
    setIsChecked((prevState) => ({
      ...prevState,
      [meatballData.name]: event.target.checked,
    }));

    const [selectedMeatballData] = meatballs.filter((mb) => mb.name === meatballData?.name);

    try {
      if (event.target.checked) {
        setIsCheckboxLoading({
          [meatballData.name]: true,
        });
        const res = await addMeatball({
          speccID: node?.speccID,
          nodeID: node?.id,
          meatballName: meatballData?.name,
          inType: meatballData?.in,
        });

        await refreshInitialData();

        setIsCheckboxLoading({
          [meatballData.name]: false,
        });
      } else {
        setIsCheckboxLoading({
          [meatballData.name]: true,
        });
        await deleteMeatball(selectedMeatballData.id);

        await refreshInitialData();

        setValue((prev) => ({ ...prev, [meatballData.name]: null }));

        setIsCheckboxLoading({
          [meatballData.name]: false,
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const filteredMeatballs = useMemo(() => {
    if (selectedFilter === "All") {
      return Object.values(allMeatballs);
    }
    if (selectedFilter === "Selected") {
      return meatballs.filter((mb) => !mb.isPagination);
    }
    if (selectedFilter === "Pagination") {
      return meatballs.filter((mb) => mb.isPagination);
    }
    if (selectedFilter === "Unselected") {
      return Object.values(allMeatballs).filter((mb) => !meatballs.some((item) => item.name === mb.name));
    }
  }, [selectedFilter, allMeatballs, meatballs]);

  const handleInputChange = (event, meatballData) => {
    setValue((prev) => ({ ...prev, [meatballData.name]: event.target.value }));
  };

  const StyledTooltip = styled(({ className, ...props }) => (
    <Tooltip
      slotProps={{ popper: { style: { zIndex: 99999999 } } }}
      title={"Collapse criteria"}
      arrow
      placement="right-start"
      {...props}
      classes={{ popper: className }}
    />
  ))`
    & .MuiTooltip-tooltip {
      background: #f8f9fa;
      color: #1e2023;
      font-size: 16px;
    }
    & .MuiTooltip-arrow {
      color: #f8f9fa;
    }
  `;

  const handleXIconClick = (name, variableId) => {
    setSidebar(ELEMENTS.SIDEBAR.VARIABLE_MENU);
    const getMeatballId = meatballs?.find((item) => item?.name === name)?.id;
    if (getMeatballId) {
      setSelectedFieldID(getMeatballId);
    }
    if (variableId) {
      setSelectedVariableID(variableId);
    } else {
      setSelectedVariableID(null);
    }
    setVariableObjectType('MEATBALL')
  }

  const selectedMeatballsDiv = () => {
    return (
      <div
        className={`flex flex-col gap-3 w-full max-w-[322px] rounded-lg border border-l-0 border-t-0 border-b-0 border-r-gradient-grey-1 h-full bg-transparent ${isTest ? "pr-3" : "pr-5"} `}>
        <div className="text-16 font-bold text-custom-ghostWhite flex items-center justify-between">
          <div className="min-w-max flex items-center gap-3">
            {isTest && <NewTag />}
            Set Criteria (0)
          </div>
          {isTest && (
            <StyledTooltip>
              {" "}
              <span
                className={`cursor-pointer rounded-full bg-gradient-grey-9 hover:bg-custom-ghostWhite h-5 w-5 flex items-center justify-center transition-all duration-250 ease-in`}
                onClick={() => setExpansion(toExpand)}>
                <KeyboardDoubleArrowLeftRoundedIcon
                  style={{
                    color: "#454C54",
                    fontSize: "14px",
                  }}
                  className="hover:!text-[#141619]"
                />
              </span>
            </StyledTooltip>
          )}
        </div>
        <div className={`${isTest ? "text-secondary-aqua-1" : "text-secondary-pink-light-1"}  flex gap-1 items-center`}>
          <div
            className={`uppercase text-xs h-[15px] flex items-center justify-center px-0.5 ${isTest ? "bg-secondary-aqua" : "bg-secondary-pink-light"} rounded font-semibold`}>
            {isTest ? destinationAPICustomName : sourceAPICustomName}
          </div>
          <span className="whitespace-nowrap overflow-hidden text-ellipsis text-lg font-normal" title={`${getNodeName(node)} details`}>
            {getNodeName(node)} details
          </span>
        </div>

        <div className="flex items-center justify-between gap-16">
          <div className="flex items-center gap-3 min-w-max">
            <Checkbox
              icon={<UnChecked />}
              checkedIcon={isTest ? <CheckedApi2 /> : <Checked />}
              sx={{
                padding: 0,
                cursor: `${Object.keys(isChecked)?.length === 0 ? "not-allowed !important" : "pointer"}`,
                pointerEvents: "all !important",
              }}
              onChange={handleSelectAll}
              checked={Object.keys(isChecked).length > 0 && Object.values(isChecked).every((val) => val)}
              disabled={Object.keys(isChecked)?.length === 0}
            />
            Select all
          </div>
          <div className="w-full flex items-center max-w-[160px] h-8 meatballs-dropdown">
            <SSelectDropdown onChange={(option) => setSelectedFilter(option)} defaultValue="All">
              <DropdownItem item="All" />
              <DropdownItem item="Selected" />
              <DropdownItem item="Unselected" />
              <DropdownItem item="Pagination" />
            </SSelectDropdown>
          </div>
        </div>
        <div className="flex flex-col gap-3 overflow-y-auto">
          {filteredMeatballs?.length > 0 ? (
            filteredMeatballs.map((mb, idx) => {
              const selectedData = allMeatballs?.[mb.name];
              const result = meatballs?.find((item) => item.name === selectedData?.name);
              const theMeatball = meatballs?.find((item) => item.name === mb.name);
              const meatballsVariables = usedVariables?.find((item) => item?.meatballID === result?.id)
              const getVariable = [...webhookVariables, ...variables]?.find((item) => item?.id === meatballsVariables?.variableID);

              return (
                <>
                  <div>
                    <SAccordion
                      key={`meatball-${idx}`}
                      titleClassname="flex justify-between flex-wrap"
                      iconClassName="max-h-[16px] flex items-center"
                      accordionClassname={`bg-gradient-grey-9 rounded border ${isChecked?.[mb?.name] ? (isTest ? "border-secondary-aqua-2" : "border-main-pink-6") : "border-transparent"} px-2 py-[7px]`}
                      title={
                        <div className="flex items-center gap-[10px] z-0">
                          {isCheckBoxLoading?.[mb?.name] ? (
                            <CustomLoader iconClassName="h-4 w-4" />
                          ) : (
                            <Checkbox
                              icon={<UnChecked />}
                              checkedIcon={isTest ? <CheckedApi2 /> : <Checked />}
                              sx={{
                                padding: 0,
                                cursor: `${isToggled?.[mb?.name] ? "not-allowed !important" : "pointer"}`,
                                pointerEvents: "all !important",
                              }}
                              disabled={isToggled?.[mb?.name]}
                              checked={isChecked?.[mb?.name] || false}
                              onClick={(e) => e.stopPropagation()}
                              onChange={(e) => {
                                handleCheckboxChange(e, mb);
                              }}
                            />
                          )}
                          <span className="text-base font-medium text-white capitalize">{mb?.name}</span>
                          {mb?.type && (
                            <SBadge
                              className={"h-4 flex items-center"}
                              style={{ backgroundColor: "#26292D", padding: "2px 4px", borderRadius: "4px", fontWeight: "500" }}
                              label={mb?.type}
                            />
                          )}
                          {mb?.isRequired && (
                            <SBadge
                              className={"h-4 flex items-center"}
                              style={{ backgroundColor: "#26292D", padding: "2px 4px", borderRadius: "4px", fontWeight: "500" }}
                              label={"Required"}
                            />
                          )}
                        </div>
                      }
                      content={
                        <div className="flex flex-col mt-2 gap-2">
                          <span className="w-full text-sm font-normal italic text-gradient-grey-10">{mb?.description || ""} {theMeatball ? theMeatball.value : ''}</span>
                          {isChecked?.[mb?.name] && (
                            <>
                              {!getVariable ? <CustomInput
                                inputClassName="h-8 w-full rounded-base border bg-transparent border-gradient-grey-4 px-2 py-[7px] text-base font-base"
                                variant={""}
                                placeholder={"Add value"}
                                defaultValue={theMeatball ? theMeatball?.value : ""}
                                suffix={
                                  <div onClick={() => handleXIconClick(mb.name)} className="text-black cursor-pointer">
                                    <XIcon />
                                  </div>
                                }
                                onChange={(e) => {
                                  handleInputChange(e, mb);
                                }}
                                onBlur={(e) => {
                                  updateMeatballValue(result?.id, "value", e.target.value);
                                }}
                                disabled={!meatballs?.some((item) => item.name === mb.name)}
                              />
                                :
                                <div className="rounded bg-grey-13 max-h-[18px] overflow-hidden pl-s4 py-s4 text-sm text-gradient-grey-7 bg-opacity-20 flex items-center justify-between pr-s12">
                                  {getVariable?.name}
                                  <span
                                    className="cursor-pointer"
                                    onClick={() => handleXIconClick(mb.name, meatballsVariables?.variableID)}
                                  >
                                    <XIcon className={"w-s12 h-s12 icon-white"} />
                                  </span>
                                </div>
                              }
                            </>
                          )}
                          <div className="flex items-center gap-3">
                            {isToggleLoading?.[mb.name] ? (
                              <CustomLoader iconClassName="h-4 w-4" />
                            ) : (
                              <ToggleSwitch
                                defaultChecked={meatballs?.some((item) => item.name === mb.name && item.isPagination === 1)}
                                disabled={isChecked?.[mb.name]}
                                checked={isToggled?.[mb.name]}
                                onChange={(value) => handleToggle(value, mb)}
                                isTest={isTest}
                              />
                            )}
                            <div>Set as pagination</div>
                          </div>
                        </div>
                      }
                      closeIcon={<KeyboardArrowUpRoundedIcon sx={{ color: "#454C54" }} />}
                      openIcon={<KeyboardArrowDownRoundedIcon sx={{ color: "#454C54" }} />}></SAccordion>
                  </div>
                </>
              );
            })
          ) : selectedFilter === "Pagination" ? (
            <div className="flex items-center p-8 text-center rounded text-sm italic font-light text-gradient-grey-10 bg-gradient-grey-9 min-h-52">
              No criteria set as pagination, toggle any selected criteria to set it as pagination.
            </div>
          ) : (
            <div className="flex items-center justify-center p-8 text-center rounded text-sm italic font-light text-gradient-grey-10 bg-gradient-grey-9 min-h-52">
              No criteria available
            </div>
          )}
        </div>
      </div>
    );

  };
  return <>{selectedMeatballsDiv()}</>;
}

export default GetData;
