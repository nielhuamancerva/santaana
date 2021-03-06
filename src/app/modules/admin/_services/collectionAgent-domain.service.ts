import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../_commons/_models/ApiResponse.model';
import { AuthModel } from '../../auth/_models/auth.model';
import { AuthService } from '../../auth/_services/auth.service';
import { CollectionAgentModel } from '../_models/collectionAgent.model';

@Injectable({
    providedIn: 'root',
})

export class CollectionAgentHTTPServiceDomain {
    //API_URL1 = `${environment.apiUrlNiel}/users?type=1`;
    API_URL_Local = `${environment.apiUrl}/user`;
    constructor(private http: HttpClient,
    private auth: AuthService) { }

    CreateCollectionAgent($collectionAgent: any): Observable<CollectionAgentModel> {
        const fileJson = new File([JSON.stringify(this.setCollectionAgent($collectionAgent))], "file2.json", {type: "application/json"});
        const f1 = new File([$collectionAgent.foto1], "file.jpg", {type: "application/jpg"});
        const f2 = new File([$collectionAgent.foto2], "file.jpg", {type: "application/jpg"});
        const f3 = new File([$collectionAgent.foto3], "file.jpg", {type: "application/jpg"});
        const f4 = new File([$collectionAgent.foto4], "file.jpg", {type: "application/jpg"});
        
        const formData: FormData = new FormData();
        formData.append('user', fileJson);
        formData.append('frontDocument', f1, 'name1');
        formData.append('reverseDocument', f2, 'name1');
        formData.append('lastPage', f3, 'name1');
        formData.append('evidence', f4, 'name1');
        const header = this.buildHeader();
        this.http.post(this.API_URL_Local, formData,{headers: header})
        .subscribe(
            data => {
                console.log(data);
            }
        );
            return this.http.post<CollectionAgentModel>(this.API_URL_Local, formData,{
            headers: header 
        })
            .pipe(map(response => response))
            .pipe(catchError(this.handleError));
    }

    getAllUser(): Observable<ApiResponse<any>> {
        const header = this.buildHeader();
        return this.http.get<ApiResponse<any[]>>(this.API_URL_Local + 's',{
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

    buildHeader(): HttpHeaders {
        let headers: HttpHeaders = new HttpHeaders()
            .set("Authorization", "Bearer " + this.getAuthFromLocalStorage() )
            .set("payload", "company" )
            .set("Access-Control-Allow-Origin", "*")

        return headers;
    }

    getAuthFromLocalStorage(): AuthModel {
        try {
            const authData = JSON.parse(localStorage.getItem(this.auth.authLocalStorageToken));
            return authData.authToken;
        } catch (error) {
            console.error(error);
            return undefined;
        }
    }

    setCollectionAgent(result){
        const collectionAgent = new CollectionAgentModel();
        collectionAgent.roleCode =result.roleCode;
        collectionAgent.roleDescription = "Administrador";
        collectionAgent.typeDocumentCode = result.typeDocumentCode;
        collectionAgent.typeDocumentDescription = null;
        collectionAgent.districtCode='NODATA';
        collectionAgent.populatedCenterCode = 'NODATA';
        collectionAgent.documentNumber = result.documentNumber;
        collectionAgent.name = result.name;
        collectionAgent.secondName = result.secondName;
        collectionAgent.lastName = result.lastName;
        collectionAgent.secondLastName = result.secondLastName;
        collectionAgent.typePersonCode= result.typePersonCode;
        collectionAgent.email= result.email;
        collectionAgent.userName= result.userName;
        collectionAgent.phone1=result.phone1;
        collectionAgent.phone2=null;
        collectionAgent.referentialAddress=null;
        collectionAgent.latitude=null;
        collectionAgent.longitude=null;
        collectionAgent.frontDocument=null;
        collectionAgent.reverseDocument=null;
        collectionAgent.enable=true;
        return collectionAgent;
    }
}