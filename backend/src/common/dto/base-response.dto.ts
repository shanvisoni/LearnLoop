export class BaseResponseDto<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  timestamp: string;
  path?: string;

  constructor(success: boolean, message: string, data?: T, error?: string) {
    this.success = success;
    this.message = message;
    this.data = data;
    this.error = error;
    this.timestamp = new Date().toISOString();
  }

  static success<T>(
    data: T,
    message = 'Operation successful',
  ): BaseResponseDto<T> {
    return new BaseResponseDto(true, message, data);
  }

  static error(message: string, error?: string): BaseResponseDto {
    return new BaseResponseDto(false, message, undefined, error);
  }
}

export class PaginatedResponseDto<T> extends BaseResponseDto<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };

  constructor(
    data: T[],
    page: number,
    limit: number,
    total: number,
    message = 'Data retrieved successfully',
  ) {
    super(true, message, data);
    this.pagination = {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }
}

export default {
  BaseResponseDto,
  PaginatedResponseDto,
};
