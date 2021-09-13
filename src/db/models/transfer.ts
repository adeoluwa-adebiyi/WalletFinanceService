import { model } from "mongoose";
import transferSchema from "../schemas/transfer";
// const walletTransfer = require("../schemas/transfer/walletTransfer");

export default model("transfer", transferSchema);
    // BankTransfer: new model("BankTransfer", bankTransfer),
    // WalletTransfer: new model("WalletTransfer", walletTransfer)