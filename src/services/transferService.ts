import { WalletTransferRequest } from "../db/models/walletTransfer";
import { WalletTransferMoneyMessage } from "../processors/messages/wallet-transfer-money-message";
import transferRequestRepoImpl, { TransferRequestRepo } from "../repos/transfer-request-repo-impl";
import walletTransfer from "../db/schemas/walletTransfer";
import AccountRepo from "../repos/account";
import { Account } from "../db/models/account";
import * as mongoose from "mongoose";
import transferRequestVerficationRepo from "../repos/transfer-request-verfication-repo";
import { TransferVerificationParams } from "../db/models/transferRequestVerification";
import { TransferCompletedMessage } from "../processors/messages/TransferCompletedMessage";
import { BankPayoutMessage, BankPayoutParams, FulfillBankPayoutMessage } from "../processors/messages/bank-payout-msg";
import { ReservationParams } from "../db/models/reservation";
import reservationRepoImpl from "../repos/reservation-repo-impl";

export type TransferRequestMessage = WalletTransferMoneyMessage;

export interface TransferService {
    processTransferRequestMessage(message: TransferRequestMessage): Promise<void>;
    verifyWalletTransferRequest(request: WalletTransferRequest): Promise<any>;
    verifyBankTransferRequest(request: BankPayoutParams): Promise<any>;
    processTransferCompletedMessage(message: TransferCompletedMessage): Promise<void>;
    handleFulfillBankPayoutMessage(message: FulfillBankPayoutMessage): Promise<void>;
}

const AccountBalanceSatifiedCheck = (account: Account, trxValue: number) => {
    const constraintSatisfied = account.balance >= trxValue;
    // if(!constraintSatisfied){
    //     throw Error("Insuffient balance");
    // }
    return constraintSatisfied;
}

class TransferServiceImpl implements TransferService {


    async handleFulfillBankPayoutMessage(message: FulfillBankPayoutMessage): Promise<void> {
        try{
            const session = await mongoose.startSession();
            await session.withTransaction(async()=>{
                const requestId = message.requestId;
                const amount = message.amount;
                const account = await AccountRepo.getAccount(message.sourceWalletId);
                await reservationRepoImpl.createReservation(<ReservationParams>{
                    type: "transfer",
                    transactionRequestId: requestId,
                    amount
                });
                account.balance = account.balance - parseFloat(amount.toString());
                await AccountRepo.updateAccount(account);
            });
            session.endSession();
        }catch(e){
            console.log(e);
        }
    }

    async verifyBankTransferRequest(request: BankPayoutParams): Promise<any> {
        const { requestId, amount } = request;
        const account = await AccountRepo.getAccount(request.sourceWalletId);
        const satisfied = AccountBalanceSatifiedCheck(account, parseFloat(amount.toFixed()));
        const session = await mongoose.startSession();
        await session.withTransaction(async () => {
            // if(satisfied){
            //     await reservationRepoImpl.createReservation(<ReservationParams>{
            //         type:"transfer",
            //         transactionRequestId: requestId,
            //         amount
            //     });
            //     account.balance = account.balance - parseFloat(amount.toString());
            //     await AccountRepo.updateAccount(account);
            // }
            await transferRequestVerficationRepo.createTransferRequestVerificationParams(<TransferVerificationParams>{
                transferRequestId: requestId,
                type: "bank-transfer",
                approved: satisfied,
                transferData: request,
                key: request.key
            });
        });
        session.endSession();
    }

    async transferFromSourceToDestinationWallet(request: any): Promise<void> {
        // const session = await mongoose.startSession();
        // await session.withTransaction(async () => {

            const sourceAccount = await AccountRepo.getAccount(request.sourceWalletId);
            sourceAccount.balance = parseFloat(sourceAccount.balance.toFixed()) - request.amount;
            await AccountRepo.updateAccount(sourceAccount);

            const destinationAcct = await AccountRepo.getAccount(request.destinationWalletId);
            destinationAcct.balance = parseFloat(destinationAcct.balance.toFixed()) + request.amount;
            console.log("DEST_ACCT:");
            console.log(await AccountRepo.updateAccount(destinationAcct));

            request.status = "success";
            await request.save();

        // })
        // session.endSession();
    }

    async handleBankTransferCompletion(request: any): Promise<void> {
        const reservation = await reservationRepoImpl.getReservation({ 
            type: "transfer", 
            transactionRequestId: request.requestId 
        });
        reservation.fulfilled = true;
        await reservationRepoImpl.save(reservation);
        request.status = "success";
        await request.save();
    }

    async processTransferCompletedMessage(message: TransferCompletedMessage): Promise<void> {
        const { transferRequestId } = message;
        const request = await transferRequestRepoImpl.getTransferRequest(transferRequestId);
        if (request.status !== "success" && request.status !== "failure") {

            if (request.destinationWalletId) {
                await this.transferFromSourceToDestinationWallet(request);
            }

            if (request.destinationAccount) {
                await this.handleBankTransferCompletion(request);
            }

        } else {
            throw Error("Duplicate TransferCompleted message");
        }

        if (request.status === "failure") {
            const session = await mongoose.startSession();
            await session.withTransaction(async () => {
                const sourceAccount = await AccountRepo.getAccount(request.sourceWalletId);
                sourceAccount.balance = parseFloat(sourceAccount.balance.toFixed()) + request.amount;
                const reservation = await reservationRepoImpl.getReservation({ type: "transfer", transactionRequestId: request.requestId });
                reservation.fulfilled = true;
            })
            session.endSession();
        }
    }

    async verifyWalletTransferRequest(request: WalletTransferRequest): Promise<any> {
        const { requestId, amount } = request;
        const account = await AccountRepo.getAccount(request.sourceWalletId);
        const satisfied = AccountBalanceSatifiedCheck(account, parseFloat(amount.toFixed()));
        const session = await mongoose.startSession();
        session.withTransaction(async () => {
            // if(satisfied){
            //     await reservationRepoImpl.createReservation(<ReservationParams>{
            //         type:"transfer",
            //         transactionRequestId: requestId,
            //         amount
            //     });
            //     account.balance = account.balance - parseFloat(amount.toString());
            //     await AccountRepo.updateAccount(account);
            // }
            await transferRequestVerficationRepo.createTransferRequestVerificationParams(<TransferVerificationParams>{
                transferRequestId: requestId,
                type: "wallet-transfer",
                approved: satisfied,
                transferData: request,
                key: account.userId
            });
        });
        session.endSession();
    }

    async processTransferRequestMessage(message: TransferRequestMessage): Promise<void> {
        if (message instanceof WalletTransferMoneyMessage) {
            const transfer = await transferRequestRepoImpl.createWalletTransferRequest(<WalletTransferRequest>{
                sourceWalletId: message.sourceWalletId,
                destinationWalletId: message.destinationWalletId,
                currency: message.currency,
                requestId: message.requestId,
                amount: message.amount,
                key: message.key.toString()
            });
            await this.verifyWalletTransferRequest(transfer);
        }

        if (message instanceof BankPayoutMessage) {
            console.log(`DEBUG: ${{ ...message }}`);
            const transfer = await transferRequestRepoImpl.createBankTransferRequest(<BankPayoutParams>{
                currency: message.currency,
                requestId: message.requestId,
                amount: message.amount,
                bankId: message.bankId,
                sourceWalletId: message.sourceWalletId,
                destinationAccount: message.destinationAccount,
                description: message.description,
                country: message.country,
                key: message.key.toString()
            });
            await this.verifyBankTransferRequest(transfer);
        }
    }


}

export default new TransferServiceImpl();