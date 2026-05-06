import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { FilePreviewer } from "../FilePreviewer";

const mocks = vi.hoisted(() => ({
  toastSuccess: vi.fn(),
  toastError: vi.fn(),
}));

vi.mock("next/image", () => ({
  default: ({
    alt,
    src,
  }: {
    alt: string;
    src: string;
  }) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img alt={alt} src={src} />;
  },
}));

vi.mock("sonner", () => ({
  toast: {
    success: mocks.toastSuccess,
    error: mocks.toastError,
  },
}));

vi.mock("@/components/ui", () => ({
  Button: ({
    asChild,
    children,
    ...props
  }: React.ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean }) => {
    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children, props);
    }

    return <button {...props}>{children}</button>;
  },
  Dialog: ({
    children,
    open,
  }: {
    children: React.ReactNode;
    open?: boolean;
  }) => (open ? <div>{children}</div> : null),
  DialogContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

function material(title: string, url: string | null) {
  return {
    id: title,
    title,
    url,
  } as never;
}

describe("FilePreviewer", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders empty and unavailable states", () => {
    const { rerender } = render(<FilePreviewer materials={[]} />);

    expect(screen.getByText("There are no files in this upload.")).toBeInTheDocument();

    rerender(<FilePreviewer materials={[material("missing.pdf", null)]} />);

    expect(screen.getByText("The file doesn't exist. It may have been removed.")).toBeInTheDocument();
  });

  it("renders supported media types and office embed urls", () => {
    const { rerender } = render(
      <FilePreviewer materials={[material("notes.pdf", "https://files.test/notes.pdf")]} />,
    );

    expect(screen.getByTitle("notes.pdf")).toHaveAttribute("src", "https://files.test/notes.pdf");

    rerender(<FilePreviewer materials={[material("slides.pptx", "https://files.test/slides.pptx")]} />);

    expect(screen.getByTitle("slides.pptx")).toHaveAttribute(
      "src",
      `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(
        "https://files.test/slides.pptx",
      )}`,
    );

    rerender(<FilePreviewer materials={[material("photo.png", "https://files.test/photo.png")]} />);

    expect(screen.getByRole("img", { name: "photo.png" })).toHaveAttribute(
      "src",
      "https://files.test/photo.png",
    );
  });

  it("navigates files and calls controlled index changes", async () => {
    const user = userEvent.setup();
    const onMaterialIndexChange = vi.fn();

    render(
      <FilePreviewer
        materialIndex={0}
        onMaterialIndexChange={onMaterialIndexChange}
        materials={[
          material("first.png", "https://files.test/first.png"),
          material("second.png", "https://files.test/second.png"),
        ]}
      />,
    );

    await user.click(screen.getByRole("button", { name: /view next image/i }));
    expect(onMaterialIndexChange).toHaveBeenCalledWith(1);

    await user.click(screen.getByRole("button", { name: /view previous image/i }));
    expect(onMaterialIndexChange).toHaveBeenCalledWith(1);
  });

  it("supports unsupported downloads, expanded copy, and download callbacks", async () => {
    const user = userEvent.setup();
    const onDownloadClick = vi.fn();

    render(
      <FilePreviewer
        onDownloadClick={onDownloadClick}
        materials={[material("archive.zip", "https://files.test/archive.zip")]}
      />,
    );

    expect(screen.getByText("zip file type is not supported for inline preview.")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /^download$/i }));
    expect(onDownloadClick).toHaveBeenCalledWith("https://files.test/archive.zip");

    await user.click(screen.getByRole("button", { name: /expand preview/i }));
    expect(await screen.findByText("Copy link")).toBeInTheDocument();

    await user.click(screen.getAllByRole("button", { name: /^download$/i }).at(-1)!);
    expect(onDownloadClick).toHaveBeenCalledWith("https://files.test/archive.zip");
  });
});
