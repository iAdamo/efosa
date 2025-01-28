import maximizeIcon from "@assets/icons/maximize-icon.svg";
import minimizeIcon from "@assets/icons/minimize-icon.svg";
import tagIcon from "@assets/icons/tag.svg";
import { styled } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";

const Expandable = ({
  TooltipText,
  expanded,
  expandedMaxWidth,
  setExpansion,
  children,
  toExpand,
  isTest,
  hovered,
  collapseSrc,
  expandedClassName = `w-[100%] ${expandedMaxWidth}`,
  imgCollapesClassName,
  collapseBordercolor,
  customIcon,
  collapseStyle,
  toolTipPlacement,
  includeCollapsedIcon = true
}) => {
  const StyledTooltip = styled(({ className, placement, ...props }) => (
    <Tooltip
      slotProps={{ popper: { sx: { zIndex: 99999 } } }}
      title={TooltipText || "Collapse menu"}
      arrow
      placement={placement || "right-start"}
      {...props}
      classes={{ popper: className }}
    />
  ))`
    & .MuiTooltip-tooltip {
      background: #f8f9fa;
      color: #1e2023;
      font-size: 16px;
      margin-left: "200px";
    }
    & .MuiTooltip-arrow {
      color: #f8f9fa;
    }
  `;

  return (
    <div
      className={`relative meatballs-container-transition ${isTest ? (expanded ? "pt-0 pr-0" : "pt-4 px-2.5") : `${expanded ? "" : "pt-4 px-2.5"}`} ${isTest ? (expanded ? "overflow-x-auto overflow-y-hidden" : "mt-0 mr-0") : ""
        } ${expanded ? expandedClassName : `w-10 ${expandedMaxWidth} h-[100vh] ${collapseStyle} bg-transparent rounded-lg ${collapseBordercolor ? `border ${collapseBordercolor}` : "border-r border-[#3C3C3C]"}`}`}>
      {customIcon ? (
        <StyledTooltip placement={toolTipPlacement}>{customIcon}</StyledTooltip>
      ) : (
        <StyledTooltip>
          <div
            className={`absolute flex items-center justify-center cursor-pointer border border-[#3C3C3C]  ${expanded
              ? isTest
                ? "w-[25px] h-[25px] top-[0px] p-1 right-[5px]"
                : "w-[25px] h-[25px] top-[-8px] p-1 right-[-7px]"
              : "w-[25px] h-[25px] top-[-7px] right-[-10px]"
              } rounded-[50%] bg-[black] z-20`}
            onClick={() => setExpansion(toExpand)}>
            <span>{expanded ? <img src={minimizeIcon} className="min-w-[10px] min-h-[10px]" /> : <img src={maximizeIcon} width={15} height={15} />}</span>
          </div>
        </StyledTooltip>
      )}
      <div
        className={`w-[100%] h-[100%] ${collapseSrc ? `border-none` : ""} ${isTest && expanded && toExpand !== "meatballs" ? "border border-[#00EFD9] rounded-lg" : ""
          }`}>
        {/* {expanded ? (
          children
        ) : (
          <div className0={`pl-[0px]`}>
            <div
              className={`w-[30px] h-[30px] mr-[10px] rounded-[5px] flex items-center justify-center ${collapseSrc ? `border-none` : ""} ${
                hovered ? isTest ? "border border-[#00EFD9] bg-[#D32DCA1A]" : "border border-[#D32DCA] bg-[#D32DCA1A]" : ""
              } `}
            >
              <img src={isTest ? (collapseSrc ? collapseSrc : tagIcon) : tagIcon} className={`${imgCollapesClassName}`} width={12} height={9} />
            </div>
          </div>
        )} */}

        <div className="h-full w-full">
          <div
            style={{
              transition: "max-width 0.5s ease-in-out",
            }}
            className={`${!expanded ? "max-w-full" : "max-w-0 max-h-0 overflow-hidden"} transition-all ease-in duration-500`}>
            <div
              className={`w-full h-[30px] rounded-base flex items-center justify-center ${collapseSrc ? `border-none` : ""} ${hovered ? (isTest ? "border border-[#00EFD9] bg-[#D32DCA1A]" : "border border-[#D32DCA] bg-[#D32DCA1A]") : ""
                } `}>
              {includeCollapsedIcon && (
                <img src={isTest ? (collapseSrc ? collapseSrc : tagIcon) : tagIcon} className={`${imgCollapesClassName}`} width={12} height={9} />
              )}
            </div>
          </div>
          <div
            style={{
              transition: "max-width 0.5s ease-in-out",
            }}
            className={`${expanded ? "max-w-full" : "max-w-0 overflow-hidden"} h-full transition-all duration-300`}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Expandable;
