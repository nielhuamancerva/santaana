import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';

import { environment } from '../../../../environments/environment';

import { ApiResponse } from 'src/app/_commons/_models/api-response.model';
import { catchError, map, tap } from 'rxjs/operators';
import { AuthRequestModel } from '../_models/auth-request.model';
import { UserModel } from '../../admin/_models/user.model';
import { saveStringOnStorage } from 'src/app/_commons/utils/storage';
import { buildHeader } from 'src/app/_commons/_helpers/http-header';


const API_AUTH_URL = `${environment.apiService}/auth`;

@Injectable({
  providedIn: 'root',
})
export class AuthHTTPRepositoryService {
  constructor(private http: HttpClient) { }


  // public methods
  login(authData: AuthRequestModel): Observable<ApiResponse<UserModel>> {

    return this.http
      .post<ApiResponse<UserModel>>(`${API_AUTH_URL}/signin`, authData,
        {
          observe: "response"
        })
    .pipe(
      tap(response => {
        if (response.body.success) {
          saveStringOnStorage("TokenAuthorization", response.headers.get("BearerAuthorization"));
          saveStringOnStorage("RefreshAuthorization", response.headers.get("RefreshAuthorization"));
          saveStringOnStorage("ExpirationAuthorization", response.headers.get("ExpirationAuthorization"));
        }        
      })
    )
    .pipe(map((response) => response.body))
    .pipe(catchError(this.handleError));
  }

  getUserByToken(): Observable<ApiResponse<UserModel>> {
    const header = buildHeader();
    
    return this.http.get<ApiResponse<UserModel>>(`${API_AUTH_URL}/me`, {
      headers: header,
    })
    .pipe(map((response) => response));
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
