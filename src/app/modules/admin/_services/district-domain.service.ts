import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../_commons/_models/ApiResponse.model';
import { PagedResponse } from '../../../_commons/_models/PagedResponse';
import { DistrictModel } from '../_models/District.model';
import { BuildHeaderService } from '../../../_commons/_services/Header-Builder.service';
import { ApiRespuesta, Data, Content } from '../_models/Prueba.interface';
@Injectable({
    providedIn: 'root',
})

export class DistrictHTTPServiceDomain {
    API_URL_Local = `${environment.apiUrl}/ubigee/district`;
    header = this.buildheader.buildHeader();
    responseApi: ApiRespuesta;
    data: Data;
    _districts: Content[] = [];

    get districts(){
        return [...this._districts];
    }

    constructor(
        private http: HttpClient,
        private buildheader:BuildHeaderService
    ) { }

    getAllDistrict(codedistrict): Observable<ApiResponse<PagedResponse<DistrictModel>>> {
        const header = this.buildheader.buildHeader();
        return this.http.get<ApiResponse<PagedResponse<DistrictModel>>>( this.API_URL_Local + `?code=${codedistrict}`,{
            headers: header 
        })
            .pipe(map(response => response))
            .pipe(catchError(this.handleError));
    }

    getAll(){
        return this.http.get<ApiRespuesta>(this.API_URL_Local,{
            headers: this.header
        }).subscribe( (resp) => {
            this._districts = resp.data.content;
        })
    }

    getByDistrict(code): Observable<ApiResponse<PagedResponse<DistrictModel>>> {
        const header = this.buildheader.buildHeader();
        return this.http.get<ApiResponse<PagedResponse<DistrictModel>>>(this.API_URL_Local + `?code=${code}`,{
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