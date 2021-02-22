import { HttpClient } from '@angular/common/http';
import { NONE_TYPE } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  constructor(private http: HttpClient) { }

  getBase64EncodedFileData(file: File): Observable<string> {
    return new Observable(observe => {
      let reader = new FileReader();

      reader.onload = () => {
        let { result } = reader;
        let data = result as ArrayBuffer;
        //let base64Encoded = btoa(data);

        //Needs work here

        //observe.next(base64Encoded);
        observe.complete();
      };

      reader.onerror = () => {
        observe.error(reader.error);
      };

      reader.readAsArrayBuffer(file);
    });
  }

  getMD5HashForFile(file: File, base64Encoded = false): Observable<string> {
    return null;
  }

}
