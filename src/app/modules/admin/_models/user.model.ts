import { UserDataModel } from './user.data.model';
import { TypeDocumentModel } from './TypeDocument.model';
import { RolesModel } from './Roles.model';
import { TypePersonModel } from './TypePerson.model';
import { DepartamentModel } from './Departament.model';
import { DistrictModel } from './District.model';
import { ProvinceModel } from './Province.model';

export interface UserModel {
    id?: string;
    role?: RolesModel;
    typePerson?: TypePersonModel;
    typeDocument?: TypeDocumentModel;
    department?: DepartamentModel;
    province?: ProvinceModel;
    district?: DistrictModel;
    data?: UserDataModel;

    ccpp?: string;
    documentNumber?: string;
    userName?: string;
    email?: string;
    name?: string;
    lastName?: string;
    phone1?: string;
    phone2?: string;
    address?: string;
    latitude?: string;
    longitude?: string;
    enabled?: string;

    //Request Field
    ubigeeCode?: string;
    roleCode?: string;
    typeDocumentCode?: string;
    typePersonCode?: string;
    typeObjectCode?: string;

    //Native Angular
    hasher?: string;

}






