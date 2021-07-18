import { model } from "mongoose";
import accountSchema from "../schemas/account";

export interface Account{
    id: String;
    userId: String;
    walletId: String;
    balance: Number;
    description: String;
}

export default model<Account>("account", accountSchema);