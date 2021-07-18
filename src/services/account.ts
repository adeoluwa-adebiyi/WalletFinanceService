import { Account } from "../db/models/account";
import accountRepo from "../repos/account";

export interface AccountService{
    processCreditAccount(walletId: String, amount: Number): Promise<void>;
    processDebitAccount(walletId: String, amount: Number): Promise<void>;
}

export class AccountServiceImpl implements AccountService{

    async processCreditAccount(walletId: String, amount: Number): Promise<void> {
        const account: Account = await accountRepo.getAccount(walletId);
        await accountRepo.updateAccount({...account, balance: new Number(account.balance.toPrecision()+amount.toPrecision())})
    }

    processDebitAccount(walletId: String, amount: Number): Promise<void> {
        throw new Error("Method not implemented.");
    }

}

export default new AccountServiceImpl();