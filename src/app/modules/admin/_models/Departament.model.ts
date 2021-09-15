import { ProvinceModel } from "./Province.model";

export interface DepartamentModel{
    id:string;
    code:string;
    description:string;
    provinces?: ProvinceModel[]
}