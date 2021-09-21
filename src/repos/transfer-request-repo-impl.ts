import { Document } from "mongoose";
import Transfer from "../db/models/transfer";
import walletTransfer, { WalletTransferRequest } from "../db/models/walletTransfer";
import bankTransfer from "../db/models/bankTransfer";
import { BankPayoutParams } from "../processors/messages/bank-payout-msg";
import { WalletTransferMoneyMessageParams } from "../processors/messages/wallet-transfer-money-message";
import { ITransferRequestRepo, TransferDocument } from "./interfaces/transfer-request-repo";
import TransferVerificationRepo from "./transfer-request-verfication-repo";

export class TransferRequestRepo implements ITransferRequestRepo{

    async createBankTransferRequest(request: BankPayoutParams): Promise<any> {
        return await new bankTransfer(request).save();
    }

    async getTransferRequest(requestId: String): Promise<any> {
        return await Transfer.findOne({requestId});
    }

    async createWalletTransferRequest(request: WalletTransferRequest): Promise<any> {
        return await new walletTransfer(request).save();
    }

}

export default new TransferRequestRepo();