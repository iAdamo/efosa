import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { Button, Menu, MenuItem, MenuTrigger, Popover } from "react-aria-components";

export function SMenuButton({ label, children, ...props }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <MenuTrigger onOpenChange={setIsOpen} {...props}>
      <Button className={"w-full"}>{label}</Button>
      <Popover placement={props.placement} className={`s-menu-popover ${props.popoverClassName}`}>
        <AnimatePresence mode="wait">
          <motion.div
            initial={{
              height: 0,
            }}
            animate={{
              height: "auto",
            }}
            exit={{
              height: 0,
            }}
            className="overflow-hidden">
            <Menu {...props}>{children}</Menu>
          </motion.div>
        </AnimatePresence>
      </Popover>
    </MenuTrigger>
  );
}

export function SMenuItem(props) {
  const textValue = props.textValue || (typeof props.children === "string" ? props.children : undefined);
  return (
    <MenuItem
      {...props}
      textValue={textValue}
      className={({ isFocused, isSelected, isOpen }) => `s-menu-item ${props.className} ${isFocused ? "focused" : ""} ${isOpen ? "open" : ""}`}>
      {({ hasSubmenu }) => (
        <>
          {props.children}
          {hasSubmenu && (
            <svg className="chevron" viewBox="0 0 24 24">
              <title>Expand</title>
              <path d="m9 18 6-6-6-6" />
            </svg>
          )}
        </>
      )}
    </MenuItem>
  );
}
