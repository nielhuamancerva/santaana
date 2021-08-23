export class CollectionAgentModel {
    id: number;
    roleCode:string;
    roleDescription:string;
    typePersonCode:string;
    typePersonDescription:string;
    typeDocumentCode:string;
    typeDocumentDescription:string;
    departmentCode: string;
    provinceCode: string;
    districtCode:string;
    populatedCenterCode:string;
    documentNumber:number;
    name:string;
    secondName:string;
    lastName: string
    secondLastName:string;
    phone1: number;
    phone2: number;
    referentialAddress: string;
    latitude: string;
    longitude: string;
    userName: string;
    email: string;
    enable: boolean;

    //se envian 4 imagenes
    frontDocument: string;
    reverseDocument: string;
    lastPage: string;
    evidence: string; 
}