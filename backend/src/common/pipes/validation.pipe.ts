import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class CustomValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    const object = plainToInstance(metatype, value);
    const errors = await validate(object);

    if (errors.length > 0) {
      const errorMessages = errors.reduce(
        (acc, error) => {
          const constraints = error.constraints;
          if (constraints) {
            // Get the first (most relevant) constraint message
            const firstConstraintKey = Object.keys(constraints)[0];
            acc[error.property] = constraints[firstConstraintKey];
          }
          return acc;
        },
        {} as Record<string, string>,
      );

      throw new BadRequestException({
        success: false,
        message: 'Validation failed',
        errors: errorMessages,
      });
    }
    return value;
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
