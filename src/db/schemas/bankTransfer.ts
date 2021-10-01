import { Schema } from "mongoose";
import eventBus from "../../bus/event-bus";
import { sendMessage } from "../../helpers/messaging";
import { BankPayoutMessage } from "../../processors/messages/bank-payout-msg";
import { WALLET_TRX_EVENTS_TOPIC } from "../../topics";
import key from "./key";

const bankTransferSchema = new Schema({
    sourceWalletId: {
        type: String,
        required: [true, "sourceWalletId cannot be empty"]
    },
    acctName: {
        type: String,
    },
    bankId: {
        type: String,
        required: [true, "nuban cannot be empty"]
    },

    country: {
        type: String,
        required: [true, "country cannot be empty"]
    },

    destinationAccount:{
        type:  String,
        required: [true, "bankAccount cannot be empty"]
    },
    swiftCode: {
        type: String,
    }
});

export default bankTransferSchema;