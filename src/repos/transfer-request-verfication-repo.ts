import TransferRequestVerification, { TransferVerificationParams } from "../db/models/transferRequestVerification";
import { TransferVerificationRepo } from "./interfaces/transfer-request-verification-repo";

export class TransferVerificationRepoImpl implements TransferVerificationRepo{

    async createTransferRequestVerificationParams(request: TransferVerificationParams): Promise<any> {
        return await new TransferRequestVerification({...request}).save();
    }

    async findVerification(requestId: String): Promise<any> {
        return await TransferRequestVerification.findOne({requestId});
    }

}

export default new TransferVerificationRepoImpl();