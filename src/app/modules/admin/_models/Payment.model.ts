export class PaymentModel {
    id?: number;
    beneficiary_code:String;
    document_code:Array<String>;
    canal:String ;
    canal_code:String;
    version:String ;
    note:String ;
    currency:String ; 
    amount_received:number;
}

