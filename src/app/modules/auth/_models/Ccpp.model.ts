export class CcppModel{
    id:string;
    code:string;
    description:string;
    annex:string;
    ccodmen:string;
    setCcpp(ccpp: any) {
        this.id = ccpp.id;
        this.code = ccpp.code;
        this.description = ccpp.description;
        this.annex = ccpp.annex;
        this.ccodmen = ccpp.ccodmen;
    }
}