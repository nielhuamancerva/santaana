
import { PaymentHeaderModel } from "./payment.header.model";
import { UserModel } from "./user.model";

export class BoxSquareModel {

    id?: string;
    totalcharged?: number;
    totalpay?: number;
    commission?: number;
    balance?: number;
    squareDate?: string;
    note?: string;
    canal?: string;
    canalCode?: string;
    version?: string;
    latitude?: string;
    longitude?: string;
    agent?: UserModel;
    // 0 = Pendiente - INFO
    // 1 = Revisado - INFO
    // 2 = Recibido - SUCCESS
    // 3 = Observado - ERROR
    state?: number;
    enabled?: string;
    payments?: PaymentHeaderModel[];
    files?: string[];

    //Request Field
    documents?: string[];
    _squareDate?: string;



}