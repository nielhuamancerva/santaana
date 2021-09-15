import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../_commons/_models/api-response.model';
import { TypeDocumentModel } from '../_models/TypeDocument.model';
import { PagedResponse } from '../../../_commons/_models/paged-response.model';
import { ApiRespuesta, Data, Content } from '../_models/Prueba.interface';
import { buildHeader } from 'src/app/_commons/_helpers/http-header';

@Injectable({
    providedIn: 'root',
})
export class TypeDocumentDomainService {

    API_URL = `${environment.apiService}/element/typedocument`;

    
    constructor(private http: HttpClient) { }

    getAllTypedocument(): Observable<ApiResponse<PagedResponse<TypeDocumentModel>>> {
        const header = buildHeader();
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