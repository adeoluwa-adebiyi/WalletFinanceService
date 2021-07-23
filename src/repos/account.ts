import { Account } from "../db/models/account";
import accountModel from "../db/models/account";

export interface AccountRepo{
    getAccount(walletId: String): Promise<Account>;
    updateAccount(account: Account): Promise<Account>;
    createAccount(account: Partial<Account>): Promise<Account>;
}

export class AccountRepoImpl implements AccountRepo{
    async createAccount(account: Partial<Account>): Promise<Account> {
        return await new accountModel({...account}).save();
    }
    
    async updateAccount(account: Account): Promise<Account> {
        const acc = await this.getAccount(account.walletId);
        acc.balance = account.balance;
        return await accountModel.findOneAndUpdate(acc);
    }

    async getAccount(walletId: String): Promise<Account> {
        try{
            const account: Account = await accountModel.findOne({walletId});
            if(!account){
                throw Error("wallet account does not exist");
            }
            console.log("FETCHED_WALLET_ID: "+account.walletId);
            return account;
        }catch(e){
            throw Error("failed to fetch account");
        }
    }

    async

}

export default new AccountRepoImpl();