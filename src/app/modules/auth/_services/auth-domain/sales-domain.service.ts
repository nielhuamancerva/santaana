import { Injectable } from '@angular/core';
import { environment } from '../../../../../../src/environments/environment';
import { AuthModel } from '../../_models/auth.model';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../../../modules/auth/_services/auth.service';
import { Observable, throwError } from 'rxjs';
import { ApiResponse } from '../../_models/ApiResponse.model';
import { map, catchError } from 'rxjs/operators';
import { PagedResponse } from '../../_models/PagedResponse';
import { SalesModel } from '../../_models/Sales.model';

@Injectable({
    providedIn: "root"
})
export class SalesHTTPServiceDomain {

    API_URL = `${environment.apiUrlNiel}/sales`;
    constructor(
        private http: HttpClient,
        private auth: AuthService
    ) {}

    getAllSales(): Observable<ApiResponse<PagedResponse<SalesModel>>>{
        const header = this.buildHeader();
        console.log("Esto se ejecutará antes que el console log de arriba");
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

    buildHeader(): HttpHeaders {
 
        let headers: HttpHeaders = new HttpHeaders()
            .set("Authorization", "Bearer " + this.getAuthFromLocalStorage() )
            .set("Company", "ac3e02e6-69b2-4e36-bda6-de98673fc74b" )
            .set("Access-Control-Allow-Origin", "*")
            .set("Content-Type", "application/json");
        return headers;
    }
    
    getAuthFromLocalStorage(): AuthModel {
        try {
          const authData = JSON.parse(
            localStorage.getItem(this.auth.authLocalStorageToken)
          );
          return authData.authToken;
        } catch (error) {
          console.error(error);
          return undefined;
        }
    }
}