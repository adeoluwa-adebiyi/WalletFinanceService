import { Account } from "../db/models/account";
import accountModel from "../db/models/account";

export interface AccountRepo{
    getAccount(walletId: String): Promise<Account>;
    updateAccount(account: Account): Promise<Account>;
    createAccount(account: Partial<Account>): Promise<Account>;
    getUserAccount(walletId: String, userId: String): Promise<any>;
}

export class AccountRepoImpl implements AccountRepo{
    async createAccount(account: Partial<Account>): Promise<Account> {
        return await new accountModel({...account}).save();
    }
    
    async updateAccount(account: Account): Promise<Account> {
        const acc = await this.getAccount(account.walletId);
        acc.balance = account.balance;
        const { _id,id, ...fields } = acc;
        return await accountModel.findOneAndUpdate({id},{...fields});
    }

    async getAccount(walletId: String): Promise<any> {
        try{
            const account = await accountModel.findOne({walletId});
            if(!account){
                throw Error("wallet account does not exist");
            }
            return account;
        }catch(e){
            throw Error("failed to fetch account");
        }
    }

    async getUserAccount(walletId: String, userId: String): Promise<any> {
        try{
            const account = await accountModel.findOne({walletId, userId});
            if(!account){
                throw Error("wallet account does not exist");
            }
            return account;
        }catch(e){
            throw Error("failed to fetch account");
        }
    }

}

export default new AccountRepoImpl();