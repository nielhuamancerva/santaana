import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ITableState, TableResponseModel, TableService } from 'src/app/_metronic/shared/crud-table';
import { PaymentDomainService } from '../_domain/payment-domain.service';
import { PaymentHeaderModel } from '../_models/payment.header.model';

@Injectable({
  providedIn: 'root',
})
export class PaymentsService extends TableService<PaymentHeaderModel> implements OnDestroy {

    constructor(@Inject(HttpClient) http, private _paymentservicedomain: PaymentDomainService) {
        super(http);
      }

    // READ
    find(tableState: ITableState): Observable<TableResponseModel<PaymentHeaderModel>> {
        let page = tableState.paginator.page -1;
        let size = tableState.paginator.pageSize;
        let beneficiary = tableState.searchTerm;
        let user = tableState.searchAux1;
        let root = tableState.searchAux2;
        let dateIn = tableState.searchAux3;
        let dateFn = tableState.searchAux4;

        return this._paymentservicedomain.getAllPayments(page , size, beneficiary, user, root, dateIn, dateFn).pipe(
        map(
        response => {
            let result: TableResponseModel<PaymentHeaderModel> = {
                items: response.data.content,
                total: response.data.totalElements,
                lenght: response.data.content.length
            };
            
            return result;
        }
        ));    
    }


    ngOnDestroy() {
        this.subscriptions.forEach(sb => sb.unsubscribe());
    }
}