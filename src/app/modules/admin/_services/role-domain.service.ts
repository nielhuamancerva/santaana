import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../_commons/_models/ApiResponse.model';
import { RolesModel } from '../_models/Roles.model';
import { PagedResponse } from '../../../_commons/_models/PagedResponse';
import { BuildHeaderService } from '../../../_commons/_services/Header-Builder.service';

@Injectable({
    providedIn: 'root',
})

export class RoleHTTPServiceDomain {
    API_URL = `${environment.apiUrlNiel}/roles`;
    constructor(
        private http: HttpClient,
        private buildheader:BuildHeaderService
    ){ }

    getAllRoles(): Observable<ApiResponse<PagedResponse<RolesModel>>> {
        const header = this.buildheader.buildHeader();
        return this.http.get<ApiResponse<PagedResponse<RolesModel>>>(this.API_URL,{
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