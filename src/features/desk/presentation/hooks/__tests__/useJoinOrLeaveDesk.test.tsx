import { act, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { deskKeys, schoolKeys } from "@/lib/queries";
import { renderHookWithQueryClient } from "@/test/utils";
import { useJoinOrLeaveDesk } from "../useJoinOrLeaveDesk";

const mocks = vi.hoisted(() => ({
  joinOrLeaveDeskAction: vi.fn(),
  toastError: vi.fn(),
}));

vi.mock("@/actions/desk", () => ({
  joinOrLeaveDeskAction: mocks.joinOrLeaveDeskAction,
}));

vi.mock("@/app/providers", () => ({
  useSchoolContext: () => ({
    currentSchoolId: "school-1",
  }),
}));

vi.mock("sonner", () => ({
  toast: {
    error: mocks.toastError,
  },
}));

describe("useJoinOrLeaveDesk", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("joins a desk, tracks loading, and invalidates related caches", async () => {
    mocks.joinOrLeaveDeskAction.mockResolvedValue({ success: true });
    const { result, queryClient } = renderHookWithQueryClient(() => useJoinOrLeaveDesk());
    const invalidateQueries = vi.spyOn(queryClient, "invalidateQueries");

    let joinPromise: Promise<void>;
    act(() => {
      joinPromise = result.current.joinDesk({
        deskId: "desk-1",
        userId: "user-1",
        role: "CONTRIBUTOR",
        isJoining: true,
      });
    });

    await waitFor(() => expect(result.current.isJoining).toBe(true));
    await act(async () => {
      await joinPromise!;
    });

    expect(mocks.joinOrLeaveDeskAction).toHaveBeenCalledWith({
      deskId: "desk-1",
      userId: "user-1",
      role: "CONTRIBUTOR",
      isJoining: true,
    });
    expect(result.current.isJoining).toBe(false);
    expect(invalidateQueries).toHaveBeenCalledWith({ queryKey: deskKeys.members("desk-1") });
    expect(invalidateQueries).toHaveBeenCalledWith({ queryKey: deskKeys.detail("desk-1") });
    expect(invalidateQueries).toHaveBeenCalledWith({ queryKey: schoolKeys.detail("school-1") });
  });

  it("shows a toast and resets loading when leaving fails", async () => {
    mocks.joinOrLeaveDeskAction.mockResolvedValue({
      success: false,
      error: "Could not leave desk",
    });
    const { result } = renderHookWithQueryClient(() => useJoinOrLeaveDesk());

    await act(async () => {
      await expect(
        result.current.leaveDesk({
          deskId: "desk-1",
          userId: "user-1",
          isJoining: false,
        }),
      ).rejects.toThrow("Could not leave desk");
    });

    expect(result.current.isLeaving).toBe(false);
    expect(mocks.toastError).toHaveBeenCalledWith("Could not leave desk");
  });
});
