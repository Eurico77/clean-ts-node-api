import { DbAddAccount } from './db-add-account';
import {
  AddAccountData,
  AccountModel,
  Encrypter,
  AddAccountRepository,
} from './db-add-account-protocols';

interface SutTypes {
  sut: DbAddAccount;
  addAccountRepositoryStub: AddAccountRepository;
  encrypterStub: Encrypter;
}

const makeFakeAccountData = (): AccountModel => ({
  id: 'valid_id',
  name: 'any_name',
  email: 'valid_email@mail.com',
  password: 'hash_password',
});

const makeAddAccountRepositoryStub = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add(accountData: AddAccountData): Promise<AccountModel> {
      return new Promise((resolve) => resolve(makeFakeAccountData()));
    }
  }
  return new AddAccountRepositoryStub();
};

const makeEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt(password: string): Promise<string> {
      return new Promise((resolve) => resolve('hashed_password'));
    }
  }
  return new EncrypterStub();
};

const makeSut = (): SutTypes => {
  const addAccountRepositoryStub = makeAddAccountRepositoryStub();
  const encrypterStub = makeEncrypter();
  const sut = new DbAddAccount(encrypterStub, addAccountRepositoryStub);
  return {
    sut,
    encrypterStub,
    addAccountRepositoryStub,
  };
};

describe('DbAddAccount UseCase', () => {
  it('Should call Encrypter with correct password', async () => {
    const { sut, encrypterStub } = makeSut();
    const encrypterSpy = jest.spyOn(encrypterStub, 'encrypt');

    const accountData = {
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'valid_password',
    };

    await sut.add(accountData);
    expect(encrypterSpy).toHaveBeenCalledWith('valid_password');
    expect(encrypterSpy).toHaveBeenCalledTimes(1);
  });

  it('Should throw if encrypter throws', async () => {
    const { sut, encrypterStub } = makeSut();
    jest
      .spyOn(encrypterStub, 'encrypt')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error())),
      );

    const accountData = {
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'valid_password',
    };

    const accountPromise = sut.add(accountData);
    expect(accountPromise).rejects.toThrow();
  });

  it('Should call addAccountRepository with correct values', async () => {
    const { sut, addAccountRepositoryStub } = makeSut();
    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add');

    const accountData = {
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'valid_password',
    };

    await sut.add(accountData);
    expect(addSpy).toHaveBeenCalledWith({
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'hashed_password',
    });
    expect(addSpy).toHaveBeenCalledTimes(1);
  });

  it('Should throw if addAccountRepository throws', async () => {
    const { sut, addAccountRepositoryStub } = makeSut();
    jest
      .spyOn(addAccountRepositoryStub, 'add')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error())),
      );

    const accountData = {
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'valid_password',
    };

    const accountPromise = sut.add(accountData);
    expect(accountPromise).rejects.toThrow();
  });

  it('Should return an account with on success', async () => {
    const { sut } = makeSut();

    const accountData = {
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'valid_password',
    };

    const account = await sut.add(accountData);
    expect(account).toEqual(makeFakeAccountData());
    expect(account).toHaveProperty('id');
    expect(account).toHaveProperty('name');
    expect(account).toHaveProperty('email');
    expect(account).toHaveProperty('password');
  });
});
