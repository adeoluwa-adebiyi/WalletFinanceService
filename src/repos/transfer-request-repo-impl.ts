import { Document } from "mongoose";
import { WalletTransferRequest } from "../../../WalletTransferService/src/models/walletTransfer";
import Transfer from "../db/models/transfer";
import walletTransfer from "../db/models/walletTransfer";
import { WalletTransferMoneyMessageParams } from "../processors/messages/wallet-transfer-money-message";
import { ITransferRequestRepo, TransferDocument } from "./interfaces/transfer-request-repo";
import TransferVerificationRepo from "./transfer-request-verfication-repo";

export class TransferRequestRepo implements ITransferRequestRepo{

    async getTransferRequest(requestId: String): Promise<any> {
        return await Transfer.findOne({requestId});
    }

    async createWalletTransferRequest(request: WalletTransferRequest): Promise<any> {
        return await new walletTransfer(request).save();
    }

}

export default new TransferRequestRepo();