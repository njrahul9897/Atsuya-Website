"use client";

import type { ReactNode } from "react";
import { LazyMotion, MotionConfig } from "framer-motion";

const features = () => import("./motion-features").then((module) => module.default);

// Framer Motion for the small UI transitions (menus, tabs, filters). The animation features are
// fetched on demand, and it is told to honour prefers-reduced-motion.
export function Motion({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={features} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
