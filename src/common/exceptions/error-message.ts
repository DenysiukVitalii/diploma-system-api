import { HttpStatus } from '@nestjs/common';
import { IErrorMessages } from './error-message.interface';

export const errorMessagesConfig: { [messageCode: string]: IErrorMessages } = {
  'owner:show:missingId': {
    type: 'BadRequest',
    httpStatus: HttpStatus.BAD_REQUEST,
    errorMessage: 'Unable to find the owner caused by missing information.',
    userMessage: 'Impossible dto find the owner by id.',
  },
};
