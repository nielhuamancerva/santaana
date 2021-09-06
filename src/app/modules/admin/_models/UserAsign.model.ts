export interface UserAsingModel<T> {
    id?: number;
    roleCode:string;
    roleDescription:string;
    typePersonCode:string;
    typePersonDescription:string;
    typeDocumentCode:string;
    typeDocumentDescription:string;
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
    frontDocument: string;
    reverseDocument: string;
    lastPage: string;
    evidence: string; 
    userName: string;
    email: string;
    enable: boolean;
    data:T[]
}