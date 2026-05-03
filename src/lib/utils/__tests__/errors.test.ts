import { describe, expect, it, vi } from "vitest";
import { AppErrorCode, AuthenticationError, NetworkError } from "@/types";
import {
  ApplicationError,
  ERROR_MESSAGES,
  getUserErrorMessage,
  logError,
  normalizeError,
} from "../errors";

describe("normalizeError", () => {
  it("preserves application errors as user-facing messages", () => {
    const error = normalizeError(new ApplicationError("Custom failure"));

    expect(error).toBeInstanceOf(ApplicationError);
    expect(error.message).toBe("Custom failure");
  });

  it("maps common Supabase authentication messages", () => {
    expect(normalizeError({ message: "Invalid login credentials" })).toMatchObject({
      name: "AuthenticationError",
      code: AppErrorCode.AUTH_INVALID_CREDENTIALS,
      message: ERROR_MESSAGES[AppErrorCode.AUTH_INVALID_CREDENTIALS],
    });

    expect(normalizeError({ message: "Email not confirmed" })).toMatchObject({
      name: "AuthenticationError",
      code: AppErrorCode.AUTH_EMAIL_NOT_CONFIRMED,
      message: ERROR_MESSAGES[AppErrorCode.AUTH_EMAIL_NOT_CONFIRMED],
    });

    expect(normalizeError({ message: "User already registered" })).toMatchObject({
      name: "AuthenticationError",
      code: AppErrorCode.AUTH_EMAIL_ALREADY_EXISTS,
      message: ERROR_MESSAGES[AppErrorCode.AUTH_EMAIL_ALREADY_EXISTS],
    });
  });

  it("maps file size and network failures to safe messages", () => {
    expect(normalizeError({ message: "body size limit exceeded" })).toEqual(
      new ApplicationError("File size is too large"),
    );

    expect(normalizeError({ message: "database unavailable", status: 503 })).toBeInstanceOf(
      NetworkError,
    );

    expect(normalizeError(new TypeError("fetch failed"))).toMatchObject({
      name: "NetworkError",
      message: ERROR_MESSAGES[AppErrorCode.NETWORK_OFFLINE],
      canRetry: true,
    });
  });

  it("falls back to unknown error messages without leaking details", () => {
    const error = normalizeError(new Error("postgres password leaked"));

    expect(error.message).toBe(ERROR_MESSAGES[AppErrorCode.UNKNOWN_ERROR]);
    expect(error).toMatchObject({
      code: AppErrorCode.UNKNOWN_ERROR,
      metadata: { originalMessage: "postgres password leaked" },
    });
  });

  it("handles unknown thrown values", () => {
    const error = normalizeError("bad value");

    expect(error.message).toBe(ERROR_MESSAGES[AppErrorCode.UNKNOWN_ERROR]);
    expect(error).toMatchObject({
      code: AppErrorCode.UNKNOWN_ERROR,
      metadata: { originalError: "bad value" },
    });
  });
});

describe("getUserErrorMessage", () => {
  it("returns the normalized message", () => {
    expect(getUserErrorMessage({ message: "Invalid login credentials" })).toBe(
      ERROR_MESSAGES[AppErrorCode.AUTH_INVALID_CREDENTIALS],
    );
  });
});

describe("logError", () => {
  it("logs in development with context", () => {
    vi.stubEnv("NODE_ENV", "development");
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
    const error = new AuthenticationError(
      AppErrorCode.AUTH_INVALID_CREDENTIALS,
      "Invalid email or password.",
    );

    logError(error, { feature: "auth" });

    expect(consoleError).toHaveBeenCalledWith(
      "App Error:",
      expect.objectContaining({
        code: AppErrorCode.AUTH_INVALID_CREDENTIALS,
        context: { feature: "auth" },
      }),
    );

    consoleError.mockRestore();
    vi.unstubAllEnvs();
  });
});
