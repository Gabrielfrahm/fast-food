import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

@Catch()
export class EitherExceptionFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();

    const { httpAdapter } = this.httpAdapterHost;
    const error =
      exception instanceof Error
        ? exception.message.includes('body')
          ? JSON.parse(exception.message)
          : exception.message
        : null;

    const httpStatus =
      exception instanceof Error
        ? exception.message.includes('body')
          ? error.code
          : HttpStatus.INTERNAL_SERVER_ERROR
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const responseBody = {
      statusCode: httpStatus,
      timestamp: new Date().toISOString(),
      path: ctx.getRequest().url,
      message:
        exception instanceof Error
          ? exception.message.includes('body')
            ? error.body.message.includes('code')
              ? JSON.parse(error.body.message)
              : error.body.message
            : exception.message
          : exception,
    };

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
