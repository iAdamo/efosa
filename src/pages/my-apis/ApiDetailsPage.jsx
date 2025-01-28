import React from 'react';
import { AnimatePresence } from "framer-motion";
import AnimatedOutlet from "@/layout/AnimatedOutlet";
import { useLocation } from 'react-router-dom';

const ApiDetailsPage = () => {

  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <AnimatedOutlet key={location.pathname} />
    </AnimatePresence>
  );
};

export default ApiDetailsPage;