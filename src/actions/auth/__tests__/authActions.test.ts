import { beforeEach, describe, expect, it, vi } from "vitest";
import { createMockUser } from "@/test/utils";
import { loginAction } from "../loginAction";
import { signOutAction } from "../signOutAction";
import { signupAction } from "../signupAction";

const mocks = vi.hoisted(() => ({
  makeLoginUserUseCase: vi.fn(),
  makeSignupUserUseCase: vi.fn(),
  makeSignOutUserUseCase: vi.fn(),
}));

vi.mock("@/composition/auth", () => mocks);

describe("auth actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns validation errors before creating the login use case", async () => {
    const result = await loginAction({ email: "bad-email", password: "short" });

    expect(result).toEqual({
      success: false,
      error: "Please enter a valid email address",
    });
    expect(mocks.makeLoginUserUseCase).not.toHaveBeenCalled();
  });

  it("executes the login use case with parsed credentials", async () => {
    const user = createMockUser();
    const execute = vi.fn().mockResolvedValue({ success: true, data: user });
    mocks.makeLoginUserUseCase.mockResolvedValue({ execute });

    const result = await loginAction({
      email: "user@example.com",
      password: "password",
    });

    expect(execute).toHaveBeenCalledWith("user@example.com", "password");
    expect(result).toEqual({ success: true, data: user });
  });

  it("maps login use case and thrown failures to action errors", async () => {
    mocks.makeLoginUserUseCase.mockResolvedValueOnce({
      execute: vi.fn().mockResolvedValue({
        success: false,
        error: new Error("Invalid email or password. Please try again."),
      }),
    });

    await expect(
      loginAction({ email: "user@example.com", password: "password" }),
    ).resolves.toEqual({
      success: false,
      error: "Invalid email or password. Please try again.",
    });

    mocks.makeLoginUserUseCase.mockRejectedValueOnce(new Error("database secret"));

    await expect(
      loginAction({ email: "user@example.com", password: "password" }),
    ).resolves.toEqual({
      success: false,
      error: "Something went wrong. Please try again later.",
    });
  });

  it("validates signup and executes the signup use case", async () => {
    const user = createMockUser();
    const execute = vi.fn().mockResolvedValue({ success: true, data: user });
    mocks.makeSignupUserUseCase.mockResolvedValue({ execute });

    await expect(signupAction({ email: "bad-email", password: "password" })).resolves.toMatchObject({
      success: false,
    });

    const result = await signupAction({
      email: "user@example.com",
      password: "password",
    });

    expect(execute).toHaveBeenCalledWith("user@example.com", "password");
    expect(result).toEqual({ success: true, data: user });
  });

  it("signs out and maps use case failures", async () => {
    mocks.makeSignOutUserUseCase.mockResolvedValueOnce({
      execute: vi.fn().mockResolvedValue({ success: true }),
    });

    await expect(signOutAction()).resolves.toEqual({ success: true });

    mocks.makeSignOutUserUseCase.mockResolvedValueOnce({
      execute: vi.fn().mockResolvedValue({
        success: false,
        error: new Error("Could not sign out"),
      }),
    });

    await expect(signOutAction()).resolves.toEqual({
      success: false,
      error: "Could not sign out",
    });
  });
});
