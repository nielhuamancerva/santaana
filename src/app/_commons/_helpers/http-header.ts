import { HttpHeaders } from "@angular/common/http";
import { retrieveStringFromStorage } from "../utils/storage";

export function buildHeader(contentType?:string): HttpHeaders {

    let headers: HttpHeaders = new HttpHeaders()
        .set("Authorization", "Bearer " + retrieveStringFromStorage("TokenAuthorization") )
        .set("Access-Control-Allow-Origin", "*")
        .set("Content-Type", contentType ? contentType : "application/json")

    return headers;
}