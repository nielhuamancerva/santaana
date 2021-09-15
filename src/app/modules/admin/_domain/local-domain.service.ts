import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root',
})
export class LocalDomainService {

  constructor(private _http: HttpClient) { }

  getFileFromPath(path: string): Observable<any> {

    return this._http.get(path, {responseType: 'blob'});
  }

}




    