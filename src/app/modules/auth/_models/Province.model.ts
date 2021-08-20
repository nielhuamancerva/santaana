export class ProvinceModel{
    id:string;
    code:string;
    description:string;
    setProvince(province: any) {
        this.id = province.id;
        this.code = province.code;
        this.description = province.description;
    }
}