import { Observable } from "rxjs";
import { DistrictModel } from "./District.model";

export interface ProvinceModel{
    id:string;
    code:string;
    description:string;
    districts?: Observable<DistrictModel[]>
}