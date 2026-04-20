/* eslint-disable react-hooks/refs */
"use client";

import { useRef } from "react";
import { AnimatePresence, motion } from "motion/react";

function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T | undefined>(undefined);
  const prev = ref.current;
  ref.current = value;
  return prev;
}

type AnimatedVoteCountProps = {
  value: number;
  /** Shown when value is 0 */
  zeroLabel?: string;
  className?: string;
};

/**
 * Odometer-style tick: new number slides in from below when increasing,
 * from above when decreasing.
 */
export function AnimatedVoteCount({
  value,
  zeroLabel = "Vote",
  className,
}: AnimatedVoteCountProps) {
  const prev = usePrevious(value);
  const direction: "up" | "down" =
    prev === undefined || value === prev
      ? "up"
      : value > prev
        ? "up"
        : "down";

  if (value === 0) {
    return (
      <span className={className} aria-live="polite">
        {zeroLabel}
      </span>
    );
  }

  return (
    <span
      className={`relative inline-flex h-[1.25em] items-center justify-center overflow-hidden tabular-nums ${className ?? ""}`}
      aria-live="polite"
    >
      {/* Holds width while animated layer is position:absolute */}
      <span className="invisible" aria-hidden>
        {value}
      </span>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={value}
          initial={{
            y: direction === "up" ? "80%" : "-80%",
            opacity: 0,
          }}
          animate={{ y: 0, opacity: 1 }}
          exit={{
            y: direction === "up" ? "-80%" : "80%",
            opacity: 0,
          }}
          transition={{
            type: "spring",
            stiffness: 420,
            damping: 32,
            mass: 0.6,
          }}
          className="absolute inset-0 flex items-center justify-center"
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
