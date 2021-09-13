import { Schema } from "mongoose";

export default new Schema({
    nuban: {
        type: String,
        required: [true, "nuban cannot be empty"]
    },
    bankAccount:{
        type:  String,
        required: [true, "bankAccount cannot be empty"]
    }
});