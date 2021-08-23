import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { AuthModel } from '../../auth/_models/auth.model';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../auth/_services/auth.service';
import { Observable, throwError } from 'rxjs';
import { ApiResponse } from '../../../_commons/_models/ApiResponse.model';
import { map, catchError } from 'rxjs/operators';
import { PagedResponse } from '../../../_commons/_models/PagedResponse';
import { SalesModel } from '../_models/Sales.model';
import { BuildHeaderService } from '../../../_commons/_services/Header-Builder.service';

@Injectable({
    providedIn: "root"
})

export class SalesHTTPServiceDomain {

    API_URL = `${environment.apiUrlNiel}/sales`;
    constructor(
        private http: HttpClient,
        private buildheader:BuildHeaderService
    ) {}

    getAllSales(): Observable<ApiResponse<PagedResponse<SalesModel>>>{
        const header = this.buildheader.buildHeader();
        return this.http.get<ApiResponse<PagedResponse<SalesModel>>>(this.API_URL,{ headers: header })
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