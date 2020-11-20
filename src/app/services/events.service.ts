import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ɵBrowserAnimationBuilder } from '@angular/platform-browser/animations';

@Injectable({
  providedIn: 'root'
})
export class EventsService {

  private path="http://localhost:3000/api/"
  constructor(private http:HttpClient) { }




// load everything at same time




  getEvents(): Observable<any>{
    return this.http.get(this.path+'events');
  }

  getBusiness(busID: string): Observable<any>{

    return this.http.get(this.path+'users/bus' + "/" + busID);
  }













}
