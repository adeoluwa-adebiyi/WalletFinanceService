import { Schema, SchemaTypes } from "mongoose";
import eventBus from "../../bus/event-bus";
import { sendMessage } from "../../helpers/messaging";
import { TransferVerificationMessage } from "../../processors/messages/TransferVerificationMessage";
import { WALLET_TRX_EVENTS_TOPIC } from "../../topics";
import { createMessage } from "../../utils";
import { TransferVerificationParams } from "../models/transferRequestVerification";
import key from "./key";

export const transferTypes = ["wallet-transfer", "bank-transfer", "fx-bank-transfer"];
export type TransferType = "wallet-transfer"|"bank-transfer"|"fx-transfer";

const transferVerificationSchema = new Schema({
    ...key,
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
    const transferVerfificationMsg = createMessage<TransferVerificationMessage, String>(TransferVerificationMessage,{
        transferRequestId: data.transferRequestId,
        type: data.type,
        transferData: data.transferData,
        approved: data.approved
    }, data.key);
    console.log("KEY:");
    console.log(transferVerfificationMsg.key);
    await sendMessage(await eventBus, WALLET_TRX_EVENTS_TOPIC, transferVerfificationMsg);
    data && next();
});

export default transferVerificationSchema;