import {
  EmailValidator, Controller, HttpRequest, HttpResponse,
} from '../contracts';
import { MissingParamError, InvalidParamError } from '../errors';
import { badRequest } from '../helpers/http-helper';

export class SignUpController implements Controller {
  constructor(private readonly emailValidation: EmailValidator) {}

  handle(httpRequest: HttpRequest): HttpResponse {
    const requiredFields = ['name', 'email', 'password', 'passwordConfirmation'];
    for (const field of requiredFields) {
      if (!httpRequest.body[field]) {
        return badRequest(new MissingParamError(field));
      }
      const isValid = this.emailValidation.isValid(httpRequest.body.email);
      if (!isValid) {
        return badRequest(new InvalidParamError('email'));
      }
    }
  }
}
