import { DepartamentModel } from './Departament.model';
import { DistrictModel } from './District.model';
import { ProvinceModel } from './Province.model';
import { SupplyModel } from './suppy.model';
export class BeneficiaryModel {
    id?:string;
    externalCode?:string;
    documentType?:string;
    documentNumber?:string;
    ccpp?:string;
    completeName?:string;
    name?:string;
    lastName?:string;
    address?:string;
    latitude?:string;
    longitude?:string;
    enabled?:string;
    ubigeeCode?:string;
    supplyCode?:string;
    supply?:SupplyModel;
    department?: DepartamentModel;
    province?: ProvinceModel;
    district?: DistrictModel;
}