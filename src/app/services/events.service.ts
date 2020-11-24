import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, ReplaySubject, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { EventModel, Geoloc } from '../../assets/model';
import { ɵBrowserAnimationBuilder } from '@angular/platform-browser/animations';
import { UserGeolocationService } from './user-geolocation.service';

@Injectable({
  providedIn: 'root'
})
export class EventsService {

  private path="http://localhost:3000/api/"
  public event_list: BehaviorSubject<Array<EventModel>> = new BehaviorSubject<Array<EventModel>>(null);

  constructor(private http:HttpClient, private geoloc:UserGeolocationService) {
  }

  getEvents(): Observable<any>{
    return this.http.get(this.path+'events');
  }

  getLocalEvents(): Observable<any>{
    console.log(this.path+'events/geo/loc/' + this.geoloc.lng.value + ',' + this.geoloc.lat.value);
    return this.http.get(this.path+'events/geo/loc/' + this.geoloc.lng.value + ',' + this.geoloc.lat.value);
  }

  getLocalEventsCustRad(rad:number): Observable<any> {
    return this.http.get(this.path+'events/geo/loc/' + this.geoloc.lng.value + ',' + this.geoloc.lat.value + '/' + rad);
  }

  postEvent(title: string, busID: string, description: string, registered_ind: string[], event_address: string, start_time: string, end_time: string): Observable<any>{
    return this.http.post<any>(this.path+'events',{ title: title, bus_id: busID, description: description, registered_ind: registered_ind, event_address: event_address, start_time: start_time, end_time: end_time})
      .pipe(map(event=>{
        title=event.data.title
        description=event.data.description
        event_address=event.data.event_address
        start_time=event.data.start_time
        end_time=event.data.end_time
        return event.data;
      }),catchError(err=>{return throwError(err.message||'server error')}));
  }


  updateUserList(eventID: string, registered_ind: string[]){
    return this.http.put(this.path + 'events/' + eventID + "/registered", {registered_ind: registered_ind});
  }
  
  getBusiness(busID: string): Observable<any>{
    return this.http.get(this.path+'users/bus' + "/" + busID);
  }

  getEventsFormattedBusinessName(): Array<EventModel> {
    let event_model_list = Array<EventModel>();
    this.geoloc.lat.subscribe(res => {
      if (res == null) {
        this.getEvents().subscribe(result => {
          result.data.forEach(unformatted_event => {
            this.getBusiness(unformatted_event.bus_id).subscribe(business => {
              event_model_list.push(new EventModel(unformatted_event.title,
                unformatted_event.description,
                unformatted_event.event_address,
                unformatted_event.start_time,
                unformatted_event.end_time,
                unformatted_event._id, 
                business.data.type_obj.bus_name,
                unformatted_event.registered_ind,
                unformatted_event.event_geoloc,
                unformatted_event.create_date))
            });
          });
        });
      }
      else {
        this.getLocalEvents().subscribe(result => {
          result.data.forEach(unformatted_event => {
            this.getBusiness(unformatted_event.bus_id).subscribe(business => {
              event_model_list.push(new EventModel(unformatted_event.title,
                unformatted_event.description,
                unformatted_event.event_address,
                unformatted_event.start_time,
                unformatted_event.end_time,
                unformatted_event._id, 
                business.data.type_obj.bus_name,
                unformatted_event.registered_ind,
                unformatted_event.event_geoloc,
                unformatted_event.create_date))
            });
          });
        });
      }
    });
    this.event_list.next(event_model_list);
    return event_model_list;
  }















}
