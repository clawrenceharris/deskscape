import { act, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { deskKeys, notebookKeys } from "@/lib/queries";
import { renderHookWithQueryClient } from "@/test/utils";
import { useDownloadNotebook } from "../useDownloadNotebook";

const mocks = vi.hoisted(() => ({
  downloadNotebookAction: vi.fn(),
}));

vi.mock("@/actions/notebook", () => ({
  downloadNotebookAction: mocks.downloadNotebookAction,
}));

function createNotebook(id = "notebook-1") {
  return {
    id,
    title: "Notebook",
    downloads: [],
  };
}

describe("useDownloadNotebook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("optimistically adds a download to detail and desk list caches", async () => {
    mocks.downloadNotebookAction.mockResolvedValue({ success: true });
    const { result, queryClient } = renderHookWithQueryClient(() => useDownloadNotebook());

    queryClient.setQueryData(notebookKeys.detail("notebook-1"), createNotebook());
    queryClient.setQueryData(notebookKeys.listByDeskId("desk-1"), [
      createNotebook("notebook-1"),
      createNotebook("notebook-2"),
    ]);

    act(() => {
      result.current.download({
        notebookId: "notebook-1",
        deskId: "desk-1",
        userId: "user-1",
      });
    });

    await waitFor(() => {
      expect(queryClient.getQueryData(notebookKeys.detail("notebook-1"))).toMatchObject({
        downloads: [{ profile: { userId: "user-1" } }],
      });
      expect(queryClient.getQueryData(notebookKeys.listByDeskId("desk-1"))).toEqual([
        expect.objectContaining({
          id: "notebook-1",
          downloads: [
            expect.objectContaining({
              profile: expect.objectContaining({ userId: "user-1" }),
            }),
          ],
        }),
        expect.objectContaining({ id: "notebook-2", downloads: [] }),
      ]);
    });
  });

  it("rolls back optimistic cache changes and invalidates on failure", async () => {
    mocks.downloadNotebookAction.mockResolvedValue({ success: false, error: "Download failed" });
    const { result, queryClient } = renderHookWithQueryClient(() => useDownloadNotebook());
    const invalidateQueries = vi.spyOn(queryClient, "invalidateQueries");
    const detail = createNotebook();
    const list = [createNotebook("notebook-1")];

    queryClient.setQueryData(notebookKeys.detail("notebook-1"), detail);
    queryClient.setQueryData(notebookKeys.listByDeskId("desk-1"), list);

    act(() => {
      result.current.download({
        notebookId: "notebook-1",
        deskId: "desk-1",
        userId: "user-1",
      });
    });

    await waitFor(() => {
      expect(queryClient.getQueryData(notebookKeys.detail("notebook-1"))).toStrictEqual(detail);
      expect(queryClient.getQueryData(notebookKeys.listByDeskId("desk-1"))).toStrictEqual(list);
      expect(invalidateQueries).toHaveBeenCalledWith({
        queryKey: notebookKeys.detail("notebook-1"),
      });
      expect(invalidateQueries).toHaveBeenCalledWith({
        queryKey: deskKeys.detail("desk-1"),
      });
    });
  });
});
