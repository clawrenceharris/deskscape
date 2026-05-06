
import { Prisma } from "@/lib/db/prisma";
import {
  AppError,
  AppErrorCode,
  AuthenticationError,
  AuthorizationError,
  ConflictError,
  DatabaseError,
  ErrorCategory,
  ErrorSeverity,
  ExternalApiError,
  NetworkError,
  NotFoundError,
  ValidationError,
} from "@/types";

export class ApplicationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ApplicationError";
  }
}

export class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DomainError";
  }
}

  
  // Centralized error message mapping
  export const ERROR_MESSAGES: Record<AppErrorCode, string> = {
    // Authentication
    [AppErrorCode.AUTH_INVALID_CREDENTIALS]:
      "Oops — that login didn’t work. Check your email and password.",
    [AppErrorCode.AUTH_USER_NOT_FOUND]:
      "We couldn’t find an account for that email.",
    [AppErrorCode.AUTH_EMAIL_NOT_CONFIRMED]:
      "Please confirm your email before signing in.",
    [AppErrorCode.AUTH_PASSWORD_TOO_WEAK]:
      "That password is too weak. Try adding numbers and symbols.",
    [AppErrorCode.AUTH_EMAIL_ALREADY_EXISTS]:
      "Looks like that email is already taken.",
    [AppErrorCode.AUTH_SESSION_EXPIRED]:
      "Your session expired. Please sign in again.",
    [AppErrorCode.AUTH_RATE_LIMITED]:
      "Slow down a bit. We’re protecting the site.",
    [AppErrorCode.AUTH_UNAUTHENTICATED]:
      "You need to sign in before doing that.",

    // Authorization
    [AppErrorCode.PERMISSION_DENIED]:
      "You don’t have permission to do that.",

    // Validation
    [AppErrorCode.VALIDATION_FAILED]:
      "Something didn’t look right. Please check your input.",
    [AppErrorCode.FILE_TOO_LARGE]:
      "That file is too large. Try a smaller one.",

    // Network
    [AppErrorCode.NETWORK_OFFLINE]:
      "No internet detected. Please check your connection.",
    [AppErrorCode.NETWORK_TIMEOUT]:
      "That request took too long. Please try again.",
    [AppErrorCode.NETWORK_SERVER_ERROR]:
      "Something broke on the server. Our team is looking at it.",
    [AppErrorCode.RATE_LIMITED]:
      "Too many requests. Please wait a moment and try again.",

    // Database
    [AppErrorCode.DATABASE_ERROR]:
      "Something went wrong on our side. Please try again in a moment.",
    [AppErrorCode.DATABASE_CONFLICT]:
      "That item already exists or can’t be updated right now.",
    [AppErrorCode.RESOURCE_NOT_FOUND]:
      "We couldn’t find what you were looking for.",

    // External
    [AppErrorCode.EXTERNAL_SERVICE_ERROR]:
      "A service we depend on failed. Please try again soon.",

    // Generic
    [AppErrorCode.UNKNOWN_ERROR]:
      "Oops — something broke. Please stand by while we fix it.",
  };
  
  export function getUserErrorMessage(error: unknown): string {
    const normalizedError = normalizeError(error);
    if (normalizedError instanceof AppError) {
      return normalizedError.userMessage;
    }
    return normalizedError.message;
  }
  
  function isPrismaKnownRequestError(error: unknown): error is Prisma.PrismaClientKnownRequestError {
    return (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      "meta" in error &&
      (error as { name?: string }).name === "PrismaClientKnownRequestError"
    );
  }
  
  function isSupabaseError(
    error: unknown,
  ): error is { message: string; status?: number; code?: string; details?: string } {
    return (
      typeof error === "object" &&
      error !== null &&
      !(error instanceof Error) &&
      "message" in error &&
      typeof (error as { message: unknown }).message === "string"
    );
  }
  
  function normalizePrismaError(error: Prisma.PrismaClientKnownRequestError): AppError {
    const normalizedMessage = error.message?.toLowerCase() ?? "";
    const metadata = { code: error.code, meta: error.meta };

    if (error.code === "P2002") {
      return new ConflictError(ERROR_MESSAGES[AppErrorCode.DATABASE_CONFLICT], metadata);
    }

    if (error.code === "P2025") {
      return new NotFoundError(ERROR_MESSAGES[AppErrorCode.RESOURCE_NOT_FOUND], metadata);
    }

    if (error.code === "P2003") {
      return new DatabaseError(ERROR_MESSAGES[AppErrorCode.DATABASE_ERROR], metadata);
    }

    if (error.code === "P2004" || error.code === "P5034") {
      return new DatabaseError(ERROR_MESSAGES[AppErrorCode.DATABASE_ERROR], metadata);
    }

    if (normalizedMessage.includes("unique constraint") || normalizedMessage.includes("duplicate")) {
      return new ConflictError(ERROR_MESSAGES[AppErrorCode.DATABASE_CONFLICT], metadata);
    }

    return new DatabaseError(ERROR_MESSAGES[AppErrorCode.DATABASE_ERROR], metadata);
  }
  
  function normalizeSupabaseError(error: {
    message: string;
    status?: number;
    code?: string;
    details?: string;
  }): AppError {
    const normalizedMessage = error.message.toLowerCase();

    if (normalizedMessage.includes("invalid login credentials")) {
      return new AuthenticationError(
        AppErrorCode.AUTH_INVALID_CREDENTIALS,
        ERROR_MESSAGES[AppErrorCode.AUTH_INVALID_CREDENTIALS],
        { status: error.status, code: error.code },
      );
    }

    if (normalizedMessage.includes("email not confirmed")) {
      return new AuthenticationError(
        AppErrorCode.AUTH_EMAIL_NOT_CONFIRMED,
        ERROR_MESSAGES[AppErrorCode.AUTH_EMAIL_NOT_CONFIRMED],
        { status: error.status, code: error.code },
      );
    }

    if (normalizedMessage.includes("user already registered")) {
      return new AuthenticationError(
        AppErrorCode.AUTH_EMAIL_ALREADY_EXISTS,
        ERROR_MESSAGES[AppErrorCode.AUTH_EMAIL_ALREADY_EXISTS],
        { status: error.status, code: error.code },
      );
    }

    if (normalizedMessage.includes("forbidden") || normalizedMessage.includes("permission denied")) {
      return new AuthorizationError(
        ERROR_MESSAGES[AppErrorCode.PERMISSION_DENIED],
        { status: error.status, code: error.code },
      );
    }

    if (normalizedMessage.includes("not found") || error.status === 404) {
      return new NotFoundError(
        ERROR_MESSAGES[AppErrorCode.RESOURCE_NOT_FOUND],
        { status: error.status, code: error.code },
      );
    }

    if (
      normalizedMessage.includes("body size limit") ||
      normalizedMessage.includes("payload too large") ||
      error.status === 413
    ) {
      return new AppError(
        AppErrorCode.FILE_TOO_LARGE,
        ErrorCategory.VALIDATION,
        ErrorSeverity.MEDIUM,
        ERROR_MESSAGES[AppErrorCode.FILE_TOO_LARGE],
        false,
        { status: error.status, code: error.code },
      );
    }

    if (error.status === 401 || normalizedMessage.includes("unauthorized") || normalizedMessage.includes("invalid token")) {
      return new AuthenticationError(
        AppErrorCode.AUTH_UNAUTHENTICATED,
        ERROR_MESSAGES[AppErrorCode.AUTH_UNAUTHENTICATED],
        { status: error.status, code: error.code },
      );
    }

    if (error.status === 429 || normalizedMessage.includes("rate limit")) {
      return new AppError(
        AppErrorCode.RATE_LIMITED,
        ErrorCategory.NETWORK,
        ErrorSeverity.MEDIUM,
        ERROR_MESSAGES[AppErrorCode.RATE_LIMITED],
        true,
        { status: error.status, code: error.code },
      );
    }

    if (error.status && error.status >= 500) {
      return new ExternalApiError(
        ERROR_MESSAGES[AppErrorCode.EXTERNAL_SERVICE_ERROR],
        { status: error.status, code: error.code, details: error.details },
      );
    }

    return new AppError(
      AppErrorCode.UNKNOWN_ERROR,
      ErrorCategory.SYSTEM,
      ErrorSeverity.MEDIUM,
      ERROR_MESSAGES[AppErrorCode.UNKNOWN_ERROR],
      true,
      { message: error.message, status: error.status, code: error.code },
    );
  }
  
  export function normalizeError(error: unknown): AppError | ApplicationError {
    if (error instanceof AppError) {
      return error;
    }

    if (error instanceof ApplicationError) {
      return error;
    }

    if (isPrismaKnownRequestError(error)) {
      return normalizePrismaError(error);
    }

    if (isSupabaseError(error)) {
      return normalizeSupabaseError(error);
    }

    // Network/fetch errors
    if (error instanceof TypeError && error.message.includes("fetch")) {
      return new NetworkError(ERROR_MESSAGES[AppErrorCode.NETWORK_OFFLINE], true, {
        originalMessage: error.message,
      });
    }

    if (error instanceof Error) {
      return new AppError(
        AppErrorCode.UNKNOWN_ERROR,
        ErrorCategory.SYSTEM,
        ErrorSeverity.MEDIUM,
        ERROR_MESSAGES[AppErrorCode.UNKNOWN_ERROR],
        true,
        { originalMessage: error.message },
      );
    }

    return new AppError(
      AppErrorCode.UNKNOWN_ERROR,
      ErrorCategory.SYSTEM,
      ErrorSeverity.MEDIUM,
      ERROR_MESSAGES[AppErrorCode.UNKNOWN_ERROR],
      true,
      { originalError: String(error) },
    );
  }

  // Central error logging
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export function logError(error: AppError, context?: Record<string, any>) {
    const errorLog = {
      timestamp: error.timestamp,
      code: error.code,
      category: error.category,
      severity: error.severity,
      message: error.message,
      userMessage: error.userMessage,
      canRetry: error.canRetry,
      metadata: error.metadata,
      context,
      userAgent:
        typeof navigator !== "undefined" ? navigator.userAgent : "server",
      url: typeof window !== "undefined" ? window.location.href : "server",
    };
  
    // Log to console in development
    if (process.env.NODE_ENV === "development") {
      console.error("App Error:", errorLog);
    }
    //Production logic will be under here
  }