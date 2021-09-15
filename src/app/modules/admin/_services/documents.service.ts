import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from 'src/app/_commons/_models/api-response.model';
import { TableService, ITableState, TableResponseModel } from 'src/app/_metronic/shared/crud-table';
import { PagedResponse } from '../../../_commons/_models/paged-response.model';
import { DocumentDomainService } from '../_domain/document-domain.service';
import { DocumentModel } from '../_models/Document.model';

@Injectable({
    providedIn: 'root',
})
export class DocumentsService extends TableService<DocumentModel> implements OnDestroy {

    constructor(@Inject(HttpClient) http,
        private _documentDomainService: DocumentDomainService) {
            super(http);
    }


    // READ
    find(tableState: ITableState): Observable<TableResponseModel<DocumentModel>> {
        let page = tableState.paginator.page -1;
        let size = tableState.paginator.pageSize;
        let numDoc = tableState.searchTerm;
        let beneficiary = tableState.searchAux1;
        let dateIn = tableState.searchAux2;
        let dateFn = tableState.searchAux3;
        let pending = tableState.searchAux4;

        return this._documentDomainService.getAllSales(page , size, numDoc, beneficiary, dateIn, dateFn, pending).pipe(
        map(
        response => {
            let result: TableResponseModel<DocumentModel> = {
                items: response.data.content,
                total: response.data.totalElements,
                lenght: response.data.content.length
            };
            
            return result;
        }
        ));    
    }

    getDocumentsForPay(page: number , size: number, numDoc: string, 
        beneficiary: string, dateIn: string, dateFn: string): Observable<ApiResponse<PagedResponse<DocumentModel>>>  {
        return this._documentDomainService.getAllSalesForPay(page , size, numDoc, beneficiary, dateIn, dateFn);   
    }


    ngOnDestroy() {
        this.subscriptions.forEach(sb => sb.unsubscribe());
    }

}