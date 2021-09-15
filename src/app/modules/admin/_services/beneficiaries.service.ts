import { Inject, Injectable, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BeneficiaryModel } from '../_models/Beneficiary.model';
import { PagedResponse } from '../../../_commons/_models/paged-response.model';
import { BeneficiaryDomainService } from '../_domain/beneficiary-domain.service';
import { ITableState, TableResponseModel, TableService } from 'src/app/_metronic/shared/crud-table';
import { HttpClient } from '@angular/common/http';
import { ApiResponse } from 'src/app/_commons/_models/api-response.model';


@Injectable({
    providedIn: 'root',
})
export class BeneficiariesService extends TableService<BeneficiaryModel> implements OnDestroy {

    constructor(@Inject(HttpClient) http,
        private _beneficiaryservicedomain: BeneficiaryDomainService) {
            super(http);
    }


    // READ
    find(tableState: ITableState): Observable<TableResponseModel<BeneficiaryModel>> {
        let page = tableState.paginator.page -1;
        let size = tableState.paginator.pageSize;
        let code = tableState.searchTerm;
        let docnum = tableState.searchAux1;
        let name = tableState.searchAux2;
    

        return this._beneficiaryservicedomain.getAllBeneficiary(page , size, code, docnum, name).pipe(
        map(
        response => {
            let result: TableResponseModel<BeneficiaryModel> = {
                items: response.data.content,
                total: response.data.totalElements,
                lenght: response.data.content.length
            };
            
            return result;
        }
        ));    
    }

    getAllBeneficiaryForPay(page: number , size: number, code: string, docnum: string, name: string): Observable<ApiResponse<PagedResponse<BeneficiaryModel>>>  {
        return this._beneficiaryservicedomain.getAllBeneficiaryForPay(page, size, code, docnum, name);   
    }

    ngOnDestroy() {
        this.subscriptions.forEach(sb => sb.unsubscribe());
    }

}