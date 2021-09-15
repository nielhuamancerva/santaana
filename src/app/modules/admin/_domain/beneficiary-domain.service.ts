import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../_commons/_models/api-response.model';
import { BeneficiaryModel } from '../_models/Beneficiary.model';
import { PagedResponse } from '../../../_commons/_models/paged-response.model';
import { buildHeader } from 'src/app/_commons/_helpers/http-header';

@Injectable({
    providedIn: 'root',
})

export class BeneficiaryDomainService {

    constructor(private http: HttpClient) { }

    getAllBeneficiary(page: number , size: number, code: string, docnum: string, name: string): Observable<ApiResponse<PagedResponse<BeneficiaryModel>>> {
        const header = buildHeader();
        var params = new HttpParams();

        params = params.set("page",page.toString());
        params = params.set("size",size.toString());

        if (code) {
            params = params.set("code", code);
        }

        if (docnum) {
            params = params.set("docnum", docnum);
        }

        if (name) {
            params = params.set("name", name);
        }

        return this.http.get<ApiResponse<PagedResponse<BeneficiaryModel>>>(
            `${environment.apiService}/beneficiaries`,
            {
                headers: header,
                params: params
            })
            .pipe(map(response => response))
            .pipe(catchError(this.handleError));
        
    }

    getAllBeneficiaryForPay(page: number , size: number, code: string, docnum: string, name: string): Observable<ApiResponse<PagedResponse<BeneficiaryModel>>> {
        const header = buildHeader();
        var params = new HttpParams();

        params = params.set("page",page.toString());
        params = params.set("size",size.toString());

        if (code) {
            params = params.set("code", code);
        }

        if (docnum) {
            params = params.set("docnum", docnum);
        }

        if (name) {
            params = params.set("name", name);
        }

        return this.http.get<ApiResponse<PagedResponse<BeneficiaryModel>>>(
            `${environment.apiService}/beneficiaries/pay`,
            {
                headers: header,
                params: params
            })
            .pipe(map(response => response))
            .pipe(catchError(this.handleError));
        
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