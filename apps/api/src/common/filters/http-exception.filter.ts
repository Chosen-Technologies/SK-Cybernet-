import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { Prisma } from '@prisma/client';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] | object = 'Internal server error';
    let error = 'Internal Server Error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const resContent = exception.getResponse();
      if (typeof resContent === 'object') {
        message = (resContent as any).message || resContent;
        error = (resContent as any).error || error;
      } else {
        message = resContent;
      }
    } else if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      // Prisma error mapping
      switch (exception.code) {
        case 'P2002': // Unique constraint violation
          status = HttpStatus.CONFLICT;
          message = `Unique constraint violation on field: ${(exception.meta?.target as string[])?.join(', ') || 'unknown'}`;
          error = 'Conflict';
          break;
        case 'P2025': // Record not found
          status = HttpStatus.NOT_FOUND;
          message = 'Record not found';
          error = 'Not Found';
          break;
        case 'P2003': // Foreign key constraint violation
          status = HttpStatus.BAD_REQUEST;
          message = `Foreign key constraint failed on field: ${exception.meta?.field_name || 'unknown'}`;
          error = 'Bad Request';
          break;
        default:
          status = HttpStatus.BAD_REQUEST;
          message = 'Database error occurred';
          error = 'Bad Request';
          break;
      }
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    response.status(status).json({
      statusCode: status,
      message: typeof message === 'string' ? [message] : (Array.isArray(message) ? message : [message]),
      error,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
