import useResponsiveGrid from "@/hooks/useResponsiveGrid";
import useGlobalStore from "@/store/globalStore";
import { Modal } from "@mui/material";

const SidebarContainer = ({ children, className, open, onClose, cannotBeClosed }) => {
  const { removeSidebar } = useGlobalStore((s) => ({
    removeSidebar: s.UI.removeSidebar,
  }));

  const { calculatePosition } = useResponsiveGrid();
  const { x, y } = calculatePosition(0, 0);

  const closeHandler = () => {
    removeSidebar();
    onClose && onClose();
  };

  return (
    <>
      {!cannotBeClosed ? (
        <Modal open={open} onClose={closeHandler} className="flex justify-end items-start">
          <div className={`m-borderSpacing col-width-[2.5/12] px-[18px] py-3 bg-[#1e2125] rounded-lg h-[600px] overflow-y-scroll ${className}`}>{children}</div>
        </Modal>
      ) : (
        open && (
          <div
            className={`absolute !z-dialog-overlay col-width-[2.5/12] max-w-96 bg-[#1e2125] rounded-lg max-h-[calc(100%-80px)] overflow-y-scroll ${className}`}
            style={{ top: y, right: x }}>
            {children}
          </div>
        )
      )}
    </>
  );
};

export default SidebarContainer;
