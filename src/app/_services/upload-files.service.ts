import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEvent, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from "../../environments/environment";
@Injectable({
  providedIn: 'root'
})
export class UploadFilesService {
  private baseUrl = environment.apiHostName;
  headers:any= {"Content-Type":"application/json"};
  constructor(private http: HttpClient) { }

  uploadDcgFile(file: File,token:String): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();

    formData.append('file', file);

    const req = new HttpRequest('POST', `${this.baseUrl}dcg/uploaddcg`, formData, {
      headers: new HttpHeaders({
        "Authorization": "Bearer" + token
      }),
      reportProgress: true,
      responseType: 'json'
    });

    return this.http.request(req);
  }
  uploadPcgFile(file: File,token:String): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();

    formData.append('file', file,);

    const req = new HttpRequest('POST', `${this.baseUrl}pcg/uploadpcg`, formData, {
      headers: new HttpHeaders({
        "Authorization": "Bearer" + token
      }),
      reportProgress: true,
      responseType: 'json'
    
    });

    return this.http.request(req);
  }
      uploadMasterFile(file: File,token:String): Observable<HttpEvent<any>> {
        const formData: FormData = new FormData();
    
        formData.append('file', file,);
        let newHeaders = {...this.headers,"Authorization":"Bearer "+token} 
        const req = new HttpRequest('POST', `${this.baseUrl}schemeMasterRoutes/uploadms`, formData, {
          headers: new HttpHeaders({
            "Authorization": "Bearer" + token
          }),
          reportProgress: true,
          responseType: 'json'
        });
    
        return this.http.request(req);
      }
  // getFiles(): Observable<any> {
  // //   return this.http.get(`${this.baseUrl}/files`);
  // // }
}
