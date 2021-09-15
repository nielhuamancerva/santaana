import { HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { FileDomainService } from "../_domain/file-domain.service";

@Injectable({
    providedIn: 'root',
})
export class FileService {

  constructor(private _filedomain: FileDomainService) { }

  getFile(id: string): Observable<HttpResponse<Blob>> {

    return this._filedomain.getFile(id);
  }

}