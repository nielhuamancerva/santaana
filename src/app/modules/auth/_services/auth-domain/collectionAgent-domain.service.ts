import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../../../../src/environments/environment';
import { ApiResponse } from '../../_models/ApiResponse.model';
import { AuthModel } from '../../_models/auth.model';
import { AuthService } from '../../../../modules/auth/_services/auth.service';
import { CollectionAgentModel } from '../../_models/collectionAgent.model';

@Injectable({
    providedIn: 'root',
})
export class CollectionAgentHTTPServiceDomain {
    API_URL = `${environment.apiUrlNiel}/user`;
    API_URL1 = `${environment.apiUrlNiel}/users?type=1`;
    constructor(private http: HttpClient,
    private auth: AuthService) { }

    CreateCollectionAgent($collectionAgent: any): Observable<CollectionAgentModel> {
        console.log($collectionAgent);
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
        this.http.post(this.API_URL, formData,{headers: header})
        .subscribe(
            data => {
                console.log(data);
            }
        );
            return this.http.post<CollectionAgentModel>(this.API_URL, formData,{
            headers: header 
        })
            .pipe(map(response => response))
            .pipe(catchError(this.handleError));
    }

    getAllUser(): Observable<ApiResponse<any>> {
        const header = this.buildHeader();
        return this.http.get<ApiResponse<any[]>>(this.API_URL1,{
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
        collectionAgent.roleCode =result.roleCode;//set
        collectionAgent.roleDescription = "Administrador";
        collectionAgent.typeDocumentCode = result.typeDocumentCode;//set
        collectionAgent.typeDocumentDescription = null;
        collectionAgent.districtCode='NODATA';
        collectionAgent.populatedCenterCode = 'NODATA';
        collectionAgent.documentNumber = result.documentNumber;//set
        collectionAgent.name = result.name;//set
        collectionAgent.secondName = result.secondName;//set
        collectionAgent.lastName = result.lastName;//set
        collectionAgent.secondLastName = result.secondLastName;//set
        collectionAgent.typePersonCode= result.typePersonCode;//set
        collectionAgent.email= result.email;//set
        collectionAgent.userName= result.userName;//set
        collectionAgent.phone1=result.phone1;//set
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