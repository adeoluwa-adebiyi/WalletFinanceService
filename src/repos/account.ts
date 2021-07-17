import { Account } from "../db/models/account";
import accountModel from "../db/models/account";

export interface AccountRepo{
    getAccount(walletId: String): Promise<Account>;
}

export class AccountRepoImpl implements AccountRepo{

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

}