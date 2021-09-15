import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { buildHeader } from 'src/app/_commons/_helpers/http-header';
import { PaymentHeaderModel } from '../_models/payment.header.model';
import { ApiResponse } from 'src/app/_commons/_models/api-response.model';
import { PagedResponse } from 'src/app/_commons/_models/paged-response.model';
import { retrieveStringFromStorage } from 'src/app/_commons/utils/storage';

@Injectable({
    providedIn: 'root',
})

export class PaymentDomainService {
    API_URL = `${environment.apiService}/payment`;

    constructor(private _http: HttpClient) { }

    getAllPayments(page: number , size: number, beneficiary: string, user: string, root: string, dateIn: string, dateFn: string): Observable<ApiResponse<PagedResponse<PaymentHeaderModel>>> {
        const header = buildHeader();

        var params = new HttpParams();

        params = params.set("page",page.toString());
        params = params.set("size",size.toString());

        if (beneficiary) {
            params = params.set("beneficiary", beneficiary);
        }

        if (user) {
            params = params.set("user", user);
        } 
        
        if (root) {
            params = params.set("root", root);
        } 

        if (dateIn) {
            params = params.set("dateIn", dateIn);
        } 

        if (dateFn) {
            params = params.set("dateFn", dateFn);
        } 

        return this._http.get<ApiResponse<PagedResponse<PaymentHeaderModel>>>( `${this.API_URL}s`, {
            headers: header,
            params: params
        })
            .pipe(map(response => response))
            .pipe(catchError(this.handleError));
    }


    getPaymentsForBoxSquare(): Observable<ApiResponse<PaymentHeaderModel[]>> {
        const header = buildHeader();
        return this._http.get<ApiResponse<PaymentHeaderModel[]>>( `${this.API_URL}s/boxsquare`, {
            headers: header,
        })
            .pipe(map(response => response))
            .pipe(catchError(this.handleError));
    }


    createPayment(data: FormData): Observable<ApiResponse<PaymentHeaderModel>> {
        let headers: HttpHeaders = new HttpHeaders()
        .set("Authorization", "Bearer " + retrieveStringFromStorage("TokenAuthorization") )
        .set("Access-Control-Allow-Origin", "*");
 
        return this._http.post<ApiResponse<PaymentHeaderModel>>(this.API_URL, data,{
            headers: headers 
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