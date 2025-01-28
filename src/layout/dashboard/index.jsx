import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import AnimatedOutlet from "../AnimatedOutlet";
import SDialog from "@/components/SDialog";
import TermsOfAgreement from "@/layout/dashboard/terms-of-agreement";
import { useState } from "react";
import CustomCollapse from "@/components/CustomCollapse";
import KeyboardDoubleArrowLeftRoundedIcon from '@mui/icons-material/KeyboardDoubleArrowLeftRounded';

export default function DashboardLayout() {
  const location = useLocation();
  const [termsDialogIsOpen, setTermsDialogIsOpen] = useState(false);
  const [open, setOpen] = useState(true);

  const handleToggle = () => {
    setOpen(!open);
  };

  return (
    <>
      <SDialog
        dialogClassName="dashboard-dialog"
        closeCallback={() => setTermsDialogIsOpen(false)}
        isOpen={false}
      >
        <TermsOfAgreement closeCallback={() => setTermsDialogIsOpen(false)} />
      </SDialog>
      <div className="h-screen overflow-auto flex flex-col bg-custom-blackPearl">
        <div className="flex-grow flex">
          <CustomCollapse
            open={open}
            handleToggle={handleToggle}
            collapsedMinSize={84}
            tooltipText={open ? "Collapse menu" : "Expand menu"}
            collapseButton={true}
            collapseButtonElement={
              <div className={`cursor-pointer absolute lg:top-7 xl:top-12 -right-3 z-[13001] rounded-full bg-grey-15 hover:bg-custom-ghostWhite h-6 w-6 flex items-center justify-center transition-all duration-250 ease-in`} onClick={handleToggle}>
                <KeyboardDoubleArrowLeftRoundedIcon style={{
                  color: '#454C54',
                  transform: open ? 'rotate(0deg)' : 'rotate(180deg)',
                  transition: 'transform 0.3s ease, color 0.3s ease',
                }}
                  className="hover:!text-[#141619]" />
              </div>
            }
          >
            <Sidebar collapsed={!open} />
          </CustomCollapse>
          <div className="flex-grow flex h-screen overflow-y-scroll">
            <AnimatePresence mode="wait">
              <AnimatedOutlet key={location.pathname} />
            </AnimatePresence>
          </div>
        </div>
      </div>
    </>
  );
}
