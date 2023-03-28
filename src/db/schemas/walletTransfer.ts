import { Schema } from "mongoose";
import eventBus from "../../bus/event-bus";
import { sendMessage } from "../../helpers/messaging";
import { WalletTransferRequest } from "../models/walletTransfer";
import { WALLET_TRX_EVENTS_TOPIC } from "../../topics";

const walletTransferSchema = new Schema({
    sourceWalletId: {
        type: String,
        required: [true, "sourceWalletId cannot be empty"]
    },
    destinationWalletId:{
        type:  String,
        required: [true, "destinationWalletId cannot be empty"]
    }
});

export default walletTransferSchema;