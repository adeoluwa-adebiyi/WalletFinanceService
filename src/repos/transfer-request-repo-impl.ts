import Transfer from "../db/models/transfer";
import walletTransfer, { WalletTransferRequest } from "../db/models/walletTransfer";
import bankTransfer from "../db/models/bankTransfer";
import { BankPayoutParams } from "../processors/messages/bank-payout-msg";
import { ITransferRequestRepo, PagedData } from "./interfaces/transfer-request-repo";
import accountRepo from "./account";
import { calculateSkipAndLimit } from "../utils";

export class TransferRequestRepo implements ITransferRequestRepo{

    async getUserInflowPayments(page: Number, userId: Number, limit: Number=10): Promise<PagedData<WalletTransferRequest>> {
        const walletIds = await accountRepo.getUserWallets(userId);
        const calcPageLimit = calculateSkipAndLimit(page,limit);
        const query = walletTransfer.aggregate([
            {
                $lookup: {
                    from: "accounts",
                    localField: "destinationWalletId",
                    foreignField: "walletId",
                    as: "account"
                }
            },
            {
                $match: {
                    destinationWalletId: { $in: walletIds },
                }
            },
            {
                $project: {
                    _id: false,
                    sourceWalletId: true,
                    destinationWalletId: true,
                    requestId: true,
                    amount: true,
                    currency: true,
                    status: true,
                    createdAt: true,
                    updatedAt: true
                }
            }
        ]);
        const total =  Math.ceil(((await query).length)/limit.valueOf());
        const data = await query.sort({updatedAt:-1}).skip(calcPageLimit.skip).limit(calcPageLimit.limit);
        return <PagedData<any>>{
            data,
            page,
            totalPages: total
        }
    }

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