import {model} from "mongoose";
import transferVerificationSchema, { TransferType } from "../schemas/transferRequestVerification";

export interface TransferVerificationParams{
    transferRequestId: String;
    approved: Boolean;
    type: TransferType;
    transferData: any;
    key?: String;
}

export default model<TransferVerificationParams>("transferVerificationSchema", transferVerificationSchema);