import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { ApiResponse } from '../../../_commons/_models/api-response.model';
import { map, catchError } from 'rxjs/operators';
import { PagedResponse } from '../../../_commons/_models/paged-response.model';
import { DocumentModel } from '../_models/Document.model';
import { buildHeader } from 'src/app/_commons/_helpers/http-header';

@Injectable({
    providedIn: "root"
})

export class DocumentDomainService {

    API_URL = `${environment.apiService}/sales`;
    constructor(private http: HttpClient) {}

    getAllSales(page: number , size: number, numDoc: string, beneficiary: string, dateIn: string, dateFn: string, pending: string): Observable<ApiResponse<PagedResponse<DocumentModel>>>{
        const header = buildHeader();
        var params = new HttpParams();

        params = params.set("page",page.toString());
        params = params.set("size",size.toString());

        if (numDoc) {
            params = params.set("numDoc", numDoc);
        }

        if (beneficiary) {
            params = params.set("beneficiary", beneficiary);
        }

        if (dateIn) {
            params = params.set("dateIn", dateIn);
        }

        if (dateFn) {
            params = params.set("dateFn", dateFn);
        }

        if (pending) {
            params = params.set("pending", pending);
        }
        
        return this.http.get<ApiResponse<PagedResponse<DocumentModel>>>(this.API_URL,{ 
            headers: header,
            params: params 
        })
                        .pipe(map(response => response))
                        .pipe(catchError(this.handleError));;
    }

    getAllSalesForPay(page: number , size: number, numDoc: string, 
                      beneficiary: string, dateIn: string, dateFn: string): Observable<ApiResponse<PagedResponse<DocumentModel>>> {

        const header = buildHeader();
        var params = new HttpParams();

        params = params.set("page",page.toString());
        params = params.set("size",size.toString());

        if (numDoc) {
            params = params.set("numDoc", numDoc);
        }

        if (beneficiary) {
            params = params.set("beneficiary", beneficiary);
        }

        if (dateIn) {
            params = params.set("dateIn", dateIn);
        }

        if (dateFn) {
            params = params.set("dateFn", dateFn);
        }
        
        return this.http.get<ApiResponse<PagedResponse<DocumentModel>>>(this.API_URL + "/pay",{ 
            headers: header,
            params: params 
        })
                        .pipe(map(response => response))
                        .pipe(catchError(this.handleError));;
    }

    private handleError(err: HttpErrorResponse): Observable<never> {
        let errorMessage = "";
        if (err.error instanceof ErrorEvent) {
            errorMessage = `Un error ha ocurrido: ${err.error.message}`;
        } else {
            errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;
        }
        console.error(errorMessage);

        return throwError(errorMessage);
    }
}