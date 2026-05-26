export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  meta?: {
    total: number;
    page: number;
    [key: string]: unknown;
  };
}

export interface ApiErrorResponse {
  success: false;
  error: string;
  code?: string;
  details?: unknown;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

export interface JobProgressPayload {
  jobId: string;
  step: string;
  percent: number;
}

export interface JobStatusPayload {
  jobId: string;
  assignmentId: string;
}

export interface JobFailedPayload {
  jobId: string;
  error: string;
}
