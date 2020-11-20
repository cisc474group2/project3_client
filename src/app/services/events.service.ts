import { Injectable } from '@angular/core';
import { Observable, ReplaySubject, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Event, Geoloc } from '../../assets/model';
import { ɵBrowserAnimationBuilder } from '@angular/platform-browser/animations';

@Injectable({
  providedIn: 'root'
})
export class EventsService {

  private path="http://localhost:3000/api/"

  constructor(private http:HttpClient) {
  }




// load everything at same time




  getEvents(): Observable<any>{
    return this.http.get(this.path+'events');
  }

  postEvent(title: string, description: string, event_address: Geoloc, start_time: string, end_time: string): Observable<any>{
    return this.http.post<any>(this.path,{ title: title, description: description, event_address: event_address, start_time: start_time, end_time: end_time})
      .pipe(map(event=>{
        title=event.data.title
        description=event.data.description
        event_address=event.data.event_address
        start_time=event.data.start_time
        end_time=event.data.end_time
        return event.data;
      }),catchError(err=>{return throwError(err.message||'server error')}));
  }
  getBusiness(busID: string): Observable<any>{

    return this.http.get(this.path+'users/bus' + "/" + busID);
  }













}
