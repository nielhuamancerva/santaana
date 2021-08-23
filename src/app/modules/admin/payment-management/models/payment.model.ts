export interface Payment 
{
   id?: number;
   beneficiary_code: string;
   beneficiaryfullname: string;
   document_code:Array<String>;
   canal:string ;
   canal_code:string;
   version:string;
   note: string;
   currency:string;
   amount_received: Number;
}