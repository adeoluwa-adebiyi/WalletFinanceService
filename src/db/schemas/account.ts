import { Schema } from "mongoose";
import * as uuid from "uuid";
import eventBus from "../../bus/event-bus";
import { sendMessage } from "../../helpers/messaging";
import { UserAccountBalance } from "../../processors/messages/UserAccountBalance";
import { WALLET_TRX_EVENTS_TOPIC } from "../../services/account";
import { Account } from "../models/account";

const accountSchema = new Schema({
    id: {
        type: String,
        unique: true,
        default: () => uuid.v4()
    },
    userId:{
        type: String,
        required: [true, "userId is required"]
    },
    walletId: {
        type: String,
        required: [true, "walletId is required"]
    },
    balance: {
        type: Number,
        default: 0.00
    },
    description: {
        type: String
    }

},{
    timestamps: true
});

accountSchema.post<Account>(["save","updateOne"], async(account: Account, next) => {
    console.log("ACCOUNT:");
    console.log(account);
    // await sendMessage(await eventBus, WALLET_TRX_EVENTS_TOPIC, new UserAccountBalance({
    //     balance: parseFloat(account.balance.toString()),
    //     userId: account.userId,
    //     walletId: account.walletId,
    //     time: account.createdAt
    // }));
    account && next();
})

export default accountSchema;
