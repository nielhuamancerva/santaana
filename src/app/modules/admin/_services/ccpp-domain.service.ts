import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../_commons/_models/ApiResponse.model';
import { PagedResponse } from '../../../_commons/_models/PagedResponse';
import { CcppModel } from '../_models/Ccpp.model';
import { BuildHeaderService } from '../../../_commons/_services/Header-Builder.service';

@Injectable({
    providedIn: 'root',
})

export class CcppHTTPServiceDomain {

    API_URL = `${environment.apiUrlNiel}/ubigee/ccpp`;
    constructor(
        private http: HttpClient,
        private buildheader:BuildHeaderService
    ) { }

    getAllCcpp(): Observable<ApiResponse<PagedResponse<CcppModel>>> {
        const header = this.buildheader.buildHeader();
        return this.http.get<ApiResponse<PagedResponse<CcppModel>>>(this.API_URL,{
            headers: header 
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