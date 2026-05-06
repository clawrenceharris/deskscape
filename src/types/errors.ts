/* eslint-disable @typescript-eslint/no-explicit-any */
// Error severity levels
export enum ErrorSeverity {
    LOW = "low", // Non-critical, user can continue
    MEDIUM = "medium", // Important but recoverable
    HIGH = "high", // Critical, blocks user flow
    CRITICAL = "critical", // System failure, requires immediate attention
  }
  
  // Error categories for better organization
  export enum ErrorCategory {
    AUTHENTICATION = "authentication",
    AUTHORIZATION = "authorization",
    VALIDATION = "validation",
    NETWORK = "network",
    DATABASE = "database",
    EXTERNAL_API = "external_api",
    BUSINESS_LOGIC = "business_logic",
    SYSTEM = "system",
  }
  
  // Centralized error codes with user-friendly messages
  export enum AppErrorCode {
    // Authentication Errors
    AUTH_INVALID_CREDENTIALS = "auth_invalid_credentials",
    AUTH_USER_NOT_FOUND = "auth_user_not_found",
    AUTH_EMAIL_NOT_CONFIRMED = "auth_email_not_confirmed",
    AUTH_PASSWORD_TOO_WEAK = "auth_password_too_weak",
    AUTH_EMAIL_ALREADY_EXISTS = "auth_email_already_exists",
    AUTH_SESSION_EXPIRED = "auth_session_expired",
    AUTH_RATE_LIMITED = "auth_rate_limited",
    AUTH_UNAUTHENTICATED = "auth_unauthenticated",
  
    // Authorization Errors
    PERMISSION_DENIED = "permission_denied",
  
    // Validation Errors
    VALIDATION_FAILED = "validation_failed",
    FILE_TOO_LARGE = "file_too_large",
  
    // Network Errors
    NETWORK_OFFLINE = "network_offline",
    NETWORK_TIMEOUT = "network_timeout",
    NETWORK_SERVER_ERROR = "network_server_error",
    RATE_LIMITED = "rate_limited",
  
    // Database Errors
    DATABASE_ERROR = "database_error",
    DATABASE_CONFLICT = "database_conflict",
    RESOURCE_NOT_FOUND = "resource_not_found",
  
    // External Errors
    EXTERNAL_SERVICE_ERROR = "external_service_error",
  
    // Generic Errors
    UNKNOWN_ERROR = "unknown_error",
  }
  
  // Base application error class
  export class AppError extends Error {
    public readonly code: AppErrorCode;
    public readonly category: ErrorCategory;
    public readonly severity: ErrorSeverity;
    public readonly userMessage: string;
    public readonly canRetry: boolean;
    public readonly metadata?: Record<string, any>;
    public readonly timestamp: Date;
  
    constructor(
      code: AppErrorCode,
      category: ErrorCategory,
      severity: ErrorSeverity,
      userMessage: string,
      canRetry: boolean = false,
      metadata?: Record<string, any>,
    ) {
      super(userMessage);
      this.name = "AppError";
      this.code = code;
      this.category = category;
      this.severity = severity;
      this.userMessage = userMessage;
      this.canRetry = canRetry;
      this.metadata = metadata;
      this.timestamp = new Date();
    }
  }
  
  
  export class NetworkError extends AppError {
    constructor(message: string, canRetry: boolean = true, metadata?: Record<string, any>) {
      super(
        AppErrorCode.NETWORK_SERVER_ERROR,
        ErrorCategory.NETWORK,
        ErrorSeverity.HIGH,
        message,
        canRetry,
        metadata,
      );
      this.name = "NetworkError";
    }
  }
  
  export class AuthenticationError extends AppError {
    constructor(code: AppErrorCode, message: string, metadata?: Record<string, any>) {
      super(
        code,
        ErrorCategory.AUTHENTICATION,
        ErrorSeverity.HIGH,
        message,
        false,
        metadata,
      );
      this.name = "AuthenticationError";
    }
  }
  
  export class AuthorizationError extends AppError {
    constructor(message: string, metadata?: Record<string, any>) {
      super(
        AppErrorCode.PERMISSION_DENIED,
        ErrorCategory.AUTHORIZATION,
        ErrorSeverity.HIGH,
        message,
        false,
        metadata,
      );
      this.name = "AuthorizationError";
    }
  }
  
  export class ValidationError extends AppError {
    constructor(message: string, metadata?: Record<string, any>) {
      super(
        AppErrorCode.VALIDATION_FAILED,
        ErrorCategory.VALIDATION,
        ErrorSeverity.MEDIUM,
        message,
        false,
        metadata,
      );
      this.name = "ValidationError";
    }
  }
  
  export class NotFoundError extends AppError {
    constructor(message: string, metadata?: Record<string, any>) {
      super(
        AppErrorCode.RESOURCE_NOT_FOUND,
        ErrorCategory.BUSINESS_LOGIC,
        ErrorSeverity.MEDIUM,
        message,
        false,
        metadata,
      );
      this.name = "NotFoundError";
    }
  }
  
  export class ConflictError extends AppError {
    constructor(message: string, metadata?: Record<string, any>) {
      super(
        AppErrorCode.DATABASE_CONFLICT,
        ErrorCategory.DATABASE,
        ErrorSeverity.MEDIUM,
        message,
        false,
        metadata,
      );
      this.name = "ConflictError";
    }
  }
  
  export class DatabaseError extends AppError {
    constructor(message: string, metadata?: Record<string, any>) {
      super(
        AppErrorCode.DATABASE_ERROR,
        ErrorCategory.DATABASE,
        ErrorSeverity.HIGH,
        message,
        true,
        metadata,
      );
      this.name = "DatabaseError";
    }
  }
  
  export class ExternalApiError extends AppError {
    constructor(message: string, metadata?: Record<string, any>) {
      super(
        AppErrorCode.EXTERNAL_SERVICE_ERROR,
        ErrorCategory.EXTERNAL_API,
        ErrorSeverity.HIGH,
        message,
        true,
        metadata,
      );
      this.name = "ExternalApiError";
    }
  }