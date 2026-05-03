import { waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { deskKeys } from "@/lib/queries";
import { renderHookWithQueryClient } from "@/test/utils";
import { useDesk } from "../useDesk";

const mocks = vi.hoisted(() => ({
  getDeskById: vi.fn(),
}));

vi.mock("@/features/desk/server", () => ({
  getDeskById: mocks.getDeskById,
}));

describe("useDesk", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("does not fetch without a desk id", () => {
    const { result } = renderHookWithQueryClient(() => useDesk(null));

    expect(result.current.fetchStatus).toBe("idle");
    expect(mocks.getDeskById).not.toHaveBeenCalled();
  });

  it("fetches a desk and stores it in cache", async () => {
    const desk = { id: "desk-1", name: "Biology" };
    mocks.getDeskById.mockResolvedValue({ success: true, data: desk });

    const { result, queryClient } = renderHookWithQueryClient(() => useDesk("desk-1"));

    await waitFor(() => expect(result.current.data).toEqual(desk));
    expect(mocks.getDeskById).toHaveBeenCalledWith("desk-1");
    expect(queryClient.getQueryData(deskKeys.detail("desk-1"))).toEqual(desk);
  });

  it("surfaces application errors from the server", async () => {
    mocks.getDeskById.mockResolvedValue({ success: false, error: "Desk not found" });

    const { result } = renderHookWithQueryClient(() => useDesk("desk-1"));

    await waitFor(() => {
      expect(result.current.error).toMatchObject({
        name: "ApplicationError",
        message: "Desk not found",
      });
    });
  });
});
