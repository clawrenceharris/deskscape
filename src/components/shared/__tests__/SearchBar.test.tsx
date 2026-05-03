import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { SearchBar } from "../SearchBar";

describe("SearchBar", () => {
  it("expands, accepts input, clears, and collapses when empty", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const onClear = vi.fn();
    const onExpandedChange = vi.fn();

    render(
      <SearchBar
        onChange={onChange}
        onClear={onClear}
        onExpandedChange={onExpandedChange}
        placeholder="Search desks"
      />,
    );

    const input = screen.getByRole("searchbox");
    expect(input).toHaveAttribute("placeholder", "");

    await user.click(input);

    expect(onExpandedChange).toHaveBeenCalledWith(true);
    expect(input).toHaveAttribute("placeholder", "Search desks");

    await user.type(input, "biology");

    expect(onChange).toHaveBeenLastCalledWith("biology");
    expect(input).toHaveValue("biology");

    await user.click(screen.getByRole("button", { name: /clear search/i }));

    expect(onClear).toHaveBeenCalled();
    expect(onChange).toHaveBeenLastCalledWith("");
    expect(input).toHaveValue("");

    await user.click(screen.getByRole("button", { name: /clear search/i }));

    expect(onExpandedChange).toHaveBeenLastCalledWith(false);
    expect(input).toHaveAttribute("placeholder", "");
  });

  it("supports controlled value and escape collapse", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const onExpandedChange = vi.fn();

    render(
      <SearchBar
        value="fixed"
        expanded
        onChange={onChange}
        onExpandedChange={onExpandedChange}
      />,
    );

    const input = screen.getByRole("searchbox");
    await user.type(input, "x");

    expect(input).toHaveValue("fixed");
    expect(onChange).toHaveBeenLastCalledWith("fixedx");

    await user.keyboard("{Escape}");

    expect(onExpandedChange).toHaveBeenCalledWith(false);
  });
});
