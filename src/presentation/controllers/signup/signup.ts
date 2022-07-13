import { MissingParamError, InvalidParamError } from '../../errors';
import { badRequest, serverError, ok } from '../../helpers/http-helper';
import {
  EmailValidator,
  Controller,
  HttpRequest,
  HttpResponse,
  AddAccount,
} from './signup-protocols';

export class SignUpController implements Controller {
  constructor(
    private readonly emailValidation: EmailValidator,
    private readonly addAccount: AddAccount,
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFields = [
        'name',
        'email',
        'password',
        'passwordConfirmation',
      ];
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field));
        }
      }
      const { name, email, password, passwordConfirmation } = httpRequest.body;
      if (password !== passwordConfirmation) {
        return badRequest(new InvalidParamError('passwordConfirmation'));
      }
      const isValid = this.emailValidation.isValid(email);
      if (!isValid) {
        return badRequest(new InvalidParamError('email'));
      }
      const account = await this.addAccount.add({
        name,
        email,
        password,
      });
      return ok(account);
    } catch (error) {
      console.error(error);
      return serverError();
    }
  }
}
