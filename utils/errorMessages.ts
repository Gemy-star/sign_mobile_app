// utils/errorMessages.ts
// Centralized error code to user-friendly message mapping

export const ERROR_CODES = {
  // Authentication errors
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  UNAUTHORIZED: 'UNAUTHORIZED',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',

  // Permission errors
  FORBIDDEN: 'FORBIDDEN',
  SUBSCRIPTION_REQUIRED: 'SUBSCRIPTION_REQUIRED',

  // Resource errors
  NOT_FOUND: 'NOT_FOUND',

  // Validation errors
  VALIDATION_ERROR: 'VALIDATION_ERROR',

  // Rate limiting
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',

  // Server errors
  SERVER_ERROR: 'SERVER_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR',

  // Unknown errors
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
} as const;

export type ErrorCode = typeof ERROR_CODES[keyof typeof ERROR_CODES];

export const ERROR_MESSAGES: Record<string, { en: string; ar: string }> = {
  [ERROR_CODES.INVALID_CREDENTIALS]: {
    en: 'Invalid email or password',
    ar: 'البريد الإلكتروني أو كلمة المرور غير صحيحة',
  },
  [ERROR_CODES.UNAUTHORIZED]: {
    en: 'Please log in to continue',
    ar: 'الرجاء تسجيل الدخول للمتابعة',
  },
  [ERROR_CODES.TOKEN_EXPIRED]: {
    en: 'Your session has expired. Please log in again.',
    ar: 'انتهت صلاحية الجلسة. الرجاء تسجيل الدخول مرة أخرى.',
  },
  [ERROR_CODES.FORBIDDEN]: {
    en: "You don't have permission to access this resource",
    ar: 'ليس لديك إذن للوصول إلى هذا المورد',
  },
  [ERROR_CODES.SUBSCRIPTION_REQUIRED]: {
    en: 'Active subscription required to access this feature',
    ar: 'يتطلب اشتراك نشط للوصول إلى هذه الميزة',
  },
  [ERROR_CODES.NOT_FOUND]: {
    en: 'Resource not found',
    ar: 'المورد غير موجود',
  },
  [ERROR_CODES.VALIDATION_ERROR]: {
    en: 'Please check your input and try again',
    ar: 'الرجاء التحقق من المدخلات والمحاولة مرة أخرى',
  },
  [ERROR_CODES.RATE_LIMIT_EXCEEDED]: {
    en: 'Too many requests. Please try again later.',
    ar: 'طلبات كثيرة جداً. الرجاء المحاولة لاحقاً.',
  },
  [ERROR_CODES.SERVER_ERROR]: {
    en: 'Something went wrong. Please try again later.',
    ar: 'حدث خطأ ما. الرجاء المحاولة لاحقاً.',
  },
  [ERROR_CODES.NETWORK_ERROR]: {
    en: 'Network error. Please check your connection.',
    ar: 'خطأ في الشبكة. الرجاء التحقق من الاتصال.',
  },
  [ERROR_CODES.UNKNOWN_ERROR]: {
    en: 'An unexpected error occurred',
    ar: 'حدث خطأ غير متوقع',
  },
};

export const getErrorMessage = (
  code?: string,
  language: 'en' | 'ar' = 'en'
): string => {
  if (!code) {
    return language === 'ar'
      ? 'حدث خطأ غير متوقع'
      : 'An unexpected error occurred';
  }

  const messages = ERROR_MESSAGES[code];
  if (messages) {
    return messages[language];
  }

  // Return the code itself if no mapping exists
  return code;
};

export const getHttpErrorCode = (status: number): string => {
  switch (status) {
    case 400:
      return ERROR_CODES.VALIDATION_ERROR;
    case 401:
      return ERROR_CODES.UNAUTHORIZED;
    case 403:
      return ERROR_CODES.FORBIDDEN;
    case 404:
      return ERROR_CODES.NOT_FOUND;
    case 422:
      return ERROR_CODES.VALIDATION_ERROR;
    case 429:
      return ERROR_CODES.RATE_LIMIT_EXCEEDED;
    case 500:
    case 502:
    case 503:
    case 504:
      return ERROR_CODES.SERVER_ERROR;
    default:
      return ERROR_CODES.SERVER_ERROR;
  }
};

export class ApiError extends Error {
  constructor(
    message: string,
    public code?: string,
    public status?: number,
    public details?: Record<string, any>
  ) {
    super(message);
    this.name = 'ApiError';
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      status: this.status,
      details: this.details,
    };
  }
}
