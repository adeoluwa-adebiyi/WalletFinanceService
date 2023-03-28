import { Document } from "mongoose";
import { WalletTransferRequest } from "../../db/models/walletTransfer";
import { BankPayoutParams } from "../../processors/messages/bank-payout-msg";
import { WalletTransferMoneyMessageParams } from "../../processors/messages/wallet-transfer-money-message";

export interface PagedData<T>{
    data: Array<T>;
    page: Number;
}

export class TransferDocument extends Document<WalletTransferMoneyMessageParams> implements WalletTransferMoneyMessageParams{
    currency: string;
    sourceWalletId: string;
    destinationWalletId: string;
    amount: number;
    requestId: string;
}

export interface ITransferRequestRepo{
    createWalletTransferRequest(request: WalletTransferRequest): Promise<any>;
    createBankTransferRequest(request: BankPayoutParams): Promise<any>;
    getTransferRequest(requestId: String): Promise<any>;
    getUserInflowPayments(page: Number, userId: Number, limit: Number): Promise<PagedData<any>>;
}