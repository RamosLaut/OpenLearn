import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';
import { Content } from '../models/Course';
interface UploadResponse {
  fileUrl: string; 
}
@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
  readonly API_URL = 'http://localhost:8080/api/content'
  constructor(private http: HttpClient){}

  createContentWithFile(contentData: any, file: File): Observable<Content> { 
    const formData: FormData = new FormData();
    formData.append('contentData', new Blob([JSON.stringify(contentData)], { type: 'application/json' }));
    formData.append('file', file, file.name);
    return this.http.post<Content>(this.API_URL, formData);
  }

  uploadFile(file: File): Observable<HttpEvent<UploadResponse>> { 
    const formData: FormData = new FormData();
    formData.append('file', file, file.name); 

    const req = new HttpRequest('POST', `${this.API_URL}/upload`, formData, {
      reportProgress: true 
    });

    return this.http.request<UploadResponse>(req).pipe(
       catchError(error => {
          console.error('Upload error in service:', error);
          throw error;
       })
    );
  }
  deleteFile(fileUrl: string): Observable<any> {
  const filename = fileUrl.substring(fileUrl.lastIndexOf('/') + 1);
  return this.http.delete(`${this.API_URL}/delete/${filename}`);
}
}
