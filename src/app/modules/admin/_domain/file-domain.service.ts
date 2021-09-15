import { HttpClient, HttpErrorResponse, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { map, catchError } from "rxjs/operators";
import { buildHeader } from "src/app/_commons/_helpers/http-header";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: 'root',
})
export class FileDomainService {
    
    API_URL = `${environment.apiService}/file`;

    constructor(private http: HttpClient) { }

    getFile(id: string): Observable<HttpResponse<Blob>> {
        const header = buildHeader();
        return this.http.get(`${this.API_URL}/${id}`,{
            headers: header,
            responseType: 'blob',
            observe: 'response' 
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