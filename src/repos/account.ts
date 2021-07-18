import { Account } from "../db/models/account";
import accountModel from "../db/models/account";

export interface AccountRepo{
    getAccount(walletId: String): Promise<Account>;
    updateAccount(account: Account): Promise<Account>;
}

export class AccountRepoImpl implements AccountRepo{
    
    async updateAccount(account: Account): Promise<Account> {
        return await accountModel.findOneAndUpdate({walletId: account.walletId}, {...account});
    }

    async getAccount(walletId: String): Promise<Account> {
        try{
            const account: Account = await accountModel.findOne({walletId});
            if(!account){
                throw Error("wallet account does not exist");
            }
            return account;
        }catch(e){
            throw Error("failed to fetch account");
        }
    }

    async

}

export default new AccountRepoImpl();