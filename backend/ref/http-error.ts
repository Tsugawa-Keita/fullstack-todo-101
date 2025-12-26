export const HTTP_STATUS = {
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export type HttpStatus = typeof HTTP_STATUS[keyof typeof HTTP_STATUS];

const DEFAULT_MESSAGE: Record<HttpStatus, string> = {
  [HTTP_STATUS.BAD_REQUEST]: "Bad Request",
  [HTTP_STATUS.NOT_FOUND]: "Not Found",
  [HTTP_STATUS.INTERNAL_SERVER_ERROR]: "Internal Server Error",
};

export class HttpError extends Error {
  readonly status: HttpStatus;
  readonly code?: string;

  constructor(status: HttpStatus, message?: string, code?: string) {
    super(message ?? DEFAULT_MESSAGE[status]);
    this.name = "HttpError";
    this.status = status;
    if (code !== undefined) this.code = code;

    // 変換環境でも instanceof が壊れにくい保険
    Object.setPrototypeOf(this, new.target.prototype);

    // stackの整形
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
