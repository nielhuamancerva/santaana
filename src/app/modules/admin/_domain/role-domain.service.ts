import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../_commons/_models/api-response.model';
import { RolesModel } from '../_models/Roles.model';
import { PagedResponse } from '../../../_commons/_models/paged-response.model';
import { buildHeader } from 'src/app/_commons/_helpers/http-header';

@Injectable({
    providedIn: 'root',
})

export class RoleDomainService {
    API_URL = `${environment.apiService}/roles`;
    constructor(private http: HttpClient){ }

    getAllRoles(page:number, size: number, type?:string, name?:string): Observable<ApiResponse<PagedResponse<RolesModel>>> {
        const header = buildHeader();
        var params = new HttpParams();

        params = params.set("page",page.toString());
        params = params.set("size",size.toString());

        if (type) {
            params = params.set("type", type);
        }

        if (name) {
            params = params.set("name", name);
        }

        return this.http.get<ApiResponse<PagedResponse<RolesModel>>>(this.API_URL,{
            headers: header,
            params: params
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