import {
  BaseResponseDto,
  PaginatedResponseDto,
} from '../dto/base-response.dto';

export class ResponseUtil {
  static success<T>(
    data: T,
    message = 'Operation successful',
  ): BaseResponseDto<T> {
    return BaseResponseDto.success(data, message);
  }

  static error(message: string, error?: string): BaseResponseDto {
    return BaseResponseDto.error(message, error);
  }

  static paginated<T>(
    data: T[],
    page: number,
    limit: number,
    total: number,
    message = 'Data retrieved successfully',
  ): PaginatedResponseDto<T> {
    return new PaginatedResponseDto(data, page, limit, total, message);
  }

  static created<T>(
    data: T,
    message = 'Resource created successfully',
  ): BaseResponseDto<T> {
    return BaseResponseDto.success(data, message);
  }

  static updated<T>(
    data: T,
    message = 'Resource updated successfully',
  ): BaseResponseDto<T> {
    return BaseResponseDto.success(data, message);
  }

  static deleted(
    message = 'Resource deleted successfully',
  ): BaseResponseDto<null> {
    return BaseResponseDto.success(null, message);
  }
}
