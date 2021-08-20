export class DistrictModel{
    id:string;
    code:string;
    description:string;
    setDistrict(district: any) {
        this.id = district.id;
        this.code = district.code;
        this.description = district.description;
    }
}