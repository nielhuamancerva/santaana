import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../../../../src/environments/environment';
import { ApiResponse } from '../../_models/ApiResponse.model';
import { AuthModel } from '../../_models/auth.model';
import { AuthService } from '../../../../modules/auth/_services/auth.service';
import { UserModel } from '../../_models/user.model';
import { PaymentModel } from '../../_models/Payment.model';
import { v4 as uuid } from 'uuid';
@Injectable({
    providedIn: 'root',
})
export class PaymentHTTPServiceDomain {
    API_URL = `${environment.apiUrlNiel}/api/payment`;
  constructor(private http: HttpClient,
    private auth: AuthService) { }

    CreatePayment($user: UserModel): Observable<UserModel> {
        console.log($user);
        const fileJson = new File([JSON.stringify(this.setuser($user))], "file2.json", {type: "application/json"});
        const f1 = new File(['./assets/media/users/default.jpg'], "file.jpg", {type: "application/jpg"});
        const f2 = new File(['./assets/media/users/default.jpg'], "file.jpg", {type: "application/jpg"});
        const f3 = new File(['./assets/media/users/default.jpg'], "file.jpg", {type: "application/jpg"});
        const f4 = new File(['./assets/media/users/default.jpg'], "file.jpg", {type: "application/jpg"});
        
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
        return this.http.post<UserModel>(this.API_URL, formData,{
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
        //.set("Connection", retrieveStringFromStorage("ConnectionCompany") ) 99dedcc7-ffbc-41e0-8494-73cfae25dffe
        .set("payload", "company" )
        .set("Company", "ac3e02e6-69b2-4e36-bda6-de98673fc74b" )
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

    setuser(result){
        const payment = new PaymentModel();
        payment.beneficiary_code=result.beneficiary_code;
        payment.document_code=result.document_code;
        payment.canal="WEB";
        payment.canal_code=uuid(result.canal_code);
        payment.version="1";
        payment.note=result.note;
        payment.currency="SOL";
        payment.amount_received=result.amount_received;
        return payment;
    }
}