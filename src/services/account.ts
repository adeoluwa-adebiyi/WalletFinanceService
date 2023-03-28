import eventBus from "../bus/event-bus";
import { Account } from "../db/models/account";
import { sendMessage } from "../helpers/messaging";
import { UserAccountBalance } from "../processors/messages/UserAccountBalance";
import { WalletCreditMessage } from "../processors/messages/WalletCreditMessage";
import accountRepo from "../repos/account";

export const WALLET_TRX_EVENTS_TOPIC = "public.wallet.trx";


export interface AccountBalanceResponse{
    walletId: String;
    balance: Number;
}

export interface AccountService{
    processCreditAccount(walletId: String, amount: Number): Promise<void>;
    processDebitAccount(walletId: String, amount: Number): Promise<void>;
    processWalletCreated(walletId: String, userId: String): Promise<void>;
    getAccountBalance(walletId: String, userId: String): Promise<AccountBalanceResponse>;

}

export class AccountServiceImpl implements AccountService{

    async getAccountBalance(walletId: String, userId: String): Promise<AccountBalanceResponse> {
        const account:Account = await accountRepo.getUserAccount(walletId, userId);
        return <AccountBalanceResponse>{
            walletId,
            balance: account.balance
        }
    }

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
        await sendMessage(await eventBus, WALLET_TRX_EVENTS_TOPIC, new UserAccountBalance({
            balance: parseFloat(account.balance.toString()),
            userId: account.userId,
            walletId: account.walletId,
            time: account.createdAt
        }));
    }

    processDebitAccount(walletId: String, amount: Number): Promise<void> {
        throw new Error("Method not implemented.");
    }

}

export default new AccountServiceImpl();