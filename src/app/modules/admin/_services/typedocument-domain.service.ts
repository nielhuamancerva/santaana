import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../_commons/_models/ApiResponse.model';
import { TypeDocumentModel } from '../_models/TypeDocument.model';
import { PagedResponse } from '../../../_commons/_models/PagedResponse';
import { BuildHeaderService } from '../../../_commons/_services/Header-Builder.service';

@Injectable({
    providedIn: 'root',
})
export class TypeDocumentHTTPServiceDomain {

    API_URL = `${environment.apiUrlNiel}/element/typedocument`;
    constructor(
        private http: HttpClient,
        private buildheader:BuildHeaderService
    ) { }

    getAllTypedocument(): Observable<ApiResponse<PagedResponse<TypeDocumentModel>>> {
        const header = this.buildheader.buildHeader();
        return this.http.get<ApiResponse<PagedResponse<TypeDocumentModel>>>(this.API_URL,{
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