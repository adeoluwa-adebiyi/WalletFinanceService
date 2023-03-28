import { Schema } from "mongoose";
import { v4 as uuidv4 } from "uuid";

const reservationSchema: Schema = new Schema({
    id: {
        type: String,
        default: ()=>uuidv4()
    },
    transactionRequestId: {
        type: String,
        required: [true, "transactionRequestId cannot be empty"]
    },
    type:{
        type: String,
        enum: ["transfer", "fx-exchange"],
        required: [true, "type cannot be empty"]
    },
    amount: {
        type: Number,
        required: [true, "amount cannot be empty"]
    },
    fulfilled: {
        type: Boolean,
        default: false
    }
},{
    timestamps: true
});


export default reservationSchema;