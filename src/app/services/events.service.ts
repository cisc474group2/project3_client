import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, ReplaySubject, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { EventModel, Geoloc } from '../../assets/model';
import { ɵBrowserAnimationBuilder } from '@angular/platform-browser/animations';
import { UserGeolocationService } from './user-geolocation.service';

@Injectable({
  providedIn: 'root'
})
export class EventsService {

  private path = "http://localhost:3000/api/"
  public event_list: BehaviorSubject<Array<EventModel>> = new BehaviorSubject<Array<EventModel>>(null);

  constructor(private http: HttpClient, private geoloc: UserGeolocationService) {
  }

  getOneEvent(_id: string): Observable<any> {
    return this.http.get(this.path + 'events/' + _id);
  }

  getEvents(): Observable<any> {
    return this.http.get(this.path + 'events');
  }

  getLocalEvents(): Observable<any> {
    console.log(this.path + 'events/geo/loc/' + this.geoloc.lng.value + ',' + this.geoloc.lat.value);
    return this.http.get(this.path + 'events/geo/loc/' + this.geoloc.lng.value + ',' + this.geoloc.lat.value);
  }

  getLocalEventsCustRad(rad: number): Observable<any> {
    return this.http.get(this.path + 'events/geo/loc/' + this.geoloc.lng.value + ',' + this.geoloc.lat.value + '/' + rad);
  }

  postEvent(title: string, busID: string, description: string, registered_ind: string[], event_address: string, start_time: string, end_time: string): Observable<any> {
    return this.http.post<any>(this.path + 'events', { title: title, bus_id: busID, description: description, registered_ind: registered_ind, event_address: event_address, start_time: start_time, end_time: end_time })
      .pipe(map(event => {
        title = event.data.title
        description = event.data.description
        event_address = event.data.event_address
        start_time = event.data.start_time
        end_time = event.data.end_time
        return event.data;
      }), catchError(err => { return throwError(err.message || 'server error') }));
  }


  updateUserList(eventID: string, registered_ind: string) {
    var x = this.path + 'events' + "/" + eventID + "/" + 'registered';
    console.log(x);

    // const body = new HttpParams()
    //   .set('registered_ind', registered_ind);

    // return this.http.post(x,
    //   body.toString(),
    //   {
    //     headers: new HttpHeaders()
    //       .set('Content-Type', 'application/x-www-form-urlencoded')
    //   }
    // );

    return this.http.put(x, {registered_ind: registered_ind});
  }

  getBusiness(busID: string): Observable<any> {
    return this.http.get(this.path + 'users/bus' + "/" + busID);
  }

  getOneEventFormat(_id){
    let event = Array<EventModel>();
    this.getOneEvent(_id).subscribe(result => {
      result.data.forEach(unformatted_event => {
        this.getBusiness(unformatted_event.bus_id).subscribe(business => {
          event.push(new EventModel(unformatted_event.title,
            unformatted_event.description,
            this.formatAddress(unformatted_event.event_address),
            this.convertTimestamp(unformatted_event.start_time),
            this.convertTimestamp(unformatted_event.end_time),
            unformatted_event._id,
            business.data.type_obj.bus_name,
            unformatted_event.registered_ind,
            unformatted_event.event_geoloc,
            unformatted_event.create_date))
        });
      });
    });
    return event;
  }

  getEventsFormat(): Array<EventModel> {
    let event_model_list = Array<EventModel>();
    this.geoloc.accuracy.subscribe(res => {
      // If the user has declined geoloation features, it will just load all events
      if (res == -1) {
        this.getEvents().subscribe(result => {
          result.data.forEach(unformatted_event => {
            this.getBusiness(unformatted_event.bus_id).subscribe(business => {
              event_model_list.push(new EventModel(unformatted_event.title,
                unformatted_event.description,
                this.formatAddress(unformatted_event.event_address),
                this.convertTimestamp(unformatted_event.start_time),
                this.convertTimestamp(unformatted_event.end_time),
                unformatted_event._id,
                business.data.type_obj.bus_name,
                unformatted_event.registered_ind,
                unformatted_event.event_geoloc,
                unformatted_event.create_date))
            });
          });
        });
      }
      //If the user has accepted geolocation features, it will pull all events from that location
      else if (res != -1 && res != null) {
        this.getLocalEventsCustRad(50).subscribe(result => {
          result.data.forEach(unformatted_event => {
            this.getBusiness(unformatted_event.bus_id).subscribe(business => {
              event_model_list.push(new EventModel(unformatted_event.title,
                unformatted_event.description,
                this.formatAddress(unformatted_event.event_address),
                this.convertTimestamp(unformatted_event.start_time),
                this.convertTimestamp(unformatted_event.end_time),
                unformatted_event._id,
                business.data.type_obj.bus_name,
                unformatted_event.registered_ind,
                unformatted_event.event_geoloc,
                unformatted_event.create_date))
            });
          });
        });
      }
      //Else it will not load anything else.
    });
    this.event_list.next(event_model_list);
    return event_model_list;
  }

  convertTimestamp(time){
    var timestamp = '';
    timestamp = time.substring(5,10).replace(/[-]/, "/") + " ";
    if(time.substring(11,13) < 12){
      timestamp += time.substring(11,16) + "AM";
    }else{
      timestamp += time.substring(11,16) + "PM";
    }
  return timestamp;
  }

  convertFullTimestamp(start_time, end_time){
    var timestamp = '';
      timestamp = start_time.substring(5,10).replace(/[-]/, "/") + " ";
      if(start_time.substring(11,13) < 12){
        timestamp += start_time.substring(11,16) + "AM";
      }else{
        timestamp += start_time.substring(11,16) + "PM";
      }
      timestamp += " - " + end_time.substring(5,10).replace(/[-]/, "/") + " ";
      if(end_time.substring(11,13) < 12){
        timestamp += end_time.substring(11,16) + "AM";
      }else{
        timestamp += end_time.substring(11,16) + "PM";
      }return timestamp;
  }

  formatAddress(event_address){
    return event_address.replace(/[+]/g, " ");
  }

}
