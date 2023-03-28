import { ReservationParams } from "../../db/models/reservation";

export interface ReservationRepo{
    createReservation(params: ReservationParams): Promise<ReservationParams>;
    getReservation(params: Partial<ReservationParams>): Promise<ReservationParams>;
    save(params: ReservationParams): Promise<ReservationParams>;
}