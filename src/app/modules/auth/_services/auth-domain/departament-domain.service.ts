import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../../../../src/environments/environment';
import { ApiResponse } from '../../_models/ApiResponse.model';
import { AuthModel } from '../../_models/auth.model';
import { AuthService } from '../../../../modules/auth/_services/auth.service';
import { DepartamentModel } from '../../_models/Departament.model';
@Injectable({
  providedIn: 'root',
})
export class DepartamentHTTPServiceDomain {
    API_URL = `${environment.apiUrlNiel}/ubigee/department`;
  constructor(private http: HttpClient,
    private auth: AuthService) { }

    getAllDepartament(): Observable<ApiResponse<any>> {
        const header = this.buildHeader();
        return this.http.get<ApiResponse<any[]>>(this.API_URL,{
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

  buildHeader(): HttpHeaders {
 
    let headers: HttpHeaders = new HttpHeaders()
        .set("Authorization", "Bearer " + this.getAuthFromLocalStorage() )
        //.set("Connection", retrieveStringFromStorage("ConnectionCompany") ) 99dedcc7-ffbc-41e0-8494-73cfae25dffe
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
