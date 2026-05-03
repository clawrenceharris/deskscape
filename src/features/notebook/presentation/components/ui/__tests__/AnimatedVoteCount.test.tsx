/* eslint-disable @typescript-eslint/no-unused-vars */
import { render, screen } from "@testing-library/react";
import type { HTMLAttributes, ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";

import { AnimatedVoteCount } from "../AnimatedVoteCount";

type MotionSpanProps = HTMLAttributes<HTMLSpanElement> & {
  animate?: unknown;
  children?: ReactNode;
  exit?: unknown;
  initial?: unknown;
  transition?: unknown;
};

vi.mock("motion/react", () => ({
  AnimatePresence: ({ children }: { children: ReactNode }) => <>{children}</>,
  motion: {
    span: ({
      animate: _animate,
      exit: _exit,
      initial: _initial,
      transition: _transition,
      children,
      ...props
    }: MotionSpanProps) => <span {...props}>{children}</span>,
  },
}));

describe("AnimatedVoteCount", () => {
  it("shows the zero label when the value is zero", () => {
    render(<AnimatedVoteCount value={0} zeroLabel="Vote" />);

    expect(screen.getByText("Vote")).toBeInTheDocument();
  });

  it("shows the numeric vote count when the value is not zero", () => {
    render(<AnimatedVoteCount value={5} />);

    expect(screen.getAllByText("5")).toHaveLength(2);
  });
});
