import { describe, expect, it, vi } from "vitest";

import type { DeskRepository } from "../../../domain/repositories";
import { GetDesksUseCase } from "../GetDesksUseCase";

function makeRepository(overrides: Partial<DeskRepository> = {}): DeskRepository {
  return {
    getAll: vi.fn(),
    getById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    join: vi.fn(),
    leave: vi.fn(),
    createSchoolDesk: vi.fn(),
    createMyDesk: vi.fn(),
    getSchoolDesk: vi.fn(),
    ...overrides,
  } as DeskRepository;
}

describe("GetDesksUseCase", () => {
  it("returns desks from the repository", async () => {
    const desks = [{ id: "desk-1", name: "Biology" }];
    const repository = makeRepository({
      getAll: vi.fn().mockResolvedValue(desks),
    });
    const useCase = new GetDesksUseCase(repository);

    const result = await useCase.execute({ where: { isPublic: true } });

    expect(repository.getAll).toHaveBeenCalledWith({ where: { isPublic: true } });
    expect(result).toEqual({ success: true, data: desks });
  });

  it("maps repository failures to a user-facing result", async () => {
    const repository = makeRepository({
      getAll: vi.fn().mockRejectedValue(new Error("database unavailable")),
    });
    const useCase = new GetDesksUseCase(repository);

    const result = await useCase.execute();

    expect(result.success).toBe(false);
    expect(result).toHaveProperty("error", "Something went wrong. Please try again later.");
  });
});
