import { describe, expect, it, vi, beforeEach } from "vitest";
import { CreateDeskUseCase } from "../CreateDeskUseCase";

import { DeskRepository } from "../../../domain/repositories";
import { DeskStorage } from "../../../domain/services";
import { DeskForDetail } from "../../../infrastructure/queries";
import { ApplicationError } from "@/lib/utils/errors";

// Helper to create a mock DeskRepository
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

// Helper to create a mock DeskStorage
function makeStorage(overrides: Partial<DeskStorage> = {}): DeskStorage {
  return {
    uploadImage: vi.fn().mockResolvedValue({ path: "test.png", url: "test.png" }),
    remove: vi.fn().mockResolvedValue(undefined),
    ...overrides,
  } as DeskStorage;
}

describe("CreateDeskUseCase", () => {
  let deskRepository: DeskRepository;
  let storage: DeskStorage;

  beforeEach(() => {
    vi.clearAllMocks();
    deskRepository = makeRepository({
      create: vi.fn().mockResolvedValue({
        id: "1",
        name: "Test Desk",
        schoolId: "1",
        isPublic: true,
        creatorId: "1",
        imageUrl: "test.png",
        imagePath: "test.png",
        description: null,
      } as DeskForDetail),
      update: vi.fn().mockResolvedValue({
        id: "1",
        name: "Test Desk",
        schoolId: "1",
        isPublic: true,
        creatorId: "1",
        imageUrl: "test.png",
        imagePath: "test.png",
        description: null,
      } as DeskForDetail),
    });
    storage = makeStorage();
  });

  it("should create a desk", async () => {
    // You can access and control mocks using vi.mocked
    const createDeskUseCase = new CreateDeskUseCase(deskRepository, storage);

    // Actually set up the uploadImage mock if you want to override value for this test
    vi.mocked(storage.uploadImage).mockResolvedValue({ path: "test.png", url: "test.png" });

    // Call tested use case
    const desk = await createDeskUseCase.execute({
      name: "Test Desk",
      schoolId: "1",
      isPublic: true,
      creatorId: "1",
      imageFile: new File([], "test.png"),
    });

    expect(deskRepository.create).toHaveBeenCalledWith({
      creatorId: "1",
      name: "Test Desk",
      schoolId: "1",
      imageUrl: null,
      imagePath: null,
      isPublic: true,
      description: null,
    });
    expect(storage.uploadImage).toHaveBeenCalledWith({
      deskId: "1",
      file: new File([], "test.png"),
      userId: "1",
    });

    expect(deskRepository.update).toHaveBeenCalledWith("1", { imageUrl: "test.png", imagePath: "test.png" });
    expect(desk).toEqual({
      success: true,
      data: {
        id: "1",
        name: "Test Desk",
        schoolId: "1",
        isPublic: true,
        creatorId: "1",
        imageUrl: "test.png",
        imagePath: "test.png",
        description: null,
      } as DeskForDetail,
    });
  });

  it("should return an error if the desk creation fails", async () => {
    // Overwrite the create method to reject
    deskRepository = makeRepository({
      create: vi.fn().mockRejectedValue(new Error("Failed to create desk")),
    });
    storage = makeStorage();
    const createDeskUseCase = new CreateDeskUseCase(deskRepository, storage);
    const desk = await createDeskUseCase.execute({
      name: "Test Desk",
      schoolId: "1",
      isPublic: true,
      creatorId: "1",
      imageFile: new File([], "test.png"),
    });
    expect(desk).toEqual({
      success: false,
      error: new ApplicationError("Something went wrong. Please try again later."),
    });
  });

  it("should return an error if the image upload fails", async () => {
    // Overwrite only the uploadImage method to reject
    deskRepository = makeRepository();
    storage = makeStorage({
      uploadImage: vi.fn().mockRejectedValue(new Error("Failed to upload image")),
    });
    const createDeskUseCase = new CreateDeskUseCase(deskRepository, storage);
    const desk = await createDeskUseCase.execute({
      name: "Test Desk",
      schoolId: "1",
      isPublic: true,
      creatorId: "1",
      imageFile: new File([], "test.png"),
    });
    expect(desk).toEqual({
      success: false,
      error: new ApplicationError("Something went wrong. Please try again later."),
    });
  });

  it("should call remove on DeskStorage if uploadImage fails after creating and uploading", async () => {
    // This tests mocking the DeskStorage.remove method
    deskRepository = makeRepository({
      create: vi.fn().mockResolvedValue({
        id: "1",
        name: "Test Desk",
        schoolId: "1",
        isPublic: true,
        creatorId: "1",
        imageUrl: null,
        imagePath: null,
        description: null,
      } as DeskForDetail),
    });
    // uploadImage resolves, but update rejects, triggering cleanup (remove)
    storage = makeStorage({
      uploadImage: vi.fn().mockResolvedValue({ path: "test.png", url: "test.png" }),
      remove: vi.fn().mockResolvedValue(undefined),
    });

    // Make update fail
    deskRepository.update = vi.fn().mockRejectedValue(new Error("Update failed"));

    const createDeskUseCase = new CreateDeskUseCase(deskRepository, storage);

    await createDeskUseCase.execute({
      name: "Test Desk",
      schoolId: "1",
      isPublic: true,
      creatorId: "1",
      imageFile: new File([], "test.png"),
    });

    // remove should have been called with "test.png" because image upload succeeded, but update failed
    expect(storage.remove).toHaveBeenCalledWith("test.png");
  });
});