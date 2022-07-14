import { AccountModel } from '../../../domain/entities/account';
import { AddAccount, AddAccountParams } from '../../../domain/use-cases/add-account';
import { Encrypter } from '../../contracts/encrypter';

export class DbAddAccount implements AddAccount {
  constructor(private readonly encrypter: Encrypter) { }

  async add(accountData: AddAccountParams): Promise<AccountModel> {
    await this.encrypter.encrypt(accountData.password);
    return new Promise((resolve) => resolve(null));
  }
}
