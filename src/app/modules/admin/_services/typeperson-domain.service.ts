import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../_commons/_models/ApiResponse.model';
import { TypePersonModel } from '../_models/TypePerson.model';
import { PagedResponse } from '../../../_commons/_models/PagedResponse';
import { BuildHeaderService } from '../../../_commons/_services/Header-Builder.service';

@Injectable({
    providedIn: 'root',
})

export class TypePersontHTTPServiceDomain {
    API_URL = `${environment.apiUrlNiel}/element/typeperson`;
    constructor(
        private http: HttpClient,
        private buildheader:BuildHeaderService
    ) { }

    getAllTypeperson(): Observable<ApiResponse<PagedResponse<TypePersonModel>>> {
        const header = this.buildheader.buildHeader();
        return this.http.get<ApiResponse<PagedResponse<TypePersonModel>>>(this.API_URL,{
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