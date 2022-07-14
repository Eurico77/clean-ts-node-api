import {
  AddAccount,
  AccountModel,
  AddAccountData,
  Encrypter } from './db-add-account-protocols';

export class DbAddAccount implements AddAccount {
  constructor(private readonly encrypter: Encrypter) { }

  async add(accountData: AddAccountData): Promise<AccountModel> {
    await this.encrypter.encrypt(accountData.password);
    return new Promise((resolve) => resolve(null));
  }
}
