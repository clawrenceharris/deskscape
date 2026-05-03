import { describe, expect, it, vi } from "vitest";
import { createMockUser } from "@/test/utils";
import type { AuthProvider } from "@/features/auth/domain/services/AuthProvider";
import { GetCurrentUserUseCase } from "../GetCurrentUserUseCase";
import { LoginUserUseCase } from "../LoginUserUseCase";
import { RequestPasswordResetUseCase } from "../RequestPasswordResetUseCase";
import { ResetPasswordUseCase } from "../ResetPasswordUseCase";
import { SignOutUserUseCase } from "../SignOutUserUseCase";
import { SignupUserUseCase } from "../SignupUserUseCase";

function createAuthProviderMock(overrides: Partial<Record<keyof AuthProvider, unknown>> = {}) {
  return {
    getUserId: vi.fn(),
    getUser: vi.fn(),
    signInWithEmail: vi.fn(),
    signUp: vi.fn(),
    signOut: vi.fn(),
    requestPasswordReset: vi.fn(),
    resetPassword: vi.fn(),
    ...overrides,
  } as unknown as AuthProvider;
}

describe("auth use cases", () => {
  it("logs in with email and password", async () => {
    const user = createMockUser();
    const authProvider = createAuthProviderMock({
      signInWithEmail: vi.fn().mockResolvedValue(user),
    });

    const result = await new LoginUserUseCase(authProvider).execute({
      email: "user@example.com",
      password: "password",
    });

    expect(authProvider.signInWithEmail).toHaveBeenCalledWith("user@example.com", "password");
    expect(result).toEqual({ success: true, data: user });
  });

  it("returns a safe auth error when login fails", async () => {
    const authProvider = createAuthProviderMock({
      signInWithEmail: vi.fn().mockRejectedValue({ message: "Invalid login credentials" }),
    });

    const result = await new LoginUserUseCase(authProvider).execute({
      email: "user@example.com",
      password: "password",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.message).toBe("Invalid email or password. Please try again.");
    }
  });

  it("signs up and handles missing users", async () => {
    const user = createMockUser();
    const authProvider = createAuthProviderMock({
      signUp: vi.fn().mockResolvedValueOnce(user).mockResolvedValueOnce(null),
    });
    const useCase = new SignupUserUseCase(authProvider);

    await expect(
      useCase.execute({ email: "user@example.com", password: "password" }),
    ).resolves.toEqual({ success: true, data: user });

    const missingUserResult = await useCase.execute({
      email: "user@example.com",
      password: "password",
    });

    expect(missingUserResult.success).toBe(false);
    if (!missingUserResult.success) {
      expect(missingUserResult.error.message).toBe("Failed to create account.");
    }
  });

  it("signs out and wraps failures", async () => {
    const authProvider = createAuthProviderMock({
      signOut: vi.fn().mockResolvedValueOnce(undefined).mockRejectedValueOnce(new Error("boom")),
    });
    const useCase = new SignOutUserUseCase(authProvider);

    await expect(useCase.execute()).resolves.toEqual({ success: true });

    const result = await useCase.execute();

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.message).toBe("Something went wrong. Please try again later.");
    }
  });

  it("delegates current user lookup", async () => {
    const user = createMockUser();
    const authProvider = createAuthProviderMock({
      getUser: vi.fn().mockResolvedValue(user),
    });

    await expect(new GetCurrentUserUseCase(authProvider).execute()).resolves.toBe(user);
  });

  it("requests and resets passwords through the provider", async () => {
    const authProvider = createAuthProviderMock({
      requestPasswordReset: vi.fn().mockResolvedValue(undefined),
      resetPassword: vi.fn().mockResolvedValue(undefined),
    });

    await expect(
      new RequestPasswordResetUseCase(authProvider).execute("user@example.com"),
    ).resolves.toEqual({ success: true });

    await expect(
      new ResetPasswordUseCase(authProvider).execute("new-password", "token"),
    ).resolves.toEqual({ success: true });

    expect(authProvider.requestPasswordReset).toHaveBeenCalledWith("user@example.com");
    expect(authProvider.resetPassword).toHaveBeenCalledWith("new-password", "token");
  });
});
