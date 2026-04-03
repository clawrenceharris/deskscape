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
  
    // Network Errors
    NETWORK_OFFLINE = "network_offline",
    NETWORK_TIMEOUT = "network_timeout",
    NETWORK_SERVER_ERROR = "network_server_error",
  
    // Generic Errors
    UNKNOWN_ERROR = "unknown_error",
    PERMISSION_DENIED = "permission_denied",
    RESOURCE_NOT_FOUND = "resource_not_found",
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
  
      metadata?: Record<string, any>
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
    constructor(message: string, canRetry: boolean = true) {
      super(
        AppErrorCode.NETWORK_SERVER_ERROR,
        ErrorCategory.NETWORK,
        ErrorSeverity.HIGH,
        message,
        canRetry
      );
      this.name = "NetworkError";
    }
  }
  
  export class AuthenticationError extends AppError {
    constructor(code: AppErrorCode, message: string) {
      super(
        code,
        ErrorCategory.AUTHENTICATION,
        ErrorSeverity.HIGH,
        message,
        false
      );
      this.name = "AuthenticationError";
    }
  }