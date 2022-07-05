import { AccountModel } from '../entities/account';

export interface AddAccountParams {
  name: string;
  email: string;
  password: string;
}

export interface AddAccount {
  add(account: AddAccountParams): AccountModel;
}
