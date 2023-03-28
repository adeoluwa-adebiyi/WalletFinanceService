import reservationSchema from "../schemas/reservation";
import { model, Document } from "mongoose";

export interface ReservationParams extends Partial<Document<any>>{
    id?: String,
    transactionRequestId: String,
    amount: Number,
    fulfilled?: boolean,
    type: String
}

export default model<ReservationParams>("reservation", reservationSchema);