import { BeneficiaryModel } from './Beneficiary.model';
export class DocumentModel {
    id?:string;
    currency?:string;
    serie?:string;
    correlative?:string;
    period?:string;
    docDate?:string;
    total?:number;
    pending?:number;
    note?:string;
    enabled?:string;
    beneficiary?:BeneficiaryModel;
    //Custom Field
    checked?:boolean = false;

}