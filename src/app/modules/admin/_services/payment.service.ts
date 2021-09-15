import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ApiResponse } from "src/app/_commons/_models/api-response.model";
import { LocalDomainService } from "../_domain/local-domain.service";
import { PaymentDomainService } from "../_domain/payment-domain.service";
import { PaymentHeaderModel } from "../_models/payment.header.model";

@Injectable({
    providedIn: 'root',
})
export class PaymentService {

  constructor(private _paymentDomain: PaymentDomainService) { }

  register(_data: FormData) : Observable<ApiResponse<PaymentHeaderModel>>{
    return this._paymentDomain.createPayment(_data);      
  }


  getPaymentsForBoxSquare() : Observable<ApiResponse<PaymentHeaderModel[]>>{
    return this._paymentDomain.getPaymentsForBoxSquare();      
  }

}