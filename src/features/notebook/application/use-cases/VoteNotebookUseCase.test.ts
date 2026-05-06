import { beforeEach, describe, expect, it, vi } from "vitest";

import { getCurrentUser } from "@/actions/auth/getCurrentUser";
import { createMockUser } from "@/test/utils";
import type { NotebookRepository } from "../../domain/repositories";
import { VoteNotebookUseCase } from "./VoteNotebookUseCase";

vi.mock("@/features/auth/server", () => ({
  getCurrentUser: vi.fn(),
}));

function makeRepository(overrides: Partial<NotebookRepository> = {}): NotebookRepository {
  return {
    getAll: vi.fn(),
    create: vi.fn(),
    getById: vi.fn(),
    delete: vi.fn(),
    vote: vi.fn(),
    removeVote: vi.fn(),
    getVotesByNotebookId: vi.fn(),
    downloadNotebook: vi.fn(),
    update: vi.fn(),
    ...overrides,
  } as NotebookRepository;
}

describe("VoteNotebookUseCase", () => {
  beforeEach(() => {
    vi.mocked(getCurrentUser).mockReset();
  });

  it("creates or updates a vote for the current user", async () => {
    vi.mocked(getCurrentUser).mockResolvedValue(createMockUser({ id: "user-1" }));
    const repository = makeRepository({
      vote: vi.fn().mockResolvedValue(undefined),
    });
    const useCase = new VoteNotebookUseCase(repository);

    const result = await useCase.execute({ notebookId: "notebook-1", isUpvote: true });

    expect(repository.vote).toHaveBeenCalledWith({
      notebookId: "notebook-1",
      userId: "user-1",
      isUpvote: true,
    });
    expect(repository.removeVote).not.toHaveBeenCalled();
    expect(result).toEqual({ success: true });
  });

  it("removes a vote when the input is null", async () => {
    vi.mocked(getCurrentUser).mockResolvedValue(createMockUser({ id: "user-1" }));
    const repository = makeRepository({
      removeVote: vi.fn().mockResolvedValue(undefined),
    });
    const useCase = new VoteNotebookUseCase(repository);

    const result = await useCase.execute({ notebookId: "notebook-1", isUpvote: null });

    expect(repository.removeVote).toHaveBeenCalledWith({
      notebookId: "notebook-1",
      userId: "user-1",
    });
    expect(repository.vote).not.toHaveBeenCalled();
    expect(result).toEqual({ success: true });
  });
});
