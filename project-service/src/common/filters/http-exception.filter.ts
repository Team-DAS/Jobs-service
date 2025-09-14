import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    let code: string;
    let message: string;

    if (typeof exceptionResponse === 'string') {
      code = HttpStatus[status] || 'UNKNOWN_ERROR';
      message = exceptionResponse;
    } else if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
      const errorResponse = exceptionResponse as any;
      code = errorResponse.error || HttpStatus[status] || 'UNKNOWN_ERROR';
      message = Array.isArray(errorResponse.message)
        ? errorResponse.message.join(', ')
        : errorResponse.message || exception.message;
    } else {
      code = HttpStatus[status] || 'UNKNOWN_ERROR';
      message = exception.message;
    }

    response.status(status).json({
      code,
      message,
    });
  }
} 