import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../_commons/_models/api-response.model';
import { PagedResponse } from '../../../_commons/_models/paged-response.model';
import { CcppModel } from '../_models/Ccpp.model';
import { ApiRespuesta, Data, Content } from '../_models/Prueba.interface';
import { buildHeader } from 'src/app/_commons/_helpers/http-header';

@Injectable({
    providedIn: 'root',
})

export class CcppDomainService {

    API_URL = `${environment.apiService}/ubigee/ccpp`;
    header = buildHeader();
    responseApi: ApiRespuesta;
    data: Data;
    _ccpps: Content[] = [];

    get ccpps(){
        return [...this._ccpps];
    }

    constructor(private http: HttpClient) { }

    getAllCcpp(): Observable<ApiResponse<PagedResponse<CcppModel>>> {
        const header = buildHeader();
        return this.http.get<ApiResponse<PagedResponse<CcppModel>>>( `${environment.apiService}/ubigee/ccpp?code=`,{
            headers: header 
        })
            .pipe(map(response => response))
            .pipe(catchError(this.handleError));
    }

    getAll(){
        return this.http.get<ApiRespuesta>(this.API_URL,{
            headers: this.header
        }).subscribe( (resp) => {
            this._ccpps = resp.data.content;
        })
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