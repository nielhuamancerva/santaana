export class DepartamentModel{
    id:string;
    code:string;
    description:string;
    setDepartament(departament: any) {
        this.id = departament.id;
        this.code = departament.code;
        this.description = departament.description;
    }
}