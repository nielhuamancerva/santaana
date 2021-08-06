import { BaseModel } from '../../../_metronic/shared/crud-table';

export interface Payment extends BaseModel {
    id: number;
    invoiceCode: string;
    beneficiaryDni: string;
    VINCode: string;
    createdUser: string;
    createdDate: string;
    createdHour: string;
    phonenumber1: string;
    phonenumber2: string;
    note: string;
    totalPay: Number;
    mountToPay: Number;
    mountToCollect: Number
}