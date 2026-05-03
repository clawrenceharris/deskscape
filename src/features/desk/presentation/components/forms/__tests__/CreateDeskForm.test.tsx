import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { CreateDeskForm } from "../CreateDeskForm";

const mocks = vi.hoisted(() => ({
  createDeskAction: vi.fn(),
  useUserSchools: vi.fn(),
  useUserProfile: vi.fn(),
}));

vi.mock("@/actions/desk", () => ({
  createDeskAction: mocks.createDeskAction,
}));

vi.mock("@/features/school/presentation/hooks", () => ({
  useUserSchools: mocks.useUserSchools,
}));

vi.mock("@/features/profile/presentation/hooks", () => ({
  useUserProfile: mocks.useUserProfile,
}));

vi.mock("@/components/shared", () => ({
  SearchSelect: ({
    items,
    onChange,
  }: {
    items: { value: string; label: string }[];
    onChange: (value: string) => void;
  }) => (
    <div>
      {items.map((item) => (
        <button key={item.value} onClick={() => onChange(item.value)} type="button">
          {item.label}
        </button>
      ))}
      <button onClick={() => onChange("__new__:East High")} type="button">
        New school
      </button>
    </div>
  ),
}));

describe("CreateDeskForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.useUserProfile.mockReturnValue({ data: null });
    mocks.useUserSchools.mockReturnValue({
      data: [{ id: "0f6a30a1-3193-4948-aeb4-95a803b9ee7a", name: "North High" }],
      isLoading: false,
    });
  });

  it("submits selected school and desk values", async () => {
    const user = userEvent.setup();
    const desk = { id: "desk-1", name: "Biology" };
    const onSuccess = vi.fn();
    mocks.createDeskAction.mockResolvedValue({ success: true, data: desk });

    render(<CreateDeskForm userId="user-1" onSuccess={onSuccess} />);

    await user.type(screen.getByLabelText(/name/i), "Biology");
    await user.click(screen.getByRole("button", { name: "North High" }));
    await user.click(screen.getByRole("button", { name: "Done" }));

    await waitFor(() => {
      expect(mocks.createDeskAction).toHaveBeenCalledWith({
        creatorId: "user-1",
        name: "Biology",
        schoolId: "0f6a30a1-3193-4948-aeb4-95a803b9ee7a",
        imageFile: null,
        isPublic: true,
        description: "",
      });
      expect(onSuccess).toHaveBeenCalledWith(desk);
    });
  });

  it("ignores create-new school values from the school selector", async () => {
    const user = userEvent.setup();

    render(<CreateDeskForm userId="user-1" />);

    await user.type(screen.getByLabelText(/name/i), "Biology");
    await user.click(screen.getByRole("button", { name: "New school" }));
    await user.click(screen.getByRole("button", { name: "Done" }));

    await waitFor(() => {
      expect(screen.getByText("Please select a school")).toBeInTheDocument();
      expect(mocks.createDeskAction).not.toHaveBeenCalled();
    });
  });
});
