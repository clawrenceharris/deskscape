import { beforeEach, describe, expect, it, vi } from "vitest";
import { createMockUser } from "@/test/utils";
import { SupabaseAuthProvider } from "../SupabaseAuthProvider";

function createClientMock() {
  return {
    auth: {
      getUser: vi.fn(),
      signInWithPassword: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
      resetPasswordForEmail: vi.fn(),
      updateUser: vi.fn(),
    },
  };
}

describe("SupabaseAuthProvider", () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
  });

  it("gets the current user and user id", async () => {
    const user = createMockUser();
    const client = createClientMock();
    client.auth.getUser.mockResolvedValue({ data: { user }, error: null });
    const provider = new SupabaseAuthProvider(client as never);

    await expect(provider.getUser()).resolves.toBe(user);
    await expect(provider.getUserId()).resolves.toBe(user.id);
  });

  it("returns null user ids but throws current-user errors", async () => {
    const client = createClientMock();
    client.auth.getUser.mockResolvedValue({ data: { user: null }, error: new Error("expired") });
    const provider = new SupabaseAuthProvider(client as never);

    await expect(provider.getUserId()).resolves.toBeNull();
    await expect(provider.getUser()).rejects.toThrow("expired");
  });

  it("signs in and signs up with Supabase credentials", async () => {
    const user = createMockUser();
    const client = createClientMock();
    client.auth.signInWithPassword.mockResolvedValue({ data: { user }, error: null });
    client.auth.signUp.mockResolvedValue({ data: { user }, error: null });
    const provider = new SupabaseAuthProvider(client as never);

    await expect(provider.signInWithEmail("user@example.com", "password")).resolves.toBe(user);
    expect(client.auth.signInWithPassword).toHaveBeenCalledWith({
      email: "user@example.com",
      password: "password",
    });

    await expect(provider.signUp("user@example.com", "password")).resolves.toBe(user);
    expect(client.auth.signUp).toHaveBeenCalledWith({
      email: "user@example.com",
      password: "password",
    });
  });

  it("throws Supabase auth errors", async () => {
    const client = createClientMock();
    client.auth.signInWithPassword.mockResolvedValue({
      data: { user: null },
      error: new Error("Invalid login credentials"),
    });
    client.auth.signUp.mockResolvedValue({ data: { user: null }, error: null });
    client.auth.signOut.mockResolvedValue({ error: new Error("sign out failed") });
    const provider = new SupabaseAuthProvider(client as never);

    await expect(provider.signInWithEmail("user@example.com", "password")).rejects.toThrow(
      "Invalid login credentials",
    );
    await expect(provider.signUp("user@example.com", "password")).rejects.toThrow("User not found");
    await expect(provider.signOut()).rejects.toThrow("sign out failed");
  });

  it("sends password reset emails to the app update-password route", async () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://example.com/");
    const client = createClientMock();
    client.auth.resetPasswordForEmail.mockResolvedValue({ error: null });
    const provider = new SupabaseAuthProvider(client as never);

    await provider.requestPasswordReset("user@example.com");

    expect(client.auth.resetPasswordForEmail).toHaveBeenCalledWith("user@example.com", {
      redirectTo: "https://example.com/auth/update-password",
    });
  });

  it("updates the password and propagates reset failures", async () => {
    const client = createClientMock();
    client.auth.updateUser.mockResolvedValueOnce({ error: null }).mockResolvedValueOnce({
      error: new Error("weak password"),
    });
    const provider = new SupabaseAuthProvider(client as never);

    await expect(provider.resetPassword("new-password", "token")).resolves.toBeUndefined();
    expect(client.auth.updateUser).toHaveBeenCalledWith({ password: "new-password" });

    await expect(provider.resetPassword("weak", "token")).rejects.toThrow("weak password");
  });
});
