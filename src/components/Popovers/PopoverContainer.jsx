import Button from "@/components/Button";
import useResponsiveGrid from "@/hooks/useResponsiveGrid";
import useGlobalStore from "@/store/globalStore";
import CloseIcon from "@assets/icons/close.svg?react";
import { Popover } from "@mui/material";

const PopoverContainer = ({ children, className, open, popoverClassName, title, onClose, column, row, widthClass = "col-width-[5/12]", ...props }) => {
  const { calculatePosition } = useResponsiveGrid();

  const { x, y } = calculatePosition(column, row);
  const closeHandler = () => {
    removePopover();
    onClose && onClose();
  };

  const { removePopover } = useGlobalStore((s) => ({
    removePopover: s.UI.removePopover,
  }));

  return (
    <Popover
      {...props}
      open={open}
      onClose={closeHandler}
      className="flex justify-start items-center ps-borderSpacing py-borderSpacing"
      anchorReference="anchorPosition"
      anchorOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
      anchorPosition={{ top: y, left: x }}
      slotProps={{
        paper: {
          className: `flex flex-col gap-[34px] overflow-scroll !rounded-api-component !bg-custom-modal-gradient ${widthClass} h-[436px] relative p-[12px] ${props.paperStyle}`,
        },
      }}>
      <Button
        onClick={() => {
          removePopover();
        }}
        className="px-0 py-0 pr-[5px] absolute top-[12px] right-[12px]">
        <CloseIcon className={"icon-white h-3.5 w-3.5"} />
      </Button>

      {className ? <div className={className}>{children}</div> : <>{children}</>}
    </Popover>
  );
};

export default PopoverContainer;
