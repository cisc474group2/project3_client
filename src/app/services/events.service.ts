import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, ReplaySubject, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { EventModel, Geoloc } from '../../assets/model';
import { ɵBrowserAnimationBuilder } from '@angular/platform-browser/animations';
import { UserGeolocationService } from './user-geolocation.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class EventsService {

  private path = "http://localhost:3000/api/"
  public event_list: BehaviorSubject<Array<EventModel>> = new BehaviorSubject<Array<EventModel>>(null);
  public events_loaded: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
  public events_reload: BehaviorSubject<Array<EventModel>> = new BehaviorSubject<Array<EventModel>>(null);S
  current_event: EventModel;

  constructor(private http: HttpClient, private geoloc: UserGeolocationService, private authSvc: AuthService) {
    this.events_loaded.next(false);
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

  editEvent(title: string, busID: string, description: string, registered_ind: string[], event_address: string, start_time: string, end_time: string): Observable<any> {
    return this.http.put<any>(this.path + 'events' + "/" + this.current_event._id, { title: title, bus_id: busID, description: description, registered_ind: registered_ind, event_address: event_address, start_time: start_time, end_time: end_time })
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

  deleteFromUserList(eventID: string, registered_ind: string) {
    var x = this.path + 'events' + "/" + eventID + "/" + 'registered/delete';
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

  getBulkEvents(){
    return this.http.post<any>(this.path + 'events' + "/" + "bulk", {reg_events: this.authSvc.userObject.reg_events});
  }

  getBulkBusinessEvents(){
    return this.http.post<any>(this.path + 'events' + "/" + "bulk", {reg_events: this.authSvc.userObject.type_obj.hostedEvents});
  }

  getOneEventFormat(_id){
    let event = Array<EventModel>();
    this.getOneEvent(_id).subscribe(response => {
      console.log(response);
    });
    
    this.getOneEvent(_id).subscribe(unformatted_event => {
        this.getBusiness(unformatted_event.data.bus_id).subscribe(business => {
          event.push(new EventModel(unformatted_event.data.title,
            unformatted_event.data.description,
            this.formatAddress(unformatted_event.data.event_address),
            new Date(unformatted_event.data.start_time),
            new Date(unformatted_event.data.end_time),
            unformatted_event.data._id,
            business.data.type_obj.bus_name,
            unformatted_event.data.registered_ind,
            unformatted_event.data.event_geoloc,
            unformatted_event.data.create_date,
            (this.authSvc.userObject!=null)?this.authSvc.userObject.reg_events.includes(unformatted_event.data._id):false ,
            this.convertTimestamp(unformatted_event.data.start_time),
            this.convertTimestamp(unformatted_event.data.end_time),
            business.data._id,
            unformatted_event.event_address));
        });
    });

    return event;
  }

  getEventsFormat(): Array<EventModel> {
    let event_model_list = Array<EventModel>();
    let count = 1;
    this.events_loaded.next(false);
    this.geoloc.accuracy.subscribe(res => {
      // If the user has declined geoloation features, it will just load all events
      //console.log(res, this.geoloc.lat, this.geoloc.lng);
      if (res == -1) {
        this.getEvents().subscribe(result => {
          //console.log(result.data);
          result.data.forEach(unformatted_event => {
            this.getBusiness(unformatted_event.bus_id).subscribe(business => {
              //console.log(unformatted_event);
              event_model_list.push(new EventModel(unformatted_event.title,
                unformatted_event.description,
                this.formatAddress(unformatted_event.event_address),
                new Date(unformatted_event.start_time),
                new Date(unformatted_event.end_time),
                unformatted_event._id,
                business.data.type_obj.bus_name,
                unformatted_event.registered_ind,
                unformatted_event.event_geoloc,
                unformatted_event.create_date,
                (this.authSvc.userObject!=null)?this.authSvc.userObject.reg_events.includes(unformatted_event._id):false ,
                this.convertTimestamp(unformatted_event.start_time),
                this.convertTimestamp(unformatted_event.end_time),
                business.data._id,
                unformatted_event.event_address));

              if (count == result.data.length) {
                this.events_loaded.next(true);
                //console.log(this.sortList(event_model_list));
                this.event_list.next(event_model_list);
                console.log("all events loaded");
              }
              else {
                count ++;
                //console.log(count, " ", this.event_list);
              }
            });
          });
        });
      }
      //If the user has accepted geolocation features, it will pull all events from that location
      else if (res != -1 && res != null) {
        this.getLocalEventsCustRad(50).subscribe(result => {
          //console.log(result.data);
          result.data.forEach(unformatted_event => {
            //console.log(unformatted_event);
            this.getBusiness(unformatted_event.bus_id).subscribe(business => {
              event_model_list.push(new EventModel(unformatted_event.title,
                unformatted_event.description,
                this.formatAddress(unformatted_event.event_address),
                new Date(unformatted_event.start_time),
                new Date(unformatted_event.end_time),
                unformatted_event._id,
                business.data.type_obj.bus_name,
                unformatted_event.registered_ind,
                unformatted_event.event_geoloc,
                unformatted_event.create_date,
                (this.authSvc.userObject!=null)?this.authSvc.userObject.reg_events.includes(unformatted_event._id):false ,
                this.convertTimestamp(unformatted_event.start_time),
                this.convertTimestamp(unformatted_event.end_time),
                business.data._id,
                unformatted_event.event_address));

              if (count == result.data.length) {
                this.events_loaded.next(true);
                //console.log(this.sortList(event_model_list));
                this.event_list.next(event_model_list);
                console.log("local events loaded");
              }
              else {
                count ++;
                //console.log(count, " ", this.event_list);
              }
            });
          });
        });
      }
      else {
        this.events_loaded.next(false);
      }
      //Else it will not load anything else.
    });
    //event_model_list = this.sortList(event_model_list);
    //this.event_list.next(event_model_list);
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

  public sortList(unsorted:Array<EventModel>, sortFun):Array<EventModel> {
    unsorted.map(event => {
      event.usrLoc = this.geoloc.userGeoloc.value; 
    })
    unsorted = unsorted.sort(sortFun);

    return unsorted;
  }

  alphaSort(a:EventModel, b:EventModel):number {
    let tmp = a.title.localeCompare(b.title);
      if (tmp == 0) {
        if (a.create_date > b.create_date) {return 1;}
        else if (a.create_date < b.create_date) {return -1;}
        else return 0;
      }
      return tmp;
  }

  upcommingSort(a:EventModel, b:EventModel):number {
    if (a.start_time > b.start_time) return 1;
    else if (a.start_time < b.start_time) return -1;
    else {
      if (a.end_time > b.end_time) return 1;
      else if (a.end_time < b.end_time) return -1;
      else {
        let tmp = a.title.localeCompare(b.title);
        if (tmp > 0) return 1;
        else if (tmp < 0) return -1;
        return 0;
      }
    }
  }

  hotSort(a:EventModel, b:EventModel):number {
    if (b.registered_ind.length - a.registered_ind.length != 0) 
      return b.registered_ind.length - a.registered_ind.length;
    else {
      if (a.start_time > b.start_time) return 1;
      else if (a.start_time < b.start_time) return -1;
      else {
        let tmp = a.title.localeCompare(b.title);
        if (tmp > 0) return 1;
        else if (tmp < 0) return -1;
        return 0;
      }
    }
  }

  distanceSort(a:EventModel, b:EventModel):number {
    return EventsService.getDistanceFromLatLonInMile(
      a.event_geoloc.lat, a.event_geoloc.lng, 
      a.usrLoc.lat, a.usrLoc.lng)
  - EventsService.getDistanceFromLatLonInMile(
      b.event_geoloc.lat, b.event_geoloc.lng, 
      a.usrLoc.lat, a.usrLoc.lng);
  }

  nowSort(a:EventModel, b:EventModel):number {
    if (a.inProgress) return 1;
    else {
      if (a.start_time > b.start_time) return 0;
      else if (a.start_time < b.start_time) return -1;
      else {
        if (a.end_time > b.end_time) return 0;
        else if (a.end_time < b.end_time) return -1;
        else {
          let tmp = a.title.localeCompare(b.title);
          if (tmp > 0) return 0;
          else if (tmp < 0) return -1;
          return 0;
        }
      }
    }
  }


  static getDistanceFromLatLonInMile(a_lat:number, a_lng:number, b_lat:number, b_lng:number):number {
    let R = 3958.8; // Radius of the earth in mile
    let dLat = this.deg2rad(b_lat-a_lat);  // deg2rad below
    let dLon = this.deg2rad(b_lng-a_lng); 
    let a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(a_lat)) * Math.cos(this.deg2rad(b_lat)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2); 
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    let d = R * c; // Distance in mile
    //console.log(d);
    return d;
  }
  
  static deg2rad(deg):number {
    return deg * (Math.PI/180)
  }
}
