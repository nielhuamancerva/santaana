import { BaseModel } from '../../../../_metronic/shared/crud-table';

export interface User extends BaseModel {
    id: number;
    firstName: string;
    lastName: string;
    firstApellido: string;
    lastApellido: string;
    businessName: string;
    documentType: string;
    document: string;
    firstPhone: string;
    secondPhone: string;
    email: string;
    ubigeo: string;
    address: string;
    latitude: string;
    longitude: string;
    nota: string;
    personType: string
}