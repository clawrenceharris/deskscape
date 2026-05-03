import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import type { NotebookForDetail } from "@/features/notebook/infrastructure/queries";
import { DeskHeader } from "../DeskHeader";

describe("DeskHeader", () => {
  it("summarizes uploads, downloads, and net votes", () => {
    const notebooks = [
      {
        downloads: [{}, {}, {}, {}],
        votes: [{ isUpvote: true }, { isUpvote: false }],
      },
      {
        downloads: [{}],
        votes: [{ isUpvote: true }],
      },
    ] as NotebookForDetail[];

    render(<DeskHeader notebooks={notebooks} />);

    expect(screen.getByText("Uploads")).toBeInTheDocument();
    expect(screen.getByText("Downloads")).toBeInTheDocument();
    expect(screen.getByText("Votes")).toBeInTheDocument();
    expect(screen.getByTestId("uploads-count").textContent).toBe("2");
    expect(screen.getByTestId("downloads-count").textContent).toBe("5");
    expect(screen.getByTestId("votes-count").textContent).toBe("1");
  });

  it("renders zero counts when a desk has no notebooks", () => {
    render(<DeskHeader notebooks={[]} />);

    expect(screen.getAllByText("0")).toHaveLength(3);
  });
});
