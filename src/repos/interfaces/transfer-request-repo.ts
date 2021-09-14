import { Document } from "mongoose";
import { WalletTransferRequest } from "../../../../WalletTransferService/src/models/walletTransfer";
import { WalletTransferMoneyMessageParams } from "../../../../WalletTransferService/src/processors/messages/wallet-transfer-money-message";
import { BankPayoutParams } from "../../processors/messages/bank-payout-msg";


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
}