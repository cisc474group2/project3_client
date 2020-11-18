import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EventsService {

  private path="http://localhost:3000/api/"
  constructor(private http:HttpClient) { }

  getEvents(): Observable<any>{
    return this.http.get(this.path+'events');
  }
}
