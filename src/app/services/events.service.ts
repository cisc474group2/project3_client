import { Injectable } from '@angular/core';
import { Observable, ReplaySubject, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { EventModel, Geoloc } from '../../assets/model';
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

  postEvent(title: string, description: string, event_address: string, start_time: string, end_time: string): Observable<any>{
    return this.http.post<any>(this.path+'events',{ title: title, description: description, event_address: event_address, start_time: start_time, end_time: end_time})
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

  getEvetnsFormatedBusinessName(): Array<EventModel> {
    let event_model_list = Array<EventModel>();
    this.getEvents().subscribe(result => {
      result.data.forEach(unformated_event => {
        this.getBusiness(unformated_event.bus_id).subscribe(business => {
          event_model_list.push(new EventModel(unformated_event.title,
            unformated_event.description,
            unformated_event.event_address,
            unformated_event.start_time,
            unformated_event.end_time, 
            business.data.type_obj.bus_name,
            unformated_event.registered_ind,
            unformated_event.event_geoloc,
            unformated_event.create_date))
        });
      });
    });
    return event_model_list;
  }















}
