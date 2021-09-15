import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../_commons/_models/api-response.model';
import { PagedResponse } from '../../../_commons/_models/paged-response.model';
import { DistrictModel } from '../_models/District.model';
import { ApiRespuesta, Data, Content } from '../_models/Prueba.interface';
import { buildHeader } from 'src/app/_commons/_helpers/http-header';
@Injectable({
    providedIn: 'root',
})

export class DistrictDomainService {
    API_URL = `${environment.apiService}/ubigee/district`;
    header = buildHeader();
    responseApi: ApiRespuesta;
    data: Data;
    _districts: Content[] = [];

    get districts(){
        return [...this._districts];
    }

    constructor(private http: HttpClient) { }

    getAllDistrict(codedistrict): Observable<ApiResponse<PagedResponse<DistrictModel>>> {
        const header = buildHeader();
        return this.http.get<ApiResponse<PagedResponse<DistrictModel>>>( `${environment.apiService}/ubigee/district?code=${codedistrict}`,{
            headers: header 
        })
            .pipe(map(response => response))
            .pipe(catchError(this.handleError));
    }

    getAll(){
        return this.http.get<ApiRespuesta>(this.API_URL,{
            headers: this.header
        }).subscribe( (resp) => {
            this._districts = resp.data.content;
        })
    }

    getByDistrict(code): Observable<ApiResponse<PagedResponse<DistrictModel>>> {
        const header = buildHeader();
        return this.http.get<ApiResponse<PagedResponse<DistrictModel>>>(`${environment.apiService}/ubigee/district?code=${code}`,{
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