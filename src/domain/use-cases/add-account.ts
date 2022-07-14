import { AccountModel } from '../entities/account';

export interface AddAccountData {
  name: string;
  email: string;
  password: string;
}

export interface AddAccount {
  add(account: AddAccountData): Promise<AccountModel>;
}
