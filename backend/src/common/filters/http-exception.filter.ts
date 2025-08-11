import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiResponseDto } from '../dto/response.dto';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    const errorResponse = exception.getResponse();
    const errorMessage = typeof errorResponse === 'string' 
      ? errorResponse 
      : (errorResponse as any)?.message || 'Internal server error';

    const apiResponse = new ApiResponseDto(
      false,
      'Request failed',
      null,
      Array.isArray(errorMessage) ? errorMessage.join(', ') : errorMessage,
    );

    response.status(status).json(apiResponse);
  }
}