import { Schema } from "mongoose";
import { v4 as uuidv4 } from "uuid";
import key from "./key";

const transferSchema = new Schema({
    ...key,
    amount: {
        type: Number,
        required: [true, "walletId cannot be empty"]
    },
    requestId: {
        type: String,
        default: ()=>uuidv4()
    },
    description: {
        type: String,
    },
    currency: {
        type: String,
        required: [true, "currency cannot be empty"],
        enum: ["NGN", "USD", "ZAR"]
    },
    status: {
        type: String,
        enum: ["pending", "success", "failure"],
        default: "pending"
    }
}, {
    timestamps: true,
    discriminatorKey: "transferType",
});

export default transferSchema;