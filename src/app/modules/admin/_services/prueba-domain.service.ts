import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '../../../../environments/environment';
import { BuildHeaderService } from '../../../_commons/_services/Header-Builder.service';
import { ApiRespuesta, Content, Data } from '../_models/Prueba.interface';

@Injectable({
    providedIn: 'root'
})

export class PruebaDomainService{
    API_URL = `${environment.apiUrlNiel}`;
    responseApi: ApiRespuesta;
    data: Data;
    _provinces: Content[] = [];


    get provinces(){
        return [...this._provinces];
    }

    constructor(
        private http: HttpClient,
        private buildheader:BuildHeaderService
    ) { }

    getAllProvince(){
        const header = this.buildheader.buildHeader();
        return this.http.get<ApiRespuesta>(`${environment.apiUrlNiel}/ubigee/province`,{
            headers: header
        }).subscribe( (resp) => {
            this._provinces = resp.data.content;
        })
    }
}