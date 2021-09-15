import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { LocalDomainService } from "../_domain/local-domain.service";

@Injectable({
    providedIn: 'root',
})
export class LocalService {

  constructor(private _localdomain: LocalDomainService) { }

  getFileFromPath(path: string): Observable<any> {

    return this._localdomain.getFileFromPath(path);
  }

}