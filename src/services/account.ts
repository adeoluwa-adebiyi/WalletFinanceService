import accountRepo from "../repos/account";

export interface AccountService{
    processCreditAccount(walletId: String, amount: Number): Promise<void>;
    processDebitAccount(walletId: String, amount: Number): Promise<void>;
}

export class AccountServiceImpl implements AccountService{

    processCreditAccount(walletId: String, amount: Number): Promise<void> {
        throw new Error("Method not implemented.");
    }

    processDebitAccount(walletId: String, amount: Number): Promise<void> {
        throw new Error("Method not implemented.");
    }

}

export default new AccountServiceImpl();