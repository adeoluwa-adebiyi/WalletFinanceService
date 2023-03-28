import { Schema } from "mongoose";
import * as uuid from "uuid";
import key from "./key";

const transferSchema = new Schema({
    ...key,
    id: {
        type: String,
        unique: true,
        default: uuid.v4()
    },
    requestId:{
        type: String,
        unique: true
    },
    data:{
        type: Object,
    }
},{
    timestamps: true
});

export default transferSchema;
