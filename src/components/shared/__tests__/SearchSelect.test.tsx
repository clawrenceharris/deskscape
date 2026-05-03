import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { SearchSelect } from "../SearchSelect";

const schools = [
  { value: "school-1", label: "North High" },
  { value: "school-2", label: "South High" },
];

describe("SearchSelect", () => {
  it("shows the selected label and selects an existing item", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<SearchSelect items={schools} value="school-1" onChange={onChange} />);

    expect(screen.getByRole("combobox")).toHaveTextContent("North High");

    await user.click(screen.getByRole("combobox"));
    await user.click(await screen.findByText("South High"));

    expect(onChange).toHaveBeenCalledWith("school-2");
  });

  it("filters options and creates new values when enabled", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <SearchSelect
        canCreateNew
        items={schools}
        onChange={onChange}
        placeholder="Select a school"
        newItemLabel="Add school"
        searchPlaceholder="Find a school"
      />,
    );

    await user.click(screen.getByRole("combobox"));
    await user.type(screen.getByPlaceholderText("Find a school"), "East");

    expect(screen.queryByText("North High")).not.toBeInTheDocument();
    await user.click(await screen.findByText('Add school "East"'));

    expect(onChange).toHaveBeenCalledWith("East");

    await waitFor(() => {
      expect(screen.queryByPlaceholderText("Find a school")).not.toBeInTheDocument();
    });
  });

  it("does not show create-new rows when creation is disabled", async () => {
    const user = userEvent.setup();

    render(<SearchSelect canCreateNew={false} items={schools} onChange={vi.fn()} />);

    await user.click(screen.getByRole("combobox"));
    await user.type(screen.getByPlaceholderText("Search…"), "East");

    expect(screen.queryByText('New "East"')).not.toBeInTheDocument();
    expect(screen.getByText("No results found.")).toBeInTheDocument();
  });
});
