import { model } from "mongoose";
import { WalletTransferMoneyMessage } from "../../processors/messages/wallet-transfer-money-message";
import transferSchema from "../schemas/transfers";

export type Transfer = WalletTransferMoneyMessage

export default model<Transfer>("transfer", transferSchema);