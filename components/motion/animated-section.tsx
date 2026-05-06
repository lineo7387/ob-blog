"use client";

import { motion, useReducedMotion } from "motion/react";

type AnimatedSectionProps = {
  children: React.ReactNode;
  className?: string;
};

export function AnimatedSection({
  children,
  className = "",
}: AnimatedSectionProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.section
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y: 24 }}
      animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
    >
      {children}
    </motion.section>
  );
}
