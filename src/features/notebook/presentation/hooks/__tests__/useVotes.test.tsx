import { act, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { notebookKeys } from "@/lib/queries";
import { renderHookWithQueryClient } from "@/test/utils";
import { useMakeVote, useVotes } from "../useVotes";

const mocks = vi.hoisted(() => ({
  getVotesByNotebookId: vi.fn(),
  voteNotebookAction: vi.fn(),
  toastError: vi.fn(),
}));

vi.mock("@/features/notebook/server", () => ({
  getVotesByNotebookId: mocks.getVotesByNotebookId,
}));

vi.mock("@/actions/notebook", () => ({
  voteNotebookAction: mocks.voteNotebookAction,
}));

vi.mock("@/app/providers", () => ({
  useUser: () => ({
    user: { id: "user-1" },
  }),
}));

vi.mock("sonner", () => ({
  toast: {
    error: mocks.toastError,
  },
}));

describe("useVotes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("does not fetch without a notebook id", () => {
    const { result } = renderHookWithQueryClient(() => useVotes(null));

    expect(result.current.fetchStatus).toBe("idle");
    expect(mocks.getVotesByNotebookId).not.toHaveBeenCalled();
  });

  it("fetches votes and seeds the query cache", async () => {
    const votes = [{ userId: "user-1", isUpvote: true }];
    mocks.getVotesByNotebookId.mockResolvedValue({ success: true, data: votes });

    const { result, queryClient } = renderHookWithQueryClient(() => useVotes("notebook-1"));

    await waitFor(() => expect(result.current.data).toEqual(votes));
    expect(queryClient.getQueryData(notebookKeys.votes("notebook-1"))).toEqual(votes);
  });
});

describe("useMakeVote", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("optimistically adds, updates, and removes the current user's vote", async () => {
    mocks.voteNotebookAction.mockResolvedValue({ success: true });
    const { result, queryClient } = renderHookWithQueryClient(() => useMakeVote());

    queryClient.setQueryData(notebookKeys.votes("notebook-1"), []);

    act(() => {
      result.current.makeVote({
        notebookId: "notebook-1",
        deskId: "desk-1",
        isUpvote: true,
      });
    });

    await waitFor(() => {
      expect(queryClient.getQueryData(notebookKeys.votes("notebook-1"))).toEqual([
        { userId: "user-1", isUpvote: true },
      ]);
    });

    act(() => {
      result.current.makeVote({
        notebookId: "notebook-1",
        deskId: "desk-1",
        isUpvote: false,
      });
    });

    await waitFor(() => {
      expect(queryClient.getQueryData(notebookKeys.votes("notebook-1"))).toEqual([
        { userId: "user-1", isUpvote: false },
      ]);
    });

    act(() => {
      result.current.removeVote({ notebookId: "notebook-1", deskId: "desk-1" });
    });

    await waitFor(() => {
      expect(queryClient.getQueryData(notebookKeys.votes("notebook-1"))).toEqual([]);
    });
  });

  it("shows a toast when voting fails", async () => {
    mocks.voteNotebookAction.mockResolvedValue({ success: false, error: "Vote failed" });
    const { result, queryClient } = renderHookWithQueryClient(() => useMakeVote());

    queryClient.setQueryData(notebookKeys.votes("notebook-1"), []);

    act(() => {
      result.current.makeVote({
        notebookId: "notebook-1",
        deskId: "desk-1",
        isUpvote: true,
      });
    });

    await waitFor(() => expect(mocks.toastError).toHaveBeenCalledWith("Vote failed"));
  });
});
