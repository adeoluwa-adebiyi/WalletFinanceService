import { WalletTransferRequest } from "../db/models/walletTransfer";
import { WalletTransferMoneyMessage } from "../processors/messages/wallet-transfer-money-message";
import transferRequestRepoImpl, { TransferRequestRepo } from "../repos/transfer-request-repo-impl";
import walletTransfer from "../db/schemas/walletTransfer";
import AccountRepo from "../repos/account";
import { Account } from "../db/models/account";
import transferRequestVerficationRepo from "../repos/transfer-request-verfication-repo";
import { TransferVerificationParams } from "../db/models/transferRequestVerification";
import { TransferCompletedMessage } from "../processors/messages/TransferCompletedMessage";
import { BankPayoutMessage, BankPayoutParams } from "../processors/messages/bank-payout-msg";

export type TransferRequestMessage =  WalletTransferMoneyMessage;

export interface TransferService{
    processTransferRequestMessage(message: TransferRequestMessage): Promise<void>;
    verifyWalletTransferRequest(request: WalletTransferRequest): Promise<any>;
    verifyBankTransferRequest(request: BankPayoutParams): Promise<any>;
    processTransferCompletedMessage(message: TransferCompletedMessage): Promise<void>;
}

const AccountBalanceSatifiedCheck = (account: Account, trxValue: number) => {
    const constraintSatisfied = account.balance >= trxValue;
    // if(!constraintSatisfied){
    //     throw Error("Insuffient balance");
    // }
    return constraintSatisfied;
}

class TransferServiceImpl implements TransferService{

    async verifyBankTransferRequest(request: BankPayoutParams): Promise<any> {
        const { requestId, amount } = request;
        const account = await AccountRepo.getAccount(request.sourceWalletId);
        const satisfied = AccountBalanceSatifiedCheck(account, parseFloat(amount.toFixed()));
        transferRequestVerficationRepo.createTransferRequestVerificationParams(<TransferVerificationParams>{
                transferRequestId: requestId,
                type:"bank-transfer",
                approved: satisfied,
                transferData: request
        });
    }

    async processTransferCompletedMessage(message: TransferCompletedMessage): Promise<void> {
        const { transferRequestId } = message;
        const request = await transferRequestRepoImpl.getTransferRequest(transferRequestId);
        if(request.status !== "success" && request.status !== "failure"){
            const account = await AccountRepo.getAccount(request.sourceWalletId);
            if(request.destinationWalletId){
                const destinationAcct = await AccountRepo.getAccount(request.destinationWalletId);
                destinationAcct.balance = parseFloat(destinationAcct.balance.toFixed()) + request.amount;
                await AccountRepo.updateAccount(destinationAcct);
            }
            account.balance = parseFloat(account.balance.toFixed()) - request.amount;
            await AccountRepo.updateAccount(account);
            request.status = "success";
            await request.save();
        }else{
            throw Error("Duplicate TransferCompleted message");
        }
    }

    async verifyWalletTransferRequest(request: WalletTransferRequest): Promise<any> {
        const { requestId, amount } = request;
        const account = await AccountRepo.getAccount(request.sourceWalletId);
        const satisfied = AccountBalanceSatifiedCheck(account, parseFloat(amount.toFixed()));
        transferRequestVerficationRepo.createTransferRequestVerificationParams(<TransferVerificationParams>{
                transferRequestId: requestId,
                type:"wallet-transfer",
                approved: satisfied,
                transferData: request
        });
    }

    async processTransferRequestMessage(message: TransferRequestMessage): Promise<void> {
        if(message instanceof WalletTransferMoneyMessage){
            const transfer = await transferRequestRepoImpl.createWalletTransferRequest(<WalletTransferRequest>{
                sourceWalletId: message.sourceWalletId,
                destinationWalletId: message.destinationWalletId,
                currency: message.currency,
                requestId: message.requestId,
                amount: message.amount
            });
            await this.verifyWalletTransferRequest(transfer);
        }

        if(message instanceof BankPayoutMessage){
            console.log(`DEBUG: ${{...message}}`);
            const transfer = await transferRequestRepoImpl.createBankTransferRequest(<BankPayoutParams>{
                currency: message.currency,
                requestId: message.requestId,
                amount: message.amount,
                bankId: message.bankId,
                sourceWalletId: message.sourceWalletId,
                destinationAccount: message.destinationAccount,
                description: message.description,
                country: message.country
            });
            await this.verifyBankTransferRequest(transfer);
        }
    }


}

export default new TransferServiceImpl();