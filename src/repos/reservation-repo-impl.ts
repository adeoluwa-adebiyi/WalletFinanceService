import { ReservationParams } from "../db/models/reservation";
import { ReservationRepo } from "./interfaces/reservation-repo";
import reservation from "../db/models/reservation";
import { Model } from "mongoose";

export class ReservationRepoImpl implements ReservationRepo{

    private reservationModel: Model<ReservationParams>;

    constructor(reservationModel=reservation){
        this.reservationModel = reservationModel;
    }

    async save(params: ReservationParams): Promise<ReservationParams> {
        return (await params.save()) as ReservationParams;
    }

    async createReservation(params: ReservationParams): Promise<ReservationParams> {
        return (await (new this.reservationModel({...params})).save()) as ReservationParams;
    }

    async getReservation(params: Partial<ReservationParams>): Promise<ReservationParams> {
        return (await this.reservationModel.findOne(params as any)) as ReservationParams;
    }

}

export default new ReservationRepoImpl();