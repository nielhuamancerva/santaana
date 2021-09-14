import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { AuthModel } from '../../auth/_models/auth.model';
import { AuthService } from '../../auth/_services/auth.service';
import { UserModel } from '../_models/user.model';
import { PaymentModel } from '../_models/Payment.model';
import { v4 as uuid } from 'uuid';

@Injectable({
    providedIn: 'root',
})

export class PaymentHTTPServiceDomain {
    API_URL_Local = `${environment.apiUrl}/payment`;
    constructor(private http: HttpClient,
    private auth: AuthService) { }

    CreatePayment($user: PaymentModel, $img): Observable<UserModel> {
        const fileJson = new File([JSON.stringify(this.setuser($user))], "file2.json", {type: "application/json"});
        const f1 = new File([$img], "file.jpg", {type: "application/jpg"});
        const formData: FormData = new FormData();
        formData.append('payment', fileJson);
        formData.append('files', f1, 'files');

        const header = this.buildHeader();
        this.http.post(this.API_URL_Local, formData,{headers: header})
            .subscribe(
                data => {
                    console.log(data);
                }
            );
        return this.http.post<UserModel>(this.API_URL_Local, formData,{
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
        payment.beneficiary_code='e2f2befe-41c6-4023-bfde-6ed01d097c54';
        payment.document_code=result.document_code;
        payment.canal="WEB";
        payment.canal_code=uuid();
        payment.version="1";
        payment.note=result.note;
        payment.currency="SOL";
        payment.amount_received=result.amount_received;
        return payment;
    }
}