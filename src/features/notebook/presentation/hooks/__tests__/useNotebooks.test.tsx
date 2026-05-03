import { waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { notebookKeys } from "@/lib/queries";
import { renderHookWithQueryClient } from "@/test/utils";
import { useNotebooks, useNotebooksByDeskId, useNotebooksByUserId } from "../useNotebooks";

const mocks = vi.hoisted(() => ({
  getNotebooks: vi.fn(),
}));

vi.mock("@/features/notebook/server", () => ({
  getNotebooks: mocks.getNotebooks,
}));

describe("useNotebooks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches and selects all notebooks", async () => {
    const notebooks = [
      { id: "notebook-1", title: "Biology" },
      { id: "notebook-2", title: "Math" },
    ];
    mocks.getNotebooks.mockResolvedValue({ success: true, data: notebooks });

    const { result } = renderHookWithQueryClient(() =>
      useNotebooks((data) => data.filter((notebook) => notebook.id === "notebook-1")),
    );

    await waitFor(() => {
      expect(result.current.data).toEqual([{ id: "notebook-1", title: "Biology" }]);
    });
  });

  it("does not fetch user notebooks without a user id", () => {
    const { result } = renderHookWithQueryClient(() => useNotebooksByUserId(null));

    expect(result.current.fetchStatus).toBe("idle");
    expect(mocks.getNotebooks).not.toHaveBeenCalled();
  });

  it("fetches user notebooks and stores them in cache", async () => {
    const notebooks = [{ id: "notebook-1", title: "Biology" }];
    mocks.getNotebooks.mockResolvedValue({ success: true, data: notebooks });

    const { result, queryClient } = renderHookWithQueryClient(() =>
      useNotebooksByUserId("user-1"),
    );

    await waitFor(() => expect(result.current.data).toEqual(notebooks));
    expect(mocks.getNotebooks).toHaveBeenCalledWith({ where: { creatorId: "user-1" } });
    expect(queryClient.getQueryData(notebookKeys.listByUserId("user-1"))).toEqual(notebooks);
  });

  it("fetches desk notebooks and maps failures to application errors", async () => {
    mocks.getNotebooks.mockResolvedValueOnce({
      success: true,
      data: [{ id: "notebook-1", title: "Biology" }],
    });

    const { result: successResult, queryClient } = renderHookWithQueryClient(() =>
      useNotebooksByDeskId("desk-1"),
    );

    await waitFor(() => {
      expect(successResult.current.data).toEqual([{ id: "notebook-1", title: "Biology" }]);
    });
    expect(mocks.getNotebooks).toHaveBeenCalledWith({ where: { deskId: "desk-1" } });
    expect(queryClient.getQueryData(notebookKeys.listByDeskId("desk-1"))).toEqual([
      { id: "notebook-1", title: "Biology" },
    ]);

    mocks.getNotebooks.mockResolvedValueOnce({ success: false, error: "No notebooks" });
    const { result: errorResult } = renderHookWithQueryClient(() =>
      useNotebooksByDeskId("desk-2"),
    );

    await waitFor(() => {
      expect(errorResult.current.error).toMatchObject({
        name: "ApplicationError",
        message: "No notebooks",
      });
    });
  });
});
