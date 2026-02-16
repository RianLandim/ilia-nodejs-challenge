import {
  PipeTransform,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { ZodSchema, ZodError } from 'zod';
import { status } from '@grpc/grpc-js';

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: unknown, metadata: ArgumentMetadata) {
    const result = this.schema.safeParse(value);

    if (!result.success) {
      const formattedErrors = this.formatZodErrors(result.error);
      const isHttp = ['body', 'query', 'param'].includes(metadata.type);

      if (isHttp) {
        throw new BadRequestException({
          statusCode: 400,
          message: formattedErrors,
          error: 'Validation Error',
        });
      }

      throw new RpcException({
        code: status.INVALID_ARGUMENT,
        message: formattedErrors,
      });
    }

    return result.data;
  }

  private formatZodErrors(error: ZodError): string {
    return error.issues
      .map((err) => {
        const path = err.path.length > 0 ? `[${err.path.join('.')}]` : '';
        return `${path} ${err.message}`;
      })
      .join('; ');
  }
}
