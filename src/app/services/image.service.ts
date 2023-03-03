import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  url="https://take-picture-back-end.onrender.com/api/upload";

  constructor(private http: HttpClient) { }

  uploadImage(formData: FormData): Observable<any>{
    return this.http.post(this.url, formData);
  }
}
