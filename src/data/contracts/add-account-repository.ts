import { AccountModel } from '../../domain/entities/account';
import { AddAccountData } from '../../domain/use-cases/add-account';

export interface AddAccountRepository {
  add(accountData: AddAccountData): Promise<AccountModel>;
}
