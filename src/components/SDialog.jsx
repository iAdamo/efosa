import { useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";
import { motion } from "framer-motion";
import { modalOpen } from "@/animations";

export default function SDialog({ closeCallback, ...props }) {
  const [isOpen, setIsOpen] = useState(props.isOpen || false);

  useEffect(() => {
    setIsOpen(props.isOpen);
  }, [props.isOpen]);

  return (
    <Dialog
      open={isOpen}
      onClose={() => {
        setIsOpen(false);
        closeCallback?.();
      }}
      className="relative"
    >
      <div
        className="fixed inset-0 dialog-backdrop z-overlay"
        aria-hidden="true"
      />
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4 z-dialog ">
        <Dialog.Panel>
          <motion.div
            {...modalOpen}
            className={`dialog-container ${props.dialogClassName}`}
          >
            {props.children}
          </motion.div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
