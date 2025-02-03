import React from "react";
import { routeAnim } from "../animations";
import { motion } from "framer-motion";

function RouteAnimWrapper({ children, className }) {
  return (
    <motion.div className={className ?? "flex w-full h-full"} {...routeAnim}>
      {children}
    </motion.div>
  );
}

export default RouteAnimWrapper;
