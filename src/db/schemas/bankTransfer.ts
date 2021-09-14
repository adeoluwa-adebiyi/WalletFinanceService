import { Schema } from "mongoose";

export default new Schema({
    sourceWalletId: {
        type: String,
        required: [true, "sourceWalletId cannot be empty"]
    },
    bankId: {
        type: String,
        required: [true, "nuban cannot be empty"]
    },

    destinationAccount:{
        type:  String,
        required: [true, "bankAccount cannot be empty"]
    },
    swiftCode: {
        type: String,
    }
});