import { Schema, SchemaTypes } from "mongoose";
import eventBus from "../../bus/event-bus";
import { sendMessage } from "../../helpers/messaging";
import { TransferVerificationMessage } from "../../processors/messages/TransferVerificationMessage";
import { WALLET_TRX_EVENTS_TOPIC } from "../../topics";
import { TransferVerificationParams } from "../models/transferRequestVerification";

export const transferTypes = ["wallet-transfer", "bank-transfer", "fx-bank-transfer"];
export type TransferType = "wallet-transfer"|"bank-transfer"|"fx-transfer";

const transferVerificationSchema = new Schema({
    transferRequestId: {
        type: String,
        required: true
    },
    approved: {
        type: Boolean,
        required: true,
        default: false
    },
    type: {
        type: String,
        enum: transferTypes,
        required: true
    },
    transferData:{
        type: Object,
        required: true
    }
},{
    timestamps: true
});

transferVerificationSchema.post<TransferVerificationParams>(["save", "updateOne"], async(data: TransferVerificationParams, next: Function)=>{
    console.log("REPR:");
    console.log(data);
    await sendMessage(await eventBus, WALLET_TRX_EVENTS_TOPIC, new TransferVerificationMessage({
        transferRequestId: data.transferRequestId,
        type: data.type,
        transferData: data.transferData,
        approved: data.approved
    }));
    data && next();
});

export default transferVerificationSchema;