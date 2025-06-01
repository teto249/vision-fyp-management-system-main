export enum ErrorCode {
  AUTH_ERROR = 'AUTH_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  PERMISSION_ERROR = 'PERMISSION_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  UPLOAD_ERROR = 'UPLOAD_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

export interface AppError {
  message: string;
  code: ErrorCode;
  retry?: boolean;
  details?: unknown;
}

export class DocumentError extends Error {
  code: ErrorCode;
  retry: boolean;
  details?: unknown;

  constructor(message: string, code: ErrorCode, retry = true, details?: unknown) {
    super(message);
    this.code = code;
    this.retry = retry;
    this.details = details;
    this.name = 'DocumentError';
  }
}