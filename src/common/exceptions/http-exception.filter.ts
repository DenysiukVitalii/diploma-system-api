import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus, Logger,
} from '@nestjs/common';
import { MessageCodeError } from './message-code-error';

@Catch(MessageCodeError, HttpException, Error)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    if (exception instanceof MessageCodeError) {
      return response.status(exception.httpStatus).send(exception);
    } else {
      Logger.log(exception);
      return response.status(exception.status).send(exception.response);
    }
  }
}
