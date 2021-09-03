import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../_commons/_models/ApiResponse.model';
import { PagedResponse } from '../../../_commons/_models/PagedResponse';
import { BuildHeaderService } from '../../../_commons/_services/Header-Builder.service';
import { NotaModel } from '../_models/Nota.interface';

@Injectable({
    providedIn: 'root',
})

export class NoteHTTPServiceDomain {
    API_URL = `${environment.apiUrlNiel}/notes`;
    API_URL_Local = `http://localhost:8880/api/notes`;
    constructor(
        private http: HttpClient,
        private buildheader:BuildHeaderService
    ){ }

    CreateNote(body): Observable<NotaModel> {
        const header = this.buildheader.buildHeaderPost();
        this.http.post(this.API_URL_Local, body,{headers: header})
            .subscribe(
                data => {
                    console.log(data);
                }
            );
            return this.http.post<NotaModel>(this.API_URL_Local, body,{
            headers: header 
        })
            .pipe(map(response => response))
            .pipe(catchError(this.handleError));
    }

    UpdateNote(body): Observable<NotaModel> {
        const header = this.buildheader.buildHeaderPost();
        this.http.patch(this.API_URL_Local, body,{headers: header})
            .subscribe(
                data => {
                    console.log(data);
                }
            );
            return this.http.patch<NotaModel>(this.API_URL_Local, body,{
            headers: header 
        })
            .pipe(map(response => response))
            .pipe(catchError(this.handleError));
    }

    getAllNotes(): Observable<ApiResponse<PagedResponse<NotaModel>>> {
        const header = this.buildheader.buildHeader();
        return this.http.get<ApiResponse<PagedResponse<NotaModel>>>(this.API_URL_Local+`/user`,{
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