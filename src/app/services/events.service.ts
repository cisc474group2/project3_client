import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Event } from '../../assets/model';
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

  getEvetnsFormatedBusinessName(): Array<Event> {
    let event_model_list = Array<Event>();
    this.getEvents().subscribe(result => {
      result.data.forEach(unformated_event => {
        this.getBusiness(unformated_event.bus_id).subscribe(business => {
          event_model_list.push(new Event(unformated_event.title,
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
