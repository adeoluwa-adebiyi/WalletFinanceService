import { Schema } from "mongoose";

const currencySchema = new Schema({
    id: {
        type: String,
        required: [true, "Currency id is required"],
        unique: true
    },
    symbol: {
        type: String,
        required: [true, "Currency symbol is required"],
    },
    description: {
        type: String,
        required: false
    }

},{
    timestamps: true
});

export default currencySchema;
