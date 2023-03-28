import Transfer from "./transfer";
import bankTransferSchema from "../schemas/bankTransfer";

export default Transfer.discriminator("BankTransfer",bankTransferSchema);
