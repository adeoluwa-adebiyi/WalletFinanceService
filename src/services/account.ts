import { Account } from "../db/models/account";
import accountRepo from "../repos/account";

export interface AccountService{
    processCreditAccount(walletId: String, amount: Number): Promise<void>;
    processDebitAccount(walletId: String, amount: Number): Promise<void>;
    processWalletCreated(walletId: String, userId: String): Promise<void>;

}

export class AccountServiceImpl implements AccountService{

    async processWalletCreated(walletId: String, userId: String): Promise<void> {
        await accountRepo.createAccount({
            walletId,
            userId
        });
    }

    async processCreditAccount(walletId: String, amount: Number): Promise<void> {
        const account: Account = await accountRepo.getAccount(walletId);
        account.balance = new Number((account.balance as number)+(amount as number));
        await accountRepo.updateAccount(account);
    }

    processDebitAccount(walletId: String, amount: Number): Promise<void> {
        throw new Error("Method not implemented.");
    }

}

export default new AccountServiceImpl();