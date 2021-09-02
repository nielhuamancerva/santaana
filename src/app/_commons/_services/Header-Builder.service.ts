import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { AuthModel } from 'src/app/modules/auth/_models/auth.model';

@Injectable({
    providedIn: 'root',
})
export class BuildHeaderService {
    public authLocalStorageToken = "Auth-Token";
    constructor() { }

    buildHeader(): HttpHeaders {
        let headers: HttpHeaders = new HttpHeaders()
            .set("Authorization", "Bearer " + this.getAuthFromLocalStorage() )
            .set("Company", "ac3e02e6-69b2-4e36-bda6-de98673fc74b" )
            .set("Content-Type", "application/json");
            //.set("Access-Control-Allow-Origin", "*");
        return headers;
    }

    getAuthFromLocalStorage(): AuthModel {
        try {
            const authData = JSON.parse(
                localStorage.getItem(this.authLocalStorageToken)
            );
            return authData.authToken;
        } catch (error) {
            console.error(error);
            return undefined;
        }
    }

    buildHeaderPost(): HttpHeaders {
        let headers: HttpHeaders = new HttpHeaders()
        .set("Authorization", "Bearer " + this.getAuthFromLocalStorage() )
        //.set("Connection", retrieveStringFromStorage("ConnectionCompany") ) 99dedcc7-ffbc-41e0-8494-73cfae25dffe
        .set("payload", "company" )
        .set("Company", "ac3e02e6-69b2-4e36-bda6-de98673fc74b" )
        .set("Access-Control-Allow-Origin", "*")
        return headers;
    }
}