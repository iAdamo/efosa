import Button from "@/components/Button";
import useResponsiveGrid from "@/hooks/useResponsiveGrid";
import useGlobalStore from "@/store/globalStore";
import CloseIcon from "@assets/icons/close.svg?react";
import { Modal } from "@mui/material";

const ModalContainer = ({ children, className, open, modalClassName, title, onClose, ...props }) => {
  const { removeModal } = useGlobalStore((s) => ({
    removeModal: s.UI.removeModal,
  }));

  const { calculatePosition } = useResponsiveGrid();
  const { x, y } = calculatePosition(0.5, 0);

  const closeHandler = () => {
    removeModal();
    onClose && onClose();
  };

  return (
    <Modal
      disableEnforceFocus={true}
      open={open}
      onClose={closeHandler}
      className="flex justify-start items-center !z-dialog backdrop-blur-md relative"
      {...props}>
      <div
        className={`flex flex-col gap-[34px] h-[90%] col-width-[9/12] px-[24px] py-[40px] bg-custom-modal-gradient rounded-api-component absolute scroll-auto overflow-auto`}
        style={{
          top: y,
          left: x,
        }}>
        <div className="flex justify-between items-center h-[34px]">
          {title && <span className="text-[28px] font-medium text-custom-ghostWhite leading-[34px]">{title}</span>}
        </div>
        <Button
          onClick={() => {
            closeHandler();
          }}
          className="px-0 py-0 pr-[5px] absolute top-[40px] right-[24px]">
          <CloseIcon className={"icon-white h-3.5 w-3.5"} />
        </Button>

        {className ? <div className={className}>{children}</div> : <>{children}</>}
      </div>
    </Modal>
  );
};

export default ModalContainer;
