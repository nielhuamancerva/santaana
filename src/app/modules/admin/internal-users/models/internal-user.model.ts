import { BaseModel } from '../../../../_metronic/shared/crud-table';

export interface InternalUser extends BaseModel {
    id: number;
    name: string;
    secondName: string;
    lastName: string;
    secondLastName: string;
    documentType: string;
    documentNumber: string;
    roleCode: string;
    userName: string;
    password: string;
    department: string;
    province: string;
    district: string;
    ccpp: string;
    email: string;
    typePersonCode: string;
    phone1: string
}